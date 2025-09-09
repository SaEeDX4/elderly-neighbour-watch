// admin.js - Admin dashboard functionality

let currentData = {
  seniors: [],
  volunteers: [],
  messages: [],
};

let currentFilters = {
  search: "",
  neighborhood: "",
  assistance: "",
  skills: "",
  subject: "",
};

function initializeAdmin() {
  loadData();
  setupEventListeners();
  initializeTabs();
  updateStats();
}

function loadData() {
  try {
    currentData.seniors = window.ENWStorage.getArray(
      window.ENWStorage.STORAGE_KEYS.SENIOR_REQUESTS
    );
    currentData.volunteers = window.ENWStorage.getArray(
      window.ENWStorage.STORAGE_KEYS.VOLUNTEERS
    );
    currentData.messages = window.ENWStorage.getArray(
      window.ENWStorage.STORAGE_KEYS.MESSAGES
    );

    renderAllTables();
  } catch (error) {
    console.error("Error loading admin data:", error);
    showToast("Error loading data. Please refresh the page.", "error");
  }
}

function setupEventListeners() {
  // Search input
  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.addEventListener("input", debounce(handleSearch, 300));
  }

  // Neighborhood filter
  const neighborhoodFilter = document.getElementById("neighborhood-filter");
  if (neighborhoodFilter) {
    neighborhoodFilter.addEventListener("change", handleNeighborhoodFilter);
  }

  // Assistance type filter
  const assistanceFilter = document.getElementById("assistance-filter");
  if (assistanceFilter) {
    assistanceFilter.addEventListener("change", handleAssistanceFilter);
  }

  // Skills filter
  const skillsFilter = document.getElementById("skills-filter");
  if (skillsFilter) {
    skillsFilter.addEventListener("change", handleSkillsFilter);
  }

  // Subject filter
  const subjectFilter = document.getElementById("subject-filter");
  if (subjectFilter) {
    subjectFilter.addEventListener("change", handleSubjectFilter);
  }
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function initializeTabs() {
  const tabButtons = document.querySelectorAll(".tab-btn");

  tabButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const tabName = this.dataset.tab;
      switchTab(tabName);
    });
  });
}

function switchTab(tabName) {
  // Update active tab button
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.tab === tabName);
  });

  // Show/hide tab content
  document.querySelectorAll(".tab-content").forEach((content) => {
    content.classList.toggle("active", content.id === `${tabName}-tab`);
  });

  // Update URL hash
  window.location.hash = tabName;
}

function updateStats() {
  const stats = window.ENWStorage.getStorageStats();

  document.getElementById("total-seniors").textContent = stats.seniors;
  document.getElementById("total-volunteers").textContent = stats.volunteers;
  document.getElementById("total-messages").textContent = stats.messages;
}

function handleSearch(event) {
  currentFilters.search = event.target.value.toLowerCase().trim();
  renderAllTables();
}

function handleNeighborhoodFilter(event) {
  currentFilters.neighborhood = event.target.value;
  renderAllTables();
}

function handleAssistanceFilter(event) {
  currentFilters.assistance = event.target.value;
  renderSeniorsTable();
}

function handleSkillsFilter(event) {
  currentFilters.skills = event.target.value;
  renderVolunteersTable();
}

function handleSubjectFilter(event) {
  currentFilters.subject = event.target.value;
  renderMessagesTable();
}

function clearSearch() {
  document.getElementById("search-input").value = "";
  currentFilters.search = "";
  renderAllTables();
}

function renderAllTables() {
  renderSeniorsTable();
  renderVolunteersTable();
  renderMessagesTable();
}

function renderSeniorsTable() {
  const tableBody = document.querySelector("#seniors-table tbody");
  if (!tableBody) return;

  let filteredData = currentData.seniors;

  // Apply filters
  if (currentFilters.search) {
    filteredData = filteredData.filter(
      (senior) =>
        senior.name.toLowerCase().includes(currentFilters.search) ||
        senior.contact.toLowerCase().includes(currentFilters.search)
    );
  }

  if (currentFilters.neighborhood) {
    filteredData = filteredData.filter((senior) =>
      senior.address
        .toLowerCase()
        .includes(currentFilters.neighborhood.toLowerCase())
    );
  }

  if (currentFilters.assistance) {
    filteredData = filteredData.filter(
      (senior) => senior.type && senior.type.includes(currentFilters.assistance)
    );
  }

  // Clear table
  tableBody.innerHTML = "";

  if (filteredData.length === 0) {
    const row = tableBody.insertRow();
    const cell = row.insertCell();
    cell.colSpan = 7;
    cell.textContent = "No senior requests found matching your criteria.";
    cell.style.textAlign = "center";
    cell.style.padding = "var(--spacing-xl)";
    cell.style.color = "var(--color-text-light)";
    return;
  }

  filteredData.forEach((senior) => {
    const row = tableBody.insertRow();

    row.insertCell().textContent = senior.name || "";
    row.insertCell().textContent = senior.contact || "";
    row.insertCell().textContent = senior.address || "";
    row.insertCell().textContent = Array.isArray(senior.type)
      ? senior.type.join(", ")
      : senior.type || "";
    row.insertCell().textContent = senior.time || "";
    row.insertCell().textContent = formatDate(senior.createdAt);

    const notesCell = row.insertCell();
    notesCell.textContent = senior.notes || "";
    notesCell.style.maxWidth = "200px";
    notesCell.style.wordWrap = "break-word";

    // Add hover effect for better readability
    row.style.cursor = "pointer";
    row.title = "Click for details";
    row.addEventListener("click", () =>
      showItemDetails("Senior Request", senior)
    );
  });
}

