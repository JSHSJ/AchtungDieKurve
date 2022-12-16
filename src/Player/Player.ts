import {TPosition} from "../types/TPosition";
import {TDirection} from "../types/TDirection";
import {Game} from "../Game/Game";

const BASE_SPEED = 1;
const BASE_ROTATION = 0.01;

export class Player {
    private id: string;
    public isAlive: boolean;
    public color: string;
    private direction: TDirection;
    public currentPosition: TPosition;
    public previousPosition: TPosition[];

    constructor(id: string, color: string, startPosition: TPosition, startDirection: TDirection) {
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


}

