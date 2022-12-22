import type {Player} from "../Player/Player";

export enum TGameEventTypes {
    SCORE_UPDATED = 'SCORE_UPDATED'
}

export type TGameEvent = TGameScoreUpdateEvent;

export type TGameScore = Record<Player["id"], number>;

export type TGameScoreUpdateEvent = {
type: TGameEventTypes.SCORE_UPDATED;
score: TGameScore;
}
