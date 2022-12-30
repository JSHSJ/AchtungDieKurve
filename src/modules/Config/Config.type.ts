export type TConfig = {
    speed: number;
    /**
     * Adjusts the radius with which the line is turning.
     * Higher values mean a fast turn.
     */
    turningRadius: number;
    /**
     * Adjusts the line width. Higher values lead to
     * a bigger line.
     */
    playerWidth: number;
    playerLineLength: number;
    playerGapLength: number;
    scoreCreditKiller: boolean;
    scoreUseRanking: boolean;
};
