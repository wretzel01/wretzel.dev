export class Hazard {
    constructor({ x, y, w = 60, h = 60, type = "spike" }) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.type = type;
    }

    apply(ball, game) {
        if (this.type === "spike") {
            game.endLevel(0);
        }
        if (this.type === "sticky") {
            ball.vx *= 0.5;
            ball.vy *= 0.5;
        }
    }

    draw(ctx, Theme) {
        ctx.fillStyle = Theme.colors.neonRed;
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }
}
