import { writable } from 'svelte/store';

export const isMenuOpen = writable(true);
export const isMenuDisabled = writable(false);
export const isConfigMenuOpen = writable(false);

export const closeMenu = () => {
    isMenuOpen.set(false);
    isMenuDisabled.set(true);
};

export const openMenu = () => {
    isMenuOpen.set(true);
    isMenuDisabled.set(false);
};

export const toggleMenu = () => {
    isMenuOpen.update((value) => !value);
    isMenuDisabled.update((value) => !value);
};
