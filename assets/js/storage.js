// storage.js - localStorage helpers with error handling and demo data

// Storage keys
const STORAGE_KEYS = {
  SENIOR_REQUESTS: "enw_senior_requests",
  VOLUNTEERS: "enw_volunteers",
  MESSAGES: "enw_messages",
};

// Demo data for initialization
const DEMO_DATA = {
  senior_requests: [
    {
      id: "sr_001",
      name: "Anna Petraitis",
      contact: "anna@example.com",
      address: "Old Town, Vilnius",
      time: "Tuesdays 10:00-12:00",
      type: ["Grocery Delivery"],
      notes: "Prefers morning deliveries, lives on 3rd floor",
      createdAt: "2025-09-09T10:00:00Z",
      consent: true,
    },
    {
      id: "sr_002",
      name: "Petras Kazlauskas",
      contact: "(555) 234-5678",
      address: "Antakalnis",
      time: "Weekday afternoons",
      type: ["Companionship", "Technology Help"],
      notes: "Would like help with smartphone and computer. Enjoys chess.",
      createdAt: "2025-09-08T14:30:00Z",
      consent: true,
    },
    {
      id: "sr_003",
      name: "Marija Jankauskas",
      contact: "marija.j@email.lt",
      address: "Žirmūnai",
      time: "Flexible schedule",
      type: ["Transportation", "Medication Pickup"],
      notes: "Needs rides to medical appointments, has mobility issues",
      createdAt: "2025-09-07T09:15:00Z",
      consent: true,
    },
  ],

  volunteers: [
    {
      id: "vol_001",
      name: "Jonas Petrauskas",
      contact: "jonas@example.com",
      phone: "(555) 345-6789",
      neighborhood: "Antakalnis",
      skills: ["Companionship", "Light Household Tasks"],
      availability: ["Weekends", "Weekday Evenings"],
      experience: "Former teacher, comfortable with elderly care",
      motivation: "Want to help my community and honor my late grandmother",
      createdAt: "2025-09-09T10:05:00Z",
      consent: true,
    },
    {
      id: "vol_002",
      name: "Rūta Milašienė",
      contact: "ruta.m@gmail.com",
      phone: "(555) 456-7890",
      neighborhood: "Old Town",
      skills: ["Grocery Shopping", "Medication Pickup", "Transportation"],
      availability: ["Weekday Mornings", "Weekend Afternoons"],
      experience: "Healthcare background, own car",
      motivation: "Retired nurse wanting to continue helping others",
      createdAt: "2025-09-08T16:20:00Z",
      consent: true,
    },
    {
      id: "vol_003",
      name: "Tomas Laurinavičius",
      contact: "tomas.l@outlook.com",
      phone: "(555) 567-8901",
      neighborhood: "Žirmūnai",
      skills: ["Technology Help", "Companionship", "Transportation"],
      availability: ["Weekend Mornings", "Weekday Evenings"],
      experience: "IT professional, patient with technology teaching",
      motivation: "Bridge generational gap through technology",
      createdAt: "2025-09-06T11:45:00Z",
      consent: true,
    },
  ],

  messages: [
    {
      id: "msg_001",
      name: "Elena Vasiliauskas",
      email: "elena.v@email.lt",
      phone: "(555) 678-9012",
      subject: "General Inquiry",
      message:
        "I heard about ENW from my neighbor and would like to learn more about your services for my elderly mother.",
      responseMethod: "email",
      createdAt: "2025-09-09T08:30:00Z",
      consent: true,
    },
    {
      id: "msg_002",
      name: "Dr. Aurelija Mockus",
      email: "a.mockus@hospital.lt",
      subject: "Partnership",
      message:
        "I work at a local medical center and am interested in establishing a partnership to refer patients to your volunteer network.",
      responseMethod: "phone",
      createdAt: "2025-09-08T13:15:00Z",
      consent: true,
    },
  ],
};

// Safe localStorage operations with error handling
function getArray(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error reading from localStorage:", error);
    return [];
  }
}

function saveArray(key, array) {
  try {
    localStorage.setItem(key, JSON.stringify(array));
    return true;
  } catch (error) {
    console.error("Error saving to localStorage:", error);
    return false;
  }
}

function appendItem(key, item) {
  try {
    const array = getArray(key);

    // Generate ID if not provided
    if (!item.id) {
      const prefix = key.includes("senior")
        ? "sr_"
        : key.includes("volunteer")
        ? "vol_"
        : "msg_";
      const timestamp = Date.now().toString().slice(-6);
      item.id = prefix + timestamp;
    }

    // Add timestamp if not provided
    if (!item.createdAt) {
      item.createdAt = new Date().toISOString();
    }

    array.push(item);
    return saveArray(key, array) ? item : null;
  } catch (error) {
    console.error("Error appending to localStorage:", error);
    return null;
  }
}

