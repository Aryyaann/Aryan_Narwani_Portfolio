/* ═══════════════════════════════════════════════════════════════════
   LENIS — Smooth scroll setup
═══════════════════════════════════════════════════════════════════ */
export function initLenis() {
  if (typeof Lenis === 'undefined' || typeof gsap === 'undefined') return null;

  const lenis = new Lenis({
    duration: 1.2,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(time => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  return lenis;
}
