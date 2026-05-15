/* ═══════════════════════════════════════════════════════════════════
   MAIN — Entry point: registers plugins and initialises all modules
═══════════════════════════════════════════════════════════════════ */
import { initLenis }       from './lenis.js';
import { initParticles }   from './particles.js';
import { initMarquee }     from './marquee.js';
import { initPreloader }   from './preloader.js';
import { runHeroEntrance } from './hero.js';
import { initNav }         from './nav.js';
import { initTransitions } from './transitions.js';
import { initAnimations }  from './animations.js';
import { initContact }     from './contact.js';

try {
  /* Register GSAP plugins */
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  /* Boot order matters: lenis first (ScrollTrigger needs it for tick sync) */
  const lenis = initLenis();

  initParticles();
  initMarquee();
  initPreloader(() => runHeroEntrance());
  initNav(lenis);
  initTransitions();
  initAnimations();
  initContact(lenis);

} catch (e) {
  console.error('Portfolio init error:', e);
  if (typeof window.__forceHidePreloader === 'function') {
    window.__forceHidePreloader();
  }
}
