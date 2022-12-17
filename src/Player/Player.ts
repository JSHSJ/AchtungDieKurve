import type {TPosition} from '../types/TPosition';
import type {TDirection} from '../types/TDirection';
import {updateRotationValueCos, updateRotationValueSin} from '../util/updateRotationValue';
import {BASE_SPEED, FULL_TURNING_RADIUS } from '../config/config';
import type {TControls} from '../types/TControls';

export type PlayerArgs = {
    id: string;
    color: string;
    controls: TControls;
};

export class Player {
    public id: string;
    public isAlive: boolean;
    public color: string;
    private direction: TDirection = { x: 0, y: -1 };
    public currentPosition: TPosition;
    public startPos: TPosition;
    private directionControl = 0;
    private controls: TControls;
    public path: Path2D;

    constructor(args: PlayerArgs) {
        this.id = args.id;
        this.color = args.color;
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
            this.directionControl = this.directionControl === 0 ? FULL_TURNING_RADIUS : this.directionControl - 1;
            this.updateDirection();
        }
        if (keys?.has(this.controls.right)) {
            this.directionControl = this.directionControl + 1 % FULL_TURNING_RADIUS;
            this.updateDirection();
        }
    }

    private updateDirection() {
        this.direction.y = updateRotationValueCos(this.directionControl);
        this.direction.x = updateRotationValueSin(this.directionControl);
    }


    public updatePath(points: TPosition) {
        this.path.lineTo(points.x, points.y);
    }

    public setStartPosition(startPosition: TPosition, directionControl: number) {
        this.startPos = this.currentPosition = startPosition;
        this.directionControl = directionControl;
        this.updateDirection();
        console.log(directionControl)
    }

    public reset() {
        this.isAlive = true;
        this.updateDirection();
        this.path = new Path2D();
    }
}

