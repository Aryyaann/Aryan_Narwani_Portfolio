/* ═══════════════════════════════════════════════════════════════════
   HERO — Cinematic entrance animation
═══════════════════════════════════════════════════════════════════ */
export function runHeroEntrance() {
  if (typeof gsap === 'undefined') return;

  const masks = document.querySelectorAll('.hero-name .row-mask');
  const innerTexts = document.querySelectorAll('.hero-name .row-inner');

  // Initial state: text invisible, masks visible at scaleX 0
  gsap.set(innerTexts, { visibility: 'hidden' });
  gsap.set(masks, { scaleX: 0, transformOrigin: 'left' });

  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

  // 1. Photo background reveals from top (clip-path)
  tl.set('.hero-photo-bg img', { scale: 1.25, filter: 'brightness(0.7)' })
    .set('.hero-photo-bg', { clipPath: 'inset(0 0 100% 0)' })
    .to('.hero-photo-bg', {
      clipPath: 'inset(0 0 0% 0)', duration: 1.5, ease: 'expo.inOut'
    }, 0)
    .to('.hero-photo-bg img', {
      scale: 1.05, filter: 'brightness(1.35)', duration: 2, ease: 'expo.out'
    }, 0)

  // 2. Nav
    .from('.nav-logo', {
      y: -20, opacity: 0, duration: .7
    }, .4)
    .from('.nav-links a,.nav-cta', {
      y: -20, opacity: 0, duration: .7, stagger: .05
    }, .5)

  // 3. Hero tag
    .from('.hero-tag', { y: 30, opacity: 0, duration: .8 }, .7)

  // 4. NAME — cyan flash mask reveals each row
  //    First row: "Aryan"
    .to(masks[0], { scaleX: 1, duration: .45, ease: 'expo.in', transformOrigin: 'left' }, 1.0)
    .set(innerTexts[0], { visibility: 'visible' })
    .to(masks[0], { scaleX: 0, duration: .55, ease: 'expo.out', transformOrigin: 'right' })

  //    Second row: "Narwani."
    .to(masks[1], { scaleX: 1, duration: .45, ease: 'expo.in', transformOrigin: 'left' }, '-=.3')
    .set(innerTexts[1], { visibility: 'visible' })
    .to(masks[1], { scaleX: 0, duration: .55, ease: 'expo.out', transformOrigin: 'right' })

  // 5. Rest of content
    .from('.hero-meta', { y: 30, opacity: 0, duration: .8 }, '-=.5')
    .from('.hero-desc', { y: 30, opacity: 0, duration: .8 }, '-=.6')
    .from('.hero-actions a', { y: 30, opacity: 0, duration: .7, stagger: .08 }, '-=.5')
    .from('.hero-scroll', { opacity: 0, duration: 1 }, '-=.3');
}
