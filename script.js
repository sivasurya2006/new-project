
/**
 * QR Code Generator - Script Logic
 * Covers: querySelector, addEventListener, input.value, conditionals, DOM manipulation,
 * Canvas/API generation, LocalStorage History, Themes, Clipboard & PNG Downloads.
 */

// ==========================================
// 1. DOM Elements Selection (querySelector)
// ==========================================
const qrInput = document.querySelector("#qrInput");
const clearInputBtn = document.querySelector("#clearInputBtn");
const charCounter = document.querySelector("#charCounter");
const inputError = document.querySelector("#inputError");

const qrSizeSelect = document.querySelector("#qrSize");
const qrCorrectionSelect = document.querySelector("#qrCorrection");
const qrColorInput = document.querySelector("#qrColor");
const qrColorHex = document.querySelector("#qrColorHex");
const qrBgColorInput = document.querySelector("#qrBgColor");
const qrBgColorHex = document.querySelector("#qrBgColorHex");

const generateBtn = document.querySelector("#generateBtn");
const resetAllBtn = document.querySelector("#resetAllBtn");

const statusBadge = document.querySelector("#statusBadge");
const emptyState = document.querySelector("#emptyState");
const loadingState = document.querySelector("#loadingState");
const qrWrapper = document.querySelector("#qrWrapper");
const qrCanvasContainer = document.querySelector("#qrCanvasContainer");
const qrMeta = document.querySelector("#qrMeta");

const downloadSection = document.querySelector("#downloadSection");
const downloadPngBtn = document.querySelector("#downloadPngBtn");
const copyUrlBtn = document.querySelector("#copyUrlBtn");
const copyImageBtn = document.querySelector("#copyImageBtn");

const themeToggleBtn = document.querySelector("#themeToggleBtn");
const historyToggleBtn = document.querySelector("#historyToggleBtn");
const historyDrawer = document.querySelector("#historyDrawer");
const closeHistoryBtn = document.querySelector("#closeHistoryBtn");
const drawerOverlay = document.querySelector("#drawerOverlay");
const historyList = document.querySelector("#historyList");
const clearHistoryBtn = document.querySelector("#clearHistoryBtn");
const historyCount = document.querySelector("#historyCount");

const toast = document.querySelector("#toast");
const toastMessage = document.querySelector("#toastMessage");

// ==========================================
// 2. State & Storage Constants
// ==========================================
const STORAGE_KEY_HISTORY = "qr_spark_history_v1";
const STORAGE_KEY_THEME = "qr_spark_theme_v1";

let currentQrData = {
  text: "",
  size: 300,
  colorDark: "#0f172a",
  colorLight: "#ffffff",
  correctLevel: "M",
  canvasElement: null,
  imgDataUrl: "",
};

let qrHistory = [];
let toastTimeout = null;

// ==========================================
// 3. Initialization
// ==========================================
function init() {
  loadThemePreference();
  loadHistory();
  attachEventListeners();
  updateCharCount();
}

// ==========================================
// 4. Event Listeners
// ==========================================
function attachEventListeners() {
  // Input real-time events
  qrInput.addEventListener("input", () => {
    updateCharCount();
    clearInputBtn.style.display = qrInput.value.trim().length > 0 ? "block" : "none";
    clearErrorMessage();
  });

  // Enter Key -> Generate QR (Level 2 requirement)
  qrInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleGenerate();
    }
  });

  // Clear Input button
  clearInputBtn.addEventListener("click", () => {
    qrInput.value = "";
    updateCharCount();
    clearInputBtn.style.display = "none";
    qrInput.focus();
    clearErrorMessage();
  });

  // Color Pickers - dynamic hex label updates
  qrColorInput.addEventListener("input", (e) => {
    qrColorHex.textContent = e.target.value;
  });

  qrBgColorInput.addEventListener("input", (e) => {
    qrBgColorHex.textContent = e.target.value;
  });

  // Action Buttons
  generateBtn.addEventListener("click", handleGenerate);
  resetAllBtn.addEventListener("click", handleReset);

  // Download & Copy
  downloadPngBtn.addEventListener("click", handleDownloadPng);
  copyUrlBtn.addEventListener("click", handleCopyUrl);
  copyImageBtn.addEventListener("click", handleCopyImage);

  // Theme Toggle
  themeToggleBtn.addEventListener("click", toggleTheme);

  // History Drawer Controls
  historyToggleBtn.addEventListener("click", openHistoryDrawer);
  closeHistoryBtn.addEventListener("click", closeHistoryDrawer);
  drawerOverlay.addEventListener("click", closeHistoryDrawer);
  clearHistoryBtn.addEventListener("click", handleClearAllHistory);
}

