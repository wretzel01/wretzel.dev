import { createLevelTemplate } from "./levelTemplate.js";

export default createLevelTemplate({
    id: 1,
    name: "Slime Corridor",

    bricks: [
        { x: 200, y: 200, type: "normal" },
        { x: 260, y: 200, type: "normal" },
        { x: 320, y: 200, type: "hard", hp: 3 },
        { x: 380, y: 200, type: "directional", dir: "left" }
    ],

    hazards: [
        { x: 500, y: 300, type: "spike" },
        { x: 600, y: 350, type: "sticky" }
    ],

    powerups: [
        { x: 250, y: 350, type: "bounceReducer", amount: 3 }
    ],

    modifiers: {
        bounceMultiplier: 1.0,
        friction: 1.0
    },

    starThresholds: {
        three: 12,
        two: 20,
        one: 35
    }
});
