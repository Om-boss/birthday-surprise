/* =====================================================
   BIRTHDAY SURPRISE — SCRIPT.JS (Premium Edition)
   No libraries. Organized into small, commented functions.
   Run order (bottom of file): each init function is called
   once the DOM is ready.

   FLOW OVERVIEW
   1. Password screen gates the whole experience.
   2. Correct answer reveals the gift box.
   3. Opening the gift triggers the loading screen.
   4. Loading screen fades into the real site (hero etc.).
===================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Gatekeeping flow (password -> gift -> loading -> site)
  initPasswordGate();
  initGiftBox();
  initLoadingScreen();

  // Ambient / global effects
  initCursorGlow();
  initFloatingHearts();
  initScrollReveal();
  initNavbar();
  initParallax();

  // Section behaviour
  initPetals();
  initTypewriter();
  initTimelineGlowLine();
  initReasonsGrid();
  initGallery();
  initCounter();
  initMusicPlayer();
  initCake();
  initFinalSurprise();
  initStars();
});

/* -----------------------------------------------------
   0. SHARED HELPERS
----------------------------------------------------- */

/** Locks or unlocks page scrolling — used while full-screen gates are open. */
function setScrollLocked(locked) {
  document.body.style.overflow = locked ? 'hidden' : '';
}

/* -----------------------------------------------------
   1. PASSWORD SCREEN
   Only the exact name "Ishwari" (case-insensitive) unlocks
   the gift box. A wrong answer triggers a shake + message.
----------------------------------------------------- */
function initPasswordGate() {
  const screen = document.getElementById('password-screen');
  const form = document.getElementById('password-form');
  const input = document.getElementById('password-input');
  const box = document.querySelector('.password-box');
  const errorText = document.getElementById('password-error');
  const giftScreen = document.getElementById('gift-screen');

  setScrollLocked(true);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const value = input.value.trim().toLowerCase();

    if (value === 'ishwari') {
      screen.classList.add('hide');
      window.setTimeout(() => {
        giftScreen.classList.add('show');
      }, 500);
    } else {
      // Wrong answer: shake the box and reveal the error message
      box.classList.remove('shake');
      // Force reflow so the animation can re-trigger on repeated wrong tries
      void box.offsetWidth;
      box.classList.add('shake');
      errorText.classList.add('show');
      input.value = '';
      input.focus();
    }
  });
}

/* -----------------------------------------------------
   2. GIFT BOX
   Clicking the gift opens the lid + bow, releases a burst
   of golden light and small flying hearts, then hands off
   to the loading screen.
----------------------------------------------------- */
function initGiftBox() {
  const giftScreen = document.getElementById('gift-screen');
  const giftBox = document.getElementById('gift-box');
  const giftHint = document.getElementById('gift-hint');
  const loadingScreen = document.getElementById('loading-screen');

  let opened = false;

  giftBox.addEventListener('click', () => {
    if (opened) return;
    opened = true;

    giftBox.classList.add('opened');
    giftHint.style.opacity = '0';
    spawnGiftHearts(giftBox, 16);

    // Give the open animation time to play before moving on
    window.setTimeout(() => {
      giftScreen.classList.add('hide');
      loadingScreen.classList.add('show');
      const audio=document.getElementById("audio");

if(audio){

audio.play().catch(()=>{});

}
    }, 1300);
  });
}

/** Spawns small hearts that fly upward/outward from the gift box. */
function spawnGiftHearts(originEl, count) {
  const rect = originEl.getBoundingClientRect();
  const originX = rect.left + rect.width / 2;
  const originY = rect.top + rect.height / 3;

  for (let i = 0; i < count; i++) {
    const heart = document.createElement('span');
    heart.className = 'gift-heart';
    heart.textContent = '❤';
    heart.style.left = originX + 'px';
    heart.style.top = originY + 'px';
    heart.style.fontSize = (0.8 + Math.random() * 1) + 'rem';

    const fx = (Math.random() * 220 - 110) + 'px';
    const fy = -(120 + Math.random() * 140) + 'px';
    heart.style.setProperty('--fx', fx);
    heart.style.setProperty('--fy', fy);
    heart.style.animationDelay = (Math.random() * 0.3) + 's';

    document.body.appendChild(heart);
    window.setTimeout(() => heart.remove(), 1800);
  }
}

