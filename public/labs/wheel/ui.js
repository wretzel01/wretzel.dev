// ui.js

// Unified color palette accessible across the app
export const PALETTE = [
  "#ef4444", // Red
  "#3b82f6", // Blue
  "#10b981", // Green
  "#f59e0b", // Amber
  "#8b5cf6", // Purple
  "#ec4899", // Pink
  "#06b6d4", // Cyan
  "#f97316"  // Orange
];

/**
 * Winner Modal Controller
 */
export function showWinnerModal(winnerName) {
  const modalOverlay = document.getElementById("winner-modal-overlay");
  const nameDisplay = document.getElementById("winner-name-display");
  const closeBtn = document.getElementById("winner-close-btn");

  nameDisplay.textContent = winnerName;
  modalOverlay.classList.remove("hidden");

  const closeModal = () => {
    modalOverlay.classList.add("hidden");
    closeBtn.removeEventListener("click", closeModal);
    modalOverlay.removeEventListener("click", overlayClick);
  };

  const overlayClick = (e) => {
    if (e.target === modalOverlay) closeModal();
  };

  closeBtn.addEventListener("click", closeModal);
  modalOverlay.addEventListener("click", overlayClick);
}