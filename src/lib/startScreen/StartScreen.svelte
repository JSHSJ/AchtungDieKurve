<script>
    import Logo from '../logo/Logo.svelte';
    import { withArrowControls } from '@jshsj/with-arrow-controls';
    import { onMount } from 'svelte';
    import { Routes } from '../routing/routes';
    import { navigateTo } from '../../stores/router';

    onMount(() => {
        withArrowControls();
    });
</script>

<section>
    <div>
        <Logo />
    </div>
    <div data-with-arrowcontrols>
        <button on:click="{() => navigateTo(Routes.PLAYERS)}">Start Game</button>
        <button on:click="{() => navigateTo(Routes.OPTIONS)}">Options</button>
        <button>How to Play</button>
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
