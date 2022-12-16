import { TPosition } from "../types/TPosition";
import { TDirection } from "../types/TDirection";
import { updateRotationValueSin, updateRotationValueCos } from "../util/updateRotationValue";
import { PLAYER_WIDTH, BASE_SPEED } from "../config/config";
import { TControls } from "../types/TControls";
import { doPointsIntersect } from "../util/doPointsIntersect";

export type PlayerArgs = {
    id: string,
    color: string,
    startPosition: TPosition,
    startCounter: number,
    controls: TControls,
};

export class Player {
  public id: string;
  public isAlive: boolean;
  public color: string;
  private direction: TDirection = { x: 0, y: -1 };
  public currentPosition: TPosition;
  public previousPositions: TPosition[];
  private counter = 0;
  private controls: TControls;

  constructor(args: PlayerArgs) {
    this.id = args.id;
    this.color = args.color;
    this.currentPosition = args.startPosition;
    this.counter = args.startCounter;
    this.controls = args.controls;

    this.isAlive = true;
    this.previousPositions = [];
    this.previousPositions.push(clonePoint(args.startPosition));
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
    this.direction.x = updateRotationValueCos(this.counter + Math.PI)
  }

  public draw(ctx: CanvasRenderingContext2D) {
    if (!this.isAlive) return;

    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(
      this.currentPosition.x,
      this.currentPosition.y,
      PLAYER_WIDTH,
      0,Math.PI * 2, false
    );
    ctx.fill();
    ctx.closePath();
  }

  public updatePreviousPositions() {
    const previousPoint = this.previousPositions.at(-1);
    const newPoint = clonePoint(this.currentPosition);
    if (!previousPoint || !doPointsIntersect(previousPoint, newPoint)) {
this.previousPositions.push(newPoint);
    }
  }
}


const clonePoint = (point: TPosition) => {
    return {
        x: point.x,
        y: point.y,
    }
}
