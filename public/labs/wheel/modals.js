// modals.js
import { PALETTE } from './ui.js';

/**
 * Modal Controller for Adding Items (Single or Bulk)
 */
export function setupAddModal(onAddItem) {
  const modalOverlay = document.getElementById("modal-overlay");
  const openBtn = document.getElementById("add-modal-btn");
  const cancelBtn = document.getElementById("modal-cancel-btn");
  const confirmBtn = document.getElementById("modal-confirm-btn");
  
  const singleInput = document.getElementById("modal-item-input");
  const bulkInput = document.getElementById("modal-bulk-input");
  
  const singleTab = document.getElementById("tab-single-btn");
  const bulkTab = document.getElementById("tab-bulk-btn");
  const singleContent = document.getElementById("tab-single-content");
  const bulkContent = document.getElementById("tab-bulk-content");

  let currentTab = "single";

  // Tab switching
  singleTab.addEventListener("click", () => {
    currentTab = "single";
    singleTab.classList.add("active");
    bulkTab.classList.remove("active");
    singleContent.classList.remove("hidden");
    bulkContent.classList.add("hidden");
    singleInput.focus();
  });

  bulkTab.addEventListener("click", () => {
    currentTab = "bulk";
    bulkTab.classList.add("active");
    singleTab.classList.remove("active");
    bulkContent.classList.remove("hidden");
    singleContent.classList.add("hidden");
    bulkInput.focus();
  });

  const openModal = () => {
    modalOverlay.classList.remove("hidden");
    singleInput.value = "";
    bulkInput.value = "";
    setTimeout(() => singleInput.focus(), 50);
  };

  const closeModal = () => {
    modalOverlay.classList.add("hidden");
  };

  const submitItem = () => {
    if (currentTab === "single") {
      const val = singleInput.value.trim();
      if (val) {
        onAddItem(val);
        closeModal();
      }
    } else {
      const rawText = bulkInput.value;
      const parsedItems = rawText
        .split(/[\n,]+/)
        .map(item => item.trim())
        .filter(item => item.length > 0);

      if (parsedItems.length > 0) {
        onAddItem(parsedItems);
        closeModal();
      }
    }
  };

  openBtn.addEventListener("click", openModal);
  cancelBtn.addEventListener("click", closeModal);
  confirmBtn.addEventListener("click", submitItem);

  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  singleInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") submitItem();
    if (e.key === "Escape") closeModal();
  });
}

/**
 * Modal Controller for Editing/Deleting an Existing Slice
 */
export function setupSliceModal({ onSave, onDelete }) {
  const modalOverlay = document.getElementById("slice-modal-overlay");
  const titleEl = document.getElementById("slice-modal-title");
  const nameInput = document.getElementById("slice-name-input");
  const swatchesContainer = document.getElementById("color-swatches");
  const deleteBtn = document.getElementById("slice-delete-btn");
  const cancelBtn = document.getElementById("slice-cancel-btn");
  const saveBtn = document.getElementById("slice-save-btn");

  let activeIndex = null;
  let selectedColor = PALETTE[0];

  // Render swatches dynamically using PALETTE
  swatchesContainer.innerHTML = PALETTE.map(color => `
    <button type="button" class="swatch" data-color="${color}" style="background:${color}"></button>
  `).join('');

  swatchesContainer.addEventListener("click", (e) => {
    const swatch = e.target.closest(".swatch");
    if (!swatch) return;

    swatchesContainer.querySelectorAll(".swatch").forEach(s => s.classList.remove("selected"));
    swatch.classList.add("selected");
    selectedColor = swatch.dataset.color;
  });

  const closeModal = () => {
    modalOverlay.classList.add("hidden");
    activeIndex = null;
  };

  saveBtn.addEventListener("click", () => {
    if (activeIndex === null) return;
    const newName = nameInput.value.trim();
    if (newName) {
      onSave(activeIndex, newName, selectedColor);
      closeModal();
    }
  });

  deleteBtn.addEventListener("click", () => {
    if (activeIndex === null) return;
    onDelete(activeIndex);
    closeModal();
  });

  cancelBtn.addEventListener("click", closeModal);

  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  return function openSliceModal(index, itemData) {
    activeIndex = index;
    const itemText = typeof itemData === "string" ? itemData : itemData.text;

    // Sets dynamic title to the actual content label (e.g., Edit Slice "Three")
    titleEl.textContent = `Edit Slice "${itemText}"`;
    
    nameInput.value = itemText;
    
    const fallbackColor = PALETTE[index % PALETTE.length];
    selectedColor = (typeof itemData === "object" && itemData.color) ? itemData.color : fallbackColor;

    const swatches = swatchesContainer.querySelectorAll(".swatch");
    let matchFound = false;

    swatches.forEach(swatch => {
      if (swatch.dataset.color.toLowerCase() === selectedColor.toLowerCase()) {
        swatch.classList.add("selected");
        matchFound = true;
      } else {
        swatch.classList.remove("selected");
      }
    });

    if (!matchFound && swatches.length > 0) {
      swatches[0].classList.add("selected");
      selectedColor = swatches[0].dataset.color;
    }
    
    modalOverlay.classList.remove("hidden");
    setTimeout(() => nameInput.focus(), 50);
  };
}