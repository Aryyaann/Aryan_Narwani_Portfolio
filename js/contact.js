/* ═══════════════════════════════════════════════════════════════════
   CONTACT — Form handler + smooth anchor scroll
═══════════════════════════════════════════════════════════════════ */
export function initContact(lenis) {
  /* ─── Form submit via Formspree ─── */
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"] span');
      btn.textContent = 'Sending...';

      try {
        const res = await fetch('https://formspree.io/f/meewzbpo', {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: new FormData(form)
        });

        if (res.ok) {
          btn.textContent = 'Sent ✓';
          form.reset();
          if (status) {
            status.style.display = 'block';
            status.style.color = '#00ffb3';
            status.textContent = "Message received. I'll get back to you soon.";
          }
        } else {
          btn.textContent = 'Send message →';
          if (status) {
            status.style.display = 'block';
            status.style.color = '#ff4d4d';
            status.textContent = 'Something went wrong. Try again or email directly.';
          }
        }
      } catch (err) {
        btn.textContent = 'Send message →';
        if (status) {
          status.style.display = 'block';
          status.style.color = '#ff4d4d';
          status.textContent = 'Something went wrong. Try again or email directly.';
        }
      }
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