import { Game } from './Game/Game';
import { Player } from './Player/Player';
import { PLAYER_COLORS } from './config/config';
import './style.css';

const addPlayerRow = (idx: number) => `
<fieldset class="player-row" name="player">
    <input type="color" name="player[${idx}][color]" value="${PLAYER_COLORS[idx]}">
    <div class="input-wrapper">
        <label for="player[${idx}][name]">Your name</label>
        <input id="player[${idx}][name]" type="text" required>
    </div>
    <div class="input-wrapper">
        <label for="player[${idx}][controls][left]">Left</label>
        <input name="player[${idx}][controls][left]" type="text" maxlength="1" required>
    </div>
    <div class="input-wrapper">
        <label for="player[${idx}][controls][right]">Right</label>
        <input name="player[${idx}][controls][right]" type="text" maxlength="1" required>
    </div>
</fieldset>
`;

let numberOfPlayers = 2;
const form = document.querySelector('form');

let players: Player[] = [
    // new Player({
    //     id: '#1',
    //     color: PLAYER_COLORS[0],
    //     startPosition: { x: 250, y: 250 },
    //     startCounter: 40,
    //     controls: { left: 'ArrowLeft', right: 'ArrowRight' },
    // }),
    // new Player({
    //     id: '#2',
    //     color: PLAYER_COLORS[1],
    //     startPosition: { x: 100, y: 300 },
    //     startCounter: 40,
    //     controls: { left: 'q', right: 'w' },
    // }),
];

form?.addEventListener('formdata', (e: FormDataEvent) => {
    const formData = e.formData;

    Array(numberOfPlayers).fill(0).forEach((_player, idx) => {
        players.push(new Player({
            id: formData.get(`player[${idx}][name]`) as string,
            color: formData.get(`player[${idx}][color]`) as string,
            startPosition: { x: Math.random() * 500, y: Math.random() * 500 },
            startCounter: 40,
            controls: {
                left: formData.get(`player[${idx}][controls][left]`) as string,
                right: formData.get(`player[${idx}][controls][right]`) as string,
            },
        }))
    });

    console.log(players);
});

const renderForm = () => {
    form!.innerHTML = `
        ${new Array(numberOfPlayers).fill(0).map((_item, idx) => addPlayerRow(idx)).join('\n')}
        <fieldset>
            <button type="button" id="add">Add +</button>
        </fieldset>
        <button type="submit">Start</button>
    `;
}

renderForm();

document.getElementById('#add')?.addEventListener('click', () => {
    console.log('clicked');
    numberOfPlayers += 1;
    renderForm();
});

const DEFAULT_CANVAS_SIZE = 500;
let ctx: CanvasRenderingContext2D | undefined;

const startGame = () => {
    const myGame = new Game(ctx!, players);
    myGame.loop();
};

window.addEventListener('load', function () {
    const canvas = document.querySelector('canvas');
    ctx = canvas?.getContext('2d') || undefined;
    if (!ctx) throw Error('Canvas context (ctx) is not defined');
    ctx.canvas.width = canvas?.offsetWidth ?? DEFAULT_CANVAS_SIZE;
    ctx.canvas.height = canvas?.offsetHeight ?? DEFAULT_CANVAS_SIZE;
});

const init = () => {};

init();
