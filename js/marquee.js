/* ═══════════════════════════════════════════════════════════════════
   MARQUEE — Infinite GSAP loop
═══════════════════════════════════════════════════════════════════ */
export function initMarquee() {
  const marqueeTrack = document.getElementById('marqueeTrack');
  if (!marqueeTrack || typeof gsap === 'undefined') return;
  gsap.to(marqueeTrack, { xPercent: -50, duration: 35, ease: 'none', repeat: -1 });
}
