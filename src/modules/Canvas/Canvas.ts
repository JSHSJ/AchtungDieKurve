import { DEFAULT_CANVAS_SIZE } from '../../config/config';
import type { Player } from '../Player/Player';
import type { TPosition } from '../../types/TPosition';
import type { Collision } from './Canvas.types';
import { CollisionType } from './Canvas.types';
import type { TDirection } from '../../types/TDirection';
import { config } from '../Config/Config';

export class Canvas {
    public width: number;
    public height: number;
    private ctx: CanvasRenderingContext2D;

    constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
    }

    public static init(canvas: HTMLCanvasElement): Canvas {
        const ctx = canvas?.getContext('2d') || undefined;
        if (!ctx) throw Error('Canvas context (ctx) is not defined');
        ctx.canvas.width = canvas?.offsetWidth ?? DEFAULT_CANVAS_SIZE;
        ctx.canvas.height = canvas?.offsetHeight ?? DEFAULT_CANVAS_SIZE;

        return new Canvas(ctx, canvas.offsetWidth, canvas.offsetHeight);
    }

    public drawPlayerHead = (player: Player) => {
        if (!player.isAlive) return;

        this.ctx.beginPath();
        this.ctx.fillStyle = player.color;
        this.ctx.arc(
            player.currentPosition.x,
            player.currentPosition.y,
            config.playerWidth,
            0,
            Math.PI * 2,
            false,
        );
        this.ctx.fill();
        this.ctx.closePath();
    };

    public drawPlayerPath = (player: Player) => {
        this.ctx.moveTo(player.startPos.x, player.startPos.y);
        this.ctx.beginPath();
        this.ctx.setLineDash([config.playerLineLength, config.playerGapLength]);
        this.ctx.strokeStyle = player.color;
        this.ctx.lineWidth = 2 * config.playerWidth;
        this.ctx.lineCap = 'round';
        this.ctx.stroke(player.path);
        this.ctx.closePath();
    };

    public doesPointCollideWithPath = (
        path: Path2D,
        point: TPosition,
        lineWidth = config.playerWidth * 2,
    ) => {
        this.ctx.lineWidth = lineWidth;
        return this.ctx.isPointInStroke(path, point.x, point.y);
    };

    public clear = () => {
        this.ctx.clearRect(0, 0, this.width, this.height);
    };

    public drawPreRound(players: Player[]) {
        this.clear();
        const midX = this.width / 2;
        const midY = this.height / 2 - 140;
        // @TODO: Find a way to set this to a better color
        this.ctx.textAlign = 'center';
        this.ctx.fillStyle = 'red';
        this.ctx.font = '30px Arial';
        this.ctx.fillText('Ready?', midX, midY + 120);

        this.ctx.font = '20px Arial';
        this.ctx.fillText('- Press space to start the next round - ', midX, midY + 200);
        this.drawPlayerArrows(players);
    }

    public drawCountdown(countdown: number, players: Player[]) {
        this.clear();
        const midX = this.width / 2;
        const midY = this.height / 2 - 120;
        this.ctx.textAlign = 'center';

        this.ctx.fillStyle = 'red';
        this.ctx.font = '30px Arial';
        this.ctx.fillText('ROUND STARTS IN', midX, midY + 120);
        this.ctx.fillText(countdown.toString(), midX, midY + 160);
        this.drawPlayerArrows(players);
    }

    public drawRoundOver(winner?: Player) {
        const midX = this.width / 2;
        const midY = this.height / 2 - 120;
        this.ctx.textAlign = 'center';

        // @TODO: improve this design and color
        this.ctx.fillStyle = winner?.color || 'red';
        this.ctx.font = '30px Arial';
        this.ctx.fillText('ROUND OVER', midX, midY + 120);
        if (winner) {
            this.ctx.fillText('WINNER', midX, midY + 160);
        }
        this.ctx.font = '20px Arial';
        this.ctx.fillText('- Press space to continue - ', midX, midY + 200);
    }

    public drawWinner(winner: Player) {
        this.clear();
        const midX = this.width / 2 - 75;
        const midY = this.height / 2 - 120;
        this.ctx.textAlign = 'center';
        this.ctx.fillStyle = winner.color;
        this.ctx.beginPath();
        this.ctx.moveTo(midX + 75, midY + 40);
        this.ctx.bezierCurveTo(midX + 75, midY + 37, midX + 70, midY + 25, midX + 50, midY + 25);
        this.ctx.bezierCurveTo(
            midX + 20,
            midY + 25,
            midX + 20,
            midY + 62.5,
            midX + 20,
            midY + 62.5,
        );
        this.ctx.bezierCurveTo(midX + 20, midY + 80, midX + 40, midY + 102, midX + 75, midY + 120);
        this.ctx.bezierCurveTo(
            midX + 110,
            midY + 102,
            midX + 130,
            midY + 80,
            midX + 130,
            midY + 62.5,
        );
        this.ctx.bezierCurveTo(
            midX + 130,
            midY + 62.5,
            midX + 130,
            midY + 25,
            midX + 100,
            midY + 25,
        );
        this.ctx.bezierCurveTo(midX + 85, midY + 25, midX + 75, midY + 37, midX + 75, midY + 40);
        this.ctx.fill();
        // @TODO: change font
        this.ctx.font = '30px Arial';
        this.ctx.fillText('WINNER', midX + 75, midY + 160);
    }

    public drawPlayerArrows = (players: Player[]) => {
        players.forEach((player) => {
            this.drawArrow(player.currentPosition, player.direction, player.color);
        });
    };

    private drawArrow(start: TPosition, direction: TDirection, color: string) {
        const headlen = config.playerWidth * 3;
        const arrowWidth = config.playerWidth * 2;

        // Switch start and from, so we start at the tip of the arrow
        const toX = start.x - config.speed * direction.x;
        const toY = start.y - config.speed * direction.y;
        const fromX = start.x - direction.x * config.speed * headlen * 3;
        const fromY = start.y - direction.y * config.speed * headlen * 3;
        //variables to be used when creating the arrow
        const angle = Math.atan2(toY - fromY, toX - fromX);

        this.ctx.save();
        this.ctx.strokeStyle = color;

        //starting path of the arrow from the start square to the end square
        //and drawing the stroke
        this.ctx.beginPath();
        this.ctx.moveTo(fromX, fromY);
        this.ctx.lineTo(toX, toY);
        this.ctx.lineWidth = arrowWidth;
        this.ctx.stroke();

        //starting a new path from the head of the arrow to one of the sides of
        //the point
        this.ctx.beginPath();
        this.ctx.moveTo(toX, toY);
        this.ctx.lineTo(
            toX - headlen * Math.cos(angle - Math.PI / 7),
            toY - headlen * Math.sin(angle - Math.PI / 7),
        );

        //path from the side point of the arrow, to the other side point
        this.ctx.lineTo(
            toX - headlen * Math.cos(angle + Math.PI / 7),
            toY - headlen * Math.sin(angle + Math.PI / 7),
        );

        //path from the side point back to the tip of the arrow, and then
        //again to the opposite side point
        this.ctx.lineTo(toX, toY);
        this.ctx.lineTo(
            toX - headlen * Math.cos(angle - Math.PI / 7),
            toY - headlen * Math.sin(angle - Math.PI / 7),
        );

        //draws the paths created above
        this.ctx.stroke();
        this.ctx.restore();
    }

    public didPlayerCollide(player: Player, otherPlayers: Player[]): Collision | undefined {
        // player collides with game boundaries
        if (
            player.currentPosition.x - config.playerWidth <= 0 ||
            player.currentPosition.x + config.playerWidth >= this.width ||
            player.currentPosition.y - config.playerWidth <= 0 ||
            player.currentPosition.y + config.playerWidth >= this.height
        ) {
            return {
                type: CollisionType.WALL_COLLISION,
                player,
            };
        }

        // player collides with other players
        for (const otherPlayer of otherPlayers) {
            const lineWidth = player.id === otherPlayer.id ? 1 : config.playerWidth * 3;
            if (
                // reduce line with to prevent self collision
                this.doesPointCollideWithPath(otherPlayer.path, player.currentPosition, lineWidth)
            ) {
                return {
                    type: CollisionType.PLAYER_COLLISION,
                    player,
                    into: otherPlayer,
                };
            }
        }
    }
}
