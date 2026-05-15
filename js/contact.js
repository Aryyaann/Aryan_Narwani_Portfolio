/* ═══════════════════════════════════════════════════════════════════
   CONTACT — Form handler + smooth anchor scroll
═══════════════════════════════════════════════════════════════════ */
export function initContact(lenis) {
  /* ─── Form submit ─── */
  const submitBtn = document.querySelector('.btn-submit');
  if (submitBtn) {
    submitBtn.addEventListener('click', e => {
      e.preventDefault();
      submitBtn.querySelector('span').textContent = 'Message sent ✓';
      submitBtn.style.pointerEvents = 'none';
      setTimeout(() => {
        submitBtn.querySelector('span').textContent = 'Send message →';
        submitBtn.style.pointerEvents = '';
      }, 3000);
    });
  }

  /* ─── Smooth anchor scroll via Lenis ─── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href.length <= 1) return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        if (lenis) {
          lenis.scrollTo(target, { offset: -20, duration: 1.4 });
        } else {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });
}
