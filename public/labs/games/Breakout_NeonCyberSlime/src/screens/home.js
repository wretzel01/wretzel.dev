import { Theme } from "../theme.js";
import { Background } from "../background.js";
import { Hotbar } from "../ui/hotbar.js";

export class HomeScreen {
    constructor(canvas, ctx, switchScreen) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.switchScreen = switchScreen; // callback to change screens

        this.bg = new Background(canvas, ctx);
        this.hotbar = new Hotbar(canvas, ctx, switchScreen);

        // Title pulse offset
        this.titlePulse = Math.random() * 100;

        // Button pulse offset
        this.buttonPulse = Math.random() * 80;

        // Button geometry
        this.button = {
            x: canvas.width / 2 - 120,
            y: canvas.height / 2 + 40,
            w: 240,
            h: 60
        };

        // Mouse tracking
        this.mouse = { x: 0, y: 0 };
        window.addEventListener("mousemove", e => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        window.addEventListener("mousedown", () => {
            if (this.isHoveringButton()) {
                this.switchScreen("levelSelect");
            }
        });
    }

    isHoveringButton() {
        const { x, y } = this.mouse;
        const b = this.button;
        return x > b.x && x < b.x + b.w && y > b.y && y < b.y + b.h;
    }

    update(dt) {
        this.bg.update(dt);
        this.hotbar.update(dt);

        this.titlePulse += Theme.time.globalPulseSpeed * dt;
        this.buttonPulse += Theme.time.globalPulseSpeed * dt;
    }

    draw() {
        const ctx = this.ctx;

        // Draw background
        this.bg.draw();

        // Draw hotbar
        this.hotbar.draw();

        // Draw title
        const titleHue = (this.titlePulse * 10) % 360;
        const titleGlow = Theme.glow.slime + Theme.curves.glowPulse(this.titlePulse);

        ctx.shadowColor = `hsl(${titleHue}, 100%, 60%)`;
        ctx.shadowBlur = titleGlow;

        ctx.fillStyle = `hsl(${titleHue}, 100%, 60%)`;
        ctx.font = "64px Arial Black";
        ctx.textAlign = "center";
        ctx.fillText("NEON CYBER‑SLIME", this.canvas.width / 2, this.canvas.height / 2 - 40);

        ctx.shadowBlur = 0;

        // Draw Start Button
        const b = this.button;
        const hovering = this.isHoveringButton();

        const pulse = 1 + Theme.curves.breathe(this.buttonPulse) * 0.1;
        const glow = hovering
            ? Theme.glow.hitFlash
            : Theme.glow.paddle + Theme.curves.glowPulse(this.buttonPulse);

        ctx.shadowColor = Theme.colors.neonCyan;
        ctx.shadowBlur = glow;

        ctx.fillStyle = hovering
            ? Theme.colors.neonMagenta
            : Theme.colors.neonCyan;

        ctx.fillRect(b.x, b.y, b.w * pulse, b.h * pulse);

        ctx.shadowBlur = 0;

        // Button text
        ctx.fillStyle = "#000";
        ctx.font = "28px Arial Black";
        ctx.textAlign = "center";
        ctx.fillText("START", b.x + (b.w * pulse) / 2, b.y + (b.h * pulse) / 2 + 10);
    }
}
