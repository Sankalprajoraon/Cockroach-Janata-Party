// ============================================
//  COCKROACH JANATA PARTY — script.js
// ============================================

// ---- NAVBAR SCROLL EFFECT ----
const navbar = document.getElementById('navbar');
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 80) {
    navbar.classList.add('scrolled');
    backToTop.classList.add('visible');
  } else {
    navbar.classList.remove('scrolled');
    backToTop.classList.remove('visible');
  }
});

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ---- MOBILE NAV TOGGLE ----
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  navToggle.textContent = navLinks.classList.contains('open') ? '✕' : '☰';
});

// Close nav when a link is clicked on mobile
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.textContent = '☰';
  });
});

// ---- ANIMATED STAT COUNTERS ----
function animateCounter(el, target, duration = 2000) {
  const start = performance.now();
  const startVal = 0;

  function update(timestamp) {
    const elapsed = timestamp - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(startVal + (target - startVal) * eased);
    el.textContent = current.toLocaleString('en-IN');
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target.toLocaleString('en-IN');
  }

  requestAnimationFrame(update);
}

// Trigger counters when hero is visible
const statNums = document.querySelectorAll('.stat-num');
let countersStarted = false;

const heroObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !countersStarted) {
      countersStarted = true;
      statNums.forEach(el => {
        const target = parseInt(el.getAttribute('data-target'), 10);
        animateCounter(el, target);
      });
    }
  });
}, { threshold: 0.3 });

const heroSection = document.getElementById('home');
if (heroSection) heroObserver.observe(heroSection);

// ---- ELECTION COUNTDOWN TIMER ----
// Target: January 1, 2027 (fake "next election")
const electionDate = new Date('2027-01-01T00:00:00');

function updateCountdown() {
  const now = new Date();
  const diff = electionDate - now;

  if (diff <= 0) {
    document.getElementById('days').textContent = '00';
    document.getElementById('hours').textContent = '00';
    document.getElementById('minutes').textContent = '00';
    document.getElementById('seconds').textContent = '00';
    return;
  }

  const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  const pad = n => String(n).padStart(2, '0');

  document.getElementById('days').textContent    = pad(days);
  document.getElementById('hours').textContent   = pad(hours);
  document.getElementById('minutes').textContent = pad(minutes);
  document.getElementById('seconds').textContent = pad(seconds);
}

updateCountdown();
setInterval(updateCountdown, 1000);

// ---- SCROLL REVEAL ----
// Add .reveal class to all section children automatically
document.querySelectorAll('.about-card, .promise-card, .news-card, .testi-card, .contact-item')
  .forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger delay based on sibling index
      const siblings = [...entry.target.parentElement.children];
      const index = siblings.indexOf(entry.target);
      entry.target.style.transitionDelay = `${index * 0.08}s`;
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ---- CONTACT FORM SUBMISSION ----
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = contactForm.querySelector('button[type="submit"]');
    btn.textContent = '🪳 Recruiting...';
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = '✅ Welcome to CJP!';
      showToast('🪳 Welcome to the Cockroach Janata Party! We\'ll find you.');
      contactForm.reset();
      setTimeout(() => {
        btn.textContent = 'Join CJP 🪳';
        btn.disabled = false;
      }, 3000);
    }, 1500);
  });
}

// ---- TOAST NOTIFICATION ----
function showToast(message, duration = 4000) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

// ---- SMOOTH ACTIVE NAV LINK ----
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const top = section.offsetTop - 120;
    if (window.scrollY >= top) current = section.getAttribute('id');
  });

  navAnchors.forEach(a => {
    a.style.color = '';
    if (a.getAttribute('href') === `#${current}`) {
      a.style.color = 'var(--accent)';
    }
  });
}, { passive: true });

// ---- EASTER EGG: Konami code ----
const konamiCode = [
  'ArrowUp','ArrowUp','ArrowDown','ArrowDown',
  'ArrowLeft','ArrowRight','ArrowLeft','ArrowRight',
  'b','a'
];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
  if (e.key === konamiCode[konamiIndex]) {
    konamiIndex++;
    if (konamiIndex === konamiCode.length) {
      konamiIndex = 0;
      // Spawn cockroaches on screen
      for (let i = 0; i < 20; i++) {
        spawnRoach();
      }
      showToast('🪳🪳🪳 THE COCKROACHES HAVE TAKEN OVER! 🪳🪳🪳', 5000);
    }
  } else {
    konamiIndex = 0;
  }
});

function spawnRoach() {
  const roach = document.createElement('div');
  roach.textContent = '🪳';
  roach.style.cssText = `
    position: fixed;
    font-size: ${1 + Math.random() * 2}rem;
    left: ${Math.random() * 100}vw;
    top: ${Math.random() * 100}vh;
    z-index: 9998;
    pointer-events: none;
    animation: roachRun 3s linear forwards;
    transform: rotate(${Math.random() * 360}deg);
  `;
  document.body.appendChild(roach);

  const styleId = 'roach-anim';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      @keyframes roachRun {
        0%   { opacity: 1; transform: translateX(0) rotate(0deg); }
        100% { opacity: 0; transform: translateX(${(Math.random()-0.5)*300}px) translateY(${(Math.random()-0.5)*300}px) rotate(720deg); }
      }
    `;
    document.head.appendChild(style);
  }

  setTimeout(() => roach.remove(), 3000);
}

// ---- LOG ----
console.log('%c 🪳 COCKROACH JANATA PARTY', 'color: #c8f500; font-size: 20px; font-weight: bold;');
console.log('%c Survive. Thrive. Multiply.', 'color: #888; font-size: 12px;');
console.log('%c Try the Konami Code! ↑↑↓↓←→←→BA', 'color: #555; font-size: 11px;');