function removeItem(key, id) {
  try {
    const array = getArray(key);
    const filteredArray = array.filter((item) => item.id !== id);
    return saveArray(key, filteredArray);
  } catch (error) {
    console.error("Error removing from localStorage:", error);
    return false;
  }
}

function updateItem(key, id, updates) {
  try {
    const array = getArray(key);
    const index = array.findIndex((item) => item.id === id);

    if (index !== -1) {
      array[index] = { ...array[index], ...updates };
      return saveArray(key, array) ? array[index] : null;
    }

    return null;
  } catch (error) {
    console.error("Error updating localStorage:", error);
    return null;
  }
}

function findItem(key, id) {
  try {
    const array = getArray(key);
    return array.find((item) => item.id === id) || null;
  } catch (error) {
    console.error("Error finding item in localStorage:", error);
    return null;
  }
}

// Initialize demo data if storage is empty
function initializeDemoData() {
  try {
    // Check if any data already exists
    const hasData = Object.values(STORAGE_KEYS).some(
      (key) => getArray(key).length > 0
    );

    if (!hasData) {
      console.log("Initializing ENW with demo data...");

      saveArray(STORAGE_KEYS.SENIOR_REQUESTS, DEMO_DATA.senior_requests);
      saveArray(STORAGE_KEYS.VOLUNTEERS, DEMO_DATA.volunteers);
      saveArray(STORAGE_KEYS.MESSAGES, DEMO_DATA.messages);

      console.log("Demo data initialized successfully");
    }
  } catch (error) {
    console.error("Error initializing demo data:", error);
  }
}

// Reset all data to demo state
function resetToDemo() {
  try {
    saveArray(STORAGE_KEYS.SENIOR_REQUESTS, DEMO_DATA.senior_requests);
    saveArray(STORAGE_KEYS.VOLUNTEERS, DEMO_DATA.volunteers);
    saveArray(STORAGE_KEYS.MESSAGES, DEMO_DATA.messages);

    console.log("Data reset to demo state");
    return true;
  } catch (error) {
    console.error("Error resetting to demo data:", error);
    return false;
  }
}

// Clear all data
function clearAllData() {
  try {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });

    console.log("All ENW data cleared");
    return true;
  } catch (error) {
    console.error("Error clearing data:", error);
    return false;
  }
}

// Export data for backup/analysis
function exportAllData() {
  try {
    const data = {};
    Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
      data[name.toLowerCase()] = getArray(key);
    });

    return {
      exported_at: new Date().toISOString(),
      version: "1.0",
      data: data,
    };
  } catch (error) {
    console.error("Error exporting data:", error);
    return null;
  }
}

// Get statistics
function getStorageStats() {
  try {
    return {
      seniors: getArray(STORAGE_KEYS.SENIOR_REQUESTS).length,
      volunteers: getArray(STORAGE_KEYS.VOLUNTEERS).length,
      messages: getArray(STORAGE_KEYS.MESSAGES).length,
      total: Object.values(STORAGE_KEYS).reduce(
        (sum, key) => sum + getArray(key).length,
        0
      ),
    };
  } catch (error) {
    console.error("Error getting storage stats:", error);
    return { seniors: 0, volunteers: 0, messages: 0, total: 0 };
  }
}

// Data validation helpers
function validateSeniorRequest(data) {
  const required = ["name", "address"];
  const contactRequired = data.phone || data.email;
  const typeRequired =
    data["assistance-type"] && data["assistance-type"].length > 0;

  return (
    required.every((field) => data[field] && data[field].trim()) &&
    contactRequired &&
    typeRequired &&
    data.consent
  );
}

function validateVolunteer(data) {
  const required = ["name", "phone", "email", "neighborhood"];
  const skillsRequired = data.skills && data.skills.length > 0;
  const availabilityRequired =
    data.availability && data.availability.length > 0;

  return (
    required.every((field) => data[field] && data[field].trim()) &&
    skillsRequired &&
    availabilityRequired &&
    data.consent
  );
}

function validateMessage(data) {
  const required = ["name", "email", "subject", "message"];

  return (
    required.every((field) => data[field] && data[field].trim()) && data.consent
  );
}

// Initialize demo data when script loads
initializeDemoData();

// Export functions for use in other scripts
if (typeof window !== "undefined") {
  window.ENWStorage = {
    // Storage operations
    getArray,
    saveArray,
    appendItem,
    removeItem,
    updateItem,
    findItem,

    // Demo data management
    initializeDemoData,
    resetToDemo,
    clearAllData,
    exportAllData,
    getStorageStats,

    // Validation
    validateSeniorRequest,
    validateVolunteer,
    validateMessage,

    // Constants
    STORAGE_KEYS,
    DEMO_DATA,
  };
}
