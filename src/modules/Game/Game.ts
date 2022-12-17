import { PLAYER_WIDTH } from '../../config/config';
import type { Player } from '../Player/Player';
import { calculateStartPosAndDirection } from '../../util/calculateStartPosAndDirection';
import type { Canvas } from '../Canvas/Canvas';

export class Game {
    public canvas: Canvas;
    private fps = 60;
    private now = 0;
    private then = Date.now();
    private interval = 1000 / this.fps;
    private delta: number = 0;
    private keys: Set<string>;

    private players: Player[];

    constructor(canvas: Canvas, players: Player[]) {
        this.canvas = canvas;
        this.players = players;
        this.keys = new Set<string>();

        window.addEventListener('keydown', (e: KeyboardEvent) => {
            this.keys.add(e.key);
        });
        window.addEventListener('keyup', (e: KeyboardEvent) => {
            this.keys.delete(e.key);
        });

        this.players.forEach((player) => {
            this.setPlayersStartPosition(player);
        });
    }

    reset() {
        this.players.forEach((player) => {
            player.reset();
            this.setPlayersStartPosition(player);
        });
        this.canvas.clear();
    }

    loop() {
        if (this.checkGameOver()) {
            return;
        }

        requestAnimationFrame(this.loop.bind(this));

        this.now = Date.now();
        this.delta = this.now - this.then;

        if (this.delta > this.interval) {
            this.then = this.now - (this.delta % this.interval);
            this.runGameLoop();
        }
    }

    runGameLoop() {
        this.players.forEach((player) => {
            player.move();
            player.turn(this.keys);
        });

        this.checkCollisions();

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

    private checkGameOver(): boolean {
        const alivePlayers = this.players.filter((player) => player.isAlive);
        // game over
        if (alivePlayers.length > 1) {
            return false;
        }

        if (alivePlayers[0]) {
            this.canvas.drawWinner(alivePlayers[0]);
        }

        return true;
    }

    public checkCollisions() {
        this.players.forEach((player) => {
            // check collision with game boundaries
            if (
                player.currentPosition.x - PLAYER_WIDTH <= 0 ||
                player.currentPosition.x + PLAYER_WIDTH >= this.canvas.width ||
                player.currentPosition.y - PLAYER_WIDTH <= 0 ||
                player.currentPosition.y + PLAYER_WIDTH >= this.canvas.height
            ) {
                player.die();
            }

            // check collision with other players
            this.players.forEach((otherPlayer) => {
                if (
                    // reduce line with to prevent self collision
                    this.canvas.doesPointCollideWithPath(
                        player.path,
                        otherPlayer.currentPosition,
                        1,
                    )
                ) {
                    otherPlayer.die();
                }
            });
        });
    }

    private updatePlayerPath = (player: Player) => {
        const newPoint = Object.assign({}, player.currentPosition);
        if (!this.canvas.doesPointCollideWithPath(player.path, newPoint)) {
            player.updatePath(newPoint);
        }
    };
}
