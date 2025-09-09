// forms.js - Form validation and submission handlers

// Form validation rules
const VALIDATION_RULES = {
  required: (value) => value && value.trim().length > 0,
  email: (value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  phone: (value) =>
    !value || /^[\+]?[\d\s\-\(\)]{10,}$/.test(value.replace(/\s/g, "")),
  maxLength: (value, max) => !value || value.length <= max,
  minLength: (value, min) => !value || value.length >= min,
  checkbox: (checked) => checked === true,
};

// Generic form validation
function validateField(field, rules) {
  const errors = [];
  const value = field.type === "checkbox" ? field.checked : field.value;

  for (const [rule, param] of rules) {
    if (!VALIDATION_RULES[rule](value, param)) {
      switch (rule) {
        case "required":
          errors.push("This field is required");
          break;
        case "email":
          errors.push("Please enter a valid email address");
          break;
        case "phone":
          errors.push("Please enter a valid phone number");
          break;
        case "maxLength":
          errors.push(`Maximum ${param} characters allowed`);
          break;
        case "minLength":
          errors.push(`Minimum ${param} characters required`);
          break;
        case "checkbox":
          errors.push("You must agree to continue");
          break;
      }
    }
  }

  return errors;
}

// Show/hide field errors
function showFieldError(fieldId, errors) {
  const field = document.getElementById(fieldId);
  const errorElement = document.getElementById(fieldId + "-error");
  const formGroup = field?.closest(".form-group");

  if (errors.length > 0) {
    if (errorElement) {
      errorElement.textContent = errors[0];
      errorElement.setAttribute("aria-live", "polite");
    }
    if (formGroup) {
      formGroup.classList.add("error");
    }
  } else {
    if (errorElement) {
      errorElement.textContent = "";
      errorElement.removeAttribute("aria-live");
    }
    if (formGroup) {
      formGroup.classList.remove("error");
    }
  }
}

// Validate checkbox group (at least one selected)
function validateCheckboxGroup(name, required = false) {
  const checkboxes = document.querySelectorAll(`input[name="${name}"]`);
  const checked = Array.from(checkboxes).some((cb) => cb.checked);

  if (required && !checked) {
    return ["Please select at least one option"];
  }

  return [];
}

// Show checkbox group error
function showCheckboxGroupError(name, errors) {
  const errorElement = document.getElementById(name + "-error");
  const fieldset = document.querySelector(
    `fieldset:has(input[name="${name}"])`
  );

  if (errors.length > 0) {
    if (errorElement) {
      errorElement.textContent = errors[0];
      errorElement.setAttribute("aria-live", "polite");
    }
    if (fieldset) {
      fieldset.classList.add("error");
    }
  } else {
    if (errorElement) {
      errorElement.textContent = "";
      errorElement.removeAttribute("aria-live");
    }
    if (fieldset) {
      fieldset.classList.remove("error");
    }
  }
}

// Contact validation (either email or phone required)
function validateContact(emailField, phoneField) {
  const email = emailField?.value?.trim();
  const phone = phoneField?.value?.trim();

  if (!email && !phone) {
    return "Please provide either an email address or phone number";
  }

  return null;
}

// Sanitize input data
function sanitizeFormData(formData) {
  const sanitized = {};

  for (const [key, value] of Object.entries(formData)) {
    if (typeof value === "string") {
      // Trim whitespace and limit length
      sanitized[key] = value.trim().substring(0, 1000);
    } else if (Array.isArray(value)) {
      // Sanitize array values
      sanitized[key] = value
        .map((v) => (typeof v === "string" ? v.trim().substring(0, 200) : v))
        .filter((v) => v);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

// Collect checkbox values
function getCheckboxValues(name) {
  const checkboxes = document.querySelectorAll(`input[name="${name}"]:checked`);
  return Array.from(checkboxes).map((cb) => cb.value);
}

// Show success message and hide form
function showSuccessMessage(formId) {
  const form = document.getElementById(formId);
  const successMessage = document.getElementById("success-message");

  if (form) {
    form.style.display = "none";
  }

  if (successMessage) {
    successMessage.style.display = "block";
    successMessage.focus();
    successMessage.scrollIntoView({ behavior: "smooth" });
  }
}

// Reset form and show it again
function resetForm(formId) {
  const form = document.getElementById(formId);
  const successMessage = document.getElementById("success-message");

  if (form) {
    form.reset();
    form.style.display = "block";

    // Clear all error states
    const errorElements = form.querySelectorAll(".error-message");
    errorElements.forEach((el) => (el.textContent = ""));

    const formGroups = form.querySelectorAll(".form-group");
    formGroups.forEach((group) => group.classList.remove("error"));

    // Focus first field
    const firstField = form.querySelector("input, select, textarea");
    if (firstField) {
      firstField.focus();
    }
  }

  if (successMessage) {
    successMessage.style.display = "none";
  }
}

// Senior request form initialization
function initializeSeniorForm() {
  const form = document.getElementById("senior-request-form");
  if (!form) return;

  // Real-time validation on blur
  const fields = form.querySelectorAll("input, select, textarea");
  fields.forEach((field) => {
    field.addEventListener("blur", function () {
      validateSeniorField(this);
    });
  });

  // Form submission
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    submitSeniorRequest();
  });
}

function validateSeniorField(field) {
  const fieldId = field.id;
  let errors = [];

  switch (fieldId) {
    case "senior-name":
      errors = validateField(field, [["required"], ["maxLength", 100]]);
      break;
    case "senior-phone":
      errors = validateField(field, [["phone"], ["maxLength", 20]]);
      break;
    case "senior-email":
      errors = validateField(field, [["email"], ["maxLength", 100]]);
      break;
    case "senior-address":
      errors = validateField(field, [["required"], ["maxLength", 200]]);
      break;
    case "senior-time":
      errors = validateField(field, [["maxLength", 100]]);
      break;
    case "senior-notes":
      errors = validateField(field, [["maxLength", 500]]);
      break;
    case "senior-consent":
      errors = validateField(field, [["checkbox"]]);
      break;
  }

  showFieldError(fieldId, errors);
  return errors.length === 0;
}

function submitSeniorRequest() {
  const form = document.getElementById("senior-request-form");
  let isValid = true;

  // Validate all fields
  const fields = form.querySelectorAll("input, select, textarea");
  fields.forEach((field) => {
    if (!validateSeniorField(field)) {
      isValid = false;
    }
  });

  // Validate assistance type checkboxes
  const assistanceErrors = validateCheckboxGroup("assistance-type", true);
  showCheckboxGroupError("assistance-type", assistanceErrors);
  if (assistanceErrors.length > 0) {
    isValid = false;
  }

  // Validate contact information
  const emailField = document.getElementById("senior-email");
  const phoneField = document.getElementById("senior-phone");
  const contactError = validateContact(emailField, phoneField);

  if (contactError) {
    showFieldError("senior-phone", [contactError]);
    isValid = false;
  }

  if (!isValid) {
    // Focus first error
    const firstError = form.querySelector(".form-group.error");
    if (firstError) {
      const field = firstError.querySelector("input, select, textarea");
      if (field) field.focus();
    }
    return;
  }

  // Collect and sanitize form data
  const formData = {
    name: document.getElementById("senior-name").value,
    phone: document.getElementById("senior-phone").value,
    email: document.getElementById("senior-email").value,
    address: document.getElementById("senior-address").value,
    time: document.getElementById("senior-time").value,
    type: getCheckboxValues("assistance-type"),
    notes: document.getElementById("senior-notes").value,
    consent: document.getElementById("senior-consent").checked,
  };

  const sanitizedData = sanitizeFormData(formData);

  // Save to storage
  const saved = window.ENWStorage.appendItem(
    window.ENWStorage.STORAGE_KEYS.SENIOR_REQUESTS,
    sanitizedData
  );

  if (saved) {
    showSuccessMessage("senior-request-form");
  } else {
    alert(
      "Sorry, there was an error submitting your request. Please try again."
    );
  }
}

// Volunteer form initialization
function initializeVolunteerForm() {
  const form = document.getElementById("volunteer-form");
  if (!form) return;

  // Real-time validation on blur
  const fields = form.querySelectorAll("input, select, textarea");
  fields.forEach((field) => {
    field.addEventListener("blur", function () {
      validateVolunteerField(this);
    });
  });

  // Form submission
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    submitVolunteerForm();
  });
}

