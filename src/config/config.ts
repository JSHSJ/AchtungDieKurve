export const BASE_SPEED = 1;
/**
 * Adjusts the radius with which the line is turning.
 * Higher values mean a fast turn.
 */
export const BASE_TURNING_RADIUS = 0.003;

export const FULL_TURNING_RADIUS = 1 / BASE_TURNING_RADIUS;
/**
 * Adjusts the line width. Higher values lead to
 * a bigger line.
 */
export const PLAYER_WIDTH = 2;

export const PLAYER_COLORS = ['#ae3ec9', '#4263eb', '#0ca678', '#74b816', '#f59f00', '#f76707'];
export const PLAYER_CONTROLS = [
    { left: 'q', right: 'w' },
    { left: 'o', right: 'p' },
    { left: 'c', right: 'v' },
    { left: 'n', right: 'm' },
];

export const PLAYER_LINE_DASH = [120, 15];

export const DEFAULT_CANVAS_SIZE = 500;

export const SCORE_CREDIT_KILLER = true;
export const SCORE_USE_RANKING = true;
