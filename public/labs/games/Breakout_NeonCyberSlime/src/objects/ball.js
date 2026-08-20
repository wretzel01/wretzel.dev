export class Ball {
    constructor(x, y, radius = 12) {
        this.x = x;
        this.y = y;
        this.r = radius;

        this.vx = 4;
        this.vy = -6;

        this.bounces = 0;

        // For dynamic paddle influence
        this.maxSpeed = 14;
    }

    update(dt) {
        this.x += this.vx * dt;
        this.y += this.vy * dt;
    }

    applyPaddleInfluence(paddle, paddleVX) {
        // Reverse vertical velocity
        this.vy *= -1;

        // Add paddle movement influence
        this.vx += paddleVX * 0.15;

        // Add angle based on hit position
        const hitPos = (this.x - paddle.x) / paddle.w; // 0..1
        const angle = (hitPos - 0.5) * 1.2;
        this.vx += angle * 6;

        // Clamp speed
        this.vx = Math.max(-this.maxSpeed, Math.min(this.maxSpeed, this.vx));

        this.bounces++;
    }

    bounceX() {
        this.vx *= -1;
        this.bounces++;
    }

    bounceY() {
        this.vy *= -1;
        this.bounces++;
    }
}
