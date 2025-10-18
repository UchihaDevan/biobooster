// Configuration Variables
const PITCH_REVEAL_DELAY = 30000; // 30 seconds - Time before pitch section appears
const COUNTDOWN_DURATION = 900; // 15 minutes in seconds
const VIEWER_COUNT_MIN = 200;
const VIEWER_COUNT_MAX = 350;
const VIEWER_UPDATE_INTERVAL = 5000; // Update viewer count every 5 seconds
const STOCK_COUNT_MIN = 30;
const STOCK_COUNT_MAX = 60;

// State Variables
let countdownInterval;
let viewerInterval;
let timeRemaining = COUNTDOWN_DURATION;
let currentViewers = Math.floor(Math.random() * (VIEWER_COUNT_MAX - VIEWER_COUNT_MIN + 1)) + VIEWER_COUNT_MIN;
let currentStock = Math.floor(Math.random() * (STOCK_COUNT_MAX - STOCK_COUNT_MIN + 1)) + STOCK_COUNT_MIN;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeViewerCounter();
    initializePitchReveal();
    setupVideoPlaceholder();
    setupCTAButtons();
});

// Video Placeholder Click Handler
function setupVideoPlaceholder() {
    const videoPlaceholder = document.querySelector('.video-placeholder');
    const vslVideo = document.getElementById('vsl-video');
    
    if (videoPlaceholder) {
        videoPlaceholder.addEventListener('click', function() {
            // Replace with actual video URL
            // vslVideo.src = 'YOUR_VIDEO_URL_HERE';
            // videoPlaceholder.style.display = 'none';
            // vslVideo.style.display = 'block';
            
            // For demo purposes, just hide placeholder
            alert('Video player would start here. Replace with actual video embed URL in the script.');
        });
    }
}

// Viewer Counter Animation
function initializeViewerCounter() {
    const viewerCountElement = document.getElementById('viewer-count');
    
    // Update viewer count periodically
    viewerInterval = setInterval(() => {
        // Random fluctuation between -5 and +8
        const change = Math.floor(Math.random() * 14) - 5;
        currentViewers = Math.max(VIEWER_COUNT_MIN, Math.min(VIEWER_COUNT_MAX, currentViewers + change));
        
        // Animate the number change
        animateValue(viewerCountElement, parseInt(viewerCountElement.textContent), currentViewers, 1000);
    }, VIEWER_UPDATE_INTERVAL);
}

// Pitch Section Reveal
function initializePitchReveal() {
    setTimeout(() => {
        const pitchSection = document.getElementById('pitch-section');
        pitchSection.classList.remove('hidden');
        
        // Smooth scroll to pitch section
        pitchSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Initialize countdown timer
        initializeCountdown();
        
        // Initialize stock counter
        updateStockCount();
    }, PITCH_REVEAL_DELAY);
}

// Countdown Timer
function initializeCountdown() {
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');
    
    countdownInterval = setInterval(() => {
        if (timeRemaining > 0) {
            timeRemaining--;
            
            const minutes = Math.floor(timeRemaining / 60);
            const seconds = timeRemaining % 60;
            
            minutesElement.textContent = String(minutes).padStart(2, '0');
            secondsElement.textContent = String(seconds).padStart(2, '0');
        } else {
            clearInterval(countdownInterval);
            
            // Timer expired - make CTA more aggressive
            updateExpiredTimerUI();
        }
    }, 1000);
}

// Update UI when timer expires
function updateExpiredTimerUI() {
    const timerHeadline = document.querySelector('.timer-headline');
    const timerWarning = document.querySelector('.timer-warning');
    
    timerHeadline.textContent = '⚠️ TIME\'S UP! LAST CHANCE TO SAVE! ⚠️';
    timerWarning.textContent = 'This discount is about to disappear forever - Act NOW!';
    
    // Make all CTA buttons more urgent
    const ctaButtons = document.querySelectorAll('.cta-button');
    ctaButtons.forEach(button => {
        button.style.animation = 'pulse-button 1s infinite';
        if (button.classList.contains('primary')) {
            button.textContent = '🔥 CLAIM NOW BEFORE IT\'S GONE! 🔥';
        }
    });
}

