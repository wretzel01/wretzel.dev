export class Teleporter {
    constructor({ x, y, targetX, targetY, w = 50, h = 50 }) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.targetX = targetX;
        this.targetY = targetY;
    }

    teleport(ball) {
        ball.x = this.targetX;
        ball.y = this.targetY;
    }

    draw(ctx, Theme) {
        ctx.fillStyle = Theme.colors.neonBlue;
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }
}
