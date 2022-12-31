<script lang="ts">
    import ColorThemeSwitch from "../colorTheme/ColorThemeSwitch.svelte";
    import {configStore} from "../../stores/config.js";

    export let isConfigOpen = false;

    $: tabindex = isConfigOpen ? 0 : -1;


</script>
    <form class="config-content config-form" class:isOpen={isConfigOpen} tabIndex={tabindex}>
        <ColorThemeSwitch tabIndex={tabindex} />

        <div class="input-wrapper">
            <label for="options-speed">
                <span>Speed</span>
                <span class="input-description">Speed at which the player moves</span>
            </label>
            <input
                type="number"
                name="options-speed"
                id="options-speed"
                required
                bind:value={$configStore.speed}
                tabindex={tabindex}
            />
        </div>

        <div class="input-wrapper">
            <label for="options-turning-radius">
                <span>Turning Radius</span>
                <span class="input-description">Speed at which the player turns</span></label>
            <input
                type="number"
                name="options-turning-radius"
                id="options-turning-radius"
                required
                step="0.001"
                bind:value={$configStore.turningRadius}
                tabindex={tabindex}
            />
        </div>
        <div class="input-wrapper">
            <label for="options-player-width">
                <span>Player width</span>
                <span class="input-description">Thickness of drawn lines</span></label>
            <input
                type="number"
                name="options-player-width"
                id="options-player-width"
                required
                bind:value={$configStore.playerWidth}
                tabindex={tabindex}
            />
        </div>
        <div class="input-wrapper">
            <label for="options-line-length">
                <span>Line Length</span>
                <span class="input-description">Length of drawn line, before a gap occurs</span></label>
            <input
                type="number"
                name="options-line-length"
                id="options-line-length"
                required
                bind:value={$configStore.playerLineLength}
                tabindex={tabindex}
            />
        </div>
        <div class="input-wrapper">
            <label for="options-gap-length">
                <span>Gap Length</span>
                <span class="input-description">Length of gap</span></label>
            <input
                type="number"
                name="options-gap-length"
                id="options-gap-length"
                required
                bind:value={$configStore.playerGapLength}
                tabindex={tabindex}
            />
        </div>
        <div class="input-wrapper">
            <label for="options-credit-killer">
                <span>Credit Player kills</span>
                <span class="input-description">Add a point to the killer, when a player runs into another players line</span></label>
            <input
                type="checkbox"
                name="options-credit-killer"
                id="options-credit-killer"
                required
                bind:checked={$configStore.scoreCreditKiller}
                tabindex={tabindex}
            />
        </div>
        <div class="input-wrapper">
            <label for="options-use-ranking">
                <span>Score based on ranking</span>
                <span class="input-description">Add points based on ranking. First player gets most points, last gets one.</span></label>
            <input
                type="checkbox"
                name="options-use-ranking"
                id="options-use-ranking"
                required
                bind:checked={$configStore.scoreUseRanking}
                tabindex={tabindex}
            />
        </div>
    </form>
<!--</aside>-->
