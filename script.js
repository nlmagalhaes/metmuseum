const track = document.querySelector('.carousel-track');
const btnLeft = document.querySelector('.carousel-btn.left');
const btnRight = document.querySelector('.carousel-btn.right');

let index = 0;
const totalCards = document.querySelectorAll('.card').length;
const cardsPerView = 3;

btnRight.addEventListener('click', () => {
  if (index < totalCards - cardsPerView) {
    index++;
    updateCarousel();
  }
});

btnLeft.addEventListener('click', () => {
  if (index > 0) {
    index--;
    updateCarousel();
  }
});

function updateCarousel() {
  const cardWidth = document.querySelector('.card').offsetWidth + 30;
  track.scrollTo({
    left: index * cardWidth,
    behavior: 'smooth'
  });
}
