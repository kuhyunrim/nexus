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
  const elements = typeof selector === 'string' ? document.querySelectorAll(selector) : selector;

  if (!elements.length) {
    return;
  }

  elements.forEach((element) => {
    element.style.willChange = 'transition: transform 0.6s ease-in-out, background-color 0.6s ease-in-out;';
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

// 이미지 아코디언 기능
function initImageAccordion() {
  // 콘텐츠 높이 설정 헬퍼 함수
  const setContentHeight = (content, isOpen) => {
    if (isOpen) {
      content.style.maxHeight = 'none';
      content.style.height = 'auto';
      content.style.overflow = 'visible';
      content.style.paddingTop = '20px';
      content.style.paddingBottom = '20px';

      const height = content.scrollHeight;
      content.style.maxHeight = height + 40 + 'px';
      content.style.height = '';
      content.style.overflow = 'hidden';
      content.style.opacity = '1';
    } else {
      content.style.maxHeight = '0';
      content.style.opacity = '0';
      content.style.paddingTop = '0';
      content.style.paddingBottom = '0';
    }
    content.style.transition = 'all 0.3s ease';
  };

  // 아이콘 상태 설정 헬퍼 함수
  // const setIconState = (icon, isActive) => {
  //   icon.style.transition = 'transform 0.3s ease';
  //   icon.style.transform = isActive ? 'rotate(45deg)' : 'rotate(0deg)';
  // };

  // 이미지 업데이트 헬퍼 함수
  const updateImage = (button, imageContainer) => {
    const imageSrc = button.getAttribute('data-image');
    const img = imageContainer?.querySelector('img');
    if (img && imageSrc) {
      img.style.opacity = '0';
      setTimeout(() => {
        img.src = imageSrc;
        img.alt = button.querySelector('.image-accordion__title').textContent;
        img.style.opacity = '1';
      }, 150);
    }
  };

  document.querySelectorAll('.image-accordion').forEach((accordion) => {
    const items = accordion.querySelectorAll('.image-accordion__item');
    const buttons = accordion.querySelectorAll('.image-accordion__button');
    const imageContainer = accordion.querySelector('.image-accordion__image');

    // 이미지 요소 생성
    if (imageContainer && !imageContainer.querySelector('img')) {
      const img = document.createElement('img');
      img.className = 'image-accordion__img';
      Object.assign(img.style, {
        width: '100%',
        height: 'auto',
        transition: 'opacity 0.6s ease',
      });
      imageContainer.appendChild(img);
    }

    // 초기 이미지 설정
    const activeItem = accordion.querySelector('.image-accordion__item.is-active');
    if (activeItem && imageContainer) {
      const activeButton = activeItem.querySelector('.image-accordion__button');
      updateImage(activeButton, imageContainer);
    }

    // 버튼 클릭 이벤트 처리
    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        const currentItem = button.closest('.image-accordion__item');

        // 이미 활성화된 아이템 클릭 시 무시 (항상 하나는 열려있도록)
        if (currentItem.classList.contains('is-active')) return;

        // 스크롤 위치 보정을 위한 현재 상태 저장
        const scrollY = window.scrollY;
        const accordionRect = accordion.getBoundingClientRect();
        const accordionTop = accordionRect.top + scrollY;
        const isAccordionAboveViewport = accordionTop < scrollY;

        // 현재 활성 아이템의 높이 측정
        const activeItem = accordion.querySelector('.image-accordion__item.is-active');
        const activeContent = activeItem?.querySelector('.image-accordion__content');
        const oldHeight = activeContent ? activeContent.scrollHeight : 0;

        // 모든 아이템 비활성화
        items.forEach((item) => {
          item.classList.remove('is-active');
          const content = item.querySelector('.image-accordion__content');
          const icon = item.querySelector('.image-accordion__icon');

          if (content) setContentHeight(content, false);
          // if (icon) setIconState(icon, false);
        });

        // 클릭한 아이템 활성화
        currentItem.classList.add('is-active');
        const content = currentItem.querySelector('.image-accordion__content');
        const icon = currentItem.querySelector('.image-accordion__icon');

        if (content) {
          // 새로운 높이 측정을 위해 임시로 열기
          content.style.maxHeight = 'none';
          content.style.height = 'auto';
          content.style.overflow = 'visible';
          content.style.paddingTop = '20px';
          content.style.paddingBottom = '20px';

          const newHeight = content.scrollHeight;
          const heightDiff = newHeight - oldHeight;

          // 원래 상태로 되돌리고 애니메이션 시작
          content.offsetHeight; // 강제 리플로우
          setContentHeight(content, true);

          // 아코디언이 뷰포트 위에 있고 높이가 증가했을 때만 스크롤 보정
          if (isAccordionAboveViewport && heightDiff > 0) {
            // 애니메이션 완료 후 스크롤 위치 보정
            setTimeout(() => {
              const newScrollY = scrollY + heightDiff;
              window.scrollTo({
                top: newScrollY,
                behavior: 'auto', // 즉시 이동
              });
            }, 300); // 애니메이션 시간과 동일
          }
        }
        // if (icon) setIconState(icon, true);

        // 이미지 업데이트
        updateImage(button, imageContainer);
      });
    });

    // 초기 상태 설정
    items.forEach((item) => {
      const content = item.querySelector('.image-accordion__content');
      const icon = item.querySelector('.image-accordion__icon');
      const isActive = item.classList.contains('is-active');

      if (content) setContentHeight(content, isActive);
      // if (icon) setIconState(icon, isActive);
    });
  });
}

const progressSwiper = new Swiper('.progress-swiper', {
  slidesPerView: 'auto',
  spaceBetween: 40,
  speed: 1000,
  pagination: {
    el: '.progress-swiper__pagination',
    type: 'progressbar',
  },
});

document.addEventListener('DOMContentLoaded', () => {
  handleScroll();
  initImageAccordion();

  animateUp('.rise', 400, {
    threshold: 0.1,
  });
});
