import { writable } from 'svelte/store';

export enum ColorTheme {
    Light = 'Light',
    Dark = 'Dark',
    Adaptive = 'Adaptive',
}

export const colorThemeStore = writable<ColorTheme>(ColorTheme.Adaptive);

const htmlElement = document.documentElement;
colorThemeStore.subscribe((colorTheme) => {
    const newValue = colorTheme === ColorTheme.Adaptive ? '' : colorTheme.toLowerCase();
    htmlElement.setAttribute('data-theme', newValue);
});
