import type { Player } from '../Player/Player';
import type { PlayerCollision, WallCollision } from '../Canvas/Canvas.types';

export enum RoundEventTypes {
    ROUND_STARTED = 'ROUND_STARTED',
    ROUND_OVER = 'ROUND_OVER',
    PLAYER_COLLISION = 'PLAYER_COLLISION',
    WALL_COLLISION = 'WALL_COLLISION',
}

export type RoundStartedEvent = {
    type: RoundEventTypes.ROUND_STARTED;
};

export type RoundedOverEvent = {
    type: RoundEventTypes.ROUND_OVER;
    result: 'PLAYER_WON' | 'DRAW';
    ranking: Player[];
};

export type PlayerCollisionEvent = {
    type: RoundEventTypes.PLAYER_COLLISION;
    collision: PlayerCollision;
};

export type WallCollisionEvent = {
    type: RoundEventTypes.WALL_COLLISION;
    collision: WallCollision;
};

export type RoundEvent =
    | RoundStartedEvent
    | RoundedOverEvent
    | PlayerCollisionEvent
    | WallCollisionEvent;
export enum RoundState {
    PRE_ROUND,
    RUNNING,
    ROUND_OVER,
}