function validateVolunteerField(field) {
  const fieldId = field.id;
  let errors = [];

  switch (fieldId) {
    case "vol-name":
      errors = validateField(field, [["required"], ["maxLength", 100]]);
      break;
    case "vol-phone":
      errors = validateField(field, [
        ["required"],
        ["phone"],
        ["maxLength", 20],
      ]);
      break;
    case "vol-email":
      errors = validateField(field, [
        ["required"],
        ["email"],
        ["maxLength", 100],
      ]);
      break;
    case "vol-neighborhood":
      errors = validateField(field, [["required"], ["maxLength", 100]]);
      break;
    case "vol-experience":
      errors = validateField(field, [["maxLength", 500]]);
      break;
    case "vol-motivation":
      errors = validateField(field, [["maxLength", 500]]);
      break;
    case "vol-consent":
      errors = validateField(field, [["checkbox"]]);
      break;
  }

  showFieldError(fieldId, errors);
  return errors.length === 0;
}

function submitVolunteerForm() {
  const form = document.getElementById("volunteer-form");
  let isValid = true;

  // Validate all fields
  const fields = form.querySelectorAll("input, select, textarea");
  fields.forEach((field) => {
    if (!validateVolunteerField(field)) {
      isValid = false;
    }
  });

  // Validate skills checkboxes
  const skillsErrors = validateCheckboxGroup("skills", true);
  showCheckboxGroupError("skills", skillsErrors);
  if (skillsErrors.length > 0) {
    isValid = false;
  }

  // Validate availability checkboxes
  const availabilityErrors = validateCheckboxGroup("availability", true);
  showCheckboxGroupError("availability", availabilityErrors);
  if (availabilityErrors.length > 0) {
    isValid = false;
  }

  if (!isValid) {
    // Focus first error
    const firstError = form.querySelector(".form-group.error, fieldset.error");
    if (firstError) {
      const field = firstError.querySelector("input, select, textarea");
      if (field) field.focus();
    }
    return;
  }

  // Collect and sanitize form data
  const formData = {
    name: document.getElementById("vol-name").value,
    phone: document.getElementById("vol-phone").value,
    email: document.getElementById("vol-email").value,
    neighborhood: document.getElementById("vol-neighborhood").value,
    skills: getCheckboxValues("skills"),
    availability: getCheckboxValues("availability"),
    experience: document.getElementById("vol-experience").value,
    motivation: document.getElementById("vol-motivation").value,
    consent: document.getElementById("vol-consent").checked,
  };

  const sanitizedData = sanitizeFormData(formData);

  // Save to storage
  const saved = window.ENWStorage.appendItem(
    window.ENWStorage.STORAGE_KEYS.VOLUNTEERS,
    sanitizedData
  );

  if (saved) {
    showSuccessMessage("volunteer-form");
  } else {
    alert(
      "Sorry, there was an error submitting your registration. Please try again."
    );
  }
}

