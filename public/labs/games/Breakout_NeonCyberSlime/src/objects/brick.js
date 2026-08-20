export class Brick {
    constructor({ x, y, w = 80, h = 40, hp = 1, type = "normal", dir = null }) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        this.hp = hp;
        this.type = type;
        this.dir = dir;

        this.alive = true;
    }

    hit(ball) {
        // Basic brick behavior
        this.hp--;
        if (this.hp <= 0) {
            this.alive = false;
        }

        // Directional brick behavior
        if (this.type === "directional") {
            if (this.dir === "left") ball.vx -= 2;
            if (this.dir === "right") ball.vx += 2;
            if (this.dir === "up") ball.vy -= 2;
            if (this.dir === "down") ball.vy += 2;
        }

        // Hard bricks simply take more hits (hp > 1)
    }

    draw(ctx, Theme) {
        if (!this.alive) return;

        ctx.shadowColor = Theme.colors.neonGreen;
        ctx.shadowBlur = Theme.glow.slime;

        ctx.fillStyle = Theme.colors.neonGreen;
        ctx.fillRect(this.x, this.y, this.w, this.h);

        ctx.shadowBlur = 0;
    }
}
