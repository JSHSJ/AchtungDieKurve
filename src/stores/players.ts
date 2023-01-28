import type { Player } from '../modules/Player/Player';
import { initPlayer } from '../lib/players/initPlayer';
import { PLAYER_COLORS, PLAYER_CONTROLS } from '../config/config';
import { writable } from 'svelte/store';

export const players = writable<Player[]>([
    initPlayer(PLAYER_COLORS[0], PLAYER_CONTROLS[0]),
    initPlayer(PLAYER_COLORS[1], PLAYER_CONTROLS[1]),
]);

export const addPlayer = () => {
    players.update((currentPlayers) => {
        const newPlayer = initPlayer(
            PLAYER_COLORS[currentPlayers.length],
            PLAYER_CONTROLS[currentPlayers.length],
        );
        return [...currentPlayers, newPlayer];
    });
};
