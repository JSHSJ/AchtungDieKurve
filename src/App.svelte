<script lang="ts">
    import { PLAYER_COLORS, PLAYER_CONTROLS } from './config/config';
    import { onMount } from 'svelte';
    import { Game } from './modules/Game/Game';
    import { Player } from './modules/Player/Player';
    import { Canvas } from './modules/Canvas/Canvas';
    import Score from './lib/score/Score.svelte';
    import Logo from './lib/logo/Logo.svelte';
    import type { TGameEvent, TGameScore } from './modules/Game/Game.types';
    import { TGameEventTypes } from './modules/Game/Game.types';
    import ConfigScreen from './lib/config/ConfigScreen.svelte';
    import { closeMenu, isMenuDisabled, isMenuOpen } from './stores/gameMenu';
    import { isConfigMenuOpen, toggleMenu } from './stores/gameMenu.js';
    import KeySelector from './lib/KeySelector/KeySelector.svelte';

    let game: Game;
    let canvas: Canvas;

    $: isMenuOpen;

    const initPlayer: (initColor: Player['color'], initControls: Player['controls']) => Player = (
        initColor,
        initControls,
    ) => {
        const player = Player.createPlayerStub();
        if (initColor) player.color = initColor;
        if (initControls) player.controls = initControls;
        return player;
    };

    $: players = <Player[]>[
        initPlayer(PLAYER_COLORS[0], PLAYER_CONTROLS[0]),
        initPlayer(PLAYER_COLORS[1], PLAYER_CONTROLS[1]),
    ];
    $: totalScore = <number>(players.length - 1) * 10;

    $: scoreboard = <TGameScore>{
        [players[0].id]: 0,
        [players[1].id]: 0,
    };

    onMount(() => {
        const canvasElement = document.querySelector('canvas');
        if (!canvasElement) {
            throw new Error('Canvas element not found');
        }
        canvas = Canvas.init(canvasElement);
    });

    function addPlayerRow() {
        const newPlayer = initPlayer(
            PLAYER_COLORS[players.length],
            PLAYER_CONTROLS[players.length],
        );

        players = [...players, newPlayer];

        scoreboard[newPlayer.id] = 0;
    }

    function handleSubmit() {
        if (game) {
            game.reset();
            game.prepareNewRound();
            return;
        }

        players.forEach((player: Player) => {
            player.init();
        });

        game = new Game(canvas, players, totalScore);
        game.subscribe((e: TGameEvent) => {
            if (e.type === TGameEventTypes.SCORE_UPDATED) {
                scoreboard = e.score;
            }
            if (e.type === TGameEventTypes.GAME_STARTED) {
                closeMenu();
            }
        });
        game.prepareNewRound();
    }
</script>

<svelte:head />

<main>
    <section>
        <canvas></canvas>
    </section>
    <aside class:isOpen="{$isMenuOpen}">
        <header>
            <Logo />
            <div class="total-score">
                {totalScore}
            </div>
        </header>
        <form on:submit|preventDefault="{handleSubmit}" id="main" class="player-form">
            {#each players as player, idx}
                <div class="player-row">
                    <fieldset name="player" disabled="{$isMenuDisabled || undefined}">
                        <input
                            type="color"
                            name="player[{idx}][color]"
                            bind:value="{player.color}"
                        />
                        <div class="input-wrapper">
                            <label for="player[{idx}][name]">Your name</label>
                            <input
                                type="text"
                                required
                                name="player[{idx}][name]"
                                id="player[{idx}][name]"
                                bind:value="{player.name}"
                            />
                        </div>
                        <div class="input-wrapper">
                            <label for="player[{idx}][controls][left]">Left</label>
                            <KeySelector
                                name="player[{idx}][controls][left]"
                                bind:value="{player.controls.left}"
                                id="player[{idx}][controls][left]"
                            />
                        </div>
                        <div class="input-wrapper">
                            <label for="player[{idx}][controls][right]">Right</label>
                            <KeySelector
                                name="player[{idx}][controls][right]"
                                bind:value="{player.controls.right}"
                                id="player[{idx}][controls][right]"
                            />
                        </div>
                    </fieldset>
                    <div class="score">
                        <Score
                            score="{scoreboard[player.id] ?? 0}"
                            totalScore="{totalScore}"
                            color="{player.color}"
                        />
                        <span>{player.name ?? 'unnamed'}</span>
                    </div>
                </div>
            {/each}
        </form>
        <ConfigScreen bind:isConfigOpen="{$isConfigMenuOpen}" />

        <div class="action-bar">
            <div class="action-main">
                <button type="button" class="add" on:click="{addPlayerRow}"> Add Player</button>
                <button type="submit" class="start" form="main">Start</button>
                <button
                    type="button"
                    class="toggle"
                    on:click="{() => isConfigMenuOpen.update((v) => !v)}"
                    tabindex="0"
                >
                    Config
                </button>
            </div>
            <button type="button" class="toggle" on:click="{toggleMenu}" tabindex="0">
                Toggle
            </button>
        </div>
    </aside>
</main>