// ==========================================
// 5. Input Validation & Error Handling
// ==========================================
function validateInput(text) {
  if (!text || text.trim() === "") {
    showError("Please enter text or a valid URL.");
    qrInput.classList.add("input-error-shake");
    setTimeout(() => qrInput.classList.remove("input-error-shake"), 400);
    qrInput.focus();
    return false;
  }
  clearErrorMessage();
  return true;
}

function showError(msg) {
  inputError.textContent = msg;
}

function clearErrorMessage() {
  inputError.textContent = "";
}

function updateCharCount() {
  const length = qrInput.value.length;
  charCounter.textContent = `${length} character${length === 1 ? "" : "s"}`;
}

// ==========================================
// 6. QR Code Generation Logic
// ==========================================
async function handleGenerate() {
  const rawText = qrInput.value.trim();

  // Validate
  if (!validateInput(rawText)) {
    return;
  }

  const size = parseInt(qrSizeSelect.value, 10) || 300;
  const colorDark = qrColorInput.value || "#000000";
  const colorLight = qrBgColorInput.value || "#ffffff";
  const correctLevelStr = qrCorrectionSelect.value || "M";

  // Check color contrast warning
  if (colorDark.toLowerCase() === colorLight.toLowerCase()) {
    showError("QR color and background color cannot be the same.");
    return;
  }

  // Show loading state
  showLoading(true);
  statusBadge.textContent = "Generating...";

  try {
    // Artificial slight delay for smooth UX feel
    await new Promise((resolve) => setTimeout(resolve, 250));

    // Clear previous QR canvas/images
    qrCanvasContainer.innerHTML = "";

    // Check if client-side QRCode library is available
    if (typeof QRCode !== "undefined") {
      // Map error correction
      let qrcodeLevel = QRCode.CorrectLevel.M;
      if (correctLevelStr === "L") qrcodeLevel = QRCode.CorrectLevel.L;
      if (correctLevelStr === "Q") qrcodeLevel = QRCode.CorrectLevel.Q;
      if (correctLevelStr === "H") qrcodeLevel = QRCode.CorrectLevel.H;

      // Generate with QRCode.js (draws Canvas & img)
      new QRCode(qrCanvasContainer, {
        text: rawText,
        width: size,
        height: size,
        colorDark: colorDark,
        colorLight: colorLight,
        correctLevel: qrcodeLevel,
      });

      // Wait a tick for canvas rendering
      setTimeout(() => {
        const canvas = qrCanvasContainer.querySelector("canvas");
        const img = qrCanvasContainer.querySelector("img");
        let dataUrl = "";

        if (canvas) {
          dataUrl = canvas.toDataURL("image/png");
        } else if (img && img.src) {
          dataUrl = img.src;
        }

        currentQrData = {
          text: rawText,
          size: size,
          colorDark: colorDark,
          colorLight: colorLight,
          correctLevel: correctLevelStr,
          canvasElement: canvas,
          imgDataUrl: dataUrl,
        };

        finishGeneration(rawText, dataUrl);
      }, 50);
    } else {
      // Fallback: Using QR Code API
      generateViaApi(rawText, size, colorDark, colorLight);
    }
  } catch (err) {
    console.error("QR Generation error:", err);
    showError("Failed to generate QR Code. Trying fallback...");
    generateViaApi(rawText, size, colorDark, colorLight);
  }
}

