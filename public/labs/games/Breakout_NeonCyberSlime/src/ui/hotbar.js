import { Theme } from "../theme.js";

export class Hotbar {
    constructor(canvas, ctx, switchScreen) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.switchScreen = switchScreen;

        // Hotbar state
        this.level = 1;
        this.stars = 0;
        this.challenges = { completed: 0, total: 0 };
        this.globalProgress = 0; // 0–1

        // Pulse offsets
        this.pulse = Math.random() * 100;
        this.starPulse = Math.random() * 50;
        this.levelPulse = Math.random() * 80;
        this.challengePulse = Math.random() * 120;

        // Back button
        this.backButton = {
            x: 20,
            y: 15,
            w: 100,
            h: 40,
            pulse: Math.random() * 60
        };

        // Mouse tracking
        this.mouseX = 0;
        this.mouseY = 0;

        window.addEventListener("mousemove", e => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });

        window.addEventListener("mousedown", () => {
            if (this.isHoveringBack()) {
                this.switchScreen("home");
            }
        });
    }

    // --- STATE SETTERS ---
    setLevel(level) {
        this.level = level;
        this.levelPulse += 5;
    }

    setStars(stars) {
        this.stars = stars;
        this.starPulse += 10;
    }

    setChallenges(completed, total) {
        this.challenges.completed = completed;
        this.challenges.total = total;
        this.challengePulse += 8;
    }

    setGlobalProgress(value) {
        this.globalProgress = Math.max(0, Math.min(1, value));
    }

    // --- BACK BUTTON HOVER ---
    isHoveringBack() {
        const b = this.backButton;
        return (
            this.mouseX > b.x &&
            this.mouseX < b.x + b.w &&
            this.mouseY > b.y &&
            this.mouseY < b.y + b.h
        );
    }

    // --- UPDATE ---
    update(dt) {
        const speed = Theme.time.globalPulseSpeed * dt;

        this.pulse += speed;
        this.starPulse += speed;
        this.levelPulse += speed;
        this.challengePulse += speed;
        this.backButton.pulse += speed;
    }

    // --- DRAW ---
    draw() {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = 70;

        // Background membrane
        const pulse = 1 + Theme.curves.breathe(this.pulse) * 0.1;
        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.fillRect(0, 0, w, h * pulse);

        // Glow border
        ctx.shadowColor = Theme.colors.neonCyan;
        ctx.shadowBlur = Theme.glow.paddle;
        ctx.strokeStyle = Theme.colors.neonCyan;
        ctx.lineWidth = 3;
        ctx.strokeRect(0, 0, w, h * pulse);
        ctx.shadowBlur = 0;

        // --- BACK BUTTON ---
        const b = this.backButton;
        const hovering = this.isHoveringBack();
        const backPulse = 1 + Theme.curves.breathe(b.pulse) * 0.1;

        const backGlow = hovering
            ? Theme.glow.hitFlash
            : Theme.glow.paddle + Theme.curves.glowPulse(b.pulse);

        ctx.shadowColor = Theme.colors.neonCyan;
        ctx.shadowBlur = backGlow;

        ctx.fillStyle = hovering
            ? Theme.colors.neonMagenta
            : Theme.colors.neonCyan;

        ctx.fillRect(b.x, b.y, b.w * backPulse, b.h * backPulse);

        ctx.shadowBlur = 0;

        ctx.fillStyle = "#000";
        ctx.font = "22px Arial Black";
        ctx.textAlign = "center";
        ctx.fillText(
            "BACK",
            b.x + (b.w * backPulse) / 2,
            b.y + (b.h * backPulse) / 2 + 8
        );

        // --- STARS ---
        const starGlow = Theme.glow.slime + Theme.curves.glowPulse(this.starPulse);
        ctx.shadowColor = Theme.colors.neonPink;
        ctx.shadowBlur = starGlow;
        ctx.fillStyle = Theme.colors.neonPink;
        ctx.font = "28px Arial";
        ctx.fillText("★".repeat(this.stars), 150, 45);
        ctx.shadowBlur = 0;

        // --- LEVEL INDICATOR ---
        const levelHue = (this.levelPulse * 10) % 360;
        ctx.fillStyle = `hsl(${levelHue}, 100%, 60%)`;
        ctx.font = "26px Arial";
        ctx.fillText(`LEVEL ${this.level}`, w / 2 - 80, 45);

        // --- CHALLENGES ---
        const challengeGlow = Theme.glow.slime + Theme.curves.glowPulse(this.challengePulse);
        ctx.shadowColor = Theme.colors.neonGreen;
        ctx.shadowBlur = challengeGlow;
        ctx.fillStyle = Theme.colors.neonGreen;
        ctx.font = "22px Arial";
        ctx.fillText(
            `CHALLENGES: ${this.challenges.completed}/${this.challenges.total}`,
            w - 260,
            45
        );
        ctx.shadowBlur = 0;

        // --- GLOBAL PROGRESS BAR ---
        const barWidth = 200;
        const barX = w - barWidth - 20;
        const barY = 50;

        ctx.fillStyle = "rgba(255,255,255,0.1)";
        ctx.fillRect(barX, barY, barWidth, 10);

        ctx.fillStyle = Theme.colors.neonPurple;
        ctx.fillRect(barX, barY, barWidth * this.globalProgress, 10);
    }
}
