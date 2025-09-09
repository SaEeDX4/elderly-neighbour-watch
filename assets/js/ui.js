// ui.js - UI helpers and interactive components

// Toast notification system
let toastContainer = null;

function createToastContainer() {
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.id = "toast-container";
    toastContainer.setAttribute("aria-live", "polite");
    toastContainer.setAttribute("aria-atomic", "true");
    toastContainer.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      max-width: 350px;
    `;
    document.body.appendChild(toastContainer);
  }
  return toastContainer;
}

function showToast(message, type = "info", duration = 4000) {
  const container = createToastContainer();

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.setAttribute("role", "alert");
  toast.setAttribute("aria-live", "assertive");

  // Set colors based on type
  const colors = {
    success: { bg: "#10b981", border: "#059669" },
    error: { bg: "#ef4444", border: "#dc2626" },
    warning: { bg: "#f59e0b", border: "#d97706" },
    info: { bg: "#3b82f6", border: "#2563eb" },
  };

  const color = colors[type] || colors.info;

  toast.style.cssText = `
    padding: 16px 20px;
    margin-bottom: 12px;
    background-color: ${color.bg};
    color: white;
    border-radius: 8px;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    border-left: 4px solid ${color.border};
    font-size: 14px;
    line-height: 1.5;
    transform: translateX(100%);
    opacity: 0;
    transition: all 0.3s ease-in-out;
    cursor: pointer;
  `;

  toast.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
      <span>${message}</span>
      <button style="
        background: none;
        border: none;
        color: white;
        font-size: 18px;
        cursor: pointer;
        margin-left: 12px;
        opacity: 0.8;
        padding: 0;
        line-height: 1;
      " aria-label="Close notification">&times;</button>
    </div>
  `;

  container.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.style.transform = "translateX(0)";
    toast.style.opacity = "1";
  });

  // Remove toast function
  function removeToast() {
    toast.style.transform = "translateX(100%)";
    toast.style.opacity = "0";
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }

  // Auto-remove after duration
  const autoRemove = setTimeout(removeToast, duration);

  // Manual close handlers
  const closeBtn = toast.querySelector("button");
  closeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    clearTimeout(autoRemove);
    removeToast();
  });

  toast.addEventListener("click", () => {
    clearTimeout(autoRemove);
    removeToast();
  });

  return toast;
}

// Modal