/* -----------------------------------------------------
   3. LOADING SCREEN
   Triggered once the gift box has been opened. Shows the
   glowing heart + message, then reveals the real site.
----------------------------------------------------- */
function initLoadingScreen() {
  const loadingScreen = document.getElementById('loading-screen');
  const navbar = document.getElementById('navbar');

  // Watch for the "show" class being added by initGiftBox(), then
  // run the fade-out sequence and unlock the page.
  const observer = new MutationObserver(() => {
    if (loadingScreen.classList.contains('show')) {
      observer.disconnect();
      window.setTimeout(() => {
        loadingScreen.classList.add('hide');
        loadingScreen.classList.remove('show');
        setScrollLocked(false);
        navbar.classList.add('visible');
      }, 2500);
    }
  });

  observer.observe(loadingScreen, { attributes: true, attributeFilter: ['class'] });
}

/* -----------------------------------------------------
   4. CURSOR GLOW
   A soft radial glow that follows the mouse on desktop.
----------------------------------------------------- */
function initCursorGlow() {
  const glow = document.getElementById('cursor-glow');
  if (!glow || window.matchMedia('(hover: none)').matches) return;

  let active = false;

  window.addEventListener('mousemove', (e) => {
    glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
    if (!active) {
      active = true;
      glow.classList.add('active');
    }
  });

  window.addEventListener('mouseleave', () => {
    glow.classList.remove('active');
    active = false;
  });
}

/* -----------------------------------------------------
   5. FLOATING HEARTS
   Continuously spawns small heart glyphs that float
   upward across the whole page.
----------------------------------------------------- */
function initFloatingHearts() {
  const container = document.getElementById('floating-hearts');
  const heartGlyphs = ['❤', '💕', '💗'];

  function spawnHeart() {
    const heart = document.createElement('span');
    heart.className = 'floating-heart';
    heart.textContent = heartGlyphs[Math.floor(Math.random() * heartGlyphs.length)];

    // Randomize starting position, drift, size, duration
    const startX = Math.random() * 100; // vw percentage
    const drift = (Math.random() * 160 - 80) + 'px';
    const duration = 8 + Math.random() * 6; // seconds
    const size = 0.9 + Math.random() * 1.1; // rem

    heart.style.left = startX + 'vw';
    heart.style.setProperty('--drift', drift);
    heart.style.animationDuration = duration + 's';
    heart.style.fontSize = size + 'rem';

    container.appendChild(heart);

    // Clean up after animation finishes
    window.setTimeout(() => heart.remove(), duration * 1000 + 500);
  }

  // Spawn a new heart every 900ms
  setInterval(() => {

spawnHeart();

if(Math.random()>0.6){

spawnHeart();

}

},800);
}

/* -----------------------------------------------------
   6. SCROLL REVEAL
   Uses IntersectionObserver to add ".in-view" to any
   element with fade-up / fade-left / fade-right / zoom-in
   as it enters the viewport (fires once per element).
----------------------------------------------------- */
function initScrollReveal() {
  const targets = document.querySelectorAll('.fade-up, .fade-left, .fade-right, .zoom-in');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  targets.forEach((el) => observer.observe(el));
}