function renderVolunteersTable() {
  const tableBody = document.querySelector("#volunteers-table tbody");
  if (!tableBody) return;

  let filteredData = currentData.volunteers;

  // Apply filters
  if (currentFilters.search) {
    filteredData = filteredData.filter(
      (volunteer) =>
        volunteer.name.toLowerCase().includes(currentFilters.search) ||
        volunteer.contact.toLowerCase().includes(currentFilters.search)
    );
  }

  if (currentFilters.neighborhood) {
    filteredData = filteredData.filter((volunteer) =>
      volunteer.neighborhood
        .toLowerCase()
        .includes(currentFilters.neighborhood.toLowerCase())
    );
  }

  if (currentFilters.skills) {
    filteredData = filteredData.filter(
      (volunteer) =>
        volunteer.skills && volunteer.skills.includes(currentFilters.skills)
    );
  }

  // Clear table
  tableBody.innerHTML = "";

  if (filteredData.length === 0) {
    const row = tableBody.insertRow();
    const cell = row.insertCell();
    cell.colSpan = 6;
    cell.textContent = "No volunteers found matching your criteria.";
    cell.style.textAlign = "center";
    cell.style.padding = "var(--spacing-xl)";
    cell.style.color = "var(--color-text-light)";
    return;
  }

  filteredData.forEach((volunteer) => {
    const row = tableBody.insertRow();

    row.insertCell().textContent = volunteer.name || "";

    const contactCell = row.insertCell();
    contactCell.innerHTML = `${volunteer.email || ""}<br><small>${
      volunteer.phone || ""
    }</small>`;

    row.insertCell().textContent = volunteer.neighborhood || "";
    row.insertCell().textContent = Array.isArray(volunteer.skills)
      ? volunteer.skills.join(", ")
      : volunteer.skills || "";
    row.insertCell().textContent = Array.isArray(volunteer.availability)
      ? volunteer.availability.join(", ")
      : volunteer.availability || "";
    row.insertCell().textContent = formatDate(volunteer.createdAt);

    // Add hover effect
    row.style.cursor = "pointer";
    row.title = "Click for details";
    row.addEventListener("click", () =>
      showItemDetails("Volunteer", volunteer)
    );
  });
}

function renderMessagesTable() {
  const tableBody = document.querySelector("#messages-table tbody");
  if (!tableBody) return;

  let filteredData = currentData.messages;

  // Apply filters
  if (currentFilters.search) {
    filteredData = filteredData.filter(
      (message) =>
        message.name.toLowerCase().includes(currentFilters.search) ||
        message.email.toLowerCase().includes(currentFilters.search)
    );
  }

  if (currentFilters.subject) {
    filteredData = filteredData.filter(
      (message) => message.subject === currentFilters.subject
    );
  }

  // Clear table
  tableBody.innerHTML = "";

  if (filteredData.length === 0) {
    const row = tableBody.insertRow();
    const cell = row.insertCell();
    cell.colSpan = 6;
    cell.textContent = "No messages found matching your criteria.";
    cell.style.textAlign = "center";
    cell.style.padding = "var(--spacing-xl)";
    cell.style.color = "var(--color-text-light)";
    return;
  }

  filteredData.forEach((message) => {
    const row = tableBody.insertRow();

    row.insertCell().textContent = message.name || "";
    row.insertCell().textContent = message.email || "";
    row.insertCell().textContent = message.subject || "";

    const messageCell = row.insertCell();
    const truncatedMessage =
      message.message.length > 100
        ? message.message.substring(0, 100) + "..."
        : message.message;
    messageCell.textContent = truncatedMessage;
    messageCell.style.maxWidth = "300px";
    messageCell.style.wordWrap = "break-word";

    row.insertCell().textContent = message.responseMethod || "email";
    row.insertCell().textContent = formatDate(message.createdAt);

    // Add hover effect
    row.style.cursor = "pointer";
    row.title = "Click for details";
    row.addEventListener("click", () => showItemDetails("Message", message));
  });
}

