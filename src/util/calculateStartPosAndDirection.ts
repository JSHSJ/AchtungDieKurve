import { config } from '../modules/Config/Config';
import { calculateFullTurnRadius } from './calculateFullTurnRadius';

enum DirectionFactor {
    LEFT = 0.75,
    UP = 0.5,
    DOWN = 1,
    RIGHT = 0.25,
}

export const calculateStartPosAndDirection = (width: number, height: number) => {
    const minDistance = width / 10;
    const startX = Math.random() * (width - minDistance * 2) + minDistance;
    const startY = Math.random() * (height - minDistance) + minDistance;
    const direction = getUsefulDirectionControl(startX, startY, width, height);

    return {
        startX,
        startY,
        direction,
    };
};

const getUsefulDirectionControl = (
    startX: number,
    startY: number,
    width: number,
    height: number,
) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const deltaX = startX - centerX;
    const deltaY = startY - centerY;

    const minFactor =
        getMinimumDirectionFactor(deltaX, deltaY) * calculateFullTurnRadius(config.turningRadius);
    const maxFactor =
        getMaximumDirectionFactor(deltaX, deltaY) * calculateFullTurnRadius(config.turningRadius);

    return Math.random() * (maxFactor - minFactor) + minFactor;
};

const getMinimumDirectionFactor = (deltaX: number, deltaY: number) => {
    if (deltaY > 0) {
        // bottom right
        if (deltaX > 0) {
            return DirectionFactor.UP;
            // bottom left
        } else {
            return DirectionFactor.RIGHT;
        }
    }
    // top left
    if (deltaX <= 0) {
        return 0;
    }

    // top right
    return DirectionFactor.LEFT;
};

const getMaximumDirectionFactor = (deltaX: number, deltaY: number) => {
    if (deltaY > 0) {
        // bottom right
        if (deltaX > 0) {
            return DirectionFactor.LEFT;
            // bottom left
        } else {
            return DirectionFactor.UP;
        }
    }
    // top left
    if (deltaX <= 0) {
        return DirectionFactor.RIGHT;
    }

    // top right
    return DirectionFactor.DOWN;
};
