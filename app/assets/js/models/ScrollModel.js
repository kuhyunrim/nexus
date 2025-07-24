/**
 * 스크롤 관련 데이터 모델
 */
export class ScrollModel {
  constructor() {
    this.scrollY = window.scrollY;
    this.lastScrollY = 0;
    this.scrollDirection = 'down';
    this.scrollThreshold = 100;
    this.listeners = {
      scroll: [],
      scrollEnd: []
    };

    this._init();
  }

  _init() {
    this._setupEventListeners();
  }

  _setupEventListeners() {
    let scrollTimeout;
    
    window.addEventListener('scroll', () => {
      this.lastScrollY = this.scrollY;
      this.scrollY = window.scrollY;
      this.scrollDirection = this.scrollY > this.lastScrollY ? 'down' : 'up';
      
      // 스크롤 이벤트 발생 시 모든 리스너에 알림
      this._notify('scroll', {
        scrollY: this.scrollY,
        direction: this.scrollDirection
      });

      // 스크롤이 끝났을 때를 감지
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        this._notify('scrollEnd', {
          scrollY: this.scrollY,
          direction: this.scrollDirection
        });
      }, 100);
    }, { passive: true });
  }

  /**
   * 이벤트 리스너 등록
   * @param {string} event - 이벤트 타입 ('scroll' 또는 'scrollEnd')
   * @param {Function} callback - 콜백 함수
   */
  on(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event].push(callback);
    }
  }

  /**
   * 이벤트 리스너 제거
   * @param {string} event - 이벤트 타입
   * @param {Function} callback - 제거할 콜백 함수
   */
  off(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(
        listener => listener !== callback
      );
    }
  }

  /**
   * 등록된 모든 리스너에 이벤트 알림
   * @param {string} event - 이벤트 타입
   * @param {Object} data - 전달할 데이터
   */
  _notify(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => {
        if (typeof callback === 'function') {
          callback(data);
        }
      });
    }
  }

  /**
   * 현재 스크롤 위치가 임계값을 넘었는지 확인
   * @returns {boolean}
   */
  isScrolledPastThreshold() {
    return this.scrollY > this.scrollThreshold;
  }

  /**
   * 스크롤 임계값 설정
   * @param {number} threshold - 새로운 임계값
   */
  setScrollThreshold(threshold) {
    this.scrollThreshold = threshold;
  }

  /**
   * 현재 스크롤 방향 가져오기
   * @returns {string} 'up' 또는 'down'
   */
  getScrollDirection() {
    return this.scrollDirection;
  }

  /**
   * 현재 스크롤 위치 가져오기
   * @returns {number} 현재 스크롤 Y 위치
   */
  getScrollY() {
    return this.scrollY;
  }

  /**
   * 특정 요소로 스크롤
   * @param {HTMLElement} element - 스크롤할 대상 요소
   * @param {Object} options - 스크롤 옵션
   */
  scrollToElement(element, options = {}) {
    if (!element) return;
    
    const defaults = {
      offset: 0,
      duration: 0.5,
      ease: 'power3.out'
    };
    
    const { offset, duration, ease } = { ...defaults, ...options };
    
    const targetY = window.scrollY + element.getBoundingClientRect().top + offset;
    
    gsap.to(window, {
      scrollTo: {
        y: targetY,
        autoKill: true
      },
      duration,
      ease,
      onComplete: options.onComplete
    });
  }
}
