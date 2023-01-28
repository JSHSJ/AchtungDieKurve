import { writable } from 'svelte/store';
import { Routes } from '../lib/routing/routes';

export const router = writable<{
    currentRoute: Routes;
    previousRoutes: Routes[];
}>({
    currentRoute: Routes.START,
    previousRoutes: [],
});

export const navigateTo = (route: Routes) => {
    router.update((state) => {
        const previousRoutes = [...state.previousRoutes, state.currentRoute];
        return {
            currentRoute: route,
            previousRoutes,
        };
    });
};

export const goBack = () => {
    router.update((state) => {
        const previousRoutes = [...state.previousRoutes];
        const currentRoute = previousRoutes.pop();
        return {
            currentRoute: currentRoute || Routes.START,
            previousRoutes,
        };
    });
};
