// import { Game } from './Game/Game';
// import { Player } from './Player/Player';
// import { PLAYER_COLORS } from './config/config';
// import './style.css';

// const form = document.querySelector('form');
// const formRows = document.querySelector('.form-rows');



// form?.addEventListener('submit', (e) => {
//     e.preventDefault();
//     new FormData(form);
// });

// let game: Game;

// form?.addEventListener('formdata', (e: FormDataEvent) => {
//     e.preventDefault();
//     if (game) {
//         startGame();
//         return;
//     }
//     const formData = e.formData;

//     Array(numberOfPlayers)
//         .fill(0)
//         .forEach((_player, idx) => {
//             players.push(
//                 new Player({
//                     id: formData.get(`player[${idx}][name]`) as string,
//                     color: formData.get(`player[${idx}][color]`) as string,
//                     startPosition: () => ({
//                         x: Math.random() * (ctx!.canvas.width - 100) + 50,
//                         y: Math.random() * (ctx!.canvas.height - 100) + 50,
//                     }),
//                     controls: {
//                         left: formData.get(`player[${idx}][controls][left]`) as string,
//                         right: formData.get(`player[${idx}][controls][right]`) as string,
//                     },
//                 }),
//             );
//         });

//     startGame();
// });

import './app.css'
import App from './App.svelte'

const app = new App({
  target: document.getElementById('app'),
})

export default app
