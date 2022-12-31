<script lang="ts">
    import { ColorTheme, colorThemeStore } from '../../stores/colorTheme';

    export let tabIndex: number;
</script>

<div class="input-wrapper">
    <label for="color-theme">
        <span>Color Scheme</span>
        <span class="input-description">Switch between light, dark and adaptive</span>
    </label>
    <select
        bind:value="{$colorThemeStore}"
        id="color-theme"
        name="color-theme"
        tabindex="{tabIndex}"
    >
        {#each Object.values(ColorTheme) as theme}
            <option value="{theme}">{theme}</option>
        {/each}
    </select>
</div>
<div class="canvas-color-helper"></div>
