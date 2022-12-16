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
`

const canvas = document.querySelector('canvas');
console.log(canvas);

