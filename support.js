// Support Page JavaScript

document.addEventListener("DOMContentLoaded", () => {
  initializeSupportPage();
});

function initializeSupportPage() {
  setupSupportForm();
  setupLiveChat();
  setupVideoScheduling();
  setupFileUpload();
}

// Support Form Handling
function setupSupportForm() {
  const supportForm = document.getElementById("supportForm");

  if (supportForm) {
    supportForm.addEventListener("submit", handleSupportFormSubmit);

    // Auto-save form data
    const formInputs = supportForm.querySelectorAll("input, select, textarea");
    formInputs.forEach((input) => {
      input.addEventListener("input", () => {
        saveFormData();
      });
    });

    // Load saved form data
    loadFormData();
  }
}

function handleSupportFormSubmit(e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const supportData = {};

  for (let [key, value] of formData.entries()) {
    supportData[key] = value;
  }

  // Show loading state
  const submitBtn = e.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

  // Simulate form submission
  setTimeout(() => {
    showSuccessMessage();
    e.target.reset();
    clearFormData();

    // Reset button
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }, 2000);
}

function showSuccessMessage() {
  const message = document.createElement("div");
  message.className = "success-message";
  message.innerHTML = `
        <div class="success-content">
            <i class="fas fa-check-circle"></i>
            <h3>Message Sent Successfully!</h3>
            <p>We've received your message and will respond within 2 hours. Check your email for updates.</p>
            <div class="ticket-number">Ticket #NMCN${Date.now()}</div>
        </div>
    `;

  document.body.appendChild(message);

  // Auto remove after 5 seconds
  setTimeout(() => {
    message.remove();
  }, 5000);

  // Add styles
  if (!document.querySelector("#success-message-styles")) {
    const styles = `
            .success-message {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                border-radius: 20px;
                padding: 3rem;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                z-index: 10000;
                text-align: center;
                max-width: 400px;
                animation: slideIn 0.3s ease;
            }
            
            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translate(-50%, -60%);
                }
                to {
                    opacity: 1;
                    transform: translate(-50%, -50%);
                }
            }
            
            .success-content i {
                font-size: 3rem;
                color: #10b981;
                margin-bottom: 1rem;
            }
            
            .success-content h3 {
                font-size: 1.5rem;
                font-weight: 700;
                color: #1f2937;
                margin-bottom: 1rem;
            }
            
            .success-content p {
                color: #6b7280;
                margin-bottom: 1.5rem;
                line-height: 1.6;
            }
            
            .ticket-number {
                background: #f0fdf4;
                color: #065f46;
                padding: 0.5rem 1rem;
                border-radius: 8px;
                font-weight: 600;
                font-size: 0.9rem;
            }
        `;

    const style = document.createElement("style");
    style.id = "success-message-styles";
    style.textContent = styles;
    document.head.appendChild(style);
  }
}

// Live Chat Setup
function setupLiveChat() {
  const liveChatBtn = document.getElementById("startLiveChat");

  if (liveChatBtn) {
    liveChatBtn.addEventListener("click", () => {
      // Open chat widget
      const chatWidget = document.getElementById("chatWidget");
      if (chatWidget) {
        chatWidget.classList.add("active");

        // Add welcome message
        setTimeout(() => {
          if (window.NMCN && window.NMCN.addChatMessage) {
            window.NMCN.addChatMessage(
              "Hello! I'm here to help you with any questions about NMCN services. How can I assist you today?",
              false
            );
          }
        }, 500);
      }
    });
  }
}

// Video Call Scheduling
function setupVideoScheduling() {
  const scheduleBtn = document.getElementById("scheduleVideo");

  if (scheduleBtn) {
    scheduleBtn.addEventListener("click", () => {
      showSchedulingModal();
    });
  }
}

