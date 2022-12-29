<script lang="ts">
    import {PLAYER_COLORS, PLAYER_CONTROLS} from './config/config';
    import {onMount} from 'svelte';
    import {Game} from './modules/Game/Game';
    import {Player} from './modules/Player/Player';
    import {Canvas} from './modules/Canvas/Canvas';
    import Score from "./lib/score/Score.svelte";
    import Logo from "./lib/logo/Logo.svelte";
    import type {TGameEvent, TGameScore} from "./modules/Game/Game.types";
    import {TGameEventTypes} from "./modules/Game/Game.types";

    let isOpen = true;
    let disabled = false;

    let game: Game;
    let canvas: Canvas;

    const initPlayer: (
        initColor: Player['color'],
        initControls: Player['controls'],
    ) => Player = (initColor, initControls) => {
        const player = Player.createPlayerStub()
        if (initColor) player.color = initColor;
        if (initControls) player.controls = initControls;
        return player
    }

    $: players = <Player[]>[
        initPlayer(PLAYER_COLORS[0], PLAYER_CONTROLS[0]),
        initPlayer(PLAYER_COLORS[1], PLAYER_CONTROLS[1]),
    ];
    $: totalScore = <number>(players.length -1) * 10;

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

        players = [
            ...players,
            newPlayer
        ];

        scoreboard[newPlayer.id] = 0;
    }

    function handleSubmit() {
        isOpen = false;
        disabled = true;

        if (game) {
            game.reset();
            game.start();
            return;
        }

        players.forEach((player: Player) => {
            player.init();
        })


        game = new Game(canvas, players, totalScore);
        game.subscribe((e: TGameEvent) => {
            if (e.type === TGameEventTypes.SCORE_UPDATED) {
                scoreboard = e.score;
            }
        })
        game.start();
    }
</script>

<svelte:head>

</svelte:head>

<main>
    <section>
        <canvas />
    </section>
    <aside class:isOpen>
        <header>
            <Logo />
            <div class="total-score">
                {totalScore}
            </div>
        </header>
        <form on:submit|preventDefault={handleSubmit} id="main">
            {#each players as player, idx}
                <div class="player-row">
                    <fieldset name="player" {disabled}>
                        <input type="color" name="player[{idx}][color]" bind:value={player.color} />
                        <div class="input-wrapper">
                            <label for="player[{idx}][name]">Your name</label>
                            <input
                                type="text"
                                required
                                name="player[{idx}][name]"
                                id="player[{idx}][name]"
                                bind:value={player.name}
                            />
                        </div>
                        <div class="input-wrapper">
                            <label for="player[{idx}][controls][left]">Left</label>
                            <input
                                type="text"
                                name="player[{idx}][controls][left]"
                                id="player[{idx}][controls][left]"
                                maxlength="1"
                                required
                                bind:value={player.controls.left}
                            />
                        </div>
                        <div class="input-wrapper">
                            <label for="player[{idx}][controls][right]">Right</label>
                            <input
                                name="player[{idx}][controls][right]"
                                id="player[{idx}][controls][right]"
                                type="text"
                                maxlength="1"
                                required
                                bind:value={player.controls.right}
                            />
                        </div>
                    </fieldset>
                    <div class="score">
                        <Score score={scoreboard[player.id] ?? 0} {totalScore} color={player.color} />
                        <span>{player.name ?? 'unnamed'}</span>
                    </div>
                </div>
            {/each}
        </form>
        <div class="action-bar">
            <div class="action-main">
                <button type="button" class="add" on:click={addPlayerRow}> Add Player</button>
                <button type="submit" class="start" form="main">Start</button>
            </div>
            <button
                type="button"
                class="toggle"
                on:click={() => (isOpen = !isOpen)}
                tabindex="0"
            >
                Toggle
            </button>
        </div>
    </aside>
</main>
