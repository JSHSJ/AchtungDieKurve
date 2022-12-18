import { PLAYER_WIDTH } from '../../config/config';
import type { Player } from '../Player/Player';
import { calculateStartPosAndDirection } from '../../util/calculateStartPosAndDirection';
import type { Canvas } from '../Canvas/Canvas';

enum GameState {
    SETUP = 'SETUP',
    PREGAME = 'PREGAME',
    RUNNING = 'RUNNING',
    ROUND_OVER = 'ROUND_OVER',
    FINISHED = 'FINISHED',
}

export class Game {
    public canvas: Canvas;
    private fps = 60;
    private now = 0;
    private then = Date.now();
    private interval = 1000 / this.fps;
    private delta: number = 0;
    private keys: Set<string>;

    private players: Player[];
    private currentRound = 0;
    private pointGoal: number;

    private gameState = GameState.SETUP;

    constructor(canvas: Canvas, players: Player[], pointGoal = 50) {
        this.canvas = canvas;
        this.players = players;
        this.keys = new Set<string>();
        this.currentRound = 0;
        this.pointGoal = pointGoal;

        window.addEventListener('keydown', (e: KeyboardEvent) => {
            this.keys.add(e.key);
        });
        window.addEventListener('keyup', (e: KeyboardEvent) => {
            this.keys.delete(e.key);
        });

        window.addEventListener('keydown', (e: KeyboardEvent) => {
            if (this.gameState !== GameState.SETUP) {
                e.preventDefault();
                e.stopPropagation();
            }

            if (e.key === ' ') {
                if (this.gameState === GameState.ROUND_OVER) {
                    this.startNewRound();
                }
            }
        });

        this.players.forEach((player) => {
            this.setPlayersStartPosition(player);
        });
    }

    reset() {
        this.currentRound = 0;
        this.players.forEach((player) => {
            player.reset();
            this.setPlayersStartPosition(player);
        });
        this.canvas.clear();
        this.gameState = GameState.PREGAME;
    }

    public start() {
        this.gameState = GameState.RUNNING;
        this.timeGameLoop();
    }

    public startNewRound() {
        this.players.forEach((player) => {
            player.resetStartPosition();
            this.setPlayersStartPosition(player);
        });
        this.gameState = GameState.RUNNING;
        this.currentRound++;
        this.canvas.clear();
        this.timeGameLoop();
    }

    /**
     * Throttle the game loop to 60 fps
     */
    private timeGameLoop() {
        if (this.gameState !== GameState.RUNNING) {
            return;
        }

        requestAnimationFrame(this.timeGameLoop.bind(this));

        this.now = Date.now();
        this.delta = this.now - this.then;

        if (this.delta > this.interval) {
            this.then = this.now - (this.delta % this.interval);
            this.runGameLoop();
        }
    }

    private runGameLoop() {
        this.players.forEach((player) => {
            player.move();
            player.turn(this.keys);
        });

        this.checkCollisions();

        if (this.checkRoundOver()) {
            return;
        }

        // clear react to redraw
        this.canvas.clear();
        //redraw
        for (const player of this.players) {
            this.canvas.drawPlayerHead(player);
            this.canvas.drawPlayerPath(player);
            this.updatePlayerPath(player);
        }
    }

    public setPlayersStartPosition(player: Player) {
        const startParams = calculateStartPosAndDirection(this.canvas.width, this.canvas.height);

        player.setStartPosition(
            {
                x: startParams.startX,
                y: startParams.startY,
            },
            startParams.direction,
        );
    }

    private checkRoundOver(): boolean {
        const alivePlayers = this.players.filter((player) => player.isAlive);
        // game over
        if (alivePlayers.length > 1) {
            return false;
        }

        this.handleRoundOver(alivePlayers);

        this.checkGameOver();

        return true;
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

    private handleRoundOver(alivePlayers: Player[]) {
        if (alivePlayers[0]) {
            alivePlayers[0].addPoints(10);
        }
        this.gameState = GameState.ROUND_OVER;
        this.canvas.drawRoundOver(alivePlayers[0]);
    }

    private handleGameOver(winner: Player) {
        this.gameState = GameState.FINISHED;
        this.canvas.drawWinner(winner);
    }

    public checkCollisions() {
        this.players.forEach((player) => {
            if (this.didPlayerCollide(player)) {
                player.die();
            }
        });
    }

    public didPlayerCollide(player: Player): boolean {
        // player collides with game boundaries
        if (
            player.currentPosition.x - PLAYER_WIDTH <= 0 ||
            player.currentPosition.x + PLAYER_WIDTH >= this.canvas.width ||
            player.currentPosition.y - PLAYER_WIDTH <= 0 ||
            player.currentPosition.y + PLAYER_WIDTH >= this.canvas.height
        ) {
            return true;
        }

        // player collides with other players
        for (const otherPlayer of this.players) {
            if (
                // reduce line with to prevent self collision
                this.canvas.doesPointCollideWithPath(otherPlayer.path, player.currentPosition, 1)
            ) {
                return true;
            }
        }

        return false;
    }

    private updatePlayerPath = (player: Player) => {
        const newPoint = Object.assign({}, player.currentPosition);
        if (!this.canvas.doesPointCollideWithPath(player.path, newPoint)) {
            player.updatePath(newPoint);
        }
    };
}
