import { gsap } from '../lib/gsap.min.js';

/**
 * 애니메이션 유틸리티 함수 모음
 */

export const animation = {
  /**
   * 요소를 위로 올라가는 애니메이션을 적용합니다.
   * @param {string} selector - 애니메이션을 적용할 요소 선택자
   * @param {number} duration - 애니메이션 지속 시간 (ms)
   * @param {Object} options - 추가 옵션
   */
  animateUp(selector, duration = 400, options = {}) {
    const { threshold = 0.1, delay = 0, y = 50 } = options;
    const elements = document.querySelectorAll(selector);

    if (!elements.length) return;

    elements.forEach((element) => {
      gsap.set(element, { y, opacity: 0 });

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              gsap.to(entry.target, {
                y: 0,
                opacity: 1,
                duration: duration / 1000,
                delay: delay / 1000,
                ease: 'power3.out',
                onComplete: () => {
                  observer.unobserve(entry.target);
                },
              });
            }
          });
        },
        { threshold }
      );

      observer.observe(element);
    });
  },

  /**
   * 스크롤 트리거 애니메이션을 설정합니다.
   * @param {Object} options - ScrollTrigger 옵션
   * @returns {Object} - ScrollTrigger 인스턴스
   */
  createScrollTrigger(options) {
    return gsap.registerPlugin(ScrollTrigger).create({
      ...options,
      markers: false,
    });
  },

  /**
   * 요소를 페이드 인/아웃합니다.
   * @param {HTMLElement} element - 대상 요소
   * @param {Object} options - GSAP 옵션
   */
  fade(element, options = {}) {
    const defaults = {
      opacity: 1,
      duration: 0.3,
      ease: 'power2.inOut',
    };

    return gsap.to(element, { ...defaults, ...options });
  },

  /**
   * 요소를 슬라이드합니다.
   * @param {HTMLElement} element - 대상 요소
   * @param {Object} options - GSAP 옵션
   */
  slide(element, options = {}) {
    const defaults = {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: 'power3.out',
    };

    return gsap.to(element, { ...defaults, ...options });
  },

  /**
   * 애니메이션을 일시 정지합니다.
   * @param {gsap.core.Timeline | gsap.core.Tween} animation - 일시 정지할 애니메이션
   */
  pause(animation) {
    if (animation) {
      animation.pause();
    }
  },

  /**
   * 애니메이션을 재개합니다.
   * @param {gsap.core.Timeline | gsap.core.Tween} animation - 재개할 애니메이션
   */
  resume(animation) {
    if (animation) {
      animation.play();
    }
  },
};
