<script lang="ts">
    import { PLAYER_COLORS } from "./config/config";
    import logoSvg from './assets/logo.svg';
    import { onMount } from "svelte";
    import { Game } from "./Game/Game";
    import type { Player } from "./Player/Player";

    const DEFAULT_CANVAS_SIZE = 500;

    let game: Game;
    let players: Player[] = [];
    let ctx: CanvasRenderingContext2D | undefined;

    const startGame = () => {
        if (!game) {
            game = new Game(ctx!, players);
        } else {
            game.reset();
        }
        game.loop();
    };

    onMount(() => {
        const canvas = document.querySelector('canvas');
        ctx = canvas?.getContext('2d') || undefined;
        if (!ctx) throw Error('Canvas context (ctx) is not defined');
        ctx.canvas.width = canvas?.offsetWidth ?? DEFAULT_CANVAS_SIZE;
        ctx.canvas.height = canvas?.offsetHeight ?? DEFAULT_CANVAS_SIZE;
    })

    let numberOfPlayers = 2;

    function addPlayerRow() {
        numberOfPlayers += 1;
    }
</script>

<main>
  <div class="canvas-wrapper">
      <canvas></canvas>
  </div>
  <aside>
      <img class="logo" src={logoSvg} alt="Achtung die Kurve">
      <form>
          <div class="form-rows">
            {#each Array(numberOfPlayers).fill(0) as player, idx}
              <fieldset class="player-row" name="player">
                  <input type="color" name="player[${idx}][color]" value="${PLAYER_COLORS[idx]}">
                  <div class="input-wrapper">
                      <label for="player[${idx}][name]">Your name</label>
                      <input id="player[${idx}][name]" type="text" required>
                  </div>
                  <div class="input-wrapper">
                      <label for="player[${idx}][controls][left]">Left</label>
                      <input name="player[${idx}][controls][left]" type="text" maxlength="1" required>
                  </div>
                  <div class="input-wrapper">
                      <label for="player[${idx}][controls][right]">Right</label>
                      <input name="player[${idx}][controls][right]" type="text" maxlength="1" required>
                  </div>
              </fieldset>
            {/each}
            <button
              type="button"
              class="add"
              on:click={addPlayerRow}
            >
              Add +
            </button>
          </div>
          <button type="submit">Start</button>
      </form>
  </aside>
</main>