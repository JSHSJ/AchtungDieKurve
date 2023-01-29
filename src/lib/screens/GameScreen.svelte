<script lang="ts">
    import { Game } from '../../modules/Game/Game';
    import { Canvas } from '../../modules/Canvas/Canvas';
    import type { TGameEvent, TGameScore } from '../../modules/Game/Game.types';
    import { TGameEventTypes } from '../../modules/Game/Game.types';
    import { onMount } from 'svelte';
    import { players } from '../../stores/players';
    import Score from '../score/Score.svelte';
    import { createNewGame, gameState } from '../../stores/gameState';

    $: totalScore = <number>($players.length - 1) * 10;
    $: scoreboard = initScoreBoard();

    onMount(() => {
        const canvasElement = document.querySelector('canvas');
        if (!canvasElement) {
            throw new Error('Canvas element not found');
        }
        const canvas = Canvas.init(canvasElement);
        initGame(canvas);
    });

    const initScoreBoard = () => {
        const scoreBoard = <TGameScore>{};
        $players.forEach((player) => {
            scoreBoard[player.id] = 0;
        });
        return scoreBoard;
    };

    const initGame = (canvas: Canvas) => {
        createNewGame($players, canvas, totalScore);

        if ($gameState instanceof Game) {
            $gameState.subscribe((e: TGameEvent) => {
                if (e.type === TGameEventTypes.SCORE_UPDATED) {
                    scoreboard = e.score;
                }
            });
        }
    };
</script>

<section class="screen game-screen">
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
        </ul>
    </output>
</section>
