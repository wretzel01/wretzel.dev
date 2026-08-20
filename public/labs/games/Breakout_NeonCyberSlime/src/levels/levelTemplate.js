export function createLevelTemplate({
    id,
    name,
    bricks = [],
    hazards = [],
    powerups = [],
    modifiers = {},
    starThresholds = { three: 10, two: 20, one: 35 }
}) {
    return {
        id,
        name,
        bricks,
        hazards,
        powerups,
        modifiers: {
            gravity: modifiers.gravity ?? 0,
            friction: modifiers.friction ?? 1,
            bounceMultiplier: modifiers.bounceMultiplier ?? 1,
            ...modifiers
        },
        starThresholds
    };
}
