function animteUp(selector, delay = 200) {
  const lines =
    typeof selector === 'string'
      ? document.querySelectorAll(selector)
      : selector;

  if (!('IntersectionObserver' in window)) {
    // 폴백: 지원하지 않는 브라우저에서는 즉시 실행
    lines.forEach((line, i) => {
      setTimeout(() => {
        line.classList.add('show');
      }, i * delay);
    });
    return;
  }

  let triggered = false;
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !triggered) {
          triggered = true;
          lines.forEach((line, i) => {
            setTimeout(() => {
              line.classList.add('show');
            }, i * delay);
          });
          obs.disconnect();
        }
      });
    },
    { threshold: 0.2 }
  ); // 20% 이상 보이면 트리거

  lines.forEach((line) => observer.observe(line));
}

document.addEventListener('DOMContentLoaded', () => {
  window.animteUp('.rise', 400);
});
