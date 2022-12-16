import { PLAYER_WIDTH } from '../config/config';
import { Player } from '../Player/Player';
import { doPointsIntersect } from '../util/doPointsIntersect';

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

    loop() {
        if (this.players.filter((player) => player.isAlive).length <= 1) {
            console.log('GAME OVER');
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

        for (const player of this.players) {
            player.draw(this.ctx);
            player.updatePreviousPositions();
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

            // check collision with other players
            player.previousPositions.forEach((position, idx) => {
                this.players.forEach((otherPlayer) => {
                    // skip last position of current player to avoic instant self collision
                    if (
                        player.id === otherPlayer.id &&
                        idx === player.previousPositions.length - 1
                    ) {
                        return;
                    }

                    if (doPointsIntersect(position, otherPlayer.currentPosition)) {
                        otherPlayer.die();
                        console.log(position, otherPlayer.currentPosition);
                    }
                });
            });
        });
    }
}
