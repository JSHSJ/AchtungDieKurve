import type { Canvas } from '../Canvas/Canvas';
import type { Player } from '../Player/Player';
import type { RoundEvent } from './Round.types';
import { RoundEventTypes, RoundState } from './Round.types';
import { EventEmitter } from '../EventEmitter/EventEmitter';
import type { Collision } from '../Canvas/Canvas.types';

export class Round extends EventEmitter<RoundEvent> {
    canvas: Canvas;
    players: Player[];
    #playerRanking: Player[] = [];
    #currentRankIdx = 0;
    state: RoundState = RoundState.PRE_ROUND;

    animationHandle = 0;

    private readonly keys: Set<string>;

    private fps = 60;
    private now = 0;
    private then = Date.now();
    private interval = 1000 / this.fps;
    private delta: number = 0;

    constructor(canvas: Canvas, players: Player[], keys: Set<string>) {
        super();

        this.canvas = canvas;
        this.players = players;
        this.keys = keys;
        this.#playerRanking = new Array(players.length);
        this.#currentRankIdx = players.length - 1;
    }

    public start() {
        this.canvas.clear();
        this.state = RoundState.RUNNING;
        this.runGameLoopWrapper();
        this.emit({
            type: RoundEventTypes.ROUND_STARTED,
        });
    }

    /**
     * Throttle the game loop to 60 fps
     */
    private runGameLoopWrapper() {
        if (this.state === RoundState.ROUND_OVER) {
            cancelAnimationFrame(this.animationHandle);
            return;
        }

        this.animationHandle = requestAnimationFrame(this.runGameLoopWrapper.bind(this));

        this.now = Date.now();
        this.delta = this.now - this.then;

        if (this.delta > this.interval) {
            this.then = this.now - (this.delta % this.interval);
            this.runGameLoop();
        }
    }

    private runGameLoop() {
        if (this.state === RoundState.ROUND_OVER) {
            return;
        }

        this.players.forEach((player) => {
            player.move();
            player.turn(this.keys);
        });

        const collisions = this.checkCollisions();
        this.handleCollisions(collisions);

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

    public checkCollisions(): Collision[] {
        return this.players
            .filter((player) => player.isAlive)
            .map((player) => this.canvas.didPlayerCollide(player, this.players))
            .filter((collision): collision is Collision => !!collision);
    }

    private handleCollisions(collisions: Collision[]): void {
        collisions.forEach((collision) => {
            // Add dead player to the front of the players
            if (collision.player.isAlive) {
                this.addPlayerToRanking(collision.player);
            }
            if (collision?.type === 'PLAYER_COLLISION') {
                this.emit({
                    type: RoundEventTypes.PLAYER_COLLISION,
                    collision,
                });
            }
            if (collision?.type === 'WALL_COLLISION') {
                this.emit({
                    type: RoundEventTypes.WALL_COLLISION,
                    collision,
                });
            }
        });
    }

    private updatePlayerPath = (player: Player) => {
        const newPoint = Object.assign({}, player.currentPosition);
        if (!this.canvas.doesPointCollideWithPath(player.path, newPoint)) {
            player.updatePath(newPoint);
        }
    };

    private checkRoundOver(): boolean {
        const alivePlayers = this.players.filter((player) => player.isAlive);
        // game over
        if (alivePlayers.length > 1) {
            return false;
        }

        this.state = RoundState.ROUND_OVER;
        this.handleRoundOver(alivePlayers);
        return true;
    }

    private handleRoundOver(alivePlayers: Player[]) {
        alivePlayers.forEach((player) => {
            this.addPlayerToRanking(player);
        });
        this.emit({
            type: RoundEventTypes.ROUND_OVER,
            result: alivePlayers[0] ? 'PLAYER_WON' : 'DRAW',
            ranking: this.#playerRanking,
        });
    }

    private addPlayerToRanking(player: Player) {
        this.#playerRanking[this.#currentRankIdx] = player;
        this.#currentRankIdx--;
    }
}
