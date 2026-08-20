export class PowerUp {
    constructor({ x, y, w = 40, h = 40, type = "speedBoost", amount = 1 }) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.type = type;
        this.amount = amount;
        this.collected = false;
    }

    collect(ball) {
        if (this.type === "speedBoost") {
            ball.vx *= this.amount;
            ball.vy *= this.amount;
        }
        if (this.type === "bounceReducer") {
            ball.bounces = Math.max(0, ball.bounces - this.amount);
        }
        this.collected = true;
    }

    draw(ctx, Theme) {
        if (this.collected) return;
        ctx.fillStyle = Theme.colors.neonYellow;
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }
}
