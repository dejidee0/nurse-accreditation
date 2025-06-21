// Dashboard JavaScript

document.addEventListener('DOMContentLoaded', () => {
    initializeDashboard();
});

function initializeDashboard() {
    setupUserMenu();
    setupCountdowns();
    setupQuickActions();
    setupNotifications();
    setupAssistant();
    setupServiceRating();
    updateDashboardData();
}

// User Menu
function setupUserMenu() {
    const userMenuBtn = document.getElementById('userMenuBtn');
    const userDropdown = document.getElementById('userDropdown');
    
    if (userMenuBtn && userDropdown) {
        userMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            userDropdown.classList.toggle('active');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            userDropdown.classList.remove('active');
        });
        
        // Prevent dropdown from closing when clicking inside
        userDropdown.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
}

// Countdown Timers
function setupCountdowns() {
    const examCountdown = document.getElementById('examCountdown');
    const daysLeft = document.getElementById('daysLeft');
    
    // Calculate days until exam (July 15, 2025)
    const examDate = new Date('2025-07-15');
    const today = new Date();
    const timeDiff = examDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    if (examCountdown) {
        examCountdown.textContent = `${daysDiff} days`;
    }
    
    if (daysLeft) {
        daysLeft.textContent = daysDiff;
    }
    
    // Update countdown every hour
    setInterval(() => {
        const newToday = new Date();
        const newTimeDiff = examDate.getTime() - newToday.getTime();
        const newDaysDiff = Math.ceil(newTimeDiff / (1000 * 3600 * 24));
        
        if (examCountdown) {
            examCountdown.textContent = `${newDaysDiff} days`;
        }
        
        if (daysLeft) {
            daysLeft.textContent = newDaysDiff;
        }
    }, 3600000); // Update every hour
}

// Quick Actions
function setupQuickActions() {
    const actionBtns = document.querySelectorAll('.action-btn');
    
    actionBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const actionCard = e.target.closest('.action-card');
            const actionTitle = actionCard.querySelector('h3').textContent;
            
            handleQuickAction(actionTitle, btn);
        });
    });
}

function handleQuickAction(actionTitle, button) {
    const originalText = button.textContent;
    
    switch (actionTitle) {
        case 'Pay Fees':
            handlePayment(button, originalText);
            break;
        case 'Book Exam':
            handleExamBooking(button, originalText);
            break;
        case 'Download Certificate':
            handleCertificateDownload(button, originalText);
            break;
        case 'CPD Activities':
            handleCPDActivities(button, originalText);
            break;
        default:
            showNotification('Feature coming soon!', 'info');
    }
}

function handlePayment(button, originalText) {
    button.disabled = true;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    
    // Simulate payment process
    setTimeout(() => {
        showPaymentModal();
        button.disabled = false;
        button.textContent = originalText;
    }, 2000);
}

function showPaymentModal() {
    const modal = document.createElement('div');
    modal.className = 'payment-modal';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h3>Payment Options</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="payment-amount">
                    <h4>Examination Fee</h4>
                    <div class="amount">₦15,000</div>
                </div>
                <div class="payment-methods">
                    <h5>Select Payment Method:</h5>
                    <div class="payment-options">
                        <button class="payment-option">
                            <i class="fas fa-credit-card"></i>
                            <span>Debit/Credit Card</span>
                        </button>
                        <button class="payment-option">
                            <i class="fas fa-university"></i>
                            <span>Bank Transfer</span>
                        </button>
                        <button class="payment-option">
                            <i class="fas fa-mobile-alt"></i>
                            <span>Mobile Money</span>
                        </button>
                    </div>
                </div>
                <div class="payment-actions">
                    <button class="btn btn-primary" id="proceedPayment">Proceed to Payment</button>
                    <button class="btn btn-secondary modal-cancel">Cancel</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Event listeners
    modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
    modal.querySelector('.modal-cancel').addEventListener('click', () => modal.remove());
    modal.querySelector('.modal-overlay').addEventListener('click', () => modal.remove());
    
    modal.querySelector('#proceedPayment').addEventListener('click', () => {
        modal.remove();
        showNotification('Redirecting to payment gateway...', 'info');
    });
    
    // Add payment modal styles
    addPaymentModalStyles();
}

function handleExamBooking(button, originalText) {
    button.disabled = true;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    
    setTimeout(() => {
        showExamBookingModal();
        button.disabled = false;
        button.textContent = originalText;
    }, 1500);
}

