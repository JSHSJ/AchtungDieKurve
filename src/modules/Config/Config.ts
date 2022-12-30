import type { TConfig } from './Config.type';

export const DEFAULT_CONFIG: TConfig = {
    speed: 1,
    turningRadius: 0.003,
    playerWidth: 2,
    playerLineLength: 120,
    playerGapLength: 15,
    scoreCreditKiller: true,
    scoreUseRanking: true,
};

export let config: TConfig = DEFAULT_CONFIG;

export const readFromLocalStorage = () => {
    const storedConfig = localStorage.getItem('config');
    if (storedConfig) {
        updateConfig(JSON.parse(storedConfig));
    }
};

export const writeToLocalStorage = () => {
    localStorage.setItem('config', JSON.stringify(config));
};

export const updateConfig = (newConfig: Partial<TConfig>) => {
    config = {
        ...config,
        ...newConfig,
    };
    writeToLocalStorage();
};

export const getInitialConfig = () => {
    readFromLocalStorage();
    return config;
};
