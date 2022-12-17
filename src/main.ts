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


// });

import './app.css'
import App from './App.svelte'

const app = new App({
  target: document.getElementById('app'),
})

export default app