function showExamBookingModal() {
    const modal = document.createElement('div');
    modal.className = 'booking-modal';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h3>Book Examination</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="available-slots">
                    <h4>Available Exam Slots</h4>
                    <div class="slots-grid">
                        <div class="slot-card">
                            <div class="slot-date">July 15, 2025</div>
                            <div class="slot-time">9:00 AM - 12:00 PM</div>
                            <div class="slot-location">Lagos Center</div>
                            <div class="slot-availability">3 spots left</div>
                            <button class="slot-btn">Select</button>
                        </div>
                        <div class="slot-card">
                            <div class="slot-date">July 22, 2025</div>
                            <div class="slot-time">2:00 PM - 5:00 PM</div>
                            <div class="slot-location">Abuja Center</div>
                            <div class="slot-availability">7 spots left</div>
                            <button class="slot-btn">Select</button>
                        </div>
                        <div class="slot-card">
                            <div class="slot-date">August 5, 2025</div>
                            <div class="slot-time">9:00 AM - 12:00 PM</div>
                            <div class="slot-location">Port Harcourt Center</div>
                            <div class="slot-availability">12 spots left</div>
                            <button class="slot-btn">Select</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Event listeners
    modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
    modal.querySelector('.modal-overlay').addEventListener('click', () => modal.remove());
    
    modal.querySelectorAll('.slot-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            modal.remove();
            showNotification('Exam slot booked successfully!', 'success');
        });
    });
    
    addBookingModalStyles();
}

function handleCertificateDownload(button, originalText) {
    button.disabled = true;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Preparing...';
    
    setTimeout(() => {
        // Simulate download
        const link = document.createElement('a');
        link.href = '#'; // In real app, this would be the certificate URL
        link.download = 'NNEC_Certificate_John_Doe.pdf';
        link.click();
        
        showNotification('Certificate downloaded successfully!', 'success');
        
        button.disabled = false;
        button.textContent = originalText;
    }, 2000);
}

function handleCPDActivities(button, originalText) {
    button.disabled = true;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    
    setTimeout(() => {
        showCPDModal();
        button.disabled = false;
        button.textContent = originalText;
    }, 1500);
}

function showCPDModal() {
    const modal = document.createElement('div');
    modal.className = 'cpd-modal';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h3>Continuing Professional Development</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="cpd-progress">
                    <h4>Your Progress</h4>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: 60%"></div>
                    </div>
                    <div class="progress-text">12 of 20 hours completed</div>
                </div>
                <div class="cpd-activities">
                    <h4>Available Activities</h4>
                    <div class="activities-list">
                        <div class="activity-item">
                            <div class="activity-info">
                                <h5>Modern Nursing Practices Webinar</h5>
                                <p>2 CPD Hours • July 5, 2025</p>
                            </div>
                            <button class="activity-btn">Register</button>
                        </div>
                        <div class="activity-item">
                            <div class="activity-info">
                                <h5>Patient Safety Workshop</h5>
                                <p>4 CPD Hours • July 12, 2025</p>
                            </div>
                            <button class="activity-btn">Register</button>
                        </div>
                        <div class="activity-item">
                            <div class="activity-info">
                                <h5>Digital Health Technologies</h5>
                                <p>3 CPD Hours • Online Course</p>
                            </div>
                            <button class="activity-btn">Start Course</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Event listeners
    modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
    modal.querySelector('.modal-overlay').addEventListener('click', () => modal.remove());
    
    modal.querySelectorAll('.activity-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            modal.remove();
            showNotification('Registration successful! Check your email for details.', 'success');
        });
    });
    
    addCPDModalStyles();
}

// Notifications
function setupNotifications() {
    const notificationActions = document.querySelectorAll('.notification-action');
    
    notificationActions.forEach(action => {
        action.addEventListener('click', (e) => {
            e.preventDefault();
            const actionText = e.target.textContent;
            
            switch (actionText) {
                case 'Register Now':
                    showNotification('Redirecting to webinar registration...', 'info');
                    break;
                case 'View Receipt':
                    showNotification('Opening payment receipt...', 'info');
                    break;
                case 'Download':
                    showNotification('Certificate download started...', 'success');
                    break;
                default:
                    showNotification('Feature coming soon!', 'info');
            }
        });
    });
}

// AI Assistant
function setupAssistant() {
    const assistantBtn = document.getElementById('askAssistant');
    
    if (assistantBtn) {
        assistantBtn.addEventListener('click', () => {
            const chatWidget = document.getElementById('chatWidget');
            if (chatWidget) {
                chatWidget.classList.add('active');
                
                setTimeout(() => {
                    if (window.NNEC && window.NNEC.addChatMessage) {
                        window.NNEC.addChatMessage('Hello! I\'m your NNEC AI Assistant. I can help you with exam schedules, payment issues, certificate downloads, and more. What would you like to know?', false);
                    }
                }, 500);
            }
        });
    }
}

