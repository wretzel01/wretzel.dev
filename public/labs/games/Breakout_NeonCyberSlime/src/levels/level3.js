import { createLevelTemplate } from "./levelTemplate.js";

export default createLevelTemplate({
    id: 3,
    name: "Slime Rapids",

    bricks: [
        { x: 200, y: 150, type: "directional", dir: "right" },
        { x: 260, y: 150, type: "directional", dir: "right" },
        { x: 320, y: 150, type: "normal" },
        { x: 380, y: 150, type: "normal" },
        { x: 440, y: 150, type: "hard", hp: 2 }
    ],

    hazards: [
        { x: 600, y: 400, type: "spike" }
    ],

    powerups: [
        { x: 300, y: 350, type: "multiBall", amount: 2 }
    ],

    // NEW MECHANIC: slime streams (environmental push zones)
    slimeStreams: [
        { x: 100, y: 250, w: 600, h: 40, forceX: 1.2, forceY: 0 },
        { x: 150, y: 450, w: 500, h: 40, forceX: -1.0, forceY: 0 }
    ],

    modifiers: {
        bounceMultiplier: 0.9,
        friction: 0.8
    },

    starThresholds: {
        three: 10,
        two: 18,
        one: 30
    }
});
