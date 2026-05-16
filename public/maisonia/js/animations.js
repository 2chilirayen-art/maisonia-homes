// ===== Animations — small helpers =====
// Most animations are CSS-driven; this file provides a tiny stagger helper.
export function staggerReveal(selector, step = 80) {
  document.querySelectorAll(selector).forEach((el, i) => {
    el.style.transitionDelay = `${i * step}ms`;
  });
}
