# NEXUS GAS 웹사이트

## 프로젝트 개요

NEXUS GAS의 공식 웹사이트로, 회사 소개, 사업 분야, 제품 정보, 채용 정보 등을 제공하는 반응형 웹사이트입니다.

## 주요 기능

- 반응형 웹 디자인
- 스크롤에 반응하는 헤더
- 부드러운 스크롤링 효과
- 이미지 갤러리
- 뉴스 및 미디어 섹션

## 기술 스택

- HTML5, CSS3, JavaScript
- SCSS (CSS 전처리기)
- Gulp (자동화 도구)
- Swiper.js (이미지 슬라이더)

## 개발 환경 설정

### 필요한 도구

- Node.js (v14 이상)
- npm 또는 yarn
- Git

### 설치 방법

1. 저장소 클론

```bash
git clone [저장소 URL]
cd nexus
```

2. 의존성 설치

```bash
npm install
# 또는
yarn install
```

3. 개발 서버 실행

```bash
npm run dev
# 또는
yarn dev
```

4. 프로덕션 빌드

```bash
npm run build
# 또는
yarn build
```

## 디렉토리 구조

```
app/
├── assets/
│   ├── css/       # 컴파일된 CSS 파일
│   ├── js/        # JavaScript 파일
│   ├── scss/      # SCSS 소스 파일
│   └── img/       # 이미지 파일
├── html/          # HTML 템플릿
└── inc/           # 인클루드 파일 (헤더, 푸터 등)
```

## 사용된 주요 라이브러리

- Lenis (부드러운 스크롤링)
- Swiper.js (슬라이더 컴포넌트)
- Gulp (자동화 빌드)

## 브라우저 지원

- Chrome (최신 버전)
- Firefox (최신 버전)
- Safari (최신 버전)
- Edge (최신 버전)
- IE11 (제한적 지원)
