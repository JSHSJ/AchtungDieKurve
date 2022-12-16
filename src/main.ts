import { Game } from './Game/Game';
import './style.css'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <main>
    <header>
      <h1>Achtung die Kurve</h1>
    </header>
    <canvas></canvas>
    <menu>
      <button type="button">Starten</button>
    </menu>
  </main>
`;

const DEFAULT_CANVAS_SIZE = 500;

window.addEventListener('load', function() {
  const canvas = document.querySelector('canvas');
  const ctx = canvas?.getContext("2d");
  if (!ctx) throw Error('Canvas context (ctx) is not defined');
  ctx.canvas.width = canvas?.offsetWidth ?? DEFAULT_CANVAS_SIZE;
  ctx.canvas.height = canvas?.offsetHeight ?? DEFAULT_CANVAS_SIZE;

  const myGame = new Game(ctx);
});

