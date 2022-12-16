export class Game {
    public ctx: CanvasRenderingContext2D;
    public width: number;
    public height: number;

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
        this.width = ctx.canvas.width;
        this.height = ctx.canvas.height;
    }

    animate() {
        // loop here
        requestAnimationFrame(this.animate);
    }

    public checkCollisions() {

    }
}
