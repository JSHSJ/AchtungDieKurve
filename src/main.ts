import { Game } from './Game/Game';
import { Player } from './Player/Player';
import { PLAYER_COLORS } from './config/config';
import './style.css';

document.querySelector('form')!.innerHTML = `
  <h2>Start Game</h2>
`;

const DEFAULT_CANVAS_SIZE = 500;

window.addEventListener('load', function () {
    const canvas = document.querySelector('canvas');
    const ctx = canvas?.getContext('2d');
    if (!ctx) throw Error('Canvas context (ctx) is not defined');
    ctx.canvas.width = canvas?.offsetWidth ?? DEFAULT_CANVAS_SIZE;
    ctx.canvas.height = canvas?.offsetHeight ?? DEFAULT_CANVAS_SIZE;

    const players = [
        new Player({
            id: '#1',
            color: PLAYER_COLORS[0],
            startPosition: { x: 250, y: 250 },
            startCounter: 40,
            controls: { left: 'ArrowLeft', right: 'ArrowRight' },
        }),
        new Player({
            id: '#2',
            color: PLAYER_COLORS[1],
            startPosition: { x: 100, y: 300 },
            startCounter: 40,
            controls: { left: 'q', right: 'w' },
        }),
    ];
    const myGame = new Game(ctx, players);
    myGame.loop();
});
