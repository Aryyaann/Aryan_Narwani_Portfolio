/* ═══════════════════════════════════════════════════════════════════
   PARTICLES — Hero canvas particle system
═══════════════════════════════════════════════════════════════════ */
export function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(true); }
    reset(initial) {
      this.x = Math.random() * W;
      this.y = initial ? Math.random() * H : H + 20;
      this.vx = (Math.random() - .5) * .25;
      this.vy = -(Math.random() * .4 + .1);
      this.r = Math.random() * 1.6 + .4;
      this.alpha = 0;
      this.maxAlpha = Math.random() * .5 + .15;
      this.life = 0;
      this.maxLife = Math.random() * 400 + 250;
      if (initial) this.life = Math.random() * this.maxLife;
    }
    update() {
      this.x += this.vx; this.y += this.vy; this.life++;
      if (this.life < 40) this.alpha = this.maxAlpha * (this.life / 40);
      else if (this.life > this.maxLife - 40) this.alpha = this.maxAlpha * ((this.maxLife - this.life) / 40);
      else this.alpha = this.maxAlpha;
      if (this.life >= this.maxLife || this.y < -20) this.reset();
    }
    draw() {
      ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,212,255,${this.alpha})`; ctx.fill();
    }
  }

  for (let i = 0; i < 90; i++) particles.push(new Particle());

  function animateParticles() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animateParticles);
  }
  animateParticles();
}
