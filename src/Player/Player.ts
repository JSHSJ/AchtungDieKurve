import { TPosition } from '../types/TPosition';
import { TDirection } from '../types/TDirection';
import { updateRotationValueCos, updateRotationValueSin } from '../util/updateRotationValue';
import { BASE_SPEED, LINE_FRAMES, PLAYER_WIDTH, TUNNEL_FRAMES } from '../config/config';
import { TControls } from '../types/TControls';
import { doPointsIntersect } from '../util/doPointsIntersect';
import { TDrawPath, TDrawPathTypes } from '../types/TDrawPath';

export type PlayerArgs = {
    id: string;
    color: string;
    startPosition: TPosition;
    startCounter: number;
    controls: TControls;
};

export class Player {
    public id: string;
    public isAlive: boolean;
    public color: string;
    private direction: TDirection = { x: 0, y: -1 };
    public currentPosition: TPosition;
    public startPosition: TPosition;
    public previousPositions: TDrawPath[];
    private counter = 0;
    private controls: TControls;
    public currentDrawMode = TDrawPathTypes.Line;
    private currentDrawModeTicks = LINE_FRAMES;

    constructor(args: PlayerArgs) {
        this.id = args.id;
        this.color = args.color;
        this.startPosition = args.startPosition,
        this.currentPosition = this.startPosition;
        this.counter = args.startCounter;
        this.controls = args.controls;

        this.isAlive = true;
        this.previousPositions = [];
        this.previousPositions.push(createDrawPath(
            this.startPosition,
            TDrawPathTypes.Line,
        ));
        this.updateDirection();
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

    public draw(ctx: CanvasRenderingContext2D) {
        if (!this.isAlive) return;

        if (this.currentDrawModeTicks <= 0) {
            this.switchDrawMode();
        }

        ctx.beginPath();
        ctx.fillStyle = this.currentDrawMode === TDrawPathTypes.Line ? this.color : 'transparent';
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
}

const createDrawPath = (point: TPosition, type: TDrawPathTypes): TDrawPath => {
    return {
        x: point.x,
        y: point.y,
        type,
    };
};
