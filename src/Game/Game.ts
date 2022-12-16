import { Player } from "../Player/Player";

export class Game {
  public ctx: CanvasRenderingContext2D;
  public width: number;
  public height: number;

  private players: Player[];

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.width = ctx.canvas.width;
    this.height = ctx.canvas.height;
    this.players = [];
  }

  animate() {
    // loop here

    this.players.forEach((player) => {
      player.move();
    });

    this.checkCollisions();
    this.draw();
    requestAnimationFrame(this.animate);
  }

  public checkCollisions() {}
}
