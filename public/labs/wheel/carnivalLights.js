// carnivalLights.js

/**
 * Draws animated carnival bulb lights around the perimeter of the wheel canvas.
 */
export function drawCarnivalLights(ctx, centerX, centerY, outerRadius, isSpinning = false, isWinner = false) {
  const bulbCount = 20; // Number of rim bulbs
  const bulbRadius = outerRadius + 14; // Distance from center

  // Speed up time division when spinning
  const time = Date.now() / (isSpinning ? 120 : 1200);

  for (let i = 0; i < bulbCount; i++) {
    const angle = (i * 2 * Math.PI) / bulbCount;
    const bx = centerX + Math.cos(angle) * bulbRadius;
    const by = centerY + Math.sin(angle) * bulbRadius;

    ctx.save();
    
    // 1. Expanded Glow Layer (Drawn first so it casts a wide aura around the bulb)
    ctx.beginPath();
    ctx.arc(bx, by, 8, 0, 2 * Math.PI); // Larger aura radius

    if (isWinner) {
      const partyFlash = Math.floor(Date.now() / 100 + i) % 2 === 0;
      ctx.fillStyle = partyFlash ? "#38bdf8" : "#f43f5e";
      ctx.shadowColor = partyFlash ? "#38bdf8" : "#f43f5e";
      ctx.shadowBlur = 20;
    } else {
      const isLit = Math.floor(time + i) % 2 === 0;

      if (isLit) {
        ctx.fillStyle = "#facc15"; // Gold Glow
        ctx.shadowColor = "#facc15";
        ctx.shadowBlur = isSpinning ? 22 : 16;
      } else {
        ctx.fillStyle = "#fb923c"; // Amber/Orange Glow
        ctx.shadowColor = "#fb923c";
        ctx.shadowBlur = isSpinning ? 14 : 10;
      }
    }
    ctx.fill();

    // 2. High-Contrast Core Bulb (Drawn over the glow to keep the center crisp)
    ctx.beginPath();
    ctx.arc(bx, by, 5.5, 0, 2 * Math.PI); // Larger physical bulb size (up from 5)
    ctx.fillStyle = "#ffffff"; // Bright core punch
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.restore();
  }
}