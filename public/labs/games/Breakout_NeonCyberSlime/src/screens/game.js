import { Theme } from "../theme.js";
import { Background } from "../background.js";
import { Hotbar } from "../ui/hotbar.js";
import { getLevel } from "../levels/index.js";

import { Ball } from "../objects/ball.js";
import { Brick } from "../objects/brick.js";
import { Hazard } from "../objects/hazard.js";
import { PowerUp } from "../objects/powerup.js";
import { Teleporter } from "../objects/teleporter.js";

export class GameScreen {
    constructor(canvas, ctx, switchScreen, levelIndex) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.switchScreen = switchScreen;

        this.levelIndex = levelIndex;
        this.level = getLevel(levelIndex + 1);

        this.bg = new Background(canvas, ctx);
        this.hotbar = new Hotbar(canvas, ctx, switchScreen);

        // Ball
        this.ball = new Ball(canvas.width / 2, canvas.height - 120);

        // Paddle
        this.paddle = {
            w: 140,
            h: 20,
            x: canvas.width / 2 - 70,
            y: canvas.height - 80
        };

        // Paddle velocity tracking
        this.prevPaddleX = this.paddle.x;
        this.paddleVX = 0;

        window.addEventListener("mousemove", e => {
            this.paddle.x = e.clientX - this.paddle.w / 2;
        });

        // Build objects
        this.bricks = this.level.bricks.map(b => new Brick(b));
        this.hazards = this.level.hazards.map(h => new Hazard(h));
        this.powerups = this.level.powerups.map(p => new PowerUp(p));
        this.teleporters = (this.level.teleporters || []).map(t => new Teleporter(t));

        // Level modifiers
        this.gravity = this.level.modifiers.gravity ?? 0;
        this.friction = this.level.modifiers.friction ?? 1;
        this.bounceMultiplier = this.level.modifiers.bounceMultiplier ?? 1;

        this.gameOver = false;
        this.starsEarned = 0;
    }

    updateBall(dt) {
        const b = this.ball;

        // Movement
        b.update(dt);

        // Gravity
        b.vy += this.gravity * dt;

        // Friction
        b.vx *= this.friction;
        b.vy *= this.friction;

        // Wall collisions
        if (b.x - b.r < 0) {
            b.x = b.r;
            b.vx *= -this.bounceMultiplier;
            b.bounces++;
        }
        if (b.x + b.r > this.canvas.width) {
            b.x = this.canvas.width - b.r;
            b.vx *= -this.bounceMultiplier;
            b.bounces++;
        }
        if (b.y - b.r < 0) {
            b.y = b.r;
            b.vy *= -this.bounceMultiplier;
            b.bounces++;
        }

        // Paddle collision
        const p = this.paddle;
        if (
            b.y + b.r >= p.y &&
            b.x >= p.x &&
            b.x <= p.x + p.w &&
            b.vy > 0
        ) {
            b.applyPaddleInfluence(p, this.paddleVX);
        }

        // Brick collisions
        for (const brick of this.bricks) {
            if (!brick.alive) continue;

            if (
                b.x > brick.x &&
                b.x < brick.x + brick.w &&
                b.y > brick.y &&
                b.y < brick.y + brick.h
            ) {
                brick.hit(b);
                b.vy *= -this.bounceMultiplier;
                b.bounces++;
            }
        }

        // Hazard collisions
        for (const hazard of this.hazards) {
            if (
                b.x > hazard.x &&
                b.x < hazard.x + hazard.w &&
                b.y > hazard.y &&
                b.y < hazard.y + hazard.h
            ) {
                hazard.apply(b, this);
            }
        }

        // Powerup collection
        for (const power of this.powerups) {
            if (power.collected) continue;

            if (
                b.x > power.x &&
                b.x < power.x + power.w &&
                b.y > power.y &&
                b.y < power.y + power.h
            ) {
                power.collect(b);
            }
        }

        // Teleporters
        for (const tp of this.teleporters) {
            if (
                b.x > tp.x &&
                b.x < tp.x + tp.w &&
                b.y > tp.y &&
                b.y < tp.y + tp.h
            ) {
                tp.teleport(b);
            }
        }

        // Lose condition
        if (b.y - b.r > this.canvas.height) {
            this.endLevel(0);
        }
    }

    checkWinCondition() {
        const remaining = this.bricks.some(b => b.alive);
        if (!remaining) this.scoreLevel();
    }

    scoreLevel() {
        const bounces = this.ball.bounces;
        const t = this.level.starThresholds;

        let stars = 0;
        if (bounces <= t.three) stars = 3;
        else if (bounces <= t.two) stars = 2;
        else if (bounces <= t.one) stars = 1;

        this.endLevel(stars);
    }

    endLevel(stars) {
        this.gameOver = true;
        this.starsEarned = stars;

        this.hotbar.setStars(stars);

        setTimeout(() => {
            this.switchScreen("levelSelect");
        }, 1000);
    }

    update(dt) {
        if (this.gameOver) return;

        // Paddle velocity
        this.paddleVX = (this.paddle.x - this.prevPaddleX) / dt;
        this.prevPaddleX = this.paddle.x;

        this.bg.update(dt);
        this.hotbar.update(dt);
        this.updateBall(dt);
        this.checkWinCondition();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.bg.draw();
        this.hotbar.draw();

        this.drawBall();
        this.drawPaddle();

        for (const brick of this.bricks) brick.draw(this.ctx, Theme);
        for (const hazard of this.hazards) hazard.draw(this.ctx, Theme);
        for (const power of this.powerups) power.draw(this.ctx, Theme);
        for (const tp of this.teleporters) tp.draw(this.ctx, Theme);

        if (this.gameOver) {
            const ctx = this.ctx;
            ctx.fillStyle = Theme.colors.neonMagenta;
            ctx.font = "48px Arial Black";
            ctx.textAlign = "center";
            ctx.fillText(
                `${this.starsEarned} ★`,
                this.canvas.width / 2,
                this.canvas.height / 2
            );
        }
    }

    drawBall() {
        const ctx = this.ctx;
        const b = this.ball;

        ctx.shadowColor = Theme.colors.neonCyan;
        ctx.shadowBlur = Theme.glow.slime;

        ctx.fillStyle = Theme.colors.neonCyan;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0;
    }

    drawPaddle() {
        const ctx = this.ctx;
        const p = this.paddle;

        ctx.shadowColor = Theme.colors.neonPurple;
        ctx.shadowBlur = Theme.glow.paddle;

        ctx.fillStyle = Theme.colors.neonPurple;
        ctx.fillRect(p.x, p.y, p.w, p.h);

        ctx.shadowBlur = 0;
    }
}
