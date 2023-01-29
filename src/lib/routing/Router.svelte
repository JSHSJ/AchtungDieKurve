<script lang="ts">
    import { router } from '../../stores/router';
    import { Routes } from './routes';
    import StartScreen from '../screens/StartScreen.svelte';
    import PlayerScreen from '../screens/PlayerScreen.svelte';
    import GameScreen from '../screens/GameScreen.svelte';
    import ConfigScreen from '../screens/ConfigScreen.svelte';
    import HowToPlayScreen from '../screens/HowToPlayScreen.svelte';
    import CreditsScreen from '../screens/CreditsScreen.svelte';
</script>

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
{#if $router.currentRoute === Routes.HOW_TO_PLAY}
    <HowToPlayScreen />
{/if}
{#if $router.currentRoute === Routes.CREDITS}
    <CreditsScreen />
{/if}
