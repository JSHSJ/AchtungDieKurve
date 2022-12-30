import { writable } from 'svelte/store';
import { getInitialConfig, updateConfig } from '../modules/Config/Config';

export const configStore = writable(getInitialConfig());

/**
 * Update config object for consumption in game classes
 */
configStore.subscribe((config) => {
    updateConfig(config);
});