function showSchedulingModal() {
  const modal = document.createElement("div");
  modal.className = "scheduling-modal";
  modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h3>Schedule Video Call</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <form id="schedulingForm">
                    <div class="form-group">
                        <label for="callDate">Preferred Date</label>
                        <input type="date" id="callDate" name="callDate" required min="${
                          new Date().toISOString().split("T")[0]
                        }">
                    </div>
                    <div class="form-group">
                        <label for="callTime">Preferred Time</label>
                        <select id="callTime" name="callTime" required>
                            <option value="">Select Time</option>
                            <option value="09:00">9:00 AM</option>
                            <option value="10:00">10:00 AM</option>
                            <option value="11:00">11:00 AM</option>
                            <option value="14:00">2:00 PM</option>
                            <option value="15:00">3:00 PM</option>
                            <option value="16:00">4:00 PM</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="callPurpose">Purpose of Call</label>
                        <textarea id="callPurpose" name="callPurpose" rows="3" placeholder="Brief description of what you need help with..."></textarea>
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary">Schedule Call</button>
                        <button type="button" class="btn btn-secondary modal-cancel">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    `;

  document.body.appendChild(modal);

  // Event listeners
  modal
    .querySelector(".modal-close")
    .addEventListener("click", () => modal.remove());
  modal
    .querySelector(".modal-cancel")
    .addEventListener("click", () => modal.remove());
  modal
    .querySelector(".modal-overlay")
    .addEventListener("click", () => modal.remove());

  modal.querySelector("#schedulingForm").addEventListener("submit", (e) => {
    e.preventDefault();

    // Show success message
    modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <div class="success-content">
                    <i class="fas fa-check-circle"></i>
                    <h3>Call Scheduled!</h3>
                    <p>Your video call has been scheduled. You'll receive a confirmation email with the meeting link.</p>
                    <button class="btn btn-primary" onclick="this.closest('.scheduling-modal').remove()">Close</button>
                </div>
            </div>
        `;
  });

  // Add modal styles
  if (!document.querySelector("#modal-styles")) {
    const modalStyles = `
            .scheduling-modal {
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
                max-width: 500px;
                width: 90%;
                max-height: 90vh;
                overflow-y: auto;
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
            
            .modal-header {
                padding: 2rem 2rem 1rem;
                border-bottom: 1px solid #e5e7eb;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .modal-header h3 {
                font-size: 1.5rem;
                font-weight: 700;
                color: #1f2937;
            }
            
            .modal-close {
                background: none;
                border: none;
                font-size: 1.5rem;
                color: #9ca3af;
                cursor: pointer;
                padding: 0.25rem;
            }
            
            .modal-close:hover {
                color: #6b7280;
            }
            
            .modal-body {
                padding: 2rem;
            }
            
            .modal-body .form-group {
                margin-bottom: 1.5rem;
            }
            
            .modal-body label {
                display: block;
                font-weight: 600;
                color: #374151;
                margin-bottom: 0.5rem;
            }
            
            .modal-body input,
            .modal-body select,
            .modal-body textarea {
                width: 100%;
                padding: 0.75rem;
                border: 2px solid #e5e7eb;
                border-radius: 8px;
                font-size: 1rem;
            }
            
            .modal-body input:focus,
            .modal-body select:focus,
            .modal-body textarea:focus {
                outline: none;
                border-color: #059669;
                box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.1);
            }
            
            .modal-body .form-actions {
                display: flex;
                gap: 1rem;
                margin-top: 2rem;
            }
            
            .modal-body .btn {
                flex: 1;
                padding: 0.75rem 1.5rem;
                border-radius: 8px;
                font-weight: 600;
                border: none;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .success-content {
                text-align: center;
                padding: 3rem 2rem;
            }
            
            .success-content i {
                font-size: 3rem;
                color: #10b981;
                margin-bottom: 1rem;
            }
            
            .success-content h3 {
                font-size: 1.5rem;
                font-weight: 700;
                color: #1f2937;
                margin-bottom: 1rem;
            }
            
            .success-content p {
                color: #6b7280;
                margin-bottom: 2rem;
                line-height: 1.6;
            }
        `;

    const style = document.createElement("style");
    style.id = "modal-styles";
    style.textContent = modalStyles;
    document.head.appendChild(style);
  }
}

// File Upload Enhancement
function setupFileUpload() {
  const fileInput = document.getElementById("attachment");
  const uploadArea = document.querySelector(".upload-area");

  if (fileInput && uploadArea) {
    // Drag and drop functionality
    uploadArea.addEventListener("dragover", (e) => {
      e.preventDefault();
      uploadArea.style.borderColor = "#059669";
      uploadArea.style.background = "#f0fdf4";
    });

    uploadArea.addEventListener("dragleave", () => {
      uploadArea.style.borderColor = "#d1d5db";
      uploadArea.style.background = "#fafafa";
    });

    uploadArea.addEventListener("drop", (e) => {
      e.preventDefault();
      uploadArea.style.borderColor = "#d1d5db";
      uploadArea.style.background = "#fafafa";

      const files = e.dataTransfer.files;
      fileInput.files = files;
      updateFileDisplay(files);
    });

    // File input change
    fileInput.addEventListener("change", (e) => {
      updateFileDisplay(e.target.files);
    });
  }
}

function updateFileDisplay(files) {
  const uploadArea = document.querySelector(".upload-area");

  if (files.length > 0) {
    const fileList = Array.from(files)
      .map((file) => file.name)
      .join(", ");
    uploadArea.innerHTML = `
            <i class="fas fa-check-circle" style="color: #10b981;"></i>
            <span style="color: #059669; font-weight: 600;">${files.length} file(s) selected</span>
            <div style="font-size: 0.8rem; color: #6b7280; margin-top: 0.5rem;">${fileList}</div>
        `;
  }
}

// Form Data Persistence
function saveFormData() {
  const form = document.getElementById("supportForm");
  if (form) {
    const formData = new FormData(form);
    const data = {};

    for (let [key, value] of formData.entries()) {
      data[key] = value;
    }

    localStorage.setItem("NMCN_support_form", JSON.stringify(data));
  }
}

function loadFormData() {
  const savedData = localStorage.getItem("NMCN_support_form");
  if (savedData) {
    const data = JSON.parse(savedData);
    const form = document.getElementById("supportForm");

    if (form) {
      Object.keys(data).forEach((key) => {
        const field = form.querySelector(`[name="${key}"]`);
        if (field && data[key]) {
          field.value = data[key];
        }
      });
    }
  }
}

function clearFormData() {
  localStorage.removeItem("NMCN_support_form");
}
