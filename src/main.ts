import { Game } from './Game/Game';
import { Player } from './Player/Player';
import { PLAYER_COLORS } from './config/config';
import './style.css';

const form = document.querySelector('form');

let numberOfPlayers = 2;
let players: Player[] = [];
let ctx: CanvasRenderingContext2D | undefined;

const DEFAULT_CANVAS_SIZE = 500;

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

form?.addEventListener('submit', (e) => {
    e.preventDefault();
    new FormData(form);
});

let game: Game;

form?.addEventListener('formdata', (e: FormDataEvent) => {
    e.preventDefault();
    if (game) {
        startGame();
        return;
    }
    const formData = e.formData;

    Array(numberOfPlayers)
        .fill(0)
        .forEach((_player, idx) => {
            players.push(
                new Player({
                    id: formData.get(`player[${idx}][name]`) as string,
                    color: formData.get(`player[${idx}][color]`) as string,
                    startPosition: () => ({
                        x: Math.random() * (ctx!.canvas.width - 30) - 15,
                        y: Math.random() * (ctx!.canvas.height - 30) - 15,
                    }),
                    controls: {
                        left: formData.get(`player[${idx}][controls][left]`) as string,
                        right: formData.get(`player[${idx}][controls][right]`) as string,
                    },
                }),
            );
        });

    startGame();
});

const renderForm = () => {
    form!.innerHTML = `
        ${new Array(numberOfPlayers).fill(0).map((_item, idx) => addPlayerRow(idx)).join('\n')}
        <button type="button" id="add">Add +</button>
        <button type="submit">Start</button>
    `;

    document.getElementById('add')?.addEventListener('click', () => {
        console.log('clicked');
        numberOfPlayers += 1;
        renderForm();
    });
}

renderForm();

const startGame = () => {
    if (!game) {
        game = new Game(ctx!, players);
    } else {
        game.reset();
    }
    game.loop();
};

window.addEventListener('load', function () {
    const canvas = document.querySelector('canvas');
    ctx = canvas?.getContext('2d') || undefined;
    if (!ctx) throw Error('Canvas context (ctx) is not defined');
    ctx.canvas.width = canvas?.offsetWidth ?? DEFAULT_CANVAS_SIZE;
    ctx.canvas.height = canvas?.offsetHeight ?? DEFAULT_CANVAS_SIZE;
    // init();
});

// const init = () => {
//     startGame();
// };
