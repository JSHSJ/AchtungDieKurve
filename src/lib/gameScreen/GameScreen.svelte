<script lang="ts">
    import { Game } from '../../modules/Game/Game';
    import { Canvas } from '../../modules/Canvas/Canvas';
    import type { TGameEvent, TGameScore } from '../../modules/Game/Game.types';
    import { TGameEventTypes } from '../../modules/Game/Game.types';
    import { isMenuOpen } from '../../stores/gameMenu';
    import { onMount } from 'svelte';
    import { toggleMenu } from '../../stores/gameMenu.js';
    import { players } from '../../stores/players';
    import Score from '../score/Score.svelte';
    import { Player } from '../../modules/Player/Player';

    let game: Game;
    let canvas: Canvas;

    $: isMenuOpen;

    $: totalScore = <number>($players.length - 1) * 10;

    $: scoreboard = initScoreBoard();

    onMount(() => {
        const canvasElement = document.querySelector('canvas');
        if (!canvasElement) {
            throw new Error('Canvas element not found');
        }
        canvas = Canvas.init(canvasElement);
        initGame();
    });

    const initScoreBoard = () => {
        const scoreBoard = <TGameScore>{};
        $players.forEach((player) => {
            scoreBoard[player.id] = 0;
        });
        return scoreBoard;
    };

    const initGame = () => {
        if (game) {
            game.reset();
            game.prepareNewRound();
            return;
        }

        $players.forEach((player: Player) => {
            player.init();
        });

        game = new Game(canvas, $players, totalScore);
        game.subscribe((e: TGameEvent) => {
            if (e.type === TGameEventTypes.SCORE_UPDATED) {
                scoreboard = e.score;
            }
        });
        game.prepareNewRound();
    };
</script>

<section class="board">
    <canvas></canvas>
</section>
<output>
    <ul class="score-board">
        <li class="score">
            <Score score="{totalScore}" totalScore="{totalScore}" color="rba(0,0,0,0)" />
            <span>Total</span>
        </li>
        {#each $players as player}
            <li class="score">
                <Score
                    score="{scoreboard[player.id] ?? 0}"
                    totalScore="{totalScore}"
                    color="{player.color}"
                />
                <span>{player.name ?? 'unnamed'}</span>
            </li>
        {/each}
        <li>
            <button type="button" class="toggle" on:click="{toggleMenu}"> Menu </button>
        </li>
    </ul>
</output>