/* -----------------------------------------------------
   7. FLOATING NAVBAR
   Glass navbar that hides on scroll-down, shows on
   scroll-up, and highlights the active section link.
----------------------------------------------------- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navLinks = Array.from(document.querySelectorAll('.nav-links a'));
  const sections = navLinks
    .map((link) => document.getElementById(link.dataset.nav))
    .filter(Boolean);

  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    // Hide/show based on scroll direction (small threshold avoids jitter)
    if (currentScrollY > lastScrollY && currentScrollY > 140) {
      navbar.classList.add('nav-hidden');
    } else {
      navbar.classList.remove('nav-hidden');
    }
    lastScrollY = currentScrollY;

    // Switch to a darker glass style over the final (black) section
    const finalSection = document.getElementById('final');
    const finalRect = finalSection.getBoundingClientRect();
    const overDark = finalRect.top < 120 && finalRect.bottom > 120;
    navbar.classList.toggle('on-dark', overDark);
  }, { passive: true });

  // Highlight the current section link using IntersectionObserver
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach((link) => {
          link.classList.toggle('active', link.dataset.nav === id);
        });
      }
    });
  }, { rootMargin: '-45% 0px -45% 0px' });

  sections.forEach((section) => sectionObserver.observe(section));
}

/* -----------------------------------------------------
   8. PARALLAX
   Elements tagged with data-parallax="factor" shift with
   scroll position for a subtle depth effect (hero layers).
----------------------------------------------------- */
function initParallax() {
  const layers = Array.from(document.querySelectorAll('[data-parallax]'));
  if (!layers.length) return;

  function update() {
    const scrollY = window.scrollY;
    layers.forEach((layer) => {
      const factor = parseFloat(layer.dataset.parallax) || 0;
      layer.style.transform = `translate3d(0, ${scrollY * factor}px, 0)`;
    });
    window.requestAnimationFrame(update);
  }

  window.requestAnimationFrame(update);
}

/* -----------------------------------------------------
   9. LETTER — FALLING PETALS
----------------------------------------------------- */
function initPetals() {
  const container = document.getElementById('petals');
  if (!container) return;
  const glyphs = ['❀', '❁', '✿'];

  function spawnPetal() {
    const petal = document.createElement('span');
    petal.className = 'petal';
    petal.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
    petal.style.left = Math.random() * 100 + '%';
    petal.style.setProperty('--pdrift', (Math.random() * 120 - 60) + 'px');
    petal.style.animationDuration = (6 + Math.random() * 4) + 's';
    petal.style.fontSize = (0.8 + Math.random() * 0.8) + 'rem';
    container.appendChild(petal);
    window.setTimeout(() => petal.remove(), 10000);
  }

  window.setInterval(spawnPetal, 1100);
}

/* -----------------------------------------------------
   10. TYPEWRITER EFFECT (Letter Section)
   Types out the letter text character by character once
   the letter card scrolls into view.
----------------------------------------------------- */
function initTypewriter() {
  const letterEl = document.getElementById('letter-text');
  const fullText = letterEl.getAttribute('data-full-text');
  letterEl.textContent = '';

  let hasTyped = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !hasTyped) {
        hasTyped = true;
        typeText(letterEl, fullText, 18);
        observer.disconnect();
      }
    });
  }, { threshold: 0.4 });

  observer.observe(letterEl);
}

function typeText(el, text, speed) {
  let i = 0;
  function step() {
    if (i < text.length) {
      el.textContent += text.charAt(i);
      i++;
      window.setTimeout(step, speed);
    }
  }
  step();
}

/* -----------------------------------------------------
   11. TIMELINE — GLOWING CONNECTOR LINE + DATE PULSE
----------------------------------------------------- */
function initTimelineGlowLine() {
  const line = document.getElementById('timeline-line-glow');
  const timeline = document.querySelector('.timeline');
  if (!line || !timeline) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        line.classList.add('filled');
        observer.disconnect();
      }
    });
  }, { threshold: 0.2 });
  observer.observe(timeline);

  // Pulse each date once its card scrolls into view
  const dates = document.querySelectorAll('[data-animate-date]');
  const dateObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('pulse');
        dateObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });
  dates.forEach((date) => dateObserver.observe(date));
}

