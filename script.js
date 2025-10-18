// ============================
// Config Variables
// ============================
const PITCH_REVEAL_DELAY_MS = (33 * 60 + 3) * 1000; // 33.03s - tempo para revelar o pitch APÓS o play  <-- alterado
const COUNTDOWN_DURATION = 900; // 15 min (segundos)
const VIEWER_COUNT_MIN = 200;
const VIEWER_COUNT_MAX = 350;
const VIEWER_UPDATE_INTERVAL = 5000;
const STOCK_COUNT_MIN = 30;
const STOCK_COUNT_MAX = 60;

// ============================
// State Variables
// ============================
let countdownInterval;
let viewerInterval;
let timeRemaining = COUNTDOWN_DURATION;
let currentViewers = Math.floor(Math.random() * (VIEWER_COUNT_MAX - VIEWER_COUNT_MIN + 1)) + VIEWER_COUNT_MIN;
let currentStock = Math.floor(Math.random() * (STOCK_COUNT_MAX - STOCK_COUNT_MIN + 1)) + STOCK_COUNT_MIN;

// NEW: controla disparo único do timer do pitch
let pitchTimerStarted = false;
let pitchTimeoutId = null;

// ============================
// Initialize on page load
// ============================
document.addEventListener('DOMContentLoaded', function() {
    initializeViewerCounter();
    // initializePitchReveal(); // <-- REMOVIDO: não iniciamos mais no carregamento da página
    setupVideoPlaceholder();
    setupCTAButtons();
    initScrollAnimations();
    wireAnchorSmoothScroll();
    protectVideoContextMenu();
    startTimeOnPageCounter();
});

// ============================
// Video Placeholder + gatilho do play
// ============================
function setupVideoPlaceholder() {
    const videoPlaceholder = document.querySelector('.video-placeholder');
    const vslVideo = document.getElementById('vsl-video');

    // 1) Se for <video> HTML5, dispare quando o usuário der play
    if (vslVideo && vslVideo.tagName.toLowerCase() === 'video') {
        vslVideo.addEventListener('play', startPitchTimerOnFirstPlay); // <-- novo
    }

    // 2) Caso você use um placeholder clicável para iniciar o player/iframe da Vturb
    if (videoPlaceholder) {
        videoPlaceholder.addEventListener('click', function() {
            // Aqui você iniciaria de fato seu player da Vturb (trocar src/mostrar iframe etc)
            // Exemplo (comente/ajuste conforme seu embed real):
            // vslVideo.src = 'SUA_URL_DE_EMBED_DA_VTURB';
            // videoPlaceholder.style.display = 'none';
            // vslVideo.style.display = 'block';

            // Dispara o timer do pitch no "play" do usuário via placeholder
            startPitchTimerOnFirstPlay(); // <-- novo

            // Demo antigo:
            alert('Video player would start here. Replace with actual video embed URL in the script.');
        });
    }

    // 3) (Opcional) Se o Vturb estiver em <iframe>, você pode tentar usar postMessage da plataforma
    //    Caso seu embed dispare mensagens "play", você pode ouvir assim:
    // window.addEventListener('message', (e) => {
    //     try {
    //         const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
    //         if (data && (data.event === 'play' || data.type === 'play')) {
    //             startPitchTimerOnFirstPlay();
    //         }
    //     } catch(_) {}
    // });
}

// Dispara o contador do pitch só uma vez (primeiro play)
function startPitchTimerOnFirstPlay() {
    if (pitchTimerStarted) return; // evita múltiplos disparos
    pitchTimerStarted = true;

    // Inicia a contagem para revelar o pitch
    pitchTimeoutId = setTimeout(() => {
        revealPitchAndStartUrgency(); // <-- substitui o antigo initializePitchReveal()
    }, PITCH_REVEAL_DELAY_MS);
}

// ============================
// Pitch Section (reveal + timers)
// ============================
function revealPitchAndStartUrgency() {
    const pitchSection = document.getElementById('pitch-section');
    if (!pitchSection) return;

    pitchSection.classList.remove('hidden');

    // Smooth scroll até o pitch
    pitchSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Inicializa contador regressivo e estoque
    initializeCountdown();
    updateStockCount();
}

// (mantido) Countdown Timer
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
            updateExpiredTimerUI();
        }
    }, 1000);
}

// (mantido) UI quando expira
function updateExpiredTimerUI() {
    const timerHeadline = document.querySelector('.timer-headline');
    const timerWarning = document.querySelector('.timer-warning');

    if (timerHeadline) timerHeadline.textContent = '⚠️ TIME\'S UP! LAST CHANCE TO SAVE! ⚠️';
    if (timerWarning) timerWarning.textContent = 'This discount is about to disappear forever - Act NOW!';

    const ctaButtons = document.querySelectorAll('.cta-button');
    ctaButtons.forEach(button => {
        button.style.animation = 'pulse-button 1s infinite';
        if (button.classList.contains('primary')) {
            button.textContent = '🔥 CLAIM NOW BEFORE IT\'S GONE! 🔥';
        }
    });
}

// (mantido) Estoque
function updateStockCount() {
    const stockCountElement = document.getElementById('stock-count');
    if (stockCountElement) {
        stockCountElement.textContent = currentStock;

        setInterval(() => {
            if (currentStock > STOCK_COUNT_MIN) {
                const shouldDecrease = Math.random() > 0.7;
                if (shouldDecrease) {
                    currentStock--;
                    animateValue(stockCountElement, currentStock + 1, currentStock, 500);
                }
            }
        }, 15000);
    }
}

// (mantido) Animação numérica
function animateValue(element, start, end, duration) {
    const range = end - start;
    const increment = range / (duration / 16);
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

// ============================
// Extras (mantidos/organizados)
// ============================
function initScrollAnimations() {
    const elements = document.querySelectorAll('.pricing-card, .testimonial-card');
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    window.addEventListener('scroll', function() {
        const els = document.querySelectorAll('.pricing-card, .testimonial-card');
        els.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }
        });
    });
}

// Anchor smooth scroll
function wireAnchorSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
}

// Bloqueio de right-click no vídeo
function protectVideoContextMenu() {
    document.addEventListener('contextmenu', function(e) {
        if (e.target.closest('.video-wrapper')) {
            e.preventDefault();
            return false;
        }
    });
}

// Contador de tempo na página (analytics)
function startTimeOnPageCounter() {
    let timeOnPage = 0;
    setInterval(() => {
        timeOnPage++;
        // console.log('Time on page:', timeOnPage, 'seconds');
    }, 1000);
}

// Console logs
console.log('%c🚀 VSL Landing Page Loaded Successfully!', 'color: #27ae60; font-size: 16px; font-weight: bold;');
console.log('%cConfiguration:', 'color: #3498db; font-size: 14px; font-weight: bold;');
console.log('- Pitch reveal delay (ms) after play:', PITCH_REVEAL_DELAY_MS);
console.log('- Countdown duration:', COUNTDOWN_DURATION / 60, 'minutes');
console.log('- Viewer count range:', VIEWER_COUNT_MIN, '-', VIEWER_COUNT_MAX);