// Stock Counter
function updateStockCount() {
    const stockCountElement = document.getElementById('stock-count');
    if (stockCountElement) {
        stockCountElement.textContent = currentStock;
        
        // Decrease stock randomly
        setInterval(() => {
            if (currentStock > STOCK_COUNT_MIN) {
                const shouldDecrease = Math.random() > 0.7; // 30% chance to decrease
                if (shouldDecrease) {
                    currentStock--;
                    animateValue(stockCountElement, currentStock + 1, currentStock, 500);
                }
            }
        }, 15000); // Check every 15 seconds
    }
}

// Animate number changes
function animateValue(element, start, end, duration) {
    const range = end - start;
    const increment = range / (duration / 16); // 60fps
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            element.textContent = Math.round(end);
            clearInterval(timer);
        } else {
            element.textContent = Math.round(current);
        }
    }, 16);
}

// CTA Button Click Handlers
function setupCTAButtons() {
    const ctaButtons = document.querySelectorAll('.cta-button');
    
    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get package info from parent card
            const card = this.closest('.pricing-card');
            const packageName = card.querySelector('.package-name').textContent;
            const price = card.querySelector('.total-price').textContent;
            
            // Show confirmation
            const confirmed = confirm(`You're about to purchase: ${packageName}\n${price}\n\nProceed to checkout?`);
            
            if (confirmed) {
                // Redirect to checkout page
                // window.location.href = 'checkout.html?package=' + encodeURIComponent(packageName);
                
                // For demo purposes
                alert('Redirecting to secure checkout...\n\nIn production, this would go to your payment processor.');
            }
        });
        
        // Add hover effect
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.02)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Add scroll animations
window.addEventListener('scroll', function() {
    const elements = document.querySelectorAll('.pricing-card, .testimonial-card');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        
        // Check if element is in viewport
        if (elementTop < window.innerHeight && elementBottom > 0) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
});

// Initialize scroll animations
document.addEventListener('DOMContentLoaded', function() {
    const elements = document.querySelectorAll('.pricing-card, .testimonial-card');
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
});

// Add exit intent popup (optional - can be enabled)
function setupExitIntent() {
    let hasShownExitPopup = false;
    
    document.addEventListener('mouseout', function(e) {
        if (!hasShownExitPopup && e.clientY < 10) {
            hasShownExitPopup = true;
            
            const shouldStay = confirm('WAIT! Don\'t leave without claiming your discount!\n\nGet up to 60% OFF + FREE Shipping today only!\n\nClick OK to see our special offers.');
            
            if (shouldStay) {
                // Scroll to first CTA
                document.querySelector('.cta-section').scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
}

// Uncomment to enable exit intent
// setupExitIntent();

// Track time on page for analytics
let timeOnPage = 0;
setInterval(() => {
    timeOnPage++;
    // Send to analytics if needed
    // console.log('Time on page:', timeOnPage, 'seconds');
}, 1000);

// Prevent right-click on video (optional protection)
document.addEventListener('contextmenu', function(e) {
    if (e.target.closest('.video-wrapper')) {
        e.preventDefault();
        return false;
    }
});

// Add smooth scrolling for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Console message for developers
console.log('%c🚀 VSL Landing Page Loaded Successfully!', 'color: #27ae60; font-size: 16px; font-weight: bold;');
console.log('%cConfiguration:', 'color: #3498db; font-size: 14px; font-weight: bold;');
console.log('- Pitch reveal delay:', PITCH_REVEAL_DELAY / 1000, 'seconds');
console.log('- Countdown duration:', COUNTDOWN_DURATION / 60, 'minutes');
console.log('- Viewer count range:', VIEWER_COUNT_MIN, '-', VIEWER_COUNT_MAX);

