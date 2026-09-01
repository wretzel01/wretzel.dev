// ambientDots.js - Floating Golden Bokeh Particles (Middle 1/5th Exclusion)

const canvas = document.getElementById('ambient-dots-canvas');
const ctx = canvas ? canvas.getContext('2d') : null;

let width, height, dots = [];
const DOT_COUNT = 200; 

export function resizeAmbientDots() {
  if (!canvas) return;
  width = canvas.width = window.innerWidth * 2;
  height = canvas.height = window.innerHeight * 2;
}

class GlowDot {
  constructor() {
    this.reset(true);
  }

  reset(initial = false) {
    this.size = Math.random() * 18 + 4;
    this.speed = Math.random() * 0.5 + 0.2;
    this.opacity = Math.random() * 0.5 + 0.25;
    this.pulseSpeed = Math.random() * 0.02 + 0.005;
    this.pulseAngle = Math.random() * Math.PI * 2;

    // Exclude the middle 20% (40% - 60% of total width)
    // Spawns in Left 40% (0.0 to 0.4) or Right 40% (0.6 to 1.0)
    const isLeftZone = Math.random() < 0.5;
    if (isLeftZone) {
      this.x = Math.random() * (width * 0.4);
    } else {
      this.x = (width * 0.6) + (Math.random() * (width * 0.4));
    }

    this.y = initial 
      ? Math.random() * height 
      : height + 30;
  }

  update() {
    this.y -= this.speed;
    this.pulseAngle += this.pulseSpeed;

    if (this.y < -30) {
      this.reset();
    }
  }

  draw() {
    if (!ctx) return;
    const currentOpacity = this.opacity + Math.sin(this.pulseAngle) * 0.15;
    
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    
    const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
    grad.addColorStop(0, `rgba(254, 240, 138, ${Math.max(0, currentOpacity)})`);
    grad.addColorStop(0.5, `rgba(212, 163, 115, ${Math.max(0, currentOpacity * 0.5)})`);
    grad.addColorStop(1, 'rgba(212, 163, 115, 0)');

    ctx.fillStyle = grad;
    ctx.fill();
    ctx.restore();
  }
}

export function initAmbientDots() {
  if (!canvas) return;
  resizeAmbientDots();
  dots = Array.from({ length: DOT_COUNT }, () => new GlowDot());
}

export function updateAmbientDots() {
  if (!ctx || !canvas) return;
  
  ctx.clearRect(0, 0, width, height);

  dots.forEach(dot => {
    dot.update();
    dot.draw();
  });
}