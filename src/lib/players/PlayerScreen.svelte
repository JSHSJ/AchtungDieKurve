<script lang="ts">
    import { goBack, navigateTo } from '../../stores/router';
    import { addPlayer, players } from '../../stores/players';
    import { Routes } from '../routing/routes';
    import KeySelector from '../KeySelector/KeySelector.svelte';

    function handleSubmit() {
        navigateTo(Routes.GAME);
    }
</script>

<section class="screen">
    <button on:click="{goBack}" class="back">Back</button>

    <div class="menu">
        <div class="menu-header">
            <h2>Players</h2>
        </div>

        <form on:submit|preventDefault="{handleSubmit}" id="main" class="player-form stack">
            {#each $players as player, idx}
                <fieldset name="player">
                    <div class="input-wrapper">
                        <label for="player[{idx}][color]">Color</label>
                        <input
                            type="color"
                            name="player[{idx}][color]"
                            id="player[{idx}][color]"
                            bind:value="{player.color}"
                        />
                    </div>
                    <div class="input-wrapper name">
                        <label for="player[{idx}][name]">Your name</label>
                        <input
                            type="text"
                            required
                            name="player[{idx}][name]"
                            id="player[{idx}][name]"
                            bind:value="{player.name}"
                        />
                    </div>
                    <div class="controls">
                        <div class="input-wrapper">
                            <label for="player[{idx}][controls][left]">Left</label>
                            <KeySelector
                                name="player[{idx}][controls][left]"
                                bind:value="{player.controls.left}"
                                id="player[{idx}][controls][left]"
                            />
                        </div>
                        <div class="input-wrapper">
                            <label for="player[{idx}][controls][right]">Right</label>
                            <KeySelector
                                name="player[{idx}][controls][right]"
                                bind:value="{player.controls.right}"
                                id="player[{idx}][controls][right]"
                            />
                        </div>
                    </div>
                </fieldset>
            {/each}
            <button type="button" on:click="{addPlayer}"> Add Player </button>
            <button type="submit" class="start" form="main"> Start </button>
        </form>
    </div>
</section>
