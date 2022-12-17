import type {TPosition} from '../types/TPosition';
import type {TDirection} from '../types/TDirection';
import {updateRotationValueCos, updateRotationValueSin} from '../util/updateRotationValue';
import {BASE_SPEED, PLAYER_WIDTH} from '../config/config';
import type {TControls} from '../types/TControls';

export type PlayerArgs = {
    id: string;
    color: string;
    startPosition: () => TPosition;
    controls: TControls;
};

export class Player {
    public id: string;
    public isAlive: boolean;
    public color: string;
    private direction: TDirection = { x: 0, y: -1 };
    public currentPosition: TPosition;
    public getStartPosition: () => TPosition;
    private startPos: TPosition;
    private counter = 0;
    private controls: TControls;
    private lineDash = [120, 15];
    public path: Path2D;

    constructor(args: PlayerArgs) {
        this.id = args.id;
        this.color = args.color;
        this.getStartPosition = args.startPosition;
        this.controls = args.controls;

        this.reset();
    }

    public move() {
        if (!this.isAlive) return;
        this.currentPosition.x += this.direction.x * BASE_SPEED;
        this.currentPosition.y += this.direction.y * BASE_SPEED;
    }

    public die() {
        this.isAlive = false;
    }

    public turn(keys: Set<string> | undefined) {
        if (keys?.has(this.controls.left)) {
            this.counter -= 1;
            this.updateDirection();
        }
        if (keys?.has(this.controls.right)) {
            this.counter += 1;
            this.updateDirection();
        }
    }

    private updateDirection() {
        this.direction.y = updateRotationValueSin(this.counter);
        this.direction.x = updateRotationValueCos(this.counter + Math.PI);
    }

    private redrawPreviousPositions(ctx: CanvasRenderingContext2D) {
        // Redraw player path
        ctx.moveTo(this.startPos.x, this.startPos.y);
        ctx.beginPath();
        ctx.setLineDash(this.lineDash);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2 * PLAYER_WIDTH;
        ctx.lineCap = 'round';
        ctx.stroke(this.path);
        ctx.closePath();
    }

    public draw(ctx: CanvasRenderingContext2D) {
        this.redrawPreviousPositions(ctx);

        if (!this.isAlive) return;

        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(
            this.currentPosition.x,
            this.currentPosition.y,
            PLAYER_WIDTH,
            0,
            Math.PI * 2,
            false,
        );
        ctx.fill();
        ctx.closePath();
    }

    public updatePreviousPositions(ctx: CanvasRenderingContext2D) {
        const newPoint = { x: this.currentPosition.x, y: this.currentPosition.y };

        if (ctx.isPointInStroke(this.path, newPoint.x, newPoint.y)) {
            return
        }

        this.path.lineTo(newPoint.x, newPoint.y);

    }

    public reset() {
        this.currentPosition = this.startPos = this.getStartPosition();
        this.counter = Math.random() * 100;
        this.isAlive = true;
        this.updateDirection();
        this.path = new Path2D();
    }
}

