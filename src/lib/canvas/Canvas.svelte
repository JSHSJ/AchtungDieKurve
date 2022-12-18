<script lang="ts">
    import { onMount } from "svelte";
    import { Game } from "../../modules/Game/Game";
    import type { Player } from "../../modules/Player/Player";

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
</script>

<canvas></canvas>
