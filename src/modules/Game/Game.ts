import type { Player } from '../Player/Player';
import type { Canvas } from '../Canvas/Canvas';
import { Round } from '../Round/Round';
import type { RoundEvent } from '../Round/Round.types';
import { RoundEventTypes } from '../Round/Round.types';
import { setStartParamsForPlayer } from '../../util/setStartParamsForPlayer';
import type { TGameEvent, TGameScore } from './Game.types';
import { GameState, TGameEventTypes } from './Game.types';
import { EventEmitter } from '../EventEmitter/EventEmitter';
import { config } from '../Config/Config';

export class Game extends EventEmitter<TGameEvent> {
    public canvas: Canvas;

    private readonly keys: Set<string>;

    private readonly players: Player[];
    private readonly pointGoal: number;
    private round: Round | null = null;
    private score: TGameScore = {};

    private gameState = GameState.SETUP;

    constructor(canvas: Canvas, players: Player[], pointGoal = 10) {
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
                this.prepareNewRound();
                return;
            }
            if (this.gameState === GameState.PREROUND && e.key === ' ') {
                e.preventDefault();
                e.stopPropagation();
                this.showPreGameCountDown();
                return;
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

    public prepareNewRound() {
        this.gameState = GameState.PREROUND;
        this.round = new Round(this.canvas, this.players, this.keys);
        this.round.subscribe(this.handleRoundEvent.bind(this));
        this.players.forEach((player) => {
            player.resetStartPosition();
            setStartParamsForPlayer(player, this.canvas.width, this.canvas.height);
        });
        this.canvas.drawPreRound(this.players);
        this.emit({
            type: TGameEventTypes.GAME_STARTED,
        });
    }

    public startRound() {
        this.round!.start();
        this.gameState = GameState.RUNNING;
    }

    private showPreGameCountDown() {
        if (!this.round) {
            return;
        }
        this.gameState = GameState.PREROUND_COUNTDOWN;
        let countdown = 3;
        this.canvas.drawCountdown(countdown, this.players);

        const interval = setInterval(() => {
            countdown -= 1;
            if (countdown === 0) {
                clearInterval(interval);
                this.startRound();
            }
            this.canvas.drawCountdown(countdown, this.players);
        }, 1000);
    }

    private handleRoundEvent(event: RoundEvent) {
        if (event.type === RoundEventTypes.ROUND_OVER) {
            this.handleRoundOver(event.ranking);
        }
        // If a player collides with a another player, credit the "killer" with a point and kill the player
        if (event.type === RoundEventTypes.PLAYER_COLLISION) {
            event.collision.player.die();

            if (config.scoreCreditKiller && event.collision.player !== event.collision.into) {
                this.score[event.collision.into.id] += 1;
                this.emit({
                    type: TGameEventTypes.SCORE_UPDATED,
                    score: this.score,
                });
            }
        }
        if (event.type === RoundEventTypes.WALL_COLLISION) {
            event.collision.player.die();
        }
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

    private handleRoundOver(ranking: Player[]) {
        // Correct score based on (NumberOfPlayers - PlayersRank) + NumberOfPlayersKilled
        if (ranking.length === 0) {
            return;
        }

        if (config.scoreUseRanking) {
            ranking.forEach((player, index) => {
                this.score[player.id] += this.players.length - index - 1;
            });
        } else {
            this.score[ranking[0].id] += this.players.length - 1;
        }
        this.emit({
            type: TGameEventTypes.SCORE_UPDATED,
            score: this.score,
        });
        this.canvas.drawRoundOver(ranking[0]);
        if (!this.checkGameOver()) {
            this.gameState = GameState.ROUND_OVER;
        }
    }

    private handleGameOver(winner: Player) {
        this.gameState = GameState.FINISHED;
        this.canvas.drawWinner(winner);
    }
}
