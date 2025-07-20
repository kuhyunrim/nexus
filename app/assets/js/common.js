/**
 * 요소가 화면에 보이면 위로 올라오는 애니메이션을 적용합니다.
 * @param {string|NodeList} selector - 애니메이션을 적용할 CSS 선택자 또는 NodeList
 * @param {number} [delay=200] - 각 요소의 애니메이션 간 지연 시간(밀리초)
 * @param {Object} [options={}] - 추가 옵션
 * @param {number} [options.threshold=0.2] - 요소가 몇 % 보일 때 애니메이션 시작할지 (0~1)
 * @param {boolean} [options.once=true] - 애니메이션을 한 번만 실행할지 여부
 * @example
 * // 기본 사용법
 * animateUp('.rise', 200);
 *
 * // 옵션 지정
 * animateUp('.fade-in', 150, { threshold: 0.3, once: true });
 */
function animateUp(selector, delay = 200, options = {}) {
  const { threshold = 0.2, once = true } = options;

  // 요소 가져오기
  const elements =
    typeof selector === 'string'
      ? document.querySelectorAll(selector)
      : selector;

  if (!elements.length) {
    return;
  }

  elements.forEach((element) => {
    element.style.willChange =
      'transition: transform 0.6s ease-in-out, background-color 0.6s ease-in-out;';
  });

  const runAnimation = (element, index) => {
    setTimeout(() => {
      element.classList.add('show');
      setTimeout(() => {
        element.style.willChange = '';
      }, 1000);
    }, index * delay);
  };

  if (!('IntersectionObserver' in window)) {
    elements.forEach((element, index) => runAnimation(element, index));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const index = Array.from(elements).indexOf(element);
          runAnimation(element, index);
          if (once) {
            observer.unobserve(element);
          }
        }
      });
    },
    {
      root: null,
      rootMargin: '0px',
      threshold: threshold,
    }
  );

  elements.forEach((element) => observer.observe(element));
}

// Header scroll behavior
let lastScroll = 0;
const header = document.getElementById('header');
const headerHeight = header.offsetHeight;

const handleScroll = () => {
  const currentScroll = window.pageYOffset;

  // Add/remove 'scrolled' class based on scroll position
  if (currentScroll > 10) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }

  // Show/hide header based on scroll direction
  if (currentScroll > lastScroll && currentScroll > headerHeight) {
    // Scrolling down
    header.classList.add('header--hidden');
  } else {
    // Scrolling up
    header.classList.remove('header--hidden');
  }

  lastScroll = currentScroll;
};

// Throttle scroll events for better performance
let isScrolling;
window.addEventListener('scroll', () => {
  window.clearTimeout(isScrolling);
  isScrolling = setTimeout(handleScroll, 10); // Reduced from 50ms to 10ms for faster response
});

document.addEventListener('DOMContentLoaded', () => {
  // Initialize header state
  handleScroll();

  animateUp('.rise', 400, {
    threshold: 0.1,
  });
});
