import type { TPosition } from '../../types/TPosition';
import type { TDirection } from '../../types/TDirection';
import { updateRotationValueCos, updateRotationValueSin } from '../../util/updateRotationValue';
import { BASE_SPEED, FULL_TURNING_RADIUS } from '../../config/config';
import type { TControls } from '../../types/TControls';
import { generateUUID } from '../../util/generateUUID';

export type PlayerArgs = {
    id: string;
    color: string;
    name: string;
    controls: TControls;
};

export class Player {
    public id: string;
    public name: string;
    public isAlive: boolean;
    public color: string;
    private direction: TDirection = { x: 0, y: -1 };
    public currentPosition: TPosition;
    public startPos: TPosition;
    private directionControl = 0;
    private controls: TControls;
    public path: Path2D;

    /**
     * Don't use this method to create new player, use static method createPlayerStub instead
     */
    constructor(args: PlayerArgs) {
        this.id = args.id;
        this.color = args.color;
        this.controls = args.controls;
        this.name = args.name;
        this.isAlive = false;
        this.currentPosition = { x: 0, y: 0 };
        this.startPos = { x: 0, y: 0 };
        this.path = new Path2D();
    }

    public static createPlayerStub(): Player {
        const id = generateUUID('player');
        return new Player({ id, color: 'black', controls: { left: '', right: '' }, name: '' });
    }

    public init() {
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
            this.directionControl = this.directionControl + (1 % FULL_TURNING_RADIUS);

            this.updateDirection();
        }
        if (keys?.has(this.controls.right)) {
            this.directionControl =
                this.directionControl === 0 ? FULL_TURNING_RADIUS : this.directionControl - 1;
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
    }

    public reset() {
        this.resetStartPosition();
    }

    public resetStartPosition() {
        this.isAlive = true;
        this.updateDirection();
        this.path = new Path2D();
    }
}
