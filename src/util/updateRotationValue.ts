import { BASE_TURNING_RADIUS } from '../config/config';

export const updateRotationValueSin = (factor: number) =>
    Math.round(1000 * (Math.sin(2 * Math.PI * BASE_TURNING_RADIUS * factor))) / 1000;

export const updateRotationValueCos = (factor: number) =>
    Math.round(1000 * (Math.cos(2 * Math.PI * BASE_TURNING_RADIUS * factor))) / 1000;
