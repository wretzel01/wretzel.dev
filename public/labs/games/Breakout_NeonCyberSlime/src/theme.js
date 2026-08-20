// Neon Cyber‑Slime Theme Configuration
export const Theme = {
    // --- COLOR PALETTE ---
    colors: {
        background: "#000000",
        neonCyan: "#00ffff",
        neonMagenta: "#ff00ff",
        neonGreen: "#00ff55",
        neonPink: "#ff0088",
        neonPurple: "#8000ff",
    },

    // --- GLOBAL TIMING ---
    time: {
        globalPulseSpeed: 0.015,   // background + global vibe
        entityPulseVariance: 0.5,  // random offset multiplier
    },

    // --- GLOW SETTINGS ---
    glow: {
        ball: 25,
        paddle: 20,
        slime: 15,
        backgroundBlob: 30,
        hitFlash: 40,
    },

    // --- SLIME BEHAVIOR ---
    slime: {
        pulseSpeed: 0.08,          // how fast slime bricks pulse
        wobbleAmount: 0.12,        // how much they deform on hit
        regenRate: 0.002,          // optional: slime slowly heals
        fuseChance: 0.01,          // optional: slime blobs merge
        colorCycleSpeed: 0.4,      // slime hue shift speed
        pulseOffsetRange: 100,     // random offset range
    },

    // --- BALL BEHAVIOR ---
    ball: {
        baseSpeed: 4,
        speedIncrease: 0.15,       // per level or per hit
        colorShiftSpeed: 0.5,      // ball cycles neon colors
        pulseSpeed: 0.12,          // ball glow pulse
        pulseOffsetRange: 50,
    },

    // --- PADDLE BEHAVIOR ---
    paddle: {
        wobbleOnHit: 0.15,
        infectionRate: 0.001,      // optional: slime corrupts paddle
        pulseSpeed: 0.05,
        pulseOffsetRange: 80,
    },

    // --- BACKGROUND SLIME ---
    background: {
        blobCount: 12,
        blobPulseSpeed: 0.03,
        blobPulseOffsetRange: 200,
        blobColorShiftSpeed: 0.2,
    },

    // --- PARTICLE EFFECTS ---
    particles: {
        countOnHit: 8,
        countOnDeath: 20,
        maxSize: 6,
        minSize: 2,
        lifetime: 600,
        pulseSpeed: 0.1,
    },

    // --- ANIMATION CURVES ---
    curves: {
        // Generic pulse curve
        pulse: (t) => Math.sin(t),

        // Slime wobble curve (more chaotic)
        wobble: (t) => Math.sin(t * 3) * 0.5,

        // Glow pulse curve (stronger peaks)
        glowPulse: (t) => 10 + Math.sin(t * 2) * 10,

        // Organic breathing curve
        breathe: (t) => Math.sin(t * 0.5) * 0.3,

        // Chaotic slime curve (for background blobs)
        chaos: (t) => Math.sin(t * 1.7) + Math.sin(t * 0.3) * 0.5,
    },

    // --- LEVEL SETTINGS ---
    level: {
        rows: 5,
        cols: 10,
        spacingX: 10,
        spacingY: 10,
        brickWidth: 80,
        brickHeight: 30,
    }
};
