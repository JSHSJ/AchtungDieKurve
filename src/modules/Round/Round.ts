import type { Canvas } from '../Canvas/Canvas';
import type { Player } from '../Player/Player';
import { setStartParamsForPlayer } from '../../util/setStartParamsForPlayer';
import type { RoundEvent } from './Round.types';
import { RoundEventTypes, RoundState } from './Round.types';
import {EventEmitter} from "../EventEmitter/EventEmitter";

 export class Round extends EventEmitter<RoundEvent> {
    canvas: Canvas;
    players: Player[];
    state: RoundState = RoundState.PRE_ROUND;


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
    }

    public start() {
        this.players.forEach((player) => {
            player.resetStartPosition();
            setStartParamsForPlayer(player, this.canvas.width, this.canvas.height);
        });
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
        if (this.state !== RoundState.RUNNING) {
            return;
        }

        requestAnimationFrame(this.runGameLoopWrapper.bind(this));

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

    public checkCollisions() {
        this.players.forEach((player) => {
            if (this.canvas.didPlayerCollide(player, this.players)) {
                player.die();
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

        this.handleRoundOver(alivePlayers);
        this.state = RoundState.ROUND_OVER;
        return true;
    }

    private handleRoundOver(alivePlayers: Player[]) {
        this.emit({
            type: RoundEventTypes.ROUND_OVER,
            result: alivePlayers[0] ? 'PLAYER_WON' : 'DRAW',
            winner: alivePlayers[0],
        });
    }
}
