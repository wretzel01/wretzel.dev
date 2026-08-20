// Main game controller and screen manager

import { HomeScreen } from "./screens/home.js";
import { LevelSelectScreen } from "./screens/levelSelect.js";
import { GameScreen } from "./screens/game.js";  // now active

export class GameController {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;

        this.currentScreen = null;
        this.lastTime = 0;

        this.switchScreen("home");
        requestAnimationFrame(this.loop.bind(this));
    }

    switchScreen(name, data = null) {
        if (name === "home") {
            this.currentScreen = new HomeScreen(
                this.canvas,
                this.ctx,
                this.switchScreen.bind(this)
            );
        }

        if (name === "levelSelect") {
            this.currentScreen = new LevelSelectScreen(
                this.canvas,
                this.ctx,
                this.switchScreen.bind(this)
            );
        }

        if (name === "game") {
            // data = levelIndex (0-based)
            this.currentScreen = new GameScreen(
                this.canvas,
                this.ctx,
                this.switchScreen.bind(this),
                data
            );
        }
    }

    loop(timestamp) {
        const dt = (timestamp - this.lastTime) / 16.666; // normalize to ~60fps
        this.lastTime = timestamp;

        if (this.currentScreen) {
            this.currentScreen.update(dt);
            this.currentScreen.draw();
        }

        requestAnimationFrame(this.loop.bind(this));
    }
}
