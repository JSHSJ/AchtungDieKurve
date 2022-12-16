export class Game {
    public width: number;
    public height: number;
    public ctx: CanvasRenderingContext2D | null;

    constructor() {
        const canvas = document?.querySelector('canvas');
        if (!canvas) throw Error(
            'Cannot find `<canvas>` element. Make sure to add it to `index.html`.'
        );
        this.ctx = canvas.getContext("2d");
        if (this.ctx === null) throw Error('Canvas context (`ctx`) is not defined.');

        this.width = canvas.offsetWidth ?? 500;
        this.height = canvas.offsetHeight ?? 500;
        console.log(this.width, this.height);
    }

    animate() {
        this?.ctx?.clearRect(0, 0, this.width, this.height);
        // loop here
        requestAnimationFrame(this.animate);
    }

    public checkCollisions() {

    }
}
