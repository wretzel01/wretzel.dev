// wheel.js
import { drawCarnivalLights } from './carnivalLights.js';

// Helper to darken or lighten Hex colors for smooth gradient stop calculations
function adjustColorBrightness(hex, percent) {
  let num = parseInt(hex.replace('#', ''), 16);
  if (isNaN(num)) return hex; // Fallback if HSL or invalid format

  let r = (num >> 16) + percent;
  let g = ((num >> 8) & 0x00FF) + percent;
  let b = (num & 0x0000FF) + percent;

  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));

  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

// Renders the wheel background, slices, auto-scaling labels, metallic pegs, and carnival lights
export function drawWheel(canvas, ctx, items, currentAngle, isSpinning = false, isWinner = false) {
  const width = canvas.width;
  const height = canvas.height;
  const centerX = width / 2;
  const centerY = height / 2;
  
  const radius = Math.min(centerX, centerY) - 38; 
  const hubRadius = 28;
  const numSlices = items.length;
  
  ctx.clearRect(0, 0, width, height);

  // Empty State Fallback
  if (numSlices === 0) {
    // Fill wheel interior with dark placeholder background
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fillStyle = '#0f172a';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#334155';
    ctx.stroke();

    // Center Placeholder Message
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 16px sans-serif';
    ctx.fillText('No slices added', centerX, centerY - 10);
    
    ctx.fillStyle = '#64748b';
    ctx.font = '14px sans-serif';
    ctx.fillText('Click "+ Add Slice" to start', centerX, centerY + 14);
    return;
  }

  const sliceAngle = (2 * Math.PI) / numSlices;
  const maxTextWidth = radius - hubRadius - 24; // Maximum horizontal space available for text

  // 1. Draw Slices with Radial Depth & Auto-Scaling Labels
  for (let i = 0; i < numSlices; i++) {
    const startAngle = currentAngle + i * sliceAngle;
    const endAngle = startAngle + sliceAngle;

    const baseColor = items[i].color || `hsl(${(i * 360) / numSlices}, 70%, 50%)`;

    // Slice sector path
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.closePath();

    // Radial Gradient for 3D slice depth
    if (baseColor.startsWith('#')) {
      const sliceGrad = ctx.createRadialGradient(
        centerX, centerY, hubRadius,
        centerX, centerY, radius
      );
      sliceGrad.addColorStop(0, adjustColorBrightness(baseColor, 35));
      sliceGrad.addColorStop(0.7, baseColor);
      sliceGrad.addColorStop(1, adjustColorBrightness(baseColor, -35));
      ctx.fillStyle = sliceGrad;
    } else {
      ctx.fillStyle = baseColor;
    }
    ctx.fill();

    // Subtle slice border separators
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.stroke();

    // Inner rim light overlay per slice
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius - 2, startAngle, endAngle);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Slice Labels
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(startAngle + sliceAngle / 2);
    ctx.textAlign = 'right';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
    ctx.shadowBlur = 6;
    ctx.shadowOffsetY = 1;

    const labelText = typeof items[i] === 'string' ? items[i] : (items[i].text || '');

    // Dynamically calculate starting font size based on slice count
    let fontSize = Math.min(18, Math.max(10, Math.floor(180 / numSlices)));
    ctx.font = `800 ${fontSize}px sans-serif`;

    // Shrink font size down if the text width exceeds the available radius space
    while (ctx.measureText(labelText).width > maxTextWidth && fontSize > 9) {
      fontSize -= 1;
      ctx.font = `800 ${fontSize}px sans-serif`;
    }

    // Truncate with ellipsis if text is still too long for tiny slices
    let displayText = labelText;
    if (ctx.measureText(displayText).width > maxTextWidth) {
      while (displayText.length > 3 && ctx.measureText(displayText + '…').width > maxTextWidth) {
        displayText = displayText.slice(0, -1);
      }
      displayText += '…';
    }

    // Render text centered vertically relative to the font baseline
    ctx.fillText(displayText, radius - 22, fontSize / 3.2);
    ctx.restore();
  }

  // 2. Draw Metallic Pegs directly on the Slice Boundaries
  const pegRadius = 6;
  const pegOffsetFromEdge = 10;

  for (let i = 0; i < numSlices; i++) {
    const pegAngle = currentAngle + i * sliceAngle;
    const pegX = centerX + (radius - pegOffsetFromEdge) * Math.cos(pegAngle);
    const pegY = centerY + (radius - pegOffsetFromEdge) * Math.sin(pegAngle);

    ctx.save();
    ctx.beginPath();
    ctx.arc(pegX, pegY, pegRadius, 0, 2 * Math.PI);

    // 3D Metallic Gradient
    const grad = ctx.createRadialGradient(
      pegX - 2, pegY - 2, 1, 
      pegX, pegY, pegRadius
    );
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.5, '#cbd5e1');
    grad.addColorStop(1, '#334155');

    ctx.fillStyle = grad;
    ctx.fill();
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();
  }

  // 3. Multi-Layered Center Metallic Cap (Rotates with currentAngle)
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(currentAngle); // Locks center details to wheel spin angle

  // Outer Metallic Ring Bevel
  ctx.beginPath();
  ctx.arc(0, 0, hubRadius + 4, 0, 2 * Math.PI);
  const hubRingGrad = ctx.createLinearGradient(-hubRadius, -hubRadius, hubRadius, hubRadius);
  hubRingGrad.addColorStop(0, '#ffffff');
  hubRingGrad.addColorStop(0.5, '#64748b');
  hubRingGrad.addColorStop(1, '#0f172a');
  ctx.fillStyle = hubRingGrad;
  ctx.fill();

  // Inner Dark Core Base
  ctx.beginPath();
  ctx.arc(0, 0, hubRadius, 0, 2 * Math.PI);
  const hubInnerGrad = ctx.createRadialGradient(-3, -3, 2, 0, 0, hubRadius);
  hubInnerGrad.addColorStop(0, '#38bdf8');
  hubInnerGrad.addColorStop(0.5, '#0f172a');
  hubInnerGrad.addColorStop(1, '#020617');
  ctx.fillStyle = hubInnerGrad;
  ctx.fill();

  // Rotational Visual Accents (4 Screws/Notches + Center Icon Accent)
  const notchCount = 4;
  for (let n = 0; n < notchCount; n++) {
    const notchAngle = (n * Math.PI) / 2;
    const notchDist = hubRadius - 7;
    const nx = notchDist * Math.cos(notchAngle);
    const ny = notchDist * Math.sin(notchAngle);

    ctx.beginPath();
    ctx.arc(nx, ny, 2.5, 0, 2 * Math.PI);
    ctx.fillStyle = '#94a3b8';
    ctx.fill();
    ctx.strokeStyle = '#020617';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // Center Metallic Emblem Accent
  ctx.beginPath();
  ctx.arc(0, 0, 8, 0, 2 * Math.PI);
  const emblemGrad = ctx.createLinearGradient(-8, -8, 8, 8);
  emblemGrad.addColorStop(0, '#fef08a');
  emblemGrad.addColorStop(1, '#eab308');
  ctx.fillStyle = emblemGrad;
  ctx.fill();

  ctx.restore();

  // 4. Draw Carnival Rim Lights
  drawCarnivalLights(ctx, centerX, centerY, radius, isSpinning, isWinner);
}

// Determines which slice is currently under the top pointer (12 o'clock)
export function getCurrentTopSliceIndex(itemsLength, currentAngle) {
  if (itemsLength === 0) return 0;
  const sliceAngle = (2 * Math.PI) / itemsLength;
  const pointerAngle = 1.5 * Math.PI; // Top of wheel
  
  let normalizedAngle = (pointerAngle - (currentAngle % (2 * Math.PI))) % (2 * Math.PI);
  if (normalizedAngle < 0) normalizedAngle += 2 * Math.PI;
  
  return Math.floor(normalizedAngle / sliceAngle) % itemsLength;
}