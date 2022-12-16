import { BASE_ROTATION } from '../config/config';

export const updateRotationValueSin = (time: number) =>
  Math.round(1000 * (1 + Math.sin(2 * Math.PI * BASE_ROTATION * time) - 1)) /
  1000;

export const updateRotationValueCos = (time: number) =>
  Math.round(1000 * (1 + Math.cos(2 * Math.PI * BASE_ROTATION * time) - 1)) /
  1000;
