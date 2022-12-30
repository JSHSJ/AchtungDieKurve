import type { Player } from '../Player/Player';

export enum TGameEventTypes {
    SCORE_UPDATED = 'SCORE_UPDATED',
}

export enum GameState {
    SETUP = 'SETUP',
    PREGAME = 'PREGAME',
    PREROUND = 'PREROUND',
    PREROUND_COUNTDOWN = 'PREROUND_COUNTDOWN',
    RUNNING = 'RUNNING',
    ROUND_OVER = 'ROUND_OVER',
    FINISHED = 'FINISHED',
}

export type TGameEvent = TGameScoreUpdateEvent;

export type TGameScore = Record<Player['id'], number>;

export type TGameScoreUpdateEvent = {
    type: TGameEventTypes.SCORE_UPDATED;
    score: TGameScore;
};
