<script lang="ts">
    import MenuScreen from '../menuScreen/MenuScreen.svelte';
</script>

<MenuScreen title="How to play">
    <div class="stack">
        <article>
            <h3>Basics</h3>
            <p>
                Each player controls a snake-like thing using their assigned controls. You can only
                go left or right.
            </p>
            <p>The aim of the game is to survive longer than your opponents.</p>
        </article>
        <article>
            <h3>Points</h3>
            <p>
                Points are awarded based on the rank, so if you survive the longest, you get the
                most points.
            </p>
            <p>
                By our default, we also award a point, if an opponent runs into you, so you're
                encouraged to play a bit more risky. You can disable that setting in the options.
            </p>
        </article>
        <article>
            <h3>Controls</h3>
            <p>We tried to make the game as much controllable through the keyboard as possible.</p>
            <p>Besides your assigned player controls, here are a few more control points.</p>
            <p>
                <strong>Space</strong> - Usually triggers then next round or selects and options
            </p>
            <p>
                <strong>Arrow controls</strong> - Navigate the options
            </p>
        </article>
    </div>
</MenuScreen>

<style lang="postcss">
    .stack {
        gap: var(--space-away);
    }
    article {
        display: grid;
        gap: var(--space-near);
    }
    article h3 {
        font-size: var(--font-size-2);
    }
</style>
