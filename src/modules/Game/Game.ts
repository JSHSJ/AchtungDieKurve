import type { Player } from '../Player/Player';
import type { Canvas } from '../Canvas/Canvas';
import { Round } from '../Round/Round';
import { RoundEventTypes } from '../Round/Round.types';
import { setStartParamsForPlayer } from '../../util/setStartParamsForPlayer';

enum GameState {
    SETUP = 'SETUP',
    PREGAME = 'PREGAME',
    RUNNING = 'RUNNING',
    ROUND_OVER = 'ROUND_OVER',
    FINISHED = 'FINISHED',
}

export class Game {
    public canvas: Canvas;

    private keys: Set<string>;

    private players: Player[];
    private pointGoal: number;

    private gameState = GameState.SETUP;
    private currentRound: Round;

    constructor(canvas: Canvas, players: Player[], pointGoal = 50) {
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
    }

    public start() {
        this.gameState = GameState.RUNNING;
        this.startNewRound();
    }

    public startNewRound() {
        this.currentRound = new Round(this.canvas, this.players, this.keys);
        this.currentRound.subscribe((event) => {
            if (event.type === RoundEventTypes.ROUND_OVER) {
                this.handleRoundOver(event.winner);
                this.gameState = GameState.ROUND_OVER;
            }
        });
        this.currentRound.start();
        this.gameState = GameState.RUNNING;
    }

    private checkGameOver(): boolean {
        for (const player of this.players) {
            if (player.points >= this.pointGoal) {
                this.handleGameOver(player);
                return true;
            }
        }
        return false;
    }

    private handleRoundOver(winner?: Player) {
        if (winner) {
            winner.addPoints(10);
        }
        this.canvas.drawRoundOver(winner);
        this.checkGameOver();
    }

    private handleGameOver(winner: Player) {
        this.gameState = GameState.FINISHED;
        this.canvas.drawWinner(winner);
    }
}