function formatDate(dateString) {
  if (!dateString) return "";

  try {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  } catch (error) {
    return dateString;
  }
}

function showItemDetails(type, item) {
  let details = `<strong>${type} Details</strong><br><br>`;

  for (const [key, value] of Object.entries(item)) {
    if (key === "id" || key === "consent") continue;

    const label =
      key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1");
    let displayValue = value;

    if (Array.isArray(value)) {
      displayValue = value.join(", ");
    } else if (key === "createdAt") {
      displayValue = formatDate(value);
    }

    details += `<strong>${label}:</strong> ${displayValue || "N/A"}<br>`;
  }

  showModal("Item Details", details);
}

function showModal(title, content) {
  // Create modal if it doesn't exist
  let modal = document.getElementById("item-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "item-modal";
    modal.className = "modal";
    modal.innerHTML = `
      <div class="modal-content">
        <h3 id="modal-title"></h3>
        <div id="modal-body"></div>
        <div class="modal-actions">
          <button type="button" class="btn btn-outline" onclick="closeModal('item-modal')">Close</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  document.getElementById("modal-title").textContent = title;
  document.getElementById("modal-body").innerHTML = content;
  modal.style.display = "flex";

  // Focus management
  modal.querySelector(".btn").focus();

  // Close on escape key
  const escapeHandler = (e) => {
    if (e.key === "Escape") {
      closeModal("item-modal");
      document.removeEventListener("keydown", escapeHandler);
    }
  };
  document.addEventListener("keydown", escapeHandler);

  // Close on backdrop click
  modal.addEventListener("click", function (e) {
    if (e.target === modal) {
      closeModal("item-modal");
    }
  });
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = "none";
  }
}

function exportData() {
  try {
    const data = window.ENWStorage.exportAllData();
    if (!data) {
      showToast("Error exporting data", "error");
      return;
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    const timestamp = new Date().toISOString().split("T")[0];
    a.href = url;
    a.download = `enw-data-export-${timestamp}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast("Data exported successfully", "success");
  } catch (error) {
    console.error("Error exporting data:", error);
    showToast("Error exporting data", "error");
  }
}

function resetDemoData() {
  showModal(
    "Reset Demo Data",
    "<p>This will clear all current data and restore the original demo data. This action cannot be undone.</p><p>Are you sure you want to continue?</p>"
  );

  // Replace the close button with confirm/cancel
  const modalActions = document.querySelector("#item-modal .modal-actions");
  modalActions.innerHTML = `
    <button type="button" class="btn btn-primary" onclick="confirmResetData()">Reset Data</button>
    <button type="button" class="btn btn-outline" onclick="closeModal('item-modal')">Cancel</button>
  `;
}

function confirmResetData() {
  try {
    const success = window.ENWStorage.resetToDemo();

    if (success) {
      loadData();
      updateStats();
      showToast("Demo data restored successfully", "success");
    } else {
      showToast("Error restoring demo data", "error");
    }
  } catch (error) {
    console.error("Error resetting demo data:", error);
    showToast("Error restoring demo data", "error");
  }

  closeModal("item-modal");
}

function showToast(message, type = "info") {
  // Create toast container if it doesn't exist
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.style.position = "fixed";
    container.style.top = "20px";
    container.style.right = "20px";
    container.style.zIndex = "9999";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.style.padding = "var(--spacing-md)";
  toast.style.marginBottom = "var(--spacing-sm)";
  toast.style.backgroundColor =
    type === "success"
      ? "var(--color-success)"
      : type === "error"
      ? "var(--color-error)"
      : "var(--color-primary)";
  toast.style.color = "white";
  toast.style.borderRadius = "var(--border-radius-md)";
  toast.style.boxShadow = "var(--shadow-lg)";
  toast.style.maxWidth = "300px";
  toast.textContent = message;

  container.appendChild(toast);

  // Auto-remove after 3 seconds
  setTimeout(() => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  }, 3000);
}

// Initialize tab from URL hash
document.addEventListener("DOMContentLoaded", function () {
  const hash = window.location.hash.substring(1);
  if (hash && ["seniors", "volunteers", "messages"].includes(hash)) {
    switchTab(hash);
  }
});

// Export functions for global use
if (typeof window !== "undefined") {
  window.initializeAdmin = initializeAdmin;
  window.exportData = exportData;
  window.resetDemoData = resetDemoData;
  window.confirmResetData = confirmResetData;
  window.clearSearch = clearSearch;
  window.closeModal = closeModal;
}
