import { calculateStartPosAndDirection } from './calculateStartPosAndDirection';
import type { Player } from '../modules/Player/Player';

export const setStartParamsForPlayer = (player: Player, width: number, height: number) => {
    const startParams = calculateStartPosAndDirection(width, height);

    player.setStartPosition(
        {
            x: startParams.startX,
            y: startParams.startY,
        },
        startParams.direction,
    );
};