/* -----------------------------------------------------
   12. REASONS I LOVE YOU — GRID GENERATION
   Builds 12 flip cards from a placeholder reasons array,
   with a small heart-particle burst on hover.
----------------------------------------------------- */
function initReasonsGrid() {
  const grid = document.getElementById('reasons-grid');

  const reasons = [
"Because your smile makes even my worst days better.",
"Because every moment with you feels like home.",
"Because you always believe in me.",
"Because your eyes are my favourite place to get lost.",
"Because your laugh is my favourite sound.",
"Because you're beautiful inside and out.",
"Because you care for everyone around you.",
"Because even your smallest efforts mean everything to me.",
"Because life became happier after meeting you.",
"Because you understand me without words.",
"Because you are my peace.",
"Because I would still choose you in every lifetime."
];

  reasons.forEach((reason, index) => {
    const card = document.createElement('div');
    card.className = 'reason-card';

    card.innerHTML = `
      <div class="reason-card-inner">
        <div class="reason-face reason-front">
          <span class="heart-icon">❤</span>
          <span class="reason-number">Reason ${String(index + 1).padStart(2, '0')}</span>
        </div>
        <div class="reason-face reason-back">
          <p>${reason}</p>
        </div>
      </div>
    `;

    // Support tap-to-flip on touch devices (hover already handles desktop)
    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
    });

    // A tiny burst of heart particles the first time a card is hovered
    let burstDone = false;
    card.addEventListener('mouseenter', () => {
      if (burstDone) return;
      burstDone = true;
      spawnReasonParticles(card, 6);
    });

    grid.appendChild(card);
  });
}

/** Spawns a few small hearts drifting up from a reason card. */
function spawnReasonParticles(originEl, count) {
  const rect = originEl.getBoundingClientRect();
  const originX = rect.left + rect.width / 2;
  const originY = rect.top + rect.height / 2;

  for (let i = 0; i < count; i++) {
    const particle = document.createElement('span');
    particle.className = 'reason-particle';
    particle.textContent = '❤';
    particle.style.left = originX + 'px';
    particle.style.top = originY + 'px';
    particle.style.fontSize = (0.6 + Math.random() * 0.5) + 'rem';
    particle.style.setProperty('--rx', (Math.random() * 60 - 30) + 'px');
    particle.style.animationDelay = (Math.random() * 0.2) + 's';
    document.body.appendChild(particle);
    window.setTimeout(() => particle.remove(), 1400);
  }
}

/* -----------------------------------------------------
   13. MEMORY GALLERY + MODAL
   Pinterest-style masonry with a hover tilt effect,
   captions, a like heart, and a fullscreen lightbox with
   previous / next / close controls and keyboard support.
----------------------------------------------------- */
function initGallery() {
  const items = Array.from(document.querySelectorAll('#gallery-grid .masonry-item'));
  const images = items.map((item) => item.querySelector('img'));
  const modal = document.getElementById('gallery-modal');
  const modalImage = document.getElementById('modal-image');
  const modalCaptionText = document.getElementById('modal-caption-text');
  const modalCaptionDate = document.getElementById('modal-caption-date');
  const closeBtn = document.getElementById('modal-close');
  const prevBtn = document.getElementById('modal-prev');
  const nextBtn = document.getElementById('modal-next');

  let currentIndex = 0;

  // Preload every gallery image up front for instant lightbox transitions
  images.forEach((img) => {
    const preloadImg = new Image();
    preloadImg.src = img.src;
  });

  function renderModal() {
    const item = items[currentIndex];
    const img = images[currentIndex];
    modalImage.src = img.src;
    modalImage.alt = img.alt;
    modalCaptionText.textContent = item.dataset.caption || '';
    modalCaptionDate.textContent = item.dataset.date || '';
  }

  function openModal(index) {
    currentIndex = index;
    renderModal();
    modal.classList.add('open');
    setScrollLocked(true);
  }

  function closeModal() {
    modal.classList.remove('open');
    setScrollLocked(false);
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % items.length;
    renderModal();
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    renderModal();
  }

  items.forEach((item, index) => {
    item.addEventListener('click', (e) => {
      // Clicking the heart likes the photo instead of opening the modal
      if (e.target.classList.contains('masonry-heart')) return;
      openModal(index);
    });

    // Gentle 3D tilt that follows the pointer within each card
    item.addEventListener('mousemove', (e) => {
      const rect = item.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      item.style.transform = `perspective(700px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg) scale(1.02)`;
    });
    item.addEventListener('mouseleave', () => {
      item.style.transform = '';
    });

    const heart = item.querySelector('.masonry-heart');
    if (heart) {
      heart.addEventListener('click', (e) => {
        e.stopPropagation();
        heart.classList.toggle('liked');
      });
    }
  });

  closeBtn.addEventListener('click', closeModal);
  nextBtn.addEventListener('click', showNext);
  prevBtn.addEventListener('click', showPrev);

  // Close when clicking the dark backdrop (but not the image itself)
  modal.querySelector('.modal-backdrop').addEventListener('click', closeModal);

  // Keyboard support: Escape closes, arrows navigate
  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('open')) return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });
}

