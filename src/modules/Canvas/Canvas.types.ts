import type { Player } from '../Player/Player';

export enum CollisionType {
    PLAYER_COLLISION = 'PLAYER_COLLISION',
    WALL_COLLISION = 'WALL_COLLISION',
}

export type BaseCollsion = {
    player: Player;
};

export type PlayerCollision = BaseCollsion & {
    into: Player;
    type: CollisionType.PLAYER_COLLISION;
};

export type WallCollision = BaseCollsion & {
    type: CollisionType.WALL_COLLISION;
};

export type Collision = PlayerCollision | WallCollision;
