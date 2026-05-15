/* ═══════════════════════════════════════════════════════════════════
   PRELOADER — GSAP countdown + exit animation
═══════════════════════════════════════════════════════════════════ */
export function initPreloader(onComplete) {
  const preloader = document.getElementById('preloader');
  const preloaderCount = document.querySelector('.preloader-count');
  const preloaderBar = document.querySelector('.preloader-bar');

  if (typeof gsap === 'undefined' || !preloader) {
    if (onComplete) onComplete();
    return;
  }

  const loadTL = gsap.timeline({
    onComplete: () => {
      clearTimeout(window.__failsafeTimer);
      gsap.to(preloader, {
        y: '-100%', duration: 1.1, ease: 'expo.inOut',
        onComplete: () => {
          preloader.style.display = 'none';
          if (onComplete) onComplete();
        }
      });
      gsap.to(preloaderBar, { opacity: 0, duration: .4 });
    }
  });

  loadTL.to({ val: 0 }, {
    val: 100, duration: 1.6, ease: 'power2.out',
    onUpdate: function () {
      const v = Math.round(this.targets()[0].val);
      if (preloaderCount) preloaderCount.textContent = v + '%';
      if (preloaderBar) preloaderBar.style.width = v + '%';
    }
  });
}