/* -----------------------------------------------------
   14. RELATIONSHIP COUNTER
   Counts up from a fixed start date, updating every
   second with a small glow "tick" on each digit change.
----------------------------------------------------- */
function initCounter() {
  // Relationship start date: 20 February 2026, midnight local time
  const startDate = new Date('2026-02-20T00:00:00');

  const daysEl = document.getElementById('count-days');
  const hoursEl = document.getElementById('count-hours');
  const minutesEl = document.getElementById('count-minutes');
  const secondsEl = document.getElementById('count-seconds');

  function setIfChanged(el, value) {
    const formatted = String(value).padStart(2, '0');
    if (el.textContent !== formatted) {
      el.textContent = formatted;
      el.classList.remove('tick');
      void el.offsetWidth; // restart the animation
      el.classList.add('tick');
    }
  }

  function updateCounter() {
    const now = new Date();
    let diff = now - startDate; // milliseconds since the start date

    // If the start date is in the future, show zeros
    if (diff < 0) diff = 0;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    setIfChanged(daysEl, days);
    setIfChanged(hoursEl, hours);
    setIfChanged(minutesEl, minutes);
    setIfChanged(secondsEl, seconds);
  }

  updateCounter();
  window.setInterval(updateCounter, 1000);
}

/* -----------------------------------------------------
   15. MUSIC PLAYER
   Custom controls around a plain <audio> element:
   play/pause, spinning vinyl + tonearm, wave visualizer,
   and a seekable progress bar.
----------------------------------------------------- */
function initMusicPlayer() {
  const audio = document.getElementById('audio');
  const playPauseBtn = document.getElementById('play-pause-btn');
  const playIcon = document.getElementById('play-icon');
  const pauseIcon = document.getElementById('pause-icon');
  const vinyl = document.getElementById('vinyl');
  const vinylArm = document.getElementById('vinyl-arm');
  const progressBar = document.getElementById('progress-bar');
  const progressFill = document.getElementById('progress-fill');
  const currentTimeEl = document.getElementById('current-time');
  const durationTimeEl = document.getElementById('duration-time');
  const waveVisualizer = document.getElementById('wave-visualizer');

  function formatTime(seconds) {
    if (Number.isNaN(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${String(s).padStart(2, '0')}`;
  }

  playPauseBtn.addEventListener('click', () => {
    if (audio.paused) {
      audio.play().catch(() => {
        // Autoplay/playback might fail if music/song.mp3 has not been added yet.
        console.warn('Add your song file at music/song.mp3 to enable playback.');
      });
    } else {
      audio.pause();
    }
  });

  audio.addEventListener('play', () => {
    playIcon.style.display = 'none';
    pauseIcon.style.display = 'block';
    vinyl.classList.add('playing');
    vinylArm.classList.add('playing');
    waveVisualizer.classList.add('playing');
  });

  audio.addEventListener('pause', () => {
    playIcon.style.display = 'block';
    pauseIcon.style.display = 'none';
    vinyl.classList.remove('playing');
    vinylArm.classList.remove('playing');
    waveVisualizer.classList.remove('playing');
  });

  audio.addEventListener('loadedmetadata', () => {
    durationTimeEl.textContent = formatTime(audio.duration);
  });

  audio.addEventListener('timeupdate', () => {
    const percent = (audio.currentTime / audio.duration) * 100 || 0;
    progressFill.style.width = percent + '%';
    currentTimeEl.textContent = formatTime(audio.currentTime);
  });

  audio.addEventListener('ended', () => {
    vinyl.classList.remove('playing');
    vinylArm.classList.remove('playing');
    waveVisualizer.classList.remove('playing');
    playIcon.style.display = 'block';
    pauseIcon.style.display = 'none';
  });

  // Click anywhere on the progress bar to seek
  progressBar.addEventListener('click', (e) => {
    const rect = progressBar.getBoundingClientRect();
    const clickRatio = (e.clientX - rect.left) / rect.width;
    if (!Number.isNaN(audio.duration)) {
      audio.currentTime = clickRatio * audio.duration;
    }
  });
}

/* -----------------------------------------------------
   16. BIRTHDAY CAKE — BLOW CANDLES, SMOKE, BALLOONS, CONFETTI
----------------------------------------------------- */
function initCake() {
  const blowBtn = document.getElementById('blow-btn');
  const candles = document.querySelectorAll('#candle-row .candle');
  const balloonsContainer = document.getElementById('balloons');

  blowBtn.addEventListener('click', () => {
    candles.forEach((candle, index) => {
      window.setTimeout(() => candle.classList.add('blown'), index * 150);
    });
    launchConfettiBurst(40);
    launchBalloons(balloonsContainer, 8);
    blowBtn.textContent = 'Happy Birthday! 🎉';
    blowBtn.disabled = true;
  });
}

/** Sends a handful of balloons rising up past the cake. */
function launchBalloons(container, count) {
  if (!container) return;
  const colors = ['#E57399', '#D8B4A0', '#F4D03F', '#f19bb7'];

  for (let i = 0; i < count; i++) {
    const balloon = document.createElement('div');
    balloon.className = 'balloon';
    balloon.style.left = (10 + Math.random() * 80) + '%';
    balloon.style.background = colors[Math.floor(Math.random() * colors.length)];
    balloon.style.setProperty('--bx', (Math.random() * 80 - 40) + 'px');
    balloon.style.animationDelay = (Math.random() * 0.6) + 's';

    container.appendChild(balloon);
    window.requestAnimationFrame(() => balloon.classList.add('rise'));
    window.setTimeout(() => balloon.remove(), 5500);
  }
}

/* Simple DOM-based confetti burst used for the cake celebration. */
function launchConfettiBurst(count) {
  const colors = ['#E57399', '#D8B4A0', '#F4D03F', '#FAF7F2', '#2C2C2C'];

  for (let i = 0; i < count; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = Math.random() * 100 + 'vw';
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDuration = (2.5 + Math.random() * 2) + 's';
    piece.style.opacity = String(0.7 + Math.random() * 0.3);
    piece.style.transform = `rotate(${Math.random() * 360}deg)`;
    document.body.appendChild(piece);

    window.setTimeout(() => piece.remove(), 5000);
  }
}

/* -----------------------------------------------------
   17. FINAL SURPRISE — STAGED TYPING, FIREWORKS, CONFETTI
----------------------------------------------------- */
function initFinalSurprise() {
  const finalBtn = document.getElementById('final-btn');
  const finalModal = document.getElementById('final-modal');
  const finalClose = document.getElementById('final-close');
  const confettiCanvas = document.getElementById('confetti-canvas');
  const fireworksCanvas = document.getElementById('fireworks-canvas');
  const stageText = document.getElementById('final-stage-text');
  const cursor = document.getElementById('final-cursor');
  const reveal = document.getElementById('final-reveal');

  const stages=[

"The world became brighter...\n\nthe day\n\nYOU\n\nwere born.",

"Happy Birthday\n\nIshwari ❤️",

"In every lifetime...\n\nI'd still choose you."

];

  let confettiAnimationId = null;
  let fireworksAnimationId = null;

  function runStages(index) {
    if (index >= stages.length) {
      // Final reveal: hide the typed cursor, show the signature block, launch fireworks
      cursor.classList.add('hidden');
      reveal.classList.add('show');
      document.getElementById("final-name").textContent="Forever Yours,\nOm ❤️";
      fireworksAnimationId = startFireworks(fireworksCanvas);
      return;
    }

    stageText.textContent = '';
    typeStageText(stageText, stages[index], 45, () => {
      window.setTimeout(() => runStages(index + 1), 1100);
    });
  }

  finalBtn.addEventListener('click', () => {
    finalModal.classList.add('open');
    setScrollLocked(true);
    reveal.classList.remove('show');
    cursor.classList.remove('hidden');
    confettiAnimationId = startCanvasConfetti(confettiCanvas);
    runStages(0);
  });

  finalClose.addEventListener('click', () => {
    finalModal.classList.remove('open');
    setScrollLocked(false);
    if (confettiAnimationId) {
      window.cancelAnimationFrame(confettiAnimationId);
      confettiAnimationId = null;
    }
    if (fireworksAnimationId) {
      window.cancelAnimationFrame(fireworksAnimationId);
      fireworksAnimationId = null;
    }
  });
}

/** Types text (preserving \n as line breaks) into an element, then calls onDone. */
function typeStageText(el, text, speed, onDone) {
  let i = 0;
  function step() {
    if (i < text.length) {
      el.textContent += text.charAt(i);
      i++;
      window.setTimeout(step, speed);
    } else if (onDone) {
      onDone();
    }
  }
  step();
}

/* Canvas-based confetti animation loop for the final surprise modal.
   Returns the latest requestAnimationFrame id so the caller can cancel it. */
function startCanvasConfetti(canvas) {
  const ctx = canvas.getContext('2d');
  const colors = ['#E57399', '#D8B4A0', '#F4D03F', '#FFFFFF'];

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const particles = Array.from({ length: 140 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * -canvas.height,
    size: 4 + Math.random() * 6,
    speedY: 2 + Math.random() * 3,
    speedX: -1.5 + Math.random() * 3,
    rotation: Math.random() * 360,
    rotationSpeed: -6 + Math.random() * 12,
    color: colors[Math.floor(Math.random() * colors.length)]
  }));

  let rafId;

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p) => {
      p.y += p.speedY;
      p.x += p.speedX;
      p.rotation += p.rotationSpeed;

      // Recycle particles that fall past the bottom
      if (p.y > canvas.height) {
        p.y = -10;
        p.x = Math.random() * canvas.width;
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      ctx.restore();
    });

    rafId = window.requestAnimationFrame(draw);
  }

  draw();
  return rafId;
}

/** Canvas fireworks: periodic bursts of particles that expand and fade. */
function startFireworks(canvas) {
  const ctx = canvas.getContext('2d');
  const colors = ['#E57399', '#F4D03F', '#D8B4A0', '#FFFFFF'];
  let bursts = [];
  let rafId;
  let lastLaunch = 0;

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function launchBurst() {
    const originX = canvas.width * (0.2 + Math.random() * 0.6);
    const originY = canvas.height * (0.2 + Math.random() * 0.35);
    const color = colors[Math.floor(Math.random() * colors.length)];
    const particles = Array.from({ length: 46 }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 3.5;
      return {
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1
      };
    });
    bursts.push({ particles, color });
  }

  function draw(time) {
    ctx.fillStyle = 'rgba(13, 10, 11, 0.18)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (time - lastLaunch > 900) {
      launchBurst();
      lastLaunch = time;
    }

    bursts.forEach((burst) => {
      burst.particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.02; // gentle gravity
        p.life -= 0.012;

        if (p.life > 0) {
          ctx.globalAlpha = Math.max(p.life, 0);
          ctx.fillStyle = burst.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      });
    });

    bursts = bursts.filter((burst) => burst.particles.some((p) => p.life > 0));

    rafId = window.requestAnimationFrame(draw);
  }

  rafId = window.requestAnimationFrame(draw);
  return rafId;
}
document.querySelectorAll('a[href^="#"]').forEach(anchor=>{

anchor.addEventListener("click",function(e){

e.preventDefault();

document.querySelector(this.getAttribute("href")).scrollIntoView({

behavior:"smooth"

});

});

});
/* -----------------------------------------------------
   18. STARFIELD BACKGROUND (Final Surprise section)
----------------------------------------------------- */
function initStars() {
  const starsContainer = document.getElementById('stars');
  const starCount = 90;

  for (let i = 0; i < starCount; i++) {
    const star = document.createElement('span');
    star.className = 'star';
    star.style.top = Math.random() * 100 + '%';
    star.style.left = Math.random() * 100 + '%';
    star.style.animationDuration = (2 + Math.random() * 3) + 's';
    star.style.animationDelay = Math.random() * 3 + 's';
    starsContainer.appendChild(star);
  }
}