<script lang="ts">
    import { PLAYER_COLORS } from "./config/config";
    import logoSvg from './assets/logo.svg';
    import { onMount } from "svelte";
    import { Game } from "./Game/Game";
    import { Player } from "./Player/Player";
    import {calculateStartPosAndDirection} from "./util/calculateStartPosAndDirection";

    const DEFAULT_CANVAS_SIZE = 500;

    let game: Game;
    let players: Player[] = [];
    let ctx: CanvasRenderingContext2D | undefined;

    const startGame = () => {
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

    function handleSubmit(e: SubmitEvent) {
        const formElem = e.target as HTMLFormElement;
        const formData = new FormData(formElem);

        console.log(formData.get(`player[0][color]`));
        if (game) {
            game.reset();
            startGame()
            return
        }

        Array(numberOfPlayers)
        .fill(0)
        .forEach((_player, idx) => {
            const startParams = calculateStartPosAndDirection(ctx!.canvas.width, ctx!.canvas.height);
            const p = new Player({
                    id: formData.get(`player[${idx}][name]`) as string,
                    color: formData.get(`player[${idx}][color]`) as string,
                    controls: {
                        left: formData.get(`player[${idx}][controls][left]`) as string,
                        right: formData.get(`player[${idx}][controls][right]`) as string,
                    },
                })

            p.setStartPosition({
                x: startParams.startX,
                y: startParams.startY,
            }, startParams.direction)
            players.push(
                p
            );
        });

        game = new Game(ctx!, players);
        startGame();
    }
</script>

<main>
  <div class="canvas-wrapper">
      <canvas></canvas>
  </div>
  <aside>
      <img class="logo" src={logoSvg} alt="Achtung die Kurve">
      <form on:submit|preventDefault={handleSubmit}>
          <div class="form-rows">
            {#each Array(numberOfPlayers).fill(0) as _player, idx}
              <fieldset class="player-row" name="player">
                    <input
                        type="color"
                        name="player[{idx}][color]"
                        bind:value={PLAYER_COLORS[idx]}
                    >
                    <div class="input-wrapper">
                        <label for="player[{idx}][name]">Your name</label>
                        <input
                            type="text" required
                            name="player[{idx}][name]"
                            id="player[{idx}][name]"
                        >
                    </div>
                    <div class="input-wrapper">
                        <label for="player[{idx}][controls][left]">Left</label>
                        <input
                            type="text"
                            name="player[{idx}][controls][left]"
                            id="player[{idx}][controls][left]"
                            maxlength="1"
                            required
                        >
                    </div>
                    <div class="input-wrapper">
                        <label for="player[{idx}][controls][right]">Right</label>
                        <input
                            name="player[{idx}][controls][right]"
                            id="player[{idx}][controls][right]"
                            type="text"
                            maxlength="1"
                            required
                        >
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
