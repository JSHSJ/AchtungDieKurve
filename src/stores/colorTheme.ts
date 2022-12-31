import { writable } from 'svelte/store';

export enum ColorTheme {
    Light = 'Light',
    Dark = 'Dark',
    Adaptive = 'Adaptive',
}

const initColorTheme = () => {
    const storedColorTheme = localStorage.getItem('colorTheme');
    if (storedColorTheme) {
        return storedColorTheme as ColorTheme;
    }

    return ColorTheme.Adaptive;
};

export const colorThemeStore = writable<ColorTheme>(initColorTheme());

const htmlElement = document.documentElement;
colorThemeStore.subscribe((colorTheme) => {
    const newValue = colorTheme === ColorTheme.Adaptive ? '' : colorTheme.toLowerCase();
    htmlElement.setAttribute('data-theme', newValue);
    localStorage.setItem('colorTheme', colorTheme);
});
