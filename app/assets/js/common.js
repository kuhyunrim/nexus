function animateUp(selector, delay = 200, options = {}) {
  const { threshold = 0.2, once = true } = options;

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

let lastScroll = 0;
const header = document.getElementById('header');
const headerHeight = header.offsetHeight;

const handleScroll = () => {
  const currentScroll = window.pageYOffset;

  if (currentScroll > 10) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }

  if (currentScroll > lastScroll && currentScroll > headerHeight) {
    header.classList.add('header--hidden');
  } else {
    header.classList.remove('header--hidden');
  }

  lastScroll = currentScroll;
};

let isScrolling;
window.addEventListener('scroll', () => {
  window.clearTimeout(isScrolling);
  isScrolling = setTimeout(handleScroll, 10);
});

function initImageAccordion() {
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

    const activeItem = accordion.querySelector('.image-accordion__item.is-active');
    if (activeItem && imageContainer) {
      const activeButton = activeItem.querySelector('.image-accordion__button');
      updateImage(activeButton, imageContainer);
    }

    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        const currentItem = button.closest('.image-accordion__item');

        if (currentItem.classList.contains('is-active')) return;

        const scrollY = window.scrollY;
        const accordionRect = accordion.getBoundingClientRect();
        const accordionTop = accordionRect.top + scrollY;
        const isAccordionAboveViewport = accordionTop < scrollY;

        const activeItem = accordion.querySelector('.image-accordion__item.is-active');
        const activeContent = activeItem?.querySelector('.image-accordion__content');
        const oldHeight = activeContent ? activeContent.scrollHeight : 0;

        items.forEach((item) => {
          item.classList.remove('is-active');
          const content = item.querySelector('.image-accordion__content');
          const icon = item.querySelector('.image-accordion__icon');

          if (content) setContentHeight(content, false);
        });

        currentItem.classList.add('is-active');
        const content = currentItem.querySelector('.image-accordion__content');
        const icon = currentItem.querySelector('.image-accordion__icon');

        if (content) {
          content.style.maxHeight = 'none';
          content.style.height = 'auto';
          content.style.overflow = 'visible';
          content.style.paddingTop = '20px';
          content.style.paddingBottom = '20px';

          const newHeight = content.scrollHeight;
          const heightDiff = newHeight - oldHeight;

          content.offsetHeight;
          setContentHeight(content, true);

          if (isAccordionAboveViewport && heightDiff > 0) {
            setTimeout(() => {
              const newScrollY = scrollY + heightDiff;
              window.scrollTo({
                top: newScrollY,
                behavior: 'auto',
              });
            }, 300);
          }
        }

        updateImage(button, imageContainer);
      });
    });

    items.forEach((item) => {
      const content = item.querySelector('.image-accordion__content');
      const icon = item.querySelector('.image-accordion__icon');
      const isActive = item.classList.contains('is-active');

      if (content) setContentHeight(content, isActive);
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

/**
 * 스크롤에 따라 히어로 섹션의 이미지를 확대하고 단계별 애니메이션을 제어합니다.
 */
const enlargeImageOnScroll = (() => {
  // GSAP 플러그인 등록
  gsap.registerPlugin(ScrollTrigger);
  
  // 설정 상수
  const CONFIG = {
    // 애니메이션 진행도에 따른 클래스 토글 임계값
    ENLARGE_THRESHOLD: 0.1,
    // 단계별 진행도 계산을 위한 기본값 (전체 진행도의 70%를 단계별로 분배)
    PROGRESS_RATIO: 0.7,
    // 단일 단계일 때의 추가 스크롤 비율 (단계가 1개일 때 더 긴 스크롤 적용)
    SINGLE_STEP_MULTIPLIER: 2
  };

  /**
   * 요소에서 클래스를 제거하는 헬퍼 함수
   * @param {HTMLElement} element - 대상 요소
   * @param {string[]} classNames - 제거할 클래스 이름 배열
   */
  const removeClasses = (element, classNames) => {
    classNames.forEach(className => {
      element.classList.remove(className);
    });
  };

  /**
   * 모든 스텝 요소 초기화
   * @param {NodeList} steps - 초기화할 스텝 요소들
   */
  const resetSteps = (steps) => {
    steps.forEach(step => {
      if (step) removeClasses(step, ['in', 'out']);
    });
  };

  /**
   * 애니메이션 초기화 및 설정
   */
  const init = () => {
    const container = document.querySelector('.hero-container');
    if (!container) return;

    const steps = container.querySelectorAll('.hero-step');
    const stepCount = steps.length;
    
    // 유효성 검사
    if (!stepCount) return;

    // 단계별 진행도 계산
    const progressStep = CONFIG.PROGRESS_RATIO / stepCount;
    const progressThresholds = Array.from(
      { length: stepCount },
      (_, i) => progressStep * (i + 1)
    );

    // ScrollTrigger 설정
    ScrollTrigger.create({
      trigger: container,
      start: 'top',
      end: `+=${(stepCount === 1 ? CONFIG.SINGLE_STEP_MULTIPLIER : stepCount) * 100}%`,
      pin: true,
      onEnter: () => resetSteps(steps),
      onLeave: () => resetSteps(steps),
      onLeaveBack: () => resetSteps(steps),
      onUpdate: (self) => {
        const { progress } = self;
        
        // 확대/축소 클래스 토글
        container.classList.toggle('enlarge', progress >= CONFIG.ENLARGE_THRESHOLD);
        
        // 모든 스텝 초기화
        resetSteps(steps);
        
        // 진행도에 따라 단계별로 'in' 클래스 추가
        progressThresholds.forEach((threshold, index) => {
          if (progress >= threshold && steps[index]) {
            steps[index].classList.add('in');
          }
        });
      }
    });
  };

  return { init };
})();

function goTop() {
  gsap.to('html, body', { duration: 0.5, scrollTop: 0, ease: Power3.easeOut });
}

document.addEventListener('DOMContentLoaded', () => {
  handleScroll();
  initImageAccordion();

  enlargeImageOnScroll.init();

  animateUp('.rise', 400, {
    threshold: 0.1,
  });
  goTop();
});
