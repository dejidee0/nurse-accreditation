// Registration Form JavaScript

// Form state
let currentStep = 1;
let formData = {
  userType: "",
  personalInfo: {},
  documents: {},
};

// DOM Elements
const steps = document.querySelectorAll(".form-step");
const progressSteps = document.querySelectorAll(".progress-step");
const userTypeOptions = document.querySelectorAll('input[name="userType"]');
const nextStep1Btn = document.getElementById("nextStep1");
const nextStep2Btn = document.getElementById("nextStep2");
const prevStep2Btn = document.getElementById("prevStep2");
const prevStep3Btn = document.getElementById("prevStep3");
const submitBtn = document.getElementById("submitRegistration");
const personalInfoForm = document.getElementById("personalInfoForm");
const aiAssistantBtn = document.getElementById("aiAssistant");

// Upload elements
const uploadBoxes = document.querySelectorAll(".upload-box");
const fileInputs = document.querySelectorAll('input[type="file"]');

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  initializeForm();
  setupEventListeners();
  setupFileUploads();
});

function initializeForm() {
  // Check for saved data
  const savedData = NMCN.getFromLocalStorage("NMCN_registration_data");
  if (savedData) {
    formData = savedData;
    // Restore form state if needed
  }

  showStep(1);
}

function setupEventListeners() {
  // User type selection
  userTypeOptions.forEach((option) => {
    option.addEventListener("change", handleUserTypeChange);
  });

  // Navigation buttons
  if (nextStep1Btn) {
    nextStep1Btn.addEventListener("click", () => goToStep(2));
  }

  if (nextStep2Btn) {
    nextStep2Btn.addEventListener("click", handleStep2Next);
  }

  if (prevStep2Btn) {
    prevStep2Btn.addEventListener("click", () => goToStep(1));
  }

  if (prevStep3Btn) {
    prevStep3Btn.addEventListener("click", () => goToStep(2));
  }

  if (submitBtn) {
    submitBtn.addEventListener("click", handleSubmitRegistration);
  }

  // Form validation
  if (personalInfoForm) {
    personalInfoForm.addEventListener("input", validateStep2);
  }

  // AI Assistant
  if (aiAssistantBtn) {
    aiAssistantBtn.addEventListener("click", showAIAssistant);
  }
}

function setupFileUploads() {
  uploadBoxes.forEach((box, index) => {
    const input = box.querySelector('input[type="file"]');

    if (input) {
      // Click to upload
      box.addEventListener("click", () => {
        input.click();
      });

      // File change handler
      input.addEventListener("change", (e) => {
        handleFileUpload(e.target, box);
      });

      // Drag and drop
      box.addEventListener("dragover", (e) => {
        e.preventDefault();
        box.classList.add("drag-over");
      });

      box.addEventListener("dragleave", () => {
        box.classList.remove("drag-over");
      });

      box.addEventListener("drop", (e) => {
        e.preventDefault();
        box.classList.remove("drag-over");

        const files = e.dataTransfer.files;
        if (files.length > 0) {
          input.files = files;
          handleFileUpload(input, box);
        }
      });
    }
  });
}

function handleUserTypeChange() {
  const selectedType = document.querySelector(
    'input[name="userType"]:checked'
  )?.value;

  if (selectedType) {
    formData.userType = selectedType;
    nextStep1Btn.disabled = false;

    // Save progress
    NMCN.saveToLocalStorage("NMCN_registration_data", formData);

    // Update form fields based on user type
    updateFormFieldsForUserType(selectedType);
  }
}

function updateFormFieldsForUserType(userType) {
  const nursingSchoolGroup = document.getElementById("nursingSchoolGroup");
  const nursingSchoolSelect = document.getElementById("nursingSchool");

  if (userType === "fresh-abroad") {
    // Show different options for international graduates
    if (nursingSchoolSelect) {
      nursingSchoolSelect.innerHTML = `
                <option value="">Select Your Institution</option>
                <option value="uk-university">UK University</option>
                <option value="us-university">US University/College</option>
                <option value="canada-university">Canadian University</option>
                <option value="australia-university">Australian University</option>
                <option value="other-international">Other International Institution</option>
            `;
    }
  } else if (userType === "license-holder") {
    // Add license number field
    addLicenseNumberField();
  }
}

function addLicenseNumberField() {
  const formGrid = document.querySelector(".form-grid");
  if (formGrid && !document.getElementById("licenseNumber")) {
    const licenseGroup = document.createElement("div");
    licenseGroup.className = "form-group";
    licenseGroup.innerHTML = `
            <label for="licenseNumber">License Number *</label>
            <input type="text" id="licenseNumber" name="licenseNumber" required>
        `;
    formGrid.insertBefore(licenseGroup, formGrid.firstChild);
  }
}