// Service Rating
function setupServiceRating() {
    const rateBtn = document.getElementById('rateService');
    
    if (rateBtn) {
        rateBtn.addEventListener('click', () => {
            showRatingModal();
        });
    }
}

function showRatingModal() {
    const modal = document.createElement('div');
    modal.className = 'rating-modal';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h3>Rate Our Service</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="rating-section">
                    <h4>How would you rate your experience with NNEC?</h4>
                    <div class="star-rating" id="starRating">
                        <i class="fas fa-star" data-rating="1"></i>
                        <i class="fas fa-star" data-rating="2"></i>
                        <i class="fas fa-star" data-rating="3"></i>
                        <i class="fas fa-star" data-rating="4"></i>
                        <i class="fas fa-star" data-rating="5"></i>
                    </div>
                    <div class="rating-text" id="ratingText">Click to rate</div>
                </div>
                <div class="feedback-section">
                    <h4>Additional Feedback (Optional)</h4>
                    <textarea placeholder="Tell us how we can improve..." rows="4"></textarea>
                </div>
                <div class="rating-actions">
                    <button class="btn btn-primary" id="submitRating">Submit Rating</button>
                    <button class="btn btn-secondary modal-cancel">Cancel</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Star rating functionality
    const stars = modal.querySelectorAll('.star-rating i');
    const ratingText = modal.getElementById('ratingText');
    let selectedRating = 0;
    
    stars.forEach(star => {
        star.addEventListener('mouseover', () => {
            const rating = parseInt(star.dataset.rating);
            highlightStars(stars, rating);
        });
        
        star.addEventListener('click', () => {
            selectedRating = parseInt(star.dataset.rating);
            updateRatingText(ratingText, selectedRating);
        });
    });
    
    modal.addEventListener('mouseleave', () => {
        highlightStars(stars, selectedRating);
    });
    
    // Event listeners
    modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
    modal.querySelector('.modal-cancel').addEventListener('click', () => modal.remove());
    modal.querySelector('.modal-overlay').addEventListener('click', () => modal.remove());
    
    modal.querySelector('#submitRating').addEventListener('click', () => {
        if (selectedRating > 0) {
            modal.remove();
            showNotification('Thank you for your feedback!', 'success');
        } else {
            showNotification('Please select a rating first.', 'error');
        }
    });
    
    addRatingModalStyles();
}

function highlightStars(stars, rating) {
    stars.forEach((star, index) => {
        if (index < rating) {
            star.style.color = '#fbbf24';
        } else {
            star.style.color = '#d1d5db';
        }
    });
}

function updateRatingText(textElement, rating) {
    const ratingTexts = {
        1: 'Poor',
        2: 'Fair',
        3: 'Good',
        4: 'Very Good',
        5: 'Excellent'
    };
    
    textElement.textContent = ratingTexts[rating] || 'Click to rate';
}

// Update Dashboard Data
function updateDashboardData() {
    // Simulate real-time updates
    setInterval(() => {
        // Update notification timestamps
        const timeElements = document.querySelectorAll('.time');
        timeElements.forEach(element => {
            // This would normally fetch real data
            // For demo, we'll just update the display
        });
        
        // Update progress bars with animation
        const progressBars = document.querySelectorAll('.progress-fill');
        progressBars.forEach(bar => {
            const currentWidth = parseInt(bar.style.width);
            if (currentWidth < 100) {
                // Simulate progress updates
            }
        });
    }, 60000); // Update every minute
}

// Utility Functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `dashboard-notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'error' ? 'exclamation-triangle' : type === 'success' ? 'check-circle' : 'info-circle'}"></i>
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
    
    // Add notification styles if not already added
    addNotificationStyles();
}

// Add Modal Styles
function addPaymentModalStyles() {
    if (document.querySelector('#payment-modal-styles')) return;
    
    const styles = `
        .payment-modal {
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
        
        .payment-amount {
            text-align: center;
            margin-bottom: 2rem;
            padding: 1.5rem;
            background: #f0fdf4;
            border-radius: 12px;
        }
        
        .payment-amount h4 {
            color: #1f2937;
            margin-bottom: 0.5rem;
        }
        
        .payment-amount .amount {
            font-size: 2rem;
            font-weight: 700;
            color: #059669;
        }
        
        .payment-methods h5 {
            margin-bottom: 1rem;
            color: #1f2937;
        }
        
        .payment-options {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            margin-bottom: 2rem;
        }
        
        .payment-option {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1rem;
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            background: white;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .payment-option:hover {
            border-color: #059669;
            background: #f0fdf4;
        }
        
        .payment-option i {
            color: #059669;
            font-size: 1.2rem;
        }
        
        .payment-actions {
            display: flex;
            gap: 1rem;
        }
        
        .payment-actions .btn {
            flex: 1;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            font-weight: 600;
            border: none;
            cursor: pointer;
        }
    `;
    
    const style = document.createElement('style');
    style.id = 'payment-modal-styles';
    style.textContent = styles;
    document.head.appendChild(style);
}

