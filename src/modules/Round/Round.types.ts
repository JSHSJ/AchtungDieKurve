import type { Player } from '../Player/Player';

export enum RoundEventTypes {
    ROUND_STARTED = 'ROUND_STARTED',
    ROUND_OVER = 'ROUND_OVER',
}

export type RoundEvent = {
    type: RoundEventTypes;
    result?: 'DRAW' | 'PLAYER_WON';
    winner?: Player;
};
export enum RoundState {
    PRE_ROUND,
    RUNNING,
    ROUND_OVER,
}
