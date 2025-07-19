const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  smoothTouch: false,
  touchMultiplier: 2,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

const mainSwiper = new Swiper('.main-swiper__inner .swiper', {
  spaceBetween: 30,
  effect: 'fade',
  centeredSlides: true,
  speed: 1000,
  loop: true,
  pagination: {
    el: '.main-swiper__pagination',
    clickable: true,
    bulletClass: 'main-swiper__bullet',
    bulletActiveClass: 'is-active',
  },
  autoplay: {
    delay: 4000,
    disableOnInteraction: false,
  },
});
const librarySwiper = new Swiper('.main-library__gallery .swiper', {
  slidesPerView: 'auto',
  loop: true,
  spaceBetween: 100,
  speed: 1000,
});
const mediaSwiper = new Swiper('.main-media__swiper', {
  slidesPerView: 'auto',
  spaceBetween: 40,
  speed: 1000,
  pagination: {
    el: '.main-media__pagination',
    type: 'progressbar',
  },
});

// DOM이 완전히 로드된 후 실행
document.addEventListener('DOMContentLoaded', () => {
  animateUp('.up', 50, {
    threshold: 1,
  });
  animateUp('.main-sustainability__feature', 500, {
    threshold: 0.4,
  });
  animateUp('.section-header', 500, {
    threshold: 0.2,
  });
});
