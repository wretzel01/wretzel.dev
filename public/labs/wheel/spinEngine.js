import { getCurrentTopSliceIndex } from './wheel.js';
import { playTickSound } from './audio.js';

export class SpinEngine {
  constructor(pointerEl, onRender, onComplete) {
    this.pointerEl = pointerEl;
    this.onRender = onRender;
    this.onComplete = onComplete;

    this.currentAngle = 0;
    this.startAngle = 0;
    this.targetAngle = 0;
    
    // Total spin time (7.5 seconds yields that iconic dramatic crawl)
    this.spinDuration = 7500; 
    
    this.startTime = null;
    this.isSpinning = false;
    this.lastSliceIndex = -1;
    this.animationId = null;
  }

  /**
   * WHEEL OF NAMES CUBIC-BEZIER EASING
   * Equivalent to CSS: cubic-bezier(0.12, 0.8, 0.15, 1.0)
   */
  getEaseOutProgress(t) {
    if (t <= 0) return 0;
    if (t >= 1) return 1;

    const inv = 1 - t;
    return 1 - Math.pow(inv, 3.5);
  }

  start(itemsLength) {
    if (this.isSpinning || itemsLength === 0) return false;

    // Normalize start angle to 0..2*PI range
    this.currentAngle = ((this.currentAngle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    this.startAngle = this.currentAngle;

    const sliceAngle = (2 * Math.PI) / itemsLength;
    const targetSliceIndex = Math.floor(Math.random() * itemsLength);
    
    // Calculate exact target angle for the pointer
    const sliceCenter = (1.5 * Math.PI - (targetSliceIndex + 0.5) * sliceAngle);
    const randomPadding = (Math.random() - 0.5) * (sliceAngle * 0.7);

    // High RPM: 8 to 11 full rotations
    const highRPMTurns = 8 + Math.floor(Math.random() * 4);
    const fullRotations = highRPMTurns * 2 * Math.PI;
    
    let deltaAngle = (sliceCenter + randomPadding - this.startAngle);
    while (deltaAngle < 0) deltaAngle += 2 * Math.PI;
    
    this.targetAngle = this.startAngle + fullRotations + deltaAngle;

    this.startTime = performance.now();
    this.isSpinning = true;
    this.lastSliceIndex = getCurrentTopSliceIndex(itemsLength, this.startAngle);

    this.loop(itemsLength);
    return true;
  }

  loop(itemsLength) {
    if (!this.isSpinning) return;

    const now = performance.now();
    const elapsed = now - this.startTime;
    const progress = Math.min(elapsed / this.spinDuration, 1);

    // Evaluate position directly from the easing curve
    const easeProgress = this.getEaseOutProgress(progress);
    
    if (progress >= 1) {
      this.currentAngle = this.targetAngle;
    } else {
      this.currentAngle = this.startAngle + (this.targetAngle - this.startAngle) * easeProgress;
    }

    // Render frame
    this.onRender(this.currentAngle);

    // Audio tick trigger
    const currentSlice = getCurrentTopSliceIndex(itemsLength, this.currentAngle);
    if (currentSlice !== this.lastSliceIndex && this.isSpinning) {
      playTickSound(this.pointerEl);
      this.lastSliceIndex = currentSlice;
    }

    // Completion check
    if (progress >= 1) {
      this.isSpinning = false; 

      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
      }

      // Normalize final angle so the index calculation is 100% accurate
      const normalizedAngle = ((this.targetAngle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
      this.currentAngle = normalizedAngle;
      this.onRender(this.currentAngle);

      // Determine winner and trigger callback ONCE
      const winningIndex = getCurrentTopSliceIndex(itemsLength, this.currentAngle);
      if (this.onComplete) {
        this.onComplete(winningIndex);
      }
      return;
    }

    this.animationId = requestAnimationFrame(() => this.loop(itemsLength));
  }
}