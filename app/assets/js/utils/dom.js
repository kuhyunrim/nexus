/**
 * DOM 유틸리티 함수 모음
 */

export const dom = {
  /**
   * 요소를 선택합니다.
   * @param {string} selector - 선택자
   * @param {HTMLElement} parent - 부모 요소 (선택 사항)
   * @returns {HTMLElement}
   */
  select(selector, parent = document) {
    return parent.querySelector(selector);
  },

  /**
   * 여러 요소를 선택합니다.
   * @param {string} selector - 선택자
   * @param {HTMLElement} parent - 부모 요소 (선택 사항)
   * @returns {NodeList}
   */
  selectAll(selector, parent = document) {
    return parent.querySelectorAll(selector);
  },

  /**
   * 요소에 클래스를 토글합니다.
   * @param {HTMLElement} element - 대상 요소
   * @param {string} className - 토글할 클래스 이름
   * @param {boolean} force - 강제로 추가/제거할지 여부
   */
  toggleClass(element, className, force) {
    if (force === undefined) {
      element.classList.toggle(className);
    } else {
      element.classList.toggle(className, force);
    }
  },

  /**
   * 요소에 이벤트 리스너를 추가합니다.
   * @param {HTMLElement} element - 대상 요소
   * @param {string} event - 이벤트 타입
   * @param {Function} callback - 콜백 함수
   * @param {Object} options - 이벤트 옵션
   */
  on(element, event, callback, options = {}) {
    element.addEventListener(event, callback, options);
  },

  /**
   * 요소의 스타일을 설정합니다.
   * @param {HTMLElement} element - 대상 요소
   * @param {Object} styles - 스타일 객체
   */
  setStyles(element, styles) {
    Object.assign(element.style, styles);
  },

  /**
   * 요소를 화면 상단으로 스크롤합니다.
   * @param {HTMLElement} element - 스크롤할 요소
   * @param {Object} options - GSAP 옵션
   */
  scrollToTop(element, options = {}) {
    const defaults = {
      duration: 0.5,
      ease: 'power3.out'
    };
    
    gsap.to(element, {
      scrollTop: 0,
      ...defaults,
      ...options
    });
  }
};