// Fallback method using QR Code API (https://api.qrserver.com)
function generateViaApi(text, size, colorDark, colorLight) {
  // Strip '#' from hex values for the API
  const fg = colorDark.replace("#", "");
  const bg = colorLight.replace("#", "");
  const encodedText = encodeURIComponent(text);
  const apiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodedText}&color=${fg}&bgcolor=${bg}&format=png`;

  const fallbackImg = new Image();
  fallbackImg.crossOrigin = "anonymous";
  fallbackImg.onload = () => {
    qrCanvasContainer.innerHTML = "";
    qrCanvasContainer.appendChild(fallbackImg);

    // Render to an off-screen canvas to obtain dataUrl for direct download
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(fallbackImg, 0, 0);
    const dataUrl = canvas.toDataURL("image/png");

    currentQrData = {
      text: text,
      size: size,
      colorDark: colorDark,
      colorLight: colorLight,
      correctLevel: "M",
      canvasElement: canvas,
      imgDataUrl: dataUrl,
    };

    finishGeneration(text, dataUrl);
  };
  fallbackImg.onerror = () => {
    showLoading(false);
    showError("Could not load QR code image. Please check your internet connection.");
    statusBadge.textContent = "Error";
  };
  fallbackImg.src = apiUrl;
}

function finishGeneration(text, dataUrl) {
  showLoading(false);
  emptyState.classList.add("hidden");
  qrWrapper.classList.remove("hidden");
  downloadSection.classList.remove("hidden");

  // Metadata Display
  qrMeta.textContent = text.length > 50 ? `${text.substring(0, 50)}...` : text;
  statusBadge.textContent = "Active";

  // Save to history (Level 3 requirement)
  saveToHistory({
    id: Date.now(),
    text: text,
    dataUrl: dataUrl,
    size: currentQrData.size,
    colorDark: currentQrData.colorDark,
    colorLight: currentQrData.colorLight,
    createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  });

  showToast("QR Code generated successfully!");
}

function showLoading(isLoading) {
  if (isLoading) {
    emptyState.classList.add("hidden");
    qrWrapper.classList.add("hidden");
    downloadSection.classList.add("hidden");
    loadingState.classList.remove("hidden");
  } else {
    loadingState.classList.add("hidden");
  }
}

// ==========================================
// 7. Download & Clipboard Functionality
// ==========================================
function handleDownloadPng() {
  if (!currentQrData.imgDataUrl) {
    showError("No QR Code available to download.");
    return;
  }

  try {
    const downloadLink = document.createElement("a");
    const sanitizedFileName = (currentQrData.text.replace(/[^a-zA-Z0-9]/g, "_").slice(0, 20) || "qrcode") + ".png";
    
    downloadLink.href = currentQrData.imgDataUrl;
    downloadLink.download = sanitizedFileName;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    showToast(`Downloaded as ${sanitizedFileName}`);
  } catch (err) {
    console.error("Download failed:", err);
    showError("Failed to download image. Try copying it instead.");
  }
}

async function handleCopyUrl() {
  if (!currentQrData.text) {
    showError("No content to copy.");
    return;
  }

  try {
    await navigator.clipboard.writeText(currentQrData.text);
    showToast("Text copied to clipboard!");
  } catch (err) {
    // Fallback for older browsers
    const textarea = document.createElement("textarea");
    textarea.value = currentQrData.text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    showToast("Text copied to clipboard!");
  }
}

async function handleCopyImage() {
  if (!currentQrData.imgDataUrl) {
    showError("No QR Code available to copy.");
    return;
  }

  try {
    const response = await fetch(currentQrData.imgDataUrl);
    const blob = await response.blob();
    await navigator.clipboard.write([
      new ClipboardItem({ "image/png": blob })
    ]);
    showToast("QR Code image copied to clipboard!");
  } catch (err) {
    console.warn("Clipboard Image API not supported:", err);
    showToast("Direct image copy not supported on this browser.");
  }
}

// ==========================================
// 8. History Management (localStorage)
// ==========================================
function loadHistory() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_HISTORY);
    if (saved) {
      qrHistory = JSON.parse(saved);
    }
  } catch (e) {
    qrHistory = [];
  }
  renderHistoryList();
}

function saveToHistory(item) {
  // Prevent duplicate consecutive entries
  if (qrHistory.length > 0 && qrHistory[0].text === item.text) {
    return;
  }

  // Keep up to 15 items
  qrHistory.unshift(item);
  if (qrHistory.length > 15) {
    qrHistory.pop();
  }

  try {
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(qrHistory));
  } catch (e) {
    console.warn("LocalStorage quota exceeded, trimming history", e);
    qrHistory = qrHistory.slice(0, 5);
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(qrHistory));
  }

  renderHistoryList();
}

function renderHistoryList() {
  historyCount.textContent = qrHistory.length;

  if (qrHistory.length === 0) {
    historyList.innerHTML = `
      <div class="history-empty">
        <i class="fa-regular fa-folder-open"></i>
        <p>No recent QR codes saved yet.</p>
      </div>
    `;
    return;
  }

  historyList.innerHTML = "";

  qrHistory.forEach((item) => {
    const card = document.createElement("div");
    card.className = "history-card";
    card.title = "Click to reload this QR Code";

    card.innerHTML = `
      <div class="history-thumb">
        <img src="${item.dataUrl}" alt="QR Thumbnail" />
      </div>
      <div class="history-info">
        <div class="history-text">${escapeHtml(item.text)}</div>
        <div class="history-time"><i class="fa-regular fa-clock"></i> ${item.createdAt || "Just now"} • ${item.size}px</div>
      </div>
      <button class="history-delete-btn" title="Delete from history" data-id="${item.id}">
        <i class="fa-regular fa-trash-can"></i>
      </button>
    `;

    // Click card to reload into inputs
    card.addEventListener("click", (e) => {
      if (e.target.closest(".history-delete-btn")) return;
      loadHistoryItem(item);
    });

    // Delete single item
    const deleteBtn = card.querySelector(".history-delete-btn");
    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      deleteHistoryItem(item.id);
    });

    historyList.appendChild(card);
  });
}

function loadHistoryItem(item) {
  qrInput.value = item.text;
  updateCharCount();
  clearInputBtn.style.display = "block";

  if (item.size) qrSizeSelect.value = item.size;
  if (item.colorDark) {
    qrColorInput.value = item.colorDark;
    qrColorHex.textContent = item.colorDark;
  }
  if (item.colorLight) {
    qrBgColorInput.value = item.colorLight;
    qrBgColorHex.textContent = item.colorLight;
  }

  closeHistoryDrawer();
  handleGenerate();
}

function deleteHistoryItem(id) {
  qrHistory = qrHistory.filter((item) => item.id !== id);
  localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(qrHistory));
  renderHistoryList();
  showToast("Item removed from history");
}

function handleClearAllHistory() {
  if (qrHistory.length === 0) return;
  qrHistory = [];
  localStorage.removeItem(STORAGE_KEY_HISTORY);
  renderHistoryList();
  showToast("All history cleared");
}

function openHistoryDrawer() {
  historyDrawer.classList.add("open");
  drawerOverlay.classList.add("active");
}

function closeHistoryDrawer() {
  historyDrawer.classList.remove("open");
  drawerOverlay.classList.remove("active");
}

// ==========================================
// 9. Reset & Theme Logic
// ==========================================
function handleReset() {
  qrInput.value = "";
  updateCharCount();
  clearInputBtn.style.display = "none";
  clearErrorMessage();

  qrSizeSelect.value = "300";
  qrCorrectionSelect.value = "M";
  qrColorInput.value = "#0f172a";
  qrColorHex.textContent = "#0f172a";
  qrBgColorInput.value = "#ffffff";
  qrBgColorHex.textContent = "#ffffff";

  qrCanvasContainer.innerHTML = "";
  qrWrapper.classList.add("hidden");
  downloadSection.classList.add("hidden");
  emptyState.classList.remove("hidden");
  statusBadge.textContent = "Ready";

  currentQrData = {
    text: "",
    size: 300,
    colorDark: "#0f172a",
    colorLight: "#ffffff",
    correctLevel: "M",
    canvasElement: null,
    imgDataUrl: "",
  };

  showToast("Reset to default settings");
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem(STORAGE_KEY_THEME, newTheme);
}

function loadThemePreference() {
  const savedTheme = localStorage.getItem(STORAGE_KEY_THEME) || "dark";
  document.documentElement.setAttribute("data-theme", savedTheme);
}

// ==========================================
// 10. Utility Helpers
// ==========================================
function showToast(message) {
  toastMessage.textContent = message;
  toast.classList.remove("hidden");

  if (toastTimeout) {
    clearTimeout(toastTimeout);
  }

  toastTimeout = setTimeout(() => {
    toast.classList.add("hidden");
  }, 2800);
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// Start application
document.addEventListener("DOMContentLoaded", init);
