/* ═══════════════════════════════════════════════════════════════════
   NAV — Hide on scroll down, reveal on scroll up
═══════════════════════════════════════════════════════════════════ */
export function initNav(lenis) {
  const nav = document.getElementById('mainNav');
  if (!nav) return;

  let lastY = 0;
  const handler = (y) => {
    if (y > lastY && y > 120) nav.style.transform = 'translateY(-120%)';
    else nav.style.transform = 'translateY(0)';
    lastY = y;
  };

  if (lenis) {
    lenis.on('scroll', ({ scroll }) => handler(scroll));
  } else {
    window.addEventListener('scroll', () => handler(window.scrollY), { passive: true });
  }
}
