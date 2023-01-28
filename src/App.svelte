<script lang="ts">
    import { Game } from './modules/Game/Game';
    import { Routes } from './lib/routing/routes';
    import StartScreen from './lib/startScreen/StartScreen.svelte';
    import { router } from './stores/router.js';
    import ConfigScreen from './lib/config/ConfigScreen.svelte';
    import PlayerScreen from './lib/players/PlayerScreen.svelte';
    import GameScreen from './lib/gameScreen/GameScreen.svelte';

    let game: Game;
</script>

<svelte:head>kurveee zatacka - Achtung, die Kurve!</svelte:head>

<main>
    {#if $router.currentRoute === Routes.START}
        <StartScreen />
    {/if}
    {#if $router.currentRoute === Routes.PLAYERS}
        <PlayerScreen />
    {/if}
    {#if $router.currentRoute === Routes.GAME}
        <GameScreen />
    {/if}
    {#if $router.currentRoute === Routes.OPTIONS}
        <ConfigScreen />
    {/if}
</main>