function addBookingModalStyles() {
    if (document.querySelector('#booking-modal-styles')) return;
    
    const styles = `
        .booking-modal .modal-content {
            max-width: 800px;
        }
        
        .slots-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1rem;
            margin-top: 1rem;
        }
        
        .slot-card {
            border: 2px solid #e5e7eb;
            border-radius: 12px;
            padding: 1.5rem;
            text-align: center;
            transition: all 0.3s ease;
        }
        
        .slot-card:hover {
            border-color: #059669;
            background: #f0fdf4;
        }
        
        .slot-date {
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 0.5rem;
        }
        
        .slot-time {
            color: #059669;
            font-weight: 600;
            margin-bottom: 0.5rem;
        }
        
        .slot-location {
            color: #6b7280;
            margin-bottom: 0.5rem;
        }
        
        .slot-availability {
            color: #ef4444;
            font-size: 0.9rem;
            margin-bottom: 1rem;
        }
        
        .slot-btn {
            background: linear-gradient(135deg, #059669, #10B981);
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
            width: 100%;
        }
    `;
    
    const style = document.createElement('style');
    style.id = 'booking-modal-styles';
    style.textContent = styles;
    document.head.appendChild(style);
}

function addCPDModalStyles() {
    if (document.querySelector('#cpd-modal-styles')) return;
    
    const styles = `
        .cpd-progress {
            margin-bottom: 2rem;
        }
        
        .cpd-progress h4 {
            margin-bottom: 1rem;
            color: #1f2937;
        }
        
        .progress-text {
            text-align: center;
            color: #6b7280;
            margin-top: 0.5rem;
        }
        
        .activities-list {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
        
        .activity-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
        }
        
        .activity-info h5 {
            color: #1f2937;
            margin-bottom: 0.25rem;
        }
        
        .activity-info p {
            color: #6b7280;
            font-size: 0.9rem;
        }
        
        .activity-btn {
            background: linear-gradient(135deg, #059669, #10B981);
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
        }
    `;
    
    const style = document.createElement('style');
    style.id = 'cpd-modal-styles';
    style.textContent = styles;
    document.head.appendChild(style);
}

function addRatingModalStyles() {
    if (document.querySelector('#rating-modal-styles')) return;
    
    const styles = `
        .rating-section {
            text-align: center;
            margin-bottom: 2rem;
        }
        
        .star-rating {
            display: flex;
            justify-content: center;
            gap: 0.5rem;
            margin: 1rem 0;
        }
        
        .star-rating i {
            font-size: 2rem;
            color: #d1d5db;
            cursor: pointer;
            transition: color 0.3s ease;
        }
        
        .star-rating i:hover {
            color: #fbbf24;
        }
        
        .rating-text {
            color: #6b7280;
            margin-top: 1rem;
        }
        
        .feedback-section h4 {
            margin-bottom: 1rem;
            color: #1f2937;
        }
        
        .feedback-section textarea {
            width: 100%;
            padding: 0.75rem;
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            resize: vertical;
            margin-bottom: 1.5rem;
        }
        
        .rating-actions {
            display: flex;
            gap: 1rem;
        }
        
        .rating-actions .btn {
            flex: 1;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            font-weight: 600;
            border: none;
            cursor: pointer;
        }
    `;
    
    const style = document.createElement('style');
    style.id = 'rating-modal-styles';
    style.textContent = styles;
    document.head.appendChild(style);
}

function addNotificationStyles() {
    if (document.querySelector('#dashboard-notification-styles')) return;
    
    const styles = `
        .dashboard-notification {
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
        
        .notification-error {
            border-left: 4px solid #ef4444;
        }
        
        .notification-success {
            border-left: 4px solid #10b981;
        }
        
        .notification-info {
            border-left: 4px solid #3b82f6;
        }
        
        .dashboard-notification .notification-content {
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }
        
        .dashboard-notification .notification-close {
            background: none;
            border: none;
            color: #9ca3af;
            cursor: pointer;
            padding: 0.25rem;
            margin-left: 1rem;
        }
    `;
    
    const style = document.createElement('style');
    style.id = 'dashboard-notification-styles';
    style.textContent = styles;
    document.head.appendChild(style);
}