// Contact form initialization
function initializeContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  // Real-time validation on blur
  const fields = form.querySelectorAll("input, select, textarea");
  fields.forEach((field) => {
    field.addEventListener("blur", function () {
      validateContactField(this);
    });
  });

  // Form submission
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    submitContactForm();
  });
}

function validateContactField(field) {
  const fieldId = field.id;
  let errors = [];

  switch (fieldId) {
    case "contact-name":
      errors = validateField(field, [["required"], ["maxLength", 100]]);
      break;
    case "contact-email":
      errors = validateField(field, [
        ["required"],
        ["email"],
        ["maxLength", 100],
      ]);
      break;
    case "contact-phone":
      errors = validateField(field, [["phone"], ["maxLength", 20]]);
      break;
    case "contact-subject":
      errors = validateField(field, [["required"]]);
      break;
    case "contact-message":
      errors = validateField(field, [["required"], ["maxLength", 1000]]);
      break;
    case "contact-consent":
      errors = validateField(field, [["checkbox"]]);
      break;
  }

  showFieldError(fieldId, errors);
  return errors.length === 0;
}

function submitContactForm() {
  const form = document.getElementById("contact-form");
  let isValid = true;

  // Validate all fields
  const fields = form.querySelectorAll("input, select, textarea");
  fields.forEach((field) => {
    if (!validateContactField(field)) {
      isValid = false;
    }
  });

  if (!isValid) {
    // Focus first error
    const firstError = form.querySelector(".form-group.error");
    if (firstError) {
      const field = firstError.querySelector("input, select, textarea");
      if (field) field.focus();
    }
    return;
  }

  // Collect and sanitize form data
  const formData = {
    name: document.getElementById("contact-name").value,
    email: document.getElementById("contact-email").value,
    phone: document.getElementById("contact-phone").value,
    subject: document.getElementById("contact-subject").value,
    message: document.getElementById("contact-message").value,
    responseMethod: document.getElementById("contact-method").value,
    consent: document.getElementById("contact-consent").checked,
  };

  const sanitizedData = sanitizeFormData(formData);

  // Save to storage
  const saved = window.ENWStorage.appendItem(
    window.ENWStorage.STORAGE_KEYS.MESSAGES,
    sanitizedData
  );

  if (saved) {
    showSuccessMessage("contact-form");
  } else {
    alert("Sorry, there was an error sending your message. Please try again.");
  }
}

