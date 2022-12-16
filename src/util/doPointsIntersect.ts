import { PLAYER_WIDTH } from "../config/config";
import { TPosition } from "../types/TPosition";

export const doPointsIntersect = (pos1: TPosition, pos2: TPosition) => {
  const delta = Math.sqrt(Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2));
  return delta <= PLAYER_WIDTH * 2;
}