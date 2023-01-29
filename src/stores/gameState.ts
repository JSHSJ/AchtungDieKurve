import { Game } from '../modules/Game/Game';
import { writable } from 'svelte/store';
import type { Player } from '../modules/Player/Player';
import type { Canvas } from '../modules/Canvas/Canvas';

export const gameState = writable<Game | undefined>(undefined);

export const createNewGame = (players: Player[], canvas: Canvas, targetScore: number) => {
    gameState.update((currentGameState) => {
        if (currentGameState) {
            return currentGameState;
        }

        players.forEach((player: Player) => {
            player.init();
        });

        const newGame = new Game(canvas, players, targetScore);
        newGame.prepareNewRound();
        return newGame;
    });
};
