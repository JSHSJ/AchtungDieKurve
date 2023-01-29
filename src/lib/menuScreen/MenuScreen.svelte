<script lang="ts">
    import { goBack } from '../../stores/router';

    export let title;
</script>

<section class="screen">
    <button on:click="{goBack}" class="back">Back</button>

    <div class="menu">
        <div class="menu-header">
            <h2>{title}</h2>
        </div>
        <slot />
    </div>
</section>