function showStep(stepNumber) {
  currentStep = stepNumber;

  // Hide all steps
  steps.forEach((step) => step.classList.remove("active"));
  progressSteps.forEach((step) => step.classList.remove("active"));

  // Show current step
  const currentStepElement = document.getElementById(`step${stepNumber}`);
  const currentProgressStep = document.querySelector(
    `[data-step="${stepNumber}"]`
  );

  if (currentStepElement) {
    currentStepElement.classList.add("active");
  }

  if (currentProgressStep) {
    currentProgressStep.classList.add("active");
  }

  // Update progress indicator
  for (let i = 1; i <= stepNumber; i++) {
    const progressStep = document.querySelector(`[data-step="${i}"]`);
    if (progressStep) {
      progressStep.classList.add("active");
    }
  }
}

function goToStep(stepNumber) {
  if (stepNumber >= 1 && stepNumber <= 3) {
    showStep(stepNumber);

    // Scroll to top
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
}

function validateStep2() {
  const form = personalInfoForm;
  const requiredFields = form.querySelectorAll(
    "input[required], select[required]"
  );
  let isValid = true;

  requiredFields.forEach((field) => {
    if (!field.value.trim()) {
      isValid = false;
    }

    // Email validation
    if (
      field.type === "email" &&
      field.value &&
      !NMCN.validateEmail(field.value)
    ) {
      isValid = false;
    }

    // Phone validation
    if (
      field.type === "tel" &&
      field.value &&
      !NMCN.validatePhone(field.value)
    ) {
      isValid = false;
    }
  });

  nextStep2Btn.disabled = !isValid;
  return isValid;
}

function handleStep2Next() {
  if (validateStep2()) {
    // Collect personal info
    const formData = new FormData(personalInfoForm);
    const personalInfo = {};

    for (let [key, value] of formData.entries()) {
      personalInfo[key] = value;
    }

    formData.personalInfo = personalInfo;

    // Save progress
    NMCN.saveToLocalStorage("NMCN_registration_data", formData);

    goToStep(3);
  } else {
    showFormErrors();
  }
}

function showFormErrors() {
  const requiredFields = personalInfoForm.querySelectorAll(
    "input[required], select[required]"
  );

  requiredFields.forEach((field) => {
    if (!field.value.trim()) {
      field.style.borderColor = "#ef4444";
      field.addEventListener(
        "input",
        () => {
          field.style.borderColor = "#e5e7eb";
        },
        { once: true }
      );
    }
  });

  // Show error message
  showNotification("Please fill in all required fields correctly.", "error");
}

function handleFileUpload(input, box) {
  const file = input.files[0];

  if (file) {
    // Validate file
    if (!validateFile(file)) {
      return;
    }

    // Update UI
    box.classList.add("has-file");
    const uploadText = box.querySelector(".upload-text");
    const originalContent = uploadText.innerHTML;

    uploadText.innerHTML = `
            <h4>✓ ${file.name}</h4>
            <p>File uploaded successfully</p>
            <span class="upload-hint">Click to change file</span>
        `;

    // Store file reference
    const fieldName = input.name || input.id;
    formData.documents[fieldName] = {
      name: file.name,
      size: file.size,
      type: file.type,
    };

    // Save progress
    NMCN.saveToLocalStorage("NMCN_registration_data", formData);

    validateStep3();
  }
}

function validateFile(file) {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "application/pdf",
  ];

  if (file.size > maxSize) {
    showNotification("File size must be less than 5MB.", "error");
    return false;
  }

  if (!allowedTypes.includes(file.type)) {
    showNotification("Only JPG, PNG, and PDF files are allowed.", "error");
    return false;
  }

  return true;
}

function validateStep3() {
  const requiredFiles = ["idFile", "certificateFile", "passportFile"];
  const uploadedFiles = Object.keys(formData.documents);

  const hasRequiredFiles = requiredFiles.every(
    (file) =>
      uploadedFiles.includes(file) ||
      uploadedFiles.includes(file.replace("File", ""))
  );

  submitBtn.disabled = !hasRequiredFiles;
  return hasRequiredFiles;
}

function handleSubmitRegistration() {
  if (validateStep3()) {
    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML =
      '<i class="fas fa-spinner fa-spin"></i> Submitting...';

    // Simulate submission
    setTimeout(() => {
      // Success
      showSuccessModal();

      // Clear saved data
      localStorage.removeItem("NMCN_registration_data");

      // Reset button
      submitBtn.disabled = false;
      submitBtn.innerHTML = "Submit Registration";
    }, 3000);
  } else {
    showNotification("Please upload all required documents.", "error");
  }
}

