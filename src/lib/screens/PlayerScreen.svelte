<script lang="ts">
    import { navigateTo } from '../../stores/router';
    import { addPlayer, players } from '../../stores/players';
    import { Routes } from '../routing/routes';
    import KeySelector from '../KeySelector/KeySelector.svelte';
    import MenuScreen from '../menuScreen/MenuScreen.svelte';

    function handleSubmit() {
        navigateTo(Routes.GAME);
    }
</script>

<MenuScreen title="Select players">
    <form on:submit|preventDefault="{handleSubmit}" id="main" class="player-form">
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
        <div class="stack menu-footer">
            <button type="button" on:click="{addPlayer}"> Add Player </button>
            <button type="submit" class="start" form="main"> Start </button>
        </div>
    </form>
</MenuScreen>
