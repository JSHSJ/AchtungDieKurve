<script lang="ts">
    import { PLAYER_COLORS } from './config/config';
    import { onMount } from 'svelte';
    import { Game } from './modules/Game/Game';
    import { Player } from './modules/Player/Player';
    import { Canvas } from './modules/Canvas/Canvas';
    import Score from './lib/score/Score.svelte';
    import type { TControls } from './types/TControls';

    let isOpen = true;

    type PlayerData = {
        id: string;
        name: string;
        controls: TControls;
        color: string;
    };

    let game: Game;
    let players: Player[] = [];
    let canvas: Canvas;
    let totalScore: number = 120;

    const initPlayer: (initColor: PlayerData['color']) => PlayerData = (initColor) => ({
        id: '',
        name: '',
        controls: { left: '', right: '' },
        color: initColor,
    });

    $: playersData = <PlayerData[]>[
        structuredClone(initPlayer(PLAYER_COLORS[0])),
        structuredClone(initPlayer(PLAYER_COLORS[1])),
    ];

    onMount(() => {
        const canvasElement = document.querySelector('canvas');
        canvas = Canvas.init(canvasElement);
    });

    let numberOfPlayers = 2;

    function addPlayerRow() {
        numberOfPlayers += 1;
        playersData = [
            ...playersData,
            structuredClone(initPlayer(PLAYER_COLORS[playersData.length])),
        ];
    }

    function handleSubmit(e: SubmitEvent) {
        const formElem = e.target as HTMLFormElement;
        const formData = new FormData(formElem);

        if (game) {
            game.reset();
            game.start();
            return;
        }

        Array(numberOfPlayers)
            .fill(0)
            .forEach((_player, idx) => {
                const p = new Player({
                    id: formData.get(`player[${idx}][name]`) as string,
                    color: formData.get(`player[${idx}][color]`) as string,
                    controls: {
                        left: formData.get(`player[${idx}][controls][left]`) as string,
                        right: formData.get(`player[${idx}][controls][right]`) as string,
                    },
                });
                players.push(p);
            });

        game = new Game(canvas, players);
        game.start();
    }
</script>

<main>
    <section>
        <canvas />
    </section>
    <aside class:isOpen>
        <header>
            <h1>Achtung die Kurve</h1>
            <div class="total-score">
                {totalScore}
            </div>
        </header>
        <form on:submit|preventDefault={handleSubmit} name="main">
            {#each playersData as player, idx}
                <div class="player-row">
                    <fieldset name="player">
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
                        <Score score={0} {totalScore} color={PLAYER_COLORS[idx]} />
                        <span>{player.name}</span>
                    </div>
                </div>
            {/each}
        </form>
        <div class="action-bar">
            <div class="action-main">
                <button type="button" class="add" on:click={addPlayerRow}> Add Player</button>
                <button class="start" form="main" type="submit">Start</button>
            </div>
            <button
                on:click={() => (isOpen = !isOpen)}
                class="toggle"
                type="button"
                tabindex="0">Toggle</button
            >
        </div>
    </aside>
</main>
