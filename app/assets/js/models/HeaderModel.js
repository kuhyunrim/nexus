/**
 * 헤더 관련 데이터 모델
 */
export class HeaderModel {
  constructor() {
    this.isOpen = false;
    this.isScrolled = false;
    this.isMobile = window.innerWidth < 1024; // 모바일 뷰포트 여부
    this.listeners = {
      open: [],
      close: [],
      toggle: [],
      scroll: []
    };
  }

  /**
   * 헤더 열기
   */
  open() {
    if (this.isOpen) return;
    this.isOpen = true;
    this._notify('open');
    this._notify('toggle', true);
  }

  /**
   * 헤더 닫기
   */
  close() {
    if (!this.isOpen) return;
    this.isOpen = false;
    this._notify('close');
    this._notify('toggle', false);
  }

  /**
   * 헤더 토글
   */
  toggle() {
    this.isOpen ? this.close() : this.open();
  }

  /**
   * 스크롤 상태 업데이트
   * @param {boolean} isScrolled - 스크롤 여부
   */
  setScrolled(isScrolled) {
    if (this.isScrolled !== isScrolled) {
      this.isScrolled = isScrolled;
      this._notify('scroll', isScrolled);
    }
  }

  /**
   * 모바일 뷰포트 여부 설정
   * @param {boolean} isMobile - 모바일 뷰포트 여부
   */
  setIsMobile(isMobile) {
    this.isMobile = isMobile;
    // 모바일 뷰포트가 아닐 때는 헤더를 닫음
    if (!isMobile && this.isOpen) {
      this.close();
    }
  }

  /**
   * 이벤트 리스너 등록
   * @param {string} event - 이벤트 타입
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
   * @param {*} [data] - 전달할 데이터
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
   * 헤더가 열려있는지 확인
   * @returns {boolean}
   */
  isHeaderOpen() {
    return this.isOpen;
  }

  /**
   * 스크롤 여부 확인
   * @returns {boolean}
   */
  isHeaderScrolled() {
    return this.isScrolled;
  }

  /**
   * 모바일 뷰포트인지 확인
   * @returns {boolean}
   */
  isMobileViewport() {
    return this.isMobile;
  }
}
