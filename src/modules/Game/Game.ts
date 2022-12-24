import type { Player } from '../Player/Player';
import type { Canvas } from '../Canvas/Canvas';
import { Round } from '../Round/Round';
import { RoundEventTypes } from '../Round/Round.types';
import { setStartParamsForPlayer } from '../../util/setStartParamsForPlayer';
import type { TGameEvent, TGameScore } from './Game.types';
import { TGameEventTypes } from './Game.types';
import { EventEmitter } from '../EventEmitter/EventEmitter';

enum GameState {
    SETUP = 'SETUP',
    PREGAME = 'PREGAME',
    RUNNING = 'RUNNING',
    ROUND_OVER = 'ROUND_OVER',
    FINISHED = 'FINISHED',
}

export class Game extends EventEmitter<TGameEvent> {
    public canvas: Canvas;

    private readonly keys: Set<string>;

    private readonly players: Player[];
    private readonly pointGoal: number;
    private score: TGameScore = {};

    private gameState = GameState.SETUP;

    constructor(canvas: Canvas, players: Player[], pointGoal = 50) {
        super();
        this.canvas = canvas;
        this.players = players;
        this.keys = new Set<string>();
        this.pointGoal = pointGoal;

        window.addEventListener('keydown', (e: KeyboardEvent) => {
            this.keys.add(e.key);
        });
        window.addEventListener('keyup', (e: KeyboardEvent) => {
            this.keys.delete(e.key);
        });

        window.addEventListener('keydown', (e: KeyboardEvent) => {
            if (this.gameState === GameState.ROUND_OVER && e.key === ' ') {
                e.preventDefault();
                e.stopPropagation();
                this.startNewRound();
            }
        });

        this.reset();
    }

    public reset() {
        this.players.forEach((player) => {
            player.reset();
            setStartParamsForPlayer(player, this.canvas.width, this.canvas.height);
        });
        this.canvas.clear();
        this.gameState = GameState.PREGAME;
        this.resetScore();
    }

    public start() {
        this.gameState = GameState.RUNNING;
        this.startNewRound();
    }

    public startNewRound() {
        const round = new Round(this.canvas, this.players, this.keys);
        round.subscribe((event) => {
            if (event.type === RoundEventTypes.ROUND_OVER) {
                this.handleRoundOver(event.winner);
                this.gameState = GameState.ROUND_OVER;
            }
        });
        round.start();
        this.gameState = GameState.RUNNING;
    }

    private resetScore() {
        this.score = this.players.reduce((acc, player) => {
            acc[player.id] = 0;
            return acc;
        }, {} as TGameScore);
        this.emit({
            type: TGameEventTypes.SCORE_UPDATED,
            score: this.score,
        });
    }

    private checkGameOver(): boolean {
        for (const [playerId, playerScore] of Object.entries(this.score)) {
            if (playerScore >= this.pointGoal) {
                const winner = this.players.find((player) => player.id === playerId);
                if (!winner) {
                    return false;
                }
                this.handleGameOver(winner);
                return true;
            }
        }
        return false;
    }

    private handleRoundOver(winner?: Player) {
        if (winner) {
            this.score[winner.id] += (this.players.length - 1);
            this.emit({
                type: TGameEventTypes.SCORE_UPDATED,
                score: this.score,
            });
        }
        this.canvas.drawRoundOver(winner);
        this.checkGameOver();
    }

    private handleGameOver(winner: Player) {
        this.gameState = GameState.FINISHED;
        this.canvas.drawWinner(winner);
    }
}
