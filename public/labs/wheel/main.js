// main.js
import { drawWheel } from './wheel.js';
import { SpinEngine } from './spinEngine.js';
import { playWinSound } from './audio.js';
import { PALETTE, showWinnerModal } from './ui.js';
import { setupAddModal, setupSliceModal } from './modals.js';
import { initAmbientDots, updateAmbientDots, resizeAmbientDots } from './ambientDots.js';

const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const pointer = document.getElementById("pointer");
const spinBtn = document.getElementById("spin-btn");
const addModalBtn = document.getElementById("add-modal-btn"); // Selected "+ Add Slice" button

// Default items using PALETTE in sequential order
let items = [
  { text: "One", color: PALETTE[0] },
  { text: "Two", color: PALETTE[1] },
  { text: "Three", color: PALETTE[2] },
  { text: "Four", color: PALETTE[3] }
];
let selectedIndex = null;

const engine = new SpinEngine(
  pointer,
  (angle) => drawWheel(canvas, ctx, items, angle, engine.isSpinning),
  (winningIndex) => {
    // 1. Reset state & pointer styles
    engine.isSpinning = false; 
    pointer.classList.remove("spinning");

    selectedIndex = winningIndex;
    const winnerName = typeof items[winningIndex] === "string" ? items[winningIndex] : items[winningIndex].text;

    // 2. Refresh UI to re-enable both the SPIN and ADD SLICE buttons
    updateUI();

    // 3. Trigger celebration sounds & modal
    playWinSound();
    if (typeof confetti === "function") {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    }

    showWinnerModal(winnerName);
  }
);

// Dynamic Canvas Rescaling for High-DPI & Responsive Layouts
function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;

  // Set high-DPI internal buffer dimensions
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;

  // Scale context so drawing coordinates remain 1:1 with canvas pixel calculations
  ctx.resetTransform();
  ctx.scale(dpr, dpr);

  resizeAmbientDots();
  updateUI();
}

window.addEventListener("resize", resizeCanvas);

// Continuous render loop so carnival lights & ambient dots animate continuously
function startRenderLoop() {
  function render() {
    updateAmbientDots();

    // Draw the wheel every frame so idle light animations run continuously
    if (!engine.isSpinning) {
      drawWheel(canvas, ctx, items, engine.currentAngle, false);
    }
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

// Redraws the wheel and updates interactive UI states
function updateUI() {
  // Update Spin Button state based on slice availability & spinning state
  if (spinBtn) {
    if (items.length === 0 || engine.isSpinning) {
      spinBtn.disabled = true;
      spinBtn.style.opacity = '0.5';
      spinBtn.style.cursor = 'not-allowed';
    } else {
      spinBtn.disabled = false;
      spinBtn.style.opacity = '1';
      spinBtn.style.cursor = 'pointer';
    }
  }

  // Disable/Enable "+ Add Slice" Button while spinning
  if (addModalBtn) {
    if (engine.isSpinning) {
      addModalBtn.disabled = true;
      addModalBtn.style.opacity = '0.5';
      addModalBtn.style.cursor = 'not-allowed';
      addModalBtn.style.pointerEvents = 'none';
    } else {
      addModalBtn.disabled = false;
      addModalBtn.style.opacity = '1';
      addModalBtn.style.cursor = 'pointer';
      addModalBtn.style.pointerEvents = 'auto';
    }
  }

  drawWheel(canvas, ctx, items, engine.currentAngle, engine.isSpinning);
}

function addItem(val) {
  if (!val || engine.isSpinning) return; // Guard against adding while spinning

  if (Array.isArray(val)) {
    val.forEach(text => {
      const nextColor = PALETTE[items.length % PALETTE.length];
      items.push({ text, color: nextColor });
    });
  } else {
    const nextColor = PALETTE[items.length % PALETTE.length];
    items.push({ text: val, color: nextColor });
  }

  if (!engine.isSpinning) updateUI();
}

function removeItem(index) {
  if (engine.isSpinning) return;
  items.splice(index, 1);
  if (selectedIndex === index) selectedIndex = null;
  else if (selectedIndex > index) selectedIndex--;
  updateUI();
}

const openSliceModal = setupSliceModal({
  onSave: (index, newName, newColor) => {
    items[index] = { text: newName, color: newColor };
    updateUI();
  },
  onDelete: (index) => {
    removeItem(index);
  }
});

// Click detection using bounding rectangle width instead of canvas buffer width
canvas.addEventListener("click", (e) => {
  if (engine.isSpinning || items.length === 0) return;

  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left - rect.width / 2;
  const y = e.clientY - rect.top - rect.height / 2;

  if (Math.sqrt(x * x + y * y) > (rect.width / 2) - 18) return;

  let clickAngle = Math.atan2(y, x);
  let relativeAngle = (clickAngle - engine.currentAngle) % (2 * Math.PI);
  if (relativeAngle < 0) relativeAngle += 2 * Math.PI;

  const sliceAngle = (2 * Math.PI) / items.length;
  const clickedIndex = Math.floor(relativeAngle / sliceAngle);

  openSliceModal(clickedIndex, items[clickedIndex]);
});

setupAddModal((newItemText) => addItem(newItemText));

if (spinBtn) {
  spinBtn.onclick = () => {
    if (engine.isSpinning || items.length === 0) return;
    selectedIndex = null;
    
    pointer.classList.add("spinning");
    engine.start(items.length);
    updateUI(); // Immediately disables both Spin and Add Slice buttons
  };
}

// Initialize canvas dimensions & start continuous render loop
initAmbientDots();
resizeCanvas();
startRenderLoop();