/* ═══════════════════════════════════════════════════════════════════
   CONTACT — Form handler + smooth anchor scroll
═══════════════════════════════════════════════════════════════════ */

const SUPABASE_URL = 'https://qyuaekusrzttoueebpsn.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5dWFla3Vzcnp0dG91ZWVicHNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExNjkwODksImV4cCI6MjA5Njc0NTA4OX0.62UWR5cDoPTIPm41fBucrRQozazYuXX1_tQKYF7hhQQ';
const FORMSPREE_ID = 'Tmeewzbpo';

export function initContact(lenis) {
  /* ─── Form submit ─── */
  const form   = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"] span');
      btn.textContent = 'Sending...';

      const data = {
        name:    form.querySelector('[name="name"]').value,
        email:   form.querySelector('[name="email"]').value,
        subject: form.querySelector('[name="subject"]').value,
        message: form.querySelector('[name="message"]').value,
      };

      try {
        /* ── 1. Guardar en Supabase ── */
        await fetch(`${SUPABASE_URL}/rest/v1/contacts`, {
          method:  'POST',
          headers: {
            'Content-Type':  'application/json',
            'apikey':        SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Prefer':        'return=minimal',
          },
          body: JSON.stringify(data),
        });

        /* ── 2. Enviar email via Formspree ── */
        const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
          method:  'POST',
          headers: { 'Accept': 'application/json' },
          body:    new FormData(form),
        });

        if (res.ok) {
          btn.textContent = 'Sent ✓';
          form.reset();
          if (status) {
            status.style.display = 'block';
            status.style.color   = '#00ffb3';
            status.textContent   = "Message received. I'll get back to you soon.";
          }
        } else {
          throw new Error('Formspree error');
        }

      } catch (err) {
        btn.textContent = 'Send message →';
        if (status) {
          status.style.display = 'block';
          status.style.color   = '#ff4d4d';
          status.textContent   = 'Something went wrong. Try again or email directly.';
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