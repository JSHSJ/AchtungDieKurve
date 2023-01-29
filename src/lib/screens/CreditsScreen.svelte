<script lang="ts">
    import MenuScreen from '../menuScreen/MenuScreen.svelte';
</script>

<MenuScreen title="Credits">
    <div class="stack">
        <p>
            This game is, of course, based on the <a
                href="https://en.wikipedia.org/wiki/Achtung,_die_Kurve!"
                target="_blank">age old classic</a
            >. We just gave it a more modern look and feel.
        </p>
        <div class="part">
            <p>Lukas Köller</p>
            <a href="https://github.com/lukaskoeller" target="_blank"
                >https://github.com/lukaskoeller</a
            >
        </div>
        <div class="part">
            <p>Joshua Stübner</p>
            <a href="https://github.com/JSHSJ" target="_blank">https://github.com/JSHSJ</a>
        </div>

        <div class="part">
            <small>
                You can find the
                <a href="https://github.com/JSHSJ/AchtungDieKurve" target="_blank">source code</a>
                on github, too.
            </small>
        </div>
    </div>
</MenuScreen>

<style lang="postcss">
    .part {
        font-size: var(--font-size-1);
        border-top: var(--border-size-1) solid var(--surface-2);
        padding-block: var(--space-near);
    }
</style>