function showSuccessModal() {
  const modal = document.createElement("div");
  modal.className = "success-modal";
  modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <div class="success-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h2>Registration Submitted Successfully!</h2>
            <p>Your application has been received and is being processed. You will receive a confirmation email shortly.</p>
            <div class="reference-number">
                <strong>Reference Number: NMCN${Date.now()}</strong>
            </div>
            <div class="modal-actions">
                <a href="dashboard.html" class="btn btn-primary">Go to Dashboard</a>
                <button class="btn btn-secondary" onclick="this.closest('.success-modal').remove()">Close</button>
            </div>
        </div>
    `;

  document.body.appendChild(modal);

  // Add styles
  const modalStyles = `
        .success-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(5px);
        }
        
        .modal-content {
            background: white;
            border-radius: 20px;
            padding: 3rem;
            max-width: 500px;
            margin: 2rem;
            text-align: center;
            position: relative;
            z-index: 10001;
            animation: modalSlideIn 0.3s ease;
        }
        
        @keyframes modalSlideIn {
            from {
                opacity: 0;
                transform: translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .success-icon {
            background: linear-gradient(135deg, #10b981, #059669);
            width: 80px;
            height: 80px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1.5rem;
            color: white;
            font-size: 2rem;
        }
        
        .modal-content h2 {
            font-size: 1.75rem;
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 1rem;
        }
        
        .modal-content p {
            color: #6b7280;
            margin-bottom: 1.5rem;
            line-height: 1.6;
        }
        
        .reference-number {
            background: #f0fdf4;
            border: 1px solid #a7f3d0;
            border-radius: 8px;
            padding: 1rem;
            margin: 1.5rem 0;
            color: #065f46;
        }
        
        .modal-actions {
            display: flex;
            gap: 1rem;
            justify-content: center;
            margin-top: 2rem;
        }
    `;

  const style = document.createElement("style");
  style.textContent = modalStyles;
  document.head.appendChild(style);
}

function showAIAssistant() {
  const responses = [
    "I can help you choose the right nursing school from our database of accredited institutions.",
    "Need assistance with document requirements? I can guide you through what's needed for your application type.",
    "Having trouble with form fields? I can provide examples and formatting guidelines.",
    "Questions about the registration process? I can explain each step in detail.",
    "Need help with payment options? I can show you the available payment methods and fees.",
  ];

  const randomResponse =
    responses[Math.floor(Math.random() * responses.length)];

  // Show notification or open chat
  showNotification(randomResponse, "info");
}

function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${
              type === "error"
                ? "exclamation-triangle"
                : type === "success"
                ? "check-circle"
                : "info-circle"
            }"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;

  document.body.appendChild(notification);

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove();
    }
  }, 5000);

  // Add styles if not already added
  if (!document.querySelector("#notification-styles")) {
    const notificationStyles = `
            .notification {
                position: fixed;
                top: 2rem;
                right: 2rem;
                background: white;
                border-radius: 12px;
                padding: 1rem 1.5rem;
                box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: space-between;
                min-width: 300px;
                max-width: 500px;
                animation: slideInRight 0.3s ease;
            }
            
            @keyframes slideInRight {
                from {
                    opacity: 0;
                    transform: translateX(100%);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            
            .notification-error {
                border-left: 4px solid #ef4444;
            }
            
            .notification-success {
                border-left: 4px solid #10b981;
            }
            
            .notification-info {
                border-left: 4px solid #3b82f6;
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 0.75rem;
            }
            
            .notification-content i {
                color: #6b7280;
            }
            
            .notification-error .notification-content i {
                color: #ef4444;
            }
            
            .notification-success .notification-content i {
                color: #10b981;
            }
            
            .notification-info .notification-content i {
                color: #3b82f6;
            }
            
            .notification-close {
                background: none;
                border: none;
                color: #9ca3af;
                cursor: pointer;
                padding: 0.25rem;
                margin-left: 1rem;
            }
            
            .notification-close:hover {
                color: #6b7280;
            }
        `;

    const style = document.createElement("style");
    style.id = "notification-styles";
    style.textContent = notificationStyles;
    document.head.appendChild(style);
  }
}

// Add drag over styles
const dragStyles = `
    .upload-box.drag-over {
        border-color: #059669 !important;
        background: #f0fdf4 !important;
        transform: scale(1.02);
    }
`;

const style = document.createElement("style");
style.textContent = dragStyles;
document.head.appendChild(style);
