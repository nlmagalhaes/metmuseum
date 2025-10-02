// script.js - carrossel com autoplay, arraste e botões.
// Regras: mostra N cards conforme largura; autoplay 5s; pausa quando o usuário interage.

const track = document.querySelector('.carousel-track');
const btnLeft = document.querySelector('.carousel-btn.left');
const btnRight = document.querySelector('.carousel-btn.right');

let index = 0;
let autoplayInterval = null;
let isInteracting = false;

const cardSelector = '.card';

function getCardWidth() {
  const card = document.querySelector(cardSelector);
  if (!card) return 330;
  const style = getComputedStyle(card);
  const marginRight = parseFloat(style.marginRight || 0);
  const marginLeft = parseFloat(style.marginLeft || 0);
  return Math.round(card.offsetWidth + marginLeft + marginRight);
}

function getCardsPerView() {
  const containerWidth = document.querySelector('.carousel-container').offsetWidth;
  const cw = getCardWidth();
  if (containerWidth < cw * 1.5) return 1;
  if (containerWidth < cw * 2.5) return 2;
  return 3;
}

function updateCarousel() {
  const cw = getCardWidth();
  const maxIndex = Math.max(0, document.querySelectorAll(cardSelector).length - getCardsPerView());
  index = Math.max(0, Math.min(index, maxIndex));
  track.scrollTo({
    left: index * cw,
    behavior: 'smooth'
  });
}

// Buttons
btnRight && btnRight.addEventListener('click', () => {
  const totalCards = document.querySelectorAll(cardSelector).length;
  const maxIndex = Math.max(0, totalCards - getCardsPerView());
  index = (index < maxIndex) ? index + 1 : 0;
  updateCarousel();
  restartAutoplay();
});

btnLeft && btnLeft.addEventListener('click', () => {
  const totalCards = document.querySelectorAll(cardSelector).length;
  const maxIndex = Math.max(0, totalCards - getCardsPerView());
  index = (index > 0) ? index - 1 : maxIndex;
  updateCarousel();
  restartAutoplay();
});

// Autoplay
function startAutoplay() {
  stopAutoplay();
  autoplayInterval = setInterval(() => {
    if (isInteracting) return;
    const totalCards = document.querySelectorAll(cardSelector).length;
    const maxIndex = Math.max(0, totalCards - getCardsPerView());
    index = (index < maxIndex) ? index + 1 : 0;
    updateCarousel();
  }, 5000);
}

function stopAutoplay() {
  if (autoplayInterval) clearInterval(autoplayInterval);
  autoplayInterval = null;
}

function restartAutoplay() {
  stopAutoplay();
  startAutoplay();
}

// Pause autoplay on pointer enter, resume on leave
track.addEventListener('mouseenter', () => { isInteracting = true; stopAutoplay(); });
track.addEventListener('mouseleave', () => { isInteracting = false; startAutoplay(); });

// Drag / swipe support using pointer events
let isDown = false;
let startX;
let scrollStart;

track.addEventListener('pointerdown', (e) => {
  isDown = true;
  isInteracting = true;
  track.setPointerCapture(e.pointerId);
  startX = e.clientX;
  scrollStart = track.scrollLeft;
  stopAutoplay();
});

track.addEventListener('pointermove', (e) => {
  if (!isDown) return;
  const x = e.clientX;
  const walk = startX - x;
  track.scrollLeft = scrollStart + walk;
});

track.addEventListener('pointerup', (e) => {
  if (!isDown) return;
  isDown = false;
  isInteracting = false;
  // calculate index based on scrollLeft
  const cw = getCardWidth();
  index = Math.round(track.scrollLeft / cw);
  updateCarousel();
  startAutoplay();
  try { track.releasePointerCapture(e.pointerId); } catch (err) {}
});

track.addEventListener('pointercancel', () => {
  isDown = false;
  isInteracting = false;
  startAutoplay();
});

// also respond to touchstart/touchend on older devices (fallback)
track.addEventListener('touchstart', () => { isInteracting = true; stopAutoplay(); });
track.addEventListener('touchend', () => { isInteracting = false; startAutoplay(); });

// When user scrolls with wheel horizontally (desktop touchpad), update index after a short debounce
let wheelTimer = null;
track.addEventListener('wheel', (e) => {
  if (Math.abs(e.deltaX) > 0) {
    isInteracting = true;
    stopAutoplay();
    clearTimeout(wheelTimer);
    wheelTimer = setTimeout(() => {
      const cw = getCardWidth();
      index = Math.round(track.scrollLeft / cw);
      updateCarousel();
      isInteracting = false;
      startAutoplay();
    }, 150);
  }
});

// On resize recalc
window.addEventListener('resize', () => {
  updateCarousel();
});

// init
document.addEventListener('DOMContentLoaded', () => {
  // small delay to ensure images loaded and sizes stable
  setTimeout(() => {
    updateCarousel();
    startAutoplay();
  }, 120);
});
