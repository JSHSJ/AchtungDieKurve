import type { TPosition } from '../types/TPosition';
import type { TDirection } from '../types/TDirection';
import { updateRotationValueCos, updateRotationValueSin } from '../util/updateRotationValue';
import { BASE_SPEED, LINE_FRAMES, PLAYER_WIDTH, TUNNEL_FRAMES } from '../config/config';
import type { TControls } from '../types/TControls';
import { doPointsIntersect } from '../util/doPointsIntersect';
import { TDrawPathTypes, type TDrawPath } from '../types/TDrawPath';

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
    public startPosition: () => TPosition;
    public previousPositions: TDrawPath[];
    private counter = 0;
    private controls: TControls;
    public currentDrawMode = TDrawPathTypes.Line;
    private currentDrawModeTicks = LINE_FRAMES;

    constructor(args: PlayerArgs) {
        this.id = args.id;
        this.color = args.color;
        this.startPosition = args.startPosition;
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
        let prevPos = this.previousPositions[0];
        this.previousPositions.forEach((drawPath) => {
            ctx.beginPath();
            ctx.moveTo(prevPos.x, prevPos.y);
            ctx.strokeStyle = drawPath.type === TDrawPathTypes.Line ? this.color : 'transparent';
            ctx.lineWidth = 2 * PLAYER_WIDTH;
            ctx.lineCap = 'round';
            ctx.lineTo(drawPath.x, drawPath.y);
            ctx.stroke();
            prevPos = drawPath;
        });
    }

    public draw(ctx: CanvasRenderingContext2D) {
        this.redrawPreviousPositions(ctx);
        if (!this.isAlive) return;

        if (this.currentDrawModeTicks <= 0) {
            this.switchDrawMode();
        }

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

        this.currentDrawModeTicks--;
    }

    public updatePreviousPositions() {
        const previousPoint = this.previousPositions.at(-1);
        const newPoint = { x: this.currentPosition.x, y: this.currentPosition.y };

        if (!previousPoint || !doPointsIntersect(previousPoint, newPoint)) {
            this.previousPositions.push(createDrawPath(newPoint, this.currentDrawMode));
        }
    }

    private switchDrawMode() {
        this.currentDrawMode =
            this.currentDrawMode === TDrawPathTypes.Line
                ? TDrawPathTypes.Tunnel
                : TDrawPathTypes.Line;

        this.currentDrawModeTicks =
            this.currentDrawMode === TDrawPathTypes.Line ? LINE_FRAMES : TUNNEL_FRAMES;
    }

    public reset() {
        this.currentPosition = this.startPosition();
        console.log(this.currentPosition);
        this.counter = Math.random() * 100;
        this.isAlive = true;
        this.previousPositions = [];
        this.previousPositions.push(
            createDrawPath(Object.assign({}, this.currentPosition), TDrawPathTypes.Line),
        );
        this.currentDrawModeTicks = LINE_FRAMES;
        this.updateDirection();
    }
}

const createDrawPath = (point: TPosition, type: TDrawPathTypes): TDrawPath => {
    return {
        x: point.x,
        y: point.y,
        type,
    };
};
