<script>
    import Logo from '../logo/Logo.svelte';
    import { withArrowControls } from '@jshsj/with-arrow-controls';
    import { onMount } from 'svelte';
    import { Routes } from '../routing/routes';
    import { navigateTo } from '../../stores/router';

    let initialButton;

    onMount(() => {
        withArrowControls();
        initialButton.focus();
    });
</script>

<section>
    <div>
        <Logo />
    </div>
    <div data-with-arrowcontrols>
        <button bind:this="{initialButton}" on:click="{() => navigateTo(Routes.PLAYERS)}"
            >New Game</button
        >
        <button on:click="{() => navigateTo(Routes.OPTIONS)}">Options</button>
        <button on:click="{() => navigateTo(Routes.HOW_TO_PLAY)}">How to Play</button>
        <button on:click="{() => navigateTo(Routes.CREDITS)}">Credits</button>
    </div>
</section>

<style lang="postcss">
    section {
        width: 100%;
        height: 100%;
        display: grid;
        place-content: center;
        gap: var(--space-away);
    }

    [data-with-arrowcontrols] {
        display: grid;
        gap: var(--space-near);
    }
</style>
