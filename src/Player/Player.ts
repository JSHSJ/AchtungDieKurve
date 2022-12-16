import { TPosition } from "../types/TPosition";
import { TDirection } from "../types/TDirection";
import { updateRotationValue } from "../util/updateRotationValue";

export class Player {
  private id: string;
  public isAlive: boolean;
  public color: string;
  private direction: TDirection;
  public currentPosition: TPosition;
  public previousPosition: TPosition[];
  private #counter = 0;

  constructor(
    id: string,
    color: string,
    startPosition: TPosition,
    startDirection: TDirection
  ) {
    this.id = id;
    this.color = color;
    this.currentPosition = startPosition;
    this.direction = startDirection;
    this.isAlive = true;
    this.previousPosition = [];
    this.previousPosition.push(this.currentPosition);
  }

  public move() {
    this.currentPosition.x += this.direction.x * BASE_SPEED;
    this.currentPosition.y += this.direction.y * BASE_SPEED;
    this.previousPosition.push(this.currentPosition);
  }

  public setAlive(isAlive: boolean) {
    this.isAlive = isAlive;
  }

  public rotateLeft() {
    this.#counter -= 1;
    this.direction.y = updateRotationValue(this.#counter);
    this.direction.x = updateRotationValue(this.#counter + Math.PI);
  }

  public rotateRight() {
    this.#counter += 1;
    this.direction.y = updateRotationValue(this.#counter);
    this.direction.x = updateRotationValue(this.#counter + Math.PI);
  }
}
