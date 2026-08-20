import { createLevelTemplate } from "./levelTemplate.js";

export default createLevelTemplate({
    id: 2,
    name: "Warp Chamber",

    bricks: [
        { x: 150, y: 200, type: "hard", hp: 3 },
        { x: 210, y: 200, type: "hard", hp: 3 },
        { x: 270, y: 200, type: "normal" },
        { x: 330, y: 200, type: "normal" },
        { x: 390, y: 200, type: "normal" }
    ],

    hazards: [
        { x: 500, y: 350, type: "sticky" }
    ],

    powerups: [
        { x: 250, y: 450, type: "speedBoost", amount: 1.5 }
    ],

    // NEW MECHANIC: teleport gates
    teleporters: [
        { x: 100, y: 300, targetX: 700, targetY: 200 },
        { x: 700, y: 200, targetX: 100, targetY: 300 }
    ],

    modifiers: {
        bounceMultiplier: 1.1,
        friction: 1.0
    },

    starThresholds: {
        three: 14,
        two: 22,
        one: 36
    }
});
