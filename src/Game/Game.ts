import { PLAYER_WIDTH } from '../config/config';
import { Player } from '../Player/Player';
import { doPointsIntersect } from '../util/doPointsIntersect';
import { TDrawPathTypes } from '../types/TDrawPath';

export class Game {
    public ctx: CanvasRenderingContext2D;
    public width: number;
    public height: number;

    private fps = 60;
    private now = 0;
    private then = Date.now();
    private interval = 1000 / this.fps;
    private delta: number = 0;
    private keys: Set<string>;

    private players: Player[];

    constructor(ctx: CanvasRenderingContext2D, players: Player[]) {
        this.ctx = ctx;
        this.width = ctx.canvas.width;
        this.height = ctx.canvas.height;
        this.players = players;
        this.keys = new Set<string>();

        window.addEventListener('keydown', (e: KeyboardEvent) => {
            this.keys.add(e.key);
        });
        window.addEventListener('keyup', (e: KeyboardEvent) => {
            this.keys.delete(e.key);
        });
    }

    reset() {
        this.players.forEach((player) => {
            player.reset();
        });
    }

    loop() {
        if (this.players.filter((player) => player.isAlive).length <= 1) {
            this.drawWinner();
            return;
        }

        requestAnimationFrame(this.loop.bind(this));

        this.now = Date.now();
        this.delta = this.now - this.then;

        if (this.delta > this.interval) {
            this.then = this.now - (this.delta % this.interval);
            this.animate();
        }
    }

    animate() {
        this.players.forEach((player) => {
            player.move();
            player.turn(this.keys);
        });

        this.checkCollisions();

        // clear react to redraw
        this.ctx.clearRect(0, 0, this.width, this.height);
        //redraw
        for (const player of this.players) {
            player.draw(this.ctx);
            player.updatePreviousPositions(this.ctx);
        }
    }

    public checkCollisions() {
        this.players.forEach((player) => {
            // check collision with game boundaries
            if (
                player.currentPosition.x - PLAYER_WIDTH <= 0 ||
                player.currentPosition.x + PLAYER_WIDTH >= this.width ||
                player.currentPosition.y - PLAYER_WIDTH <= 0 ||
                player.currentPosition.y + PLAYER_WIDTH >= this.height
            ) {
                player.die();
            }

            // reduce line with to prevent self collision
            this.ctx.lineWidth = 1
            // check collision with other players
            this.players.forEach((otherPlayer) => {
                if (this.ctx.isPointInStroke(player.path, otherPlayer.currentPosition.x, otherPlayer.currentPosition.y)) {
                    otherPlayer.die();
                }
            })
        });
    }

    private drawWinner() {
        const winner = this.players.find((player) => player.isAlive);
        if (winner) {
            const midX = this.width / 2 - 75;
            const midY = this.height / 2 - 120;
            this.ctx.fillStyle = winner.color;
            this.ctx.beginPath();
            this.ctx.moveTo(midX + 75, midY + 40);
            this.ctx.bezierCurveTo(
                midX + 75,
                midY + 37,
                midX + 70,
                midY + 25,
                midX + 50,
                midY + 25,
            );
            this.ctx.bezierCurveTo(
                midX + 20,
                midY + 25,
                midX + 20,
                midY + 62.5,
                midX + 20,
                midY + 62.5,
            );
            this.ctx.bezierCurveTo(
                midX + 20,
                midY + 80,
                midX + 40,
                midY + 102,
                midX + 75,
                midY + 120,
            );
            this.ctx.bezierCurveTo(
                midX + 110,
                midY + 102,
                midX + 130,
                midY + 80,
                midX + 130,
                midY + 62.5,
            );
            this.ctx.bezierCurveTo(
                midX + 130,
                midY + 62.5,
                midX + 130,
                midY + 25,
                midX + 100,
                midY + 25,
            );
            this.ctx.bezierCurveTo(
                midX + 85,
                midY + 25,
                midX + 75,
                midY + 37,
                midX + 75,
                midY + 40,
            );
            this.ctx.fill();
            this.ctx.font = '30px Arial';
            this.ctx.fillText('WINNER', midX + 10, midY + 160);
        }
    }
}
