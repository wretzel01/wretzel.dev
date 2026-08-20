import { Theme } from "../theme.js";
import { Background } from "../background.js";
import { Hotbar } from "../ui/hotbar.js";
import { levels } from "../levels/index.js";

export class LevelSelectScreen {
    constructor(canvas, ctx, switchScreen) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.switchScreen = switchScreen;

        this.bg = new Background(canvas, ctx);
        this.hotbar = new Hotbar(canvas, ctx, switchScreen);

        // Example level data (replace with real data later)
        this.levels = [];
        this.initLevels();

        this.mouse = { x: 0, y: 0 };
        window.addEventListener("mousemove", e => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });

        window.addEventListener("mousedown", () => {
            const idx = this.getHoveredLevelIndex();
            if (idx !== -1) {
                this.switchScreen("game", idx);
            }
        });
    }

    initLevels() {
        const spacing = 40;
        const boxW = 180;
        const boxH = 120;

        const cols = 4;
        const rows = Math.ceil(levels.length / cols);

        const totalWidth = cols * boxW + (cols - 1) * spacing;
        const totalHeight = rows * boxH + (rows - 1) * spacing;

        const startX = (this.canvas.width - totalWidth) / 2;
        const startY = (this.canvas.height - totalHeight) / 2;

        this.levels = levels.map((lvl, i) => {
            const r = Math.floor(i / cols);
            const c = i % cols;

            return {
                id: lvl.id,
                name: lvl.name,
                stars: 0, // you can store progress later
                x: startX + c * (boxW + spacing),
                y: startY + r * (boxH + spacing),
                w: boxW,
                h: boxH,
                pulse: Math.random() * 100
            };
        });
    }


    getHoveredLevelIndex() {
        const { x, y } = this.mouse;
        for (let i = 0; i < this.levels.length; i++) {
            const L = this.levels[i];
            if (x > L.x && x < L.x + L.w && y > L.y && y < L.y + L.h) {
                return i;
            }
        }
        return -1;
    }

    update(dt) {
        this.bg.update(dt);
        this.hotbar.update(dt);

        for (const L of this.levels) {
            L.pulse += Theme.time.globalPulseSpeed * dt;
        }
    }

    drawLevelBox(L, hovered) {
        const ctx = this.ctx;

        const pulse = 1 + Theme.curves.breathe(L.pulse) * 0.1;
        const glow = hovered
            ? Theme.glow.hitFlash
            : Theme.glow.slime + Theme.curves.glowPulse(L.pulse);

        ctx.shadowColor = Theme.colors.neonPurple;
        ctx.shadowBlur = glow;

        ctx.fillStyle = hovered
            ? Theme.colors.neonMagenta
            : Theme.colors.neonPurple;

        ctx.fillRect(L.x, L.y, L.w * pulse, L.h * pulse);

        ctx.shadowBlur = 0;

        // Level number
        ctx.fillStyle = "#000";
        ctx.font = "26px Arial Black";
        ctx.textAlign = "center";
        ctx.fillText(
            `LEVEL ${L.id}`,
            L.x + (L.w * pulse) / 2,
            L.y + (L.h * pulse) / 2 - 25
        );

        // Level name
        ctx.fillStyle = Theme.colors.neonCyan;
        ctx.font = "20px Arial";
        ctx.fillText(
            L.name,
            L.x + (L.w * pulse) / 2,
            L.y + (L.h * pulse) / 2
        );

        // Stars earned
        ctx.fillStyle = Theme.colors.neonPink;
        ctx.font = "22px Arial";
        ctx.fillText(
            "★".repeat(L.stars),
            L.x + (L.w * pulse) / 2,
            L.y + (L.h * pulse) / 2 + 30
        );
    }


    draw() {
        const ctx = this.ctx;

        // Background
        this.bg.draw();

        // Hotbar
        this.hotbar.draw();

        // Title
        ctx.fillStyle = Theme.colors.neonCyan;
        ctx.font = "48px Arial Black";
        ctx.textAlign = "center";
        ctx.fillText("SELECT LEVEL", this.canvas.width / 2, 110);

        // Draw level boxes
        const hoveredIndex = this.getHoveredLevelIndex();

        for (let i = 0; i < this.levels.length; i++) {
            const L = this.levels[i];
            const hovered = i === hoveredIndex;
            this.drawLevelBox(L, hovered);
        }
    }
}
