export const updateRotationValue = (time: number) =>
  Math.round(1000 * (1 + Math.sin(2 * Math.PI * BASE_ROTATION * time) - 1)) /
  1000;
