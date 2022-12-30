import { config } from '../modules/Config/Config';

export const updateRotationValueSin = (factor: number) =>
    Math.round(1000 * Math.sin(2 * Math.PI * config.turningRadius * factor)) / 1000;

export const updateRotationValueCos = (factor: number) =>
    Math.round(1000 * Math.cos(2 * Math.PI * config.turningRadius * factor)) / 1000;