// Character counter for textareas
function addCharacterCounter(textareaId, maxLength) {
  const textarea = document.getElementById(textareaId);
  if (!textarea) return;

  const counterElement = document.createElement("div");
  counterElement.className = "character-counter";
  counterElement.style.fontSize = "var(--font-size-sm)";
  counterElement.style.color = "var(--color-text-light)";
  counterElement.style.textAlign = "right";
  counterElement.style.marginTop = "var(--spacing-xs)";

  textarea.parentNode.insertBefore(counterElement, textarea.nextSibling);

  function updateCounter() {
    const remaining = maxLength - textarea.value.length;
    counterElement.textContent = `${remaining} characters remaining`;

    if (remaining < 0) {
      counterElement.style.color = "var(--color-error)";
    } else if (remaining < 50) {
      counterElement.style.color = "var(--color-warning)";
    } else {
      counterElement.style.color = "var(--color-text-light)";
    }
  }

  textarea.addEventListener("input", updateCounter);
  updateCounter(); // Initialize
}

// Initialize character counters when DOM is ready
document.addEventListener("DOMContentLoaded", function () {
  addCharacterCounter("senior-notes", 500);
  addCharacterCounter("vol-experience", 500);
  addCharacterCounter("vol-motivation", 500);
  addCharacterCounter("contact-message", 1000);
});

// Export functions for use in HTML pages
if (typeof window !== "undefined") {
  window.initializeSeniorForm = initializeSeniorForm;
  window.initializeVolunteerForm = initializeVolunteerForm;
  window.initializeContactForm = initializeContactForm;
  window.resetForm = resetForm;
  window.validateField = validateField;
  window.showFieldError = showFieldError;
}
