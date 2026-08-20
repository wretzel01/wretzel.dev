import { Theme } from "./theme.js";

export class Background {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;

        this.blobs = [];
        this.globalTime = 0;

        this.initBlobs();
    }

    initBlobs() {
        const count = Theme.background.blobCount;

        for (let i = 0; i < count; i++) {
            this.blobs.push({
                x: this.randomRange(-200, this.canvas.width + 200),
                y: this.randomRange(-200, this.canvas.height + 200),

                r: this.randomRange(40, 240),

                pulse: Math.random() * Theme.background.blobPulseOffsetRange,
                pulseSpeed: this.randomRange(
                    Theme.background.blobPulseSpeed * 0.5,
                    Theme.background.blobPulseSpeed * 2.0
                ),

                hue: this.randomRange(0, 360),
                hueShiftOffset: this.randomRange(0, 200),
                colorShiftSpeed: this.randomRange(
                    Theme.background.blobColorShiftSpeed * 0.5,
                    Theme.background.blobColorShiftSpeed * 2.0
                ),

                driftX: this.randomRange(-0.8, 0.8),
                driftY: this.randomRange(-0.8, 0.8),
            });
        }
    }

    randomRange(min, max) {
        return Math.random() * (max - min) + min;
    }


    update(dt) {
        this.globalTime += dt * Theme.time.globalPulseSpeed;

        for (const b of this.blobs) {
            // Pulse
            b.pulse += b.pulseSpeed;

            // Color shift
            b.hue = (b.hue + b.colorShiftSpeed) % 360;

            // Drift
            b.x += b.driftX;
            b.y += b.driftY;

            // Wrap around screen
            if (b.x < -b.r) b.x = this.canvas.width + b.r;
            if (b.x > this.canvas.width + b.r) b.x = -b.r;
            if (b.y < -b.r) b.y = this.canvas.height + b.r;
            if (b.y > this.canvas.height + b.r) b.y = -b.r;
        }
    }

    draw() {
        const ctx = this.ctx;

        ctx.fillStyle = Theme.colors.background;
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        for (const b of this.blobs) {
            const pulse = Theme.curves.chaos(b.pulse) * 0.5 + 1;
            const glow = Theme.glow.backgroundBlob + Theme.curves.glowPulse(b.pulse);

            ctx.fillStyle = `hsla(${b.hue}, 100%, 50%, 0.25)`;
            ctx.shadowColor = ctx.fillStyle;
            ctx.shadowBlur = glow;

            ctx.beginPath();
            ctx.arc(b.x, b.y, b.r * pulse, 0, Math.PI * 2);
            ctx.fill();

            ctx.shadowBlur = 0;
        }
    }
}
