(function initCynocorPreloader() {
  if (typeof window === 'undefined' || !document.body) return;

  const navEntries = performance.getEntriesByType ? performance.getEntriesByType('navigation') : [];
  const navType = navEntries.length
    ? navEntries[0].type
    : (performance.navigation && performance.navigation.type === 1 ? 'reload' : 'navigate');

  let hasLoadedOnce = false;
  try {
    hasLoadedOnce = sessionStorage.getItem('cynocor_loaded_once') === '1';
  } catch (e) {}

  if (navType !== 'reload' && hasLoadedOnce) return;

  try {
    sessionStorage.setItem('cynocor_loaded_once', '1');
  } catch (e) {}

  let isDark = document.body.classList.contains('atmosphere-dark');
  try {
    if (!isDark && localStorage.getItem('cynocor_atmosphere') === 'dark') isDark = true;
  } catch (e) {}

  const overlay = document.createElement('div');
  overlay.className = 'cyno-loader' + (isDark ? ' is-dark' : '');
  overlay.id = 'cynoPreloader';
  overlay.setAttribute('role', 'status');
  overlay.setAttribute('aria-label', 'Loading Cynocor');
  overlay.innerHTML = `
    <div class="cyno-loader-graphics" aria-hidden="true">
      <div class="cyno-loader-ring cyno-loader-ring--outer"></div>
      <div class="cyno-loader-ring cyno-loader-ring--inner"></div>
      <div class="cyno-loader-crosshair"></div>
      <span class="cyno-loader-node n1"></span>
      <span class="cyno-loader-node n2"></span>
      <span class="cyno-loader-node n3"></span>
      <span class="cyno-loader-node n4"></span>
      <span class="cyno-loader-node n5"></span>
      <span class="cyno-loader-node n6"></span>
    </div>
    <div class="cyno-loader-bg-word" aria-hidden="true">CYNOCOR</div>
    <canvas class="cyno-loader-canvas" id="cynoLoaderCanvas" aria-hidden="true"></canvas>
    <div class="cyno-loader-scanlines" aria-hidden="true"></div>
    <div class="cyno-loader-center">
      <h1 class="cyno-loader-tagline">
        <span class="cyno-loader-word">we</span>
        <span class="cyno-loader-word">create</span>
        <span class="cyno-loader-word cyno-loader-word--accent">future.</span>
      </h1>
    </div>
    <div class="cyno-loader-bar" id="cynoLoaderBar"></div>
  `;

  document.body.appendChild(overlay);
  const prevOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';

  const canvas = document.getElementById('cynoLoaderCanvas');
  const barEl = document.getElementById('cynoLoaderBar');
  const ctx = canvas ? canvas.getContext('2d') : null;

  let closed = false;
  let rafId = 0;

  const finishPreloader = () => {
    if (closed) return;
    closed = true;
    if (barEl) barEl.style.width = '100%';
    overlay.classList.add('is-leaving');
    document.body.style.overflow = prevOverflow;
    setTimeout(() => {
      if (rafId) cancelAnimationFrame(rafId);
      overlay.remove();
    }, 1500);
  };

  // Procedural 3D Nerve-Filament Human Holographic Scene
  if (ctx && canvas) {
    let seed = 4219;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };

    // Anatomical 3D capsules: [x1, y1, z1, r1, x2, y2, z2, r2, strandCount]
    const capsules = [
      // Head & cranium
      [0.14, -0.35, -0.02, 0.082, 0.14, -0.22, 0.0, 0.07, 46],
      // Neck
      [0.13, -0.21, 0.0, 0.042, 0.12, -0.12, 0.0, 0.055, 20],
      // Upper torso & shoulders
      [0.12, -0.11, 0.0, 0.145, 0.12, 0.18, -0.02, 0.115, 72],
      // Lower torso
      [0.12, 0.16, -0.02, 0.115, 0.13, 0.46, -0.03, 0.125, 48],
      // Right shoulder -> arm extending down-right
      [0.24, -0.06, -0.01, 0.058, 0.34, 0.22, 0.04, 0.046, 28],
      [0.34, 0.22, 0.04, 0.044, 0.43, 0.46, 0.08, 0.036, 22],
      // Left shoulder -> reaching forearm toward viewer
      [0.01, -0.06, 0.02, 0.058, -0.08, -0.08, 0.32, 0.052, 34],
      [-0.08, -0.08, 0.32, 0.052, -0.15, -0.13, 0.56, 0.056, 38],
      // Reaching Palm
      [-0.15, -0.13, 0.56, 0.064, -0.19, -0.19, 0.63, 0.058, 34],
      // Thumb (reaching right-up)
      [-0.12, -0.14, 0.58, 0.024, -0.05, -0.23, 0.67, 0.017, 16],
      // Index finger (iconic tall reach)
      [-0.17, -0.21, 0.62, 0.021, -0.25, -0.42, 0.72, 0.013, 22],
      // Middle finger
      [-0.20, -0.20, 0.61, 0.021, -0.29, -0.34, 0.67, 0.013, 20],
      // Ring finger
      [-0.21, -0.17, 0.59, 0.019, -0.29, -0.24, 0.61, 0.012, 16],
      // Pinky finger
      [-0.21, -0.14, 0.57, 0.017, -0.27, -0.15, 0.56, 0.011, 14]
    ];

    const strands = [];
    capsules.forEach((cap) => {
      const [x1, y1, z1, r1, x2, y2, z2, r2, count] = cap;
      for (let i = 0; i < count; i++) {
        const pts = [];
        const steps = 11;
        const a0 = rand() * Math.PI * 2;
        const twist = (rand() - 0.5) * 3.8;
        const freq = 1.5 + rand() * 3.0;
        const phase = rand() * Math.PI * 2;
        const amp = 0.35 + rand() * 0.85;
        const isAccent = rand() < 0.24;

        for (let s = 0; s <= steps; s++) {
          const t = s / steps;
          const bx = x1 + (x2 - x1) * t;
          const by = y1 + (y2 - y1) * t;
          const bz = z1 + (z2 - z1) * t;
          const r = (r1 + (r2 - r1) * t) * (0.55 + 0.65 * Math.sin(t * Math.PI * 0.9 + phase) * 0.45 + 0.35);
          const ang = a0 + twist * t + Math.sin(t * Math.PI * freq + phase) * amp;
          pts.push({
            x: bx + Math.cos(ang) * r,
            y: by + Math.sin(ang) * r * 0.85,
            z: bz + Math.sin(ang + 1.2) * r
          });
        }

        strands.push({
          pts,
          isAccent,
          width: isAccent ? 0.85 + rand() * 0.75 : 0.45 + rand() * 0.7,
          alpha: isAccent ? 0.55 + rand() * 0.35 : 0.22 + rand() * 0.48,
          revealOrder: rand() * 0.72,
          pulseSpeed: 0.4 + rand() * 0.9,
          pulseOffset: rand()
        });
      }
    });

    const convergeNerves = [];
    for (let i = 0; i < 68; i++) {
      const edge = i % 4; // 0: top, 1: right, 2: bottom, 3: left
      let sx = 0.5;
      let sy = 0.5;
      if (edge === 0) { sx = 0.05 + rand() * 0.9; sy = -0.06; }
      else if (edge === 1) { sx = 1.06; sy = 0.05 + rand() * 0.9; }
      else if (edge === 2) { sx = 0.05 + rand() * 0.9; sy = 1.06; }
      else { sx = -0.06; sy = 0.05 + rand() * 0.9; }

      const targetOffsetX = (rand() - 0.5) * 0.09;
      const targetOffsetY = (rand() - 0.5) * 0.12;
      const bend1 = (rand() - 0.5) * 0.18;
      const bend2 = (rand() - 0.5) * 0.18;
      const isAccent = rand() < 0.36;

      convergeNerves.push({
        sx,
        sy,
        tx: 0.51 + targetOffsetX,
        ty: 0.54 + targetOffsetY,
        bend1,
        bend2,
        delay: rand() * 0.16,
        isAccent,
        width: isAccent ? 1.15 + rand() * 0.75 : 0.6 + rand() * 0.65,
        alpha: isAccent ? 0.65 + rand() * 0.3 : 0.28 + rand() * 0.35
      });
    }

    let width = 0;
    let height = 0;
    let dpr = 1;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const startTime = performance.now();
    let pageLoaded = document.readyState === 'complete';
    window.addEventListener('load', () => { pageLoaded = true; }, { once: true });

    const minDuration = 7200;
    let progress = 0;

    const project = (pt, yaw, pitch, scale, cx, cy, tSec) => {
      const wobble = Math.sin(tSec * 1.6 + pt.y * 5.0 + pt.x * 4.0) * 0.0045;
      const x0 = pt.x + wobble;
      const y0 = pt.y + wobble * 0.6;
      const z0 = pt.z;

      const cosY = Math.cos(yaw);
      const sinY = Math.sin(yaw);
      const x1 = x0 * cosY - z0 * sinY;
      const z1 = x0 * sinY + z0 * cosY;

      const cosP = Math.cos(pitch);
      const sinP = Math.sin(pitch);
      const y2 = y0 * cosP - z1 * sinP;
      const z2 = y0 * sinP + z1 * cosP;

      const fov = 1.65;
      const persp = fov / (fov - z2 * 0.72);
      return {
        x: cx + x1 * scale * persp,
        y: cy + y2 * scale * persp,
        z: z2,
        persp
      };
    };

    const render = (now) => {
      if (closed) return;
      const elapsed = now - startTime;
      const tSec = elapsed * 0.001;

      const target = pageLoaded ? Math.min(1, elapsed / minDuration) : Math.min(0.9, elapsed / minDuration);
      progress += (target - progress) * 0.12;
      if (pageLoaded && elapsed >= minDuration && progress > 0.985) {
        progress = 1;
      }

      const pct = Math.min(100, Math.round(progress * 100));
      if (barEl) barEl.style.width = pct + '%';

      ctx.clearRect(0, 0, width, height);

      const scale = Math.min(Math.max(Math.min(width, height) * 1.24, width * 0.56), height * 1.38);
      const cx = width * 0.51;
      const cy = height * 0.56;
      const yaw = Math.sin(tSec * 0.55) * 0.1;
      const pitch = Math.cos(tSec * 0.45) * 0.05;

      const dark = overlay.classList.contains('is-dark');

      // Phase 1 (Inward 0 -> 0.56) & Phase 3 (Outward Dispersion 0.78 -> 1.00)
      if (progress < 0.56) {
        const convergeFade = progress < 0.36 ? 1 : Math.max(0, 1 - (progress - 0.36) / 0.20);
        for (let i = 0; i < convergeNerves.length; i++) {
          const cn = convergeNerves[i];
          const localP = Math.max(0, Math.min(1, (progress - cn.delay) / 0.28));
          if (localP <= 0.01) continue;

          const easeP = 1 - Math.pow(1 - localP, 2.2);
          const x0 = cn.sx * width;
          const y0 = cn.sy * height;
          const x3 = cn.tx * width;
          const y3 = cn.ty * height;
          const dx = x3 - x0;
          const dy = y3 - y0;
          const len = Math.hypot(dx, dy) || 1;
          const nx = -dy / len;
          const ny = dx / len;

          const segs = 14;
          const maxSeg = Math.max(1, Math.floor(segs * easeP));
          ctx.beginPath();
          let tipX = x0;
          let tipY = y0;
          for (let s = 0; s <= maxSeg; s++) {
            const u = (s / segs) * easeP;
            const wave = Math.sin(u * Math.PI * 2.2 + tSec * 2.0 + i) * (1 - u) * Math.min(width, height) * 0.055;
            const px = x0 + dx * u + nx * (cn.bend1 * width * u * (1 - u) + wave);
            const py = y0 + dy * u + ny * (cn.bend2 * height * u * (1 - u) + wave);
            if (s === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
            tipX = px;
            tipY = py;
          }

          const strokeAlpha = cn.alpha * convergeFade * Math.min(1, localP * 2.2);
          ctx.lineWidth = cn.width;
          ctx.strokeStyle = cn.isAccent
            ? (dark ? `rgba(56, 189, 248, ${strokeAlpha.toFixed(3)})` : `rgba(0, 112, 255, ${strokeAlpha.toFixed(3)})`)
            : (dark ? `rgba(215, 232, 255, ${(strokeAlpha * 0.72).toFixed(3)})` : `rgba(15, 23, 42, ${(strokeAlpha * 0.55).toFixed(3)})`);
          ctx.stroke();

          if (cn.isAccent && localP < 0.98) {
            ctx.beginPath();
            ctx.arc(tipX, tipY, 2.4, 0, Math.PI * 2);
            ctx.fillStyle = dark
              ? `rgba(125, 211, 252, ${(0.9 * convergeFade).toFixed(3)})`
              : `rgba(0, 112, 255, ${(0.9 * convergeFade).toFixed(3)})`;
            ctx.fill();
          }
        }

        // Subtle central nexus glow as the 4-way nerves gather
        if (progress > 0.16) {
          const nexusAlpha = Math.sin(Math.min(1, (progress - 0.16) / 0.40) * Math.PI) * 0.28;
          const grad = ctx.createRadialGradient(cx, cy, 4, cx, cy, Math.min(width, height) * 0.22);
          grad.addColorStop(0, dark ? `rgba(56, 189, 248, ${nexusAlpha.toFixed(3)})` : `rgba(0, 112, 255, ${(nexusAlpha * 0.85).toFixed(3)})`);
          grad.addColorStop(1, 'rgba(0, 112, 255, 0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(cx, cy, Math.min(width, height) * 0.22, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Phase 3: Disperse outward to all 4 sides when loading finishes
      const disperseP = Math.max(0, Math.min(1, (progress - 0.78) / 0.22));
      if (disperseP > 0.01) {
        const outFade = 1 - Math.pow(disperseP, 1.8);
        for (let i = 0; i < convergeNerves.length; i++) {
          const cn = convergeNerves[i];
          const localOut = Math.max(0, Math.min(1, (disperseP - cn.delay * 0.45) / 0.85));
          if (localOut <= 0.01) continue;

          const easeOut = 1 - Math.pow(1 - localOut, 2.0);
          const x0 = cn.tx * width;
          const y0 = cn.ty * height;
          const x3 = cn.sx * width;
          const y3 = cn.sy * height;
          const dx = x3 - x0;
          const dy = y3 - y0;
          const len = Math.hypot(dx, dy) || 1;
          const nx = -dy / len;
          const ny = dx / len;

          const segs = 14;
          const startU = Math.max(0, easeOut - 0.55);
          ctx.beginPath();
          let tipX = x0;
          let tipY = y0;
          for (let s = 0; s <= segs; s++) {
            const u = startU + (easeOut - startU) * (s / segs);
            const wave = Math.sin(u * Math.PI * 2.2 + tSec * 2.2 + i) * u * Math.min(width, height) * 0.045;
            const px = x0 + dx * u + nx * (cn.bend1 * width * u * (1 - u) + wave);
            const py = y0 + dy * u + ny * (cn.bend2 * height * u * (1 - u) + wave);
            if (s === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
            tipX = px;
            tipY = py;
          }

          const strokeAlpha = cn.alpha * outFade * 1.15;
          ctx.lineWidth = cn.width * 1.08;
          ctx.strokeStyle = cn.isAccent
            ? (dark ? `rgba(56, 189, 248, ${Math.min(1, strokeAlpha).toFixed(3)})` : `rgba(0, 112, 255, ${Math.min(1, strokeAlpha).toFixed(3)})`)
            : (dark ? `rgba(215, 232, 255, ${(strokeAlpha * 0.72).toFixed(3)})` : `rgba(15, 23, 42, ${(strokeAlpha * 0.55).toFixed(3)})`);
          ctx.stroke();

          if (cn.isAccent) {
            ctx.beginPath();
            ctx.arc(tipX, tipY, 2.5, 0, Math.PI * 2);
            ctx.fillStyle = dark
              ? `rgba(125, 211, 252, ${(0.95 * outFade).toFixed(3)})`
              : `rgba(0, 112, 255, ${(0.95 * outFade).toFixed(3)})`;
            ctx.fill();
          }
        }
      }

      // Phase 2: Nerve Human slowly forms in the center, then dissolves into Phase 3 dispersion
      const nerveProgress = Math.max(0, Math.min(1, (progress - 0.24) / 0.46));
      const humanDisperseFade = 1 - Math.pow(disperseP, 1.35);
      const humanScale = scale * (1 + disperseP * 0.16);

      for (let i = 0; i < strands.length; i++) {
        const st = strands[i];
        const drawFrac = Math.max(0, Math.min(1, (nerveProgress * 1.18 - st.revealOrder) / 0.36));
        if (drawFrac <= 0.02 || humanDisperseFade <= 0.01) continue;

        const pts = st.pts;
        const maxIdx = Math.max(2, Math.floor(pts.length * drawFrac));

        ctx.beginPath();
        let avgZ = 0;
        const maxHover = 0;
        const projected = [];
        for (let j = 0; j < maxIdx; j++) {
          const p = project(pts[j], yaw, pitch, humanScale, cx, cy, tSec);
          projected.push(p);
          avgZ += p.z;
        }
        avgZ /= projected.length;

        ctx.moveTo(projected[0].x, projected[0].y);
        for (let j = 1; j < projected.length - 1; j++) {
          const xc = (projected[j].x + projected[j + 1].x) * 0.5;
          const yc = (projected[j].y + projected[j + 1].y) * 0.5;
          ctx.quadraticCurveTo(projected[j].x, projected[j].y, xc, yc);
        }
        const last = projected[projected.length - 1];
        ctx.lineTo(last.x, last.y);

        const depthBoost = Math.max(0.45, Math.min(1.5, 0.88 + avgZ * 0.85));
        ctx.lineWidth = st.width * depthBoost * (1 + maxHover * 0.9);

        if (st.isAccent || maxHover > 0.2) {
          const alphaBoost = Math.min(1, (st.alpha + maxHover * 0.55) * drawFrac * humanDisperseFade);
          ctx.strokeStyle = dark
            ? `rgba(56, 189, 248, ${alphaBoost.toFixed(3)})`
            : `rgba(0, 112, 255, ${(alphaBoost * 0.95).toFixed(3)})`;
        } else {
          ctx.strokeStyle = dark
            ? `rgba(215, 232, 255, ${(st.alpha * 0.74 * drawFrac * humanDisperseFade).toFixed(3)})`
            : `rgba(12, 18, 32, ${(st.alpha * 0.88 * drawFrac * humanDisperseFade).toFixed(3)})`;
        }
        ctx.stroke();

        // Synaptic holographic pulse traveling along accent or hovered nerves
        if ((st.isAccent || maxHover > 0.25) && projected.length > 3) {
          const pulsePos = ((tSec * (st.pulseSpeed + maxHover * 0.8) + st.pulseOffset) % 1) * (projected.length - 1);
          const idx = Math.floor(pulsePos);
          const frac = pulsePos - idx;
          const pA = projected[idx];
          const pB = projected[Math.min(idx + 1, projected.length - 1)];
          const px = pA.x + (pB.x - pA.x) * frac;
          const py = pA.y + (pB.y - pA.y) * frac;

          ctx.beginPath();
          ctx.arc(px, py, (2.0 + maxHover * 1.8) * pA.persp, 0, Math.PI * 2);
          ctx.fillStyle = dark ? 'rgba(125, 211, 252, 0.95)' : 'rgba(0, 112, 255, 0.95)';
          ctx.fill();
        }
      }

      if (progress >= 1) {
        window.removeEventListener('resize', resize);
        setTimeout(finishPreloader, 180);
        return;
      }

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);
    // Safety fallback so preloader never blocks indefinitely
    setTimeout(finishPreloader, 10500);
  } else {
    setTimeout(finishPreloader, 5000);
  }
})();

document.addEventListener('DOMContentLoaded', () => {
  // 1. Update copyright year
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 2. Scroll reveal for .fade-up: plays every time an element scrolls into view
  //    (down or up). It resets only once the element is fully off screen, so it
  //    never flickers while still partly visible.
  const revealEls = document.querySelectorAll('.fade-up');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach((el) => el.classList.add('visible'));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.1) {
          entry.target.classList.add('visible');
        } else if (!entry.isIntersecting) {
          entry.target.classList.remove('visible');
        }
      });
    }, { root: null, rootMargin: '0px', threshold: [0, 0.1] });

    revealEls.forEach((el) => observer.observe(el));
  }

  // 3. Mobile Menu Toggle
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (menuToggle && navLinks) {
    const toggleMenu = (show) => {
      const isActive = show !== undefined ? show : !navLinks.classList.contains('active');
      menuToggle.classList.toggle('active', isActive);
      navLinks.classList.toggle('active', isActive);
      document.body.style.overflow = isActive ? 'hidden' : '';
    };

    menuToggle.addEventListener('click', () => toggleMenu());

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => toggleMenu(false));
    });
  }

  // 4. Parallax Effect (Index page background effect removed)

  // 5. Contact Form Submission
  const form = document.getElementById('contact-form');
  if (form) {
    const statusEl = document.getElementById('form-status');
    const submitBtn = form.querySelector('button[type="submit"]');
    const email = form.dataset.email;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      try {
        const res = await fetch(`https://formsubmit.co/ajax/${email}`, {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: new FormData(form)
        });
        if (res.ok) {
          statusEl.textContent = 'Message sent. We will contact you shortly.';
          statusEl.style.color = '#0066CC';
          form.reset();
        } else {
          throw new Error('Request failed');
        }
      } catch (err) {
        statusEl.textContent = `Something went wrong. Please email us directly at ${email}.`;
        statusEl.style.color = '#FF3B30';
      } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  }

  // 6. Orizon Top-Right Quick Hub Button & Dropdown (Replaces left floating dock)
  if (!document.querySelector('.orizon-hub-wrap')) {
    const path = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
    const isHome = path === '' || path === 'index.html';
    const isProjects = path === 'projects.html' || path === 'services.html';
    const isGallery = path === 'gallery.html';
    const isTeam = path === 'team.html';
    const isTools = path === 'tools.html';
    const base = document.querySelector('header .brand img')?.getAttribute('src')?.startsWith('/') ? '/' : '';

    const navRight = document.querySelector('header .nav-right');
    if (navRight) {
      const hubWrap = document.createElement('div');
      hubWrap.className = 'orizon-hub-wrap';
      hubWrap.id = 'orizonHubWrap';
      hubWrap.innerHTML = `
        <button type="button" class="orizon-hub-trigger" id="orizonHubTrigger" aria-label="Quick Hub &amp; Controls" aria-expanded="false" title="Quick Hub (Ctrl+K)">
          <span class="orizon-notif-dot"></span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="2"/>
            <rect x="14" y="3" width="7" height="7" rx="2"/>
            <rect x="3" y="14" width="7" height="7" rx="2"/>
            <rect x="14" y="14" width="7" height="7" rx="2"/>
          </svg>
        </button>

        <div class="orizon-hub-dropdown" id="orizonHubDropdown" role="menu" aria-label="Quick Navigation &amp; Atmosphere">
          <!-- Left Sculpted Vertical Rail -->
          <div class="cyno-hub-rail">
            <!-- Pod 1: 4 Stacked Circular Icons -->
            <div class="cyno-hub-rail-stack">
              <a href="${base}index.html" class="orizon-dock-btn ${isHome ? 'is-active' : ''}" title="Home Overview" aria-label="Home">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5L12 3l9 7.5"/><path d="M5 9.5V19a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1V9.5"/></svg>
              </a>
              <button type="button" class="orizon-dock-btn" id="orizonDockSearchBtn" title="Quick Search" aria-label="Quick Search">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>
              </button>
              <a href="${isHome ? '#capabilities' : base + 'projects.html'}" class="orizon-dock-btn ${isProjects ? 'is-active' : ''}" title="Systems &amp; Projects" aria-label="Systems and Projects">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>
              </a>
              <a href="${isHome ? '#cyno-bot' : base + 'gallery.html'}" class="orizon-dock-btn ${isGallery ? 'is-active' : ''}" title="${isHome ? 'Meet CynoBot AI' : 'Gallery &amp; Media'}" aria-label="CynoBot and Gallery">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
              </a>
            </div>

            <!-- Pod 2: Team Avatar + Bell Pill -->
            <div class="cyno-hub-rail-pill">
              <a href="${base}team.html" class="orizon-dock-btn cyno-hub-avatar-btn ${isTeam ? 'is-active' : ''}" title="Engineering Team" aria-label="Engineering Team">
                <span class="orizon-dock-avatar"><img src="${base}assets/logo3W.png" alt="CYNOCOR Team"></span>
              </a>
              <button type="button" class="orizon-dock-btn" id="orizonDockNotifBtn" title="System Updates" aria-label="System Updates">
                <span class="orizon-notif-dot"></span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
              </button>
            </div>

            <!-- Pod 3: Tools + Vertical Theme Switcher (Connected to Bottom) -->
            <div class="cyno-hub-rail-bottom">
              <a href="${base}tools.html" class="orizon-dock-btn ${isTools ? 'is-active' : ''}" title="Engineering Tools" aria-label="Engineering Tools">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9c.26.604.852.997 1.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
              </a>
              <div class="orizon-hub-theme-switch cyno-hub-theme-vert" role="group" aria-label="Atmosphere Theme">
                <button type="button" class="orizon-dock-btn" id="orizonThemeDarkBtn" title="Obsidian Dark Atmosphere" aria-label="Dark Mode">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
                </button>
                <button type="button" class="orizon-dock-btn is-active" id="orizonThemeLightBtn" title="BRAIX Ice-Sky Atmosphere" aria-label="Light Mode">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Right Sculpted Card Connected to Display Bottom -->
          <div class="cyno-hub-card">
            <h3 class="cyno-hub-card-title">Engineer The Perfect System</h3>
            <p class="cyno-hub-card-desc">
              Our platform connects custom AI agents, IoT automation, and resilient software—engineered to scale your business effortlessly.
            </p>

            <!-- Inline Quick Search (Shown when Search button is clicked) -->
            <div class="orizon-hub-search-results cyno-hub-expand" id="orizonSearchResults">
              <div class="orizon-hub-search-box">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>
                <input type="search" class="orizon-hub-search-input" id="orizonSearchInput" placeholder="Search pages, CynoBot, IoT..." autocomplete="off">
              </div>
              <a href="${base}index.html#hero" class="orizon-popover-item"><span>CYNOCOR Overview &amp; Benefits</span><small>Home &#8599;</small></a>
              <a href="${base}index.html#cyno-bot" class="orizon-popover-item"><span>CynoBot Autonomous Front-Desk AI</span><small>Robotics &#8599;</small></a>
              <a href="${base}services.html" class="orizon-popover-item"><span>Engineering &amp; Software Services</span><small>Services &#8599;</small></a>
              <a href="${base}projects.html" class="orizon-popover-item"><span>Delivered Client Systems (20+)</span><small>Projects &#8599;</small></a>
              <a href="${base}team.html" class="orizon-popover-item"><span>Meet the Engineering Team</span><small>Team &#8599;</small></a>
              <a href="${base}contact.html" class="orizon-popover-item"><span>Start a Project / Contact Us</span><small>Connect &#8599;</small></a>
            </div>

            <!-- Inline Dispatches (Shown when Bell button is clicked) -->
            <div class="orizon-hub-dispatches cyno-hub-expand" id="orizonHubDispatches">
              <a href="${base}index.html#cyno-bot" class="orizon-popover-item">
                <span><strong>CynoBot v2.4</strong> &mdash; Edge Vision Core active</span>
                <small>LIVE</small>
              </a>
              <a href="${base}gallery.html" class="orizon-popover-item">
                <span><strong>University Life</strong> &mdash; INFOTEL chronicles</span>
                <small>NEW</small>
              </a>
              <a href="${base}index.html#industries" class="orizon-popover-item">
                <span><strong>Telemetry Console</strong> &mdash; 6 streams online</span>
                <small>99.9%</small>
              </a>
            </div>

            <div class="cyno-hub-card-footer">
              <div class="cyno-hub-stat">
                <strong>20+</strong>
                <span>Systems</span>
              </div>
              <div class="cyno-hub-avatars">
                <img src="https://cdn.jsdelivr.net/npm/undraw-svg@2.0.0/svgs/ai-agent.svg" alt="AI Core">
                <img src="https://cdn.jsdelivr.net/npm/undraw-svg@2.0.0/svgs/programming.svg" alt="Automation">
                <img src="https://cdn.jsdelivr.net/npm/undraw-svg@2.0.0/svgs/cloud-hosting.svg" alt="CynoBot Cloud">
                <a href="${base}projects.html" class="cyno-hub-go" aria-label="View Projects">&#8599;</a>
              </div>
            </div>
          </div>
        </div>
      `;

      const mobileToggle = navRight.querySelector('.mobile-menu-toggle');
      if (mobileToggle) {
        navRight.insertBefore(hubWrap, mobileToggle);
      } else {
        navRight.appendChild(hubWrap);
      }

      const hubTrigger = document.getElementById('orizonHubTrigger');
      const hubDropdown = document.getElementById('orizonHubDropdown');
      if (hubDropdown && hubDropdown.parentElement !== document.body) {
        document.body.appendChild(hubDropdown);
      }
      const searchBtn = document.getElementById('orizonDockSearchBtn');
      const notifBtn = document.getElementById('orizonDockNotifBtn');
      const searchInput = document.getElementById('orizonSearchInput');
      const searchResults = document.getElementById('orizonSearchResults');
      const dispatchesBox = document.getElementById('orizonHubDispatches');
      const searchItems = Array.from(searchResults.querySelectorAll('.orizon-popover-item'));

      function toggleHub(forceState) {
        const willOpen = typeof forceState === 'boolean' ? forceState : !hubDropdown.classList.contains('is-open');
        hubDropdown.classList.toggle('is-open', willOpen);
        hubTrigger.classList.toggle('is-open', willOpen);
        hubTrigger.setAttribute('aria-expanded', String(willOpen));
        if (!willOpen) {
          searchResults.classList.remove('is-open');
          dispatchesBox.classList.remove('is-open');
          notifBtn.classList.remove('is-active');
        }
      }

      hubTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleHub();
      });

      searchBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dispatchesBox.classList.remove('is-open');
        notifBtn.classList.remove('is-active');
        searchResults.classList.toggle('is-open');
        if (searchResults.classList.contains('is-open')) {
          setTimeout(() => searchInput.focus(), 50);
        }
      });

      notifBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        searchResults.classList.remove('is-open');
        const willShow = !dispatchesBox.classList.contains('is-open');
        dispatchesBox.classList.toggle('is-open', willShow);
        notifBtn.classList.toggle('is-active', willShow);
      });

      searchInput.addEventListener('focus', () => {
        dispatchesBox.classList.remove('is-open');
        notifBtn.classList.remove('is-active');
        searchResults.classList.add('is-open');
      });

      searchInput.addEventListener('input', () => {
        const q = searchInput.value.trim().toLowerCase();
        searchResults.classList.add('is-open');
        searchItems.forEach(item => {
          item.style.display = item.textContent.toLowerCase().includes(q) ? 'flex' : 'none';
        });
      });

      hubDropdown.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (link) toggleHub(false);
      });

      document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
          e.preventDefault();
          toggleHub(true);
          searchResults.classList.add('is-open');
          setTimeout(() => searchInput.focus(), 60);
        } else if (e.key === 'Escape') {
          toggleHub(false);
        }
      });

      document.addEventListener('click', (e) => {
        if (!hubWrap.contains(e.target)) {
          toggleHub(false);
        }
      });

      // Theme Atmosphere Switcher (BRAIX Ice-Sky Light vs Obsidian Dark)
      const darkBtn = document.getElementById('orizonThemeDarkBtn');
      const lightBtn = document.getElementById('orizonThemeLightBtn');

      function setAtmosphere(mode) {
        const isDark = mode === 'dark';
        document.body.classList.toggle('atmosphere-dark', isDark);
        darkBtn.classList.toggle('is-active', isDark);
        lightBtn.classList.toggle('is-active', !isDark);
        try { localStorage.setItem('cynocor_atmosphere', mode); } catch (_) {}
      }

      darkBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        setAtmosphere('dark');
      });
      lightBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        setAtmosphere('light');
      });

      try {
        const saved = localStorage.getItem('cynocor_atmosphere');
        if (saved === 'dark') setAtmosphere('dark');
      } catch (_) {}
    }
  }

  // 7. Inject Orizon Framed Widgets into Inner Page Heroes (.page-hero)
  const pageHeroContainer = document.querySelector('.page-hero .container');
  if (pageHeroContainer && !pageHeroContainer.querySelector('.orizon-page-hero-widgets')) {
    const phWidgets = document.createElement('div');
    phWidgets.className = 'orizon-page-hero-widgets';
    phWidgets.innerHTML = `
      <div class="orizon-ph-bl-card">
        <div class="orizon-ph-bl-stat">
          <strong>20+</strong>
          <span>Systems Delivered</span>
        </div>
        <div class="orizon-ph-avatars">
          <img src="https://cdn.jsdelivr.net/npm/undraw-svg@2.0.0/svgs/connected-world.svg" alt="IoT Systems">
          <img src="https://cdn.jsdelivr.net/npm/undraw-svg@2.0.0/svgs/firmware.svg" alt="Embedded Systems">
          <img src="https://cdn.jsdelivr.net/npm/undraw-svg@2.0.0/svgs/real-time-analytics.svg" alt="Live Telemetry">
          <a href="projects.html" class="orizon-ph-go" aria-label="View Projects">&#8599;</a>
        </div>
      </div>

      <div class="orizon-ph-glass-card">
        <div class="orizon-ph-emblem">
          <img src="assets/logo3W.png" alt="CYNOCOR">
        </div>
        <div class="orizon-ph-glass-info">
          <h4>CynoBot &amp; Full-Stack IoT</h4>
          <span>&#9889; 4.2ms Edge Latency &bull; 99.98% Uptime</span>
        </div>
        <a href="contact.html" class="orizon-ph-go" aria-label="Connect with CYNOCOR">&#8599;</a>
      </div>
    `;
    pageHeroContainer.appendChild(phWidgets);
  }

});



// project eke popup section eke java tika me thiyenne

// --- All Projects Video Popup Modal Script ---
const modalLinks = document.querySelectorAll(".open-modal");
const modal = document.getElementById("videoModal");
const closeBtn = document.getElementById("closeModalBtn");
const video = document.getElementById("modalVideo");
const videoSource = document.getElementById("videoSource");
const modalTitle = document.getElementById("modalTitle");
const modalDesc = document.getElementById("modalDesc");

modalLinks.forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();

    // Data attributes walin values gannawa
    const videoUrl = link.getAttribute("data-video");
    const imagesUrl = link.getAttribute("data-images");
    const titleText = link.getAttribute("data-title");
    const descText = link.getAttribute("data-desc");
    const modalImagesContainer = document.getElementById("modalImagesContainer");

    if (imagesUrl) {
      video.style.display = 'none';
      modalImagesContainer.style.display = 'block';
      const imagesArr = imagesUrl.split(',');
      let imgHtml = '';
      if (imagesArr.length > 1) {
        imgHtml += `<div class="modal-carousel" id="modal-image-carousel">
                      <div class="carousel-images" id="modal-carousel-inner">`;
        imagesArr.forEach((imgSrc, idx) => {
          imgHtml += `<img src="${imgSrc.trim()}" alt="Project Image" class="${idx === 0 ? 'active' : ''}">`;
        });
        imgHtml += `  </div>
                      <button class="carousel-btn prev" style="opacity: 1;" onclick="moveCarousel('modal-carousel-inner', -1)" aria-label="Previous image">&#10094;</button>
                      <button class="carousel-btn next" style="opacity: 1;" onclick="moveCarousel('modal-carousel-inner', 1)" aria-label="Next image">&#10095;</button>
                    </div>`;
      } else {
        imgHtml = `<img src="${imagesArr[0].trim()}" style="width: 100%; height: 100%; object-fit: contain;">`;
      }
      modalImagesContainer.innerHTML = imgHtml;
    } else if (videoUrl) {
      modalImagesContainer.style.display = 'none';
      video.style.display = 'block';
      videoSource.src = videoUrl;
      video.load();
      video.play();
    }

    // Modal elements walata set karanawa
    modalTitle.textContent = titleText;
    modalDesc.textContent = descText;

    // Modal ekata active class eka add karannai (CSS eke display:flex thiyena nisa center wenawa)
    modal.classList.add("active");
  });
});

if (closeBtn && modal) {
  closeBtn.addEventListener("click", () => {
    closeModal();
  });
}

window.addEventListener("click", (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

function closeModal() {
  if (modal) {
    // Active class eka ain karama animation eka reverse wela close wenawa
    modal.classList.remove("active");
  }
  if (video && video.style.display !== 'none') {
    video.pause();
    video.currentTime = 0;
  }
}

/* ─── GLOBAL SEAMLESS SCROLL FLOW ──────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  // 1. Top Scroll Flow Progress Hairline
  const flowBar = document.createElement('div');
  flowBar.className = 'cyno-scroll-flow-bar';
  flowBar.setAttribute('aria-hidden', 'true');
  document.body.appendChild(flowBar);

  let scrollHideTimer = 0;
  const updateFlowBar = () => {
    const doc = document.documentElement;
    const maxScroll = Math.max(1, doc.scrollHeight - window.innerHeight);
    const pct = Math.min(100, Math.max(0, (window.scrollY / maxScroll) * 100));
    flowBar.style.width = pct.toFixed(2) + '%';
    if (window.scrollY > 12) {
      flowBar.classList.add('is-scrolling');
      clearTimeout(scrollHideTimer);
      scrollHideTimer = setTimeout(() => {
        if (window.scrollY <= 12) flowBar.classList.remove('is-scrolling');
      }, 900);
    } else {
      flowBar.classList.remove('is-scrolling');
    }
  };
  window.addEventListener('scroll', updateFlowBar, { passive: true });
  updateFlowBar();

  // 2. Silky Momentum Wheel Scroll (desktop fine-pointer)
  const isFinePointer = window.matchMedia && window.matchMedia('(pointer: fine)').matches;
  if (isFinePointer) {
    let targetY = window.scrollY;
    let currentY = window.scrollY;
    let isAnimating = false;
    let wheelDriven = false;
    let prevScrollBehavior = '';

    const hasScrollableParent = (el, deltaY) => {
      let node = el;
      while (node && node !== document.body && node !== document.documentElement) {
        const style = window.getComputedStyle(node);
        const overflowY = style.overflowY;
        if ((overflowY === 'auto' || overflowY === 'scroll') && node.scrollHeight > node.clientHeight + 2) {
          const atTop = node.scrollTop <= 0 && deltaY < 0;
          const atBottom = node.scrollTop + node.clientHeight >= node.scrollHeight - 1 && deltaY > 0;
          if (!atTop && !atBottom) return true;
        }
        node = node.parentElement;
      }
      return false;
    };

    const step = () => {
      const diff = targetY - currentY;
      if (Math.abs(diff) < 0.45) {
        currentY = targetY;
        wheelDriven = true;
        window.scrollTo(0, Math.round(currentY));
        wheelDriven = false;
        isAnimating = false;
        document.documentElement.style.scrollBehavior = prevScrollBehavior;
        return;
      }
      currentY += diff * 0.11;
      wheelDriven = true;
      window.scrollTo(0, currentY);
      wheelDriven = false;
      requestAnimationFrame(step);
    };

    window.addEventListener('wheel', (e) => {
      if (e.ctrlKey || e.metaKey || e.defaultPrevented) return;
      if (document.body.style.overflow === 'hidden') return;
      if (hasScrollableParent(e.target, e.deltaY)) return;

      e.preventDefault();
      const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      if (!isAnimating) {
        currentY = window.scrollY;
        targetY = window.scrollY;
        prevScrollBehavior = document.documentElement.style.scrollBehavior;
        document.documentElement.style.scrollBehavior = 'auto';
        isAnimating = true;
        requestAnimationFrame(step);
      }
      const delta = e.deltaMode === 1 ? e.deltaY * 32 : e.deltaMode === 2 ? e.deltaY * window.innerHeight : e.deltaY;
      targetY = Math.max(0, Math.min(maxScroll, targetY + delta));
    }, { passive: false });

    window.addEventListener('scroll', () => {
      if (!wheelDriven && !isAnimating) {
        currentY = window.scrollY;
        targetY = window.scrollY;
      }
    }, { passive: true });
  }

  // 3. Auto-Flow Cascade on Major Cards & Footer across all pages
  const flowSelectors = '.bento-card, .proj-card, .service-card, .tool-card, .team-card, .gallery-card, .arch-node, footer';
  const flowCandidates = Array.from(document.querySelectorAll(flowSelectors))
    .filter((el) => !el.classList.contains('fade-up') && !el.closest('#cynoPreloader'));

  if (flowCandidates.length && 'IntersectionObserver' in window) {
    const foldY = window.innerHeight * 0.95;
    const toObserve = [];
    flowCandidates.forEach((el, idx) => {
      const rect = el.getBoundingClientRect();
      if (rect.top > foldY) {
        el.classList.add('cyno-flow-item');
        if (!el.style.transitionDelay) {
          el.style.transitionDelay = ((idx % 4) * 55) + 'ms';
        }
        toObserve.push(el);
      }
    });

    if (toObserve.length) {
      const flowObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            flowObserver.unobserve(entry.target);
          }
        });
      }, { root: null, rootMargin: '0px 0px -40px 0px', threshold: 0.06 });

      toObserve.forEach((el) => flowObserver.observe(el));
    }
  }

  // 4. Navbar Click Wow Motion (Liquid Morph Glide + Pulse)
  const navBarLinksWrap = document.querySelector('header .nav-links');
  if (navBarLinksWrap && window.matchMedia && window.matchMedia('(min-width: 901px)').matches) {
    const glide = document.createElement('span');
    glide.className = 'cyno-nav-glide';
    glide.style.opacity = '0';
    navBarLinksWrap.appendChild(glide);

    navBarLinksWrap.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', (e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        const href = link.getAttribute('href');
        if (!href || href.startsWith('#') || link.target === '_blank' || link.classList.contains('active')) return;

        e.preventDefault();
        const wrapRect = navBarLinksWrap.getBoundingClientRect();
        const activeEl = navBarLinksWrap.querySelector('a.active') || link;
        const startRect = activeEl.getBoundingClientRect();
        const endRect = link.getBoundingClientRect();

        glide.style.transition = 'none';
        glide.style.width = startRect.width + 'px';
        glide.style.transform = `translate3d(${startRect.left - wrapRect.left}px, -50%, 0)`;
        glide.style.opacity = '1';

        requestAnimationFrame(() => {
          glide.style.transition = '';
          glide.style.width = endRect.width + 'px';
          glide.style.transform = `translate3d(${endRect.left - wrapRect.left}px, -50%, 0)`;
          link.style.transform = 'translateY(-1px) scale(1.05)';
        });

        setTimeout(() => {
          window.location.href = href;
        }, 410);
      });
    });
  }

  // 5. Footer Calm Slow-Motion Neural Background (attaches even when footer.js runs after main.js)
  const attachFooterNerves = (footerEl) => {
    if (!footerEl || footerEl.dataset.nervesBound === '1') return;
    footerEl.dataset.nervesBound = '1';

    const fCanvas = document.createElement('canvas');
    fCanvas.className = 'cyno-footer-nerves';
    fCanvas.setAttribute('aria-hidden', 'true');
    footerEl.insertBefore(fCanvas, footerEl.firstChild);

    const fCtx = fCanvas.getContext('2d');
    if (!fCtx) return;

    let fw = 0;
    let fh = 0;
    let fdpr = 1;
    let fMouseX = -9999;
    let fMouseY = -9999;
    let fActive = false;
    let fRaf = 0;

    let fSeed = 7331;
    const fRand = () => {
      fSeed = (fSeed * 16807) % 2147483647;
      return (fSeed - 1) / 2147483646;
    };

    const nodes = [];
    const cols = 9;
    const rows = 5;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const idx = r * cols + c;
        const isHub = idx % 5 === 0;
        nodes.push({
          bx: (c + 0.15 + fRand() * 0.7) / cols,
          by: (r + 0.15 + fRand() * 0.7) / rows,
          ax: 0.012 + fRand() * 0.02,
          ay: 0.02 + fRand() * 0.032,
          sx: 0.25 + fRand() * 0.45,
          sy: 0.22 + fRand() * 0.4,
          px: fRand() * Math.PI * 2,
          py: fRand() * Math.PI * 2,
          r: isHub ? 3.2 : 1.7 + fRand() * 1.1,
          isHub,
          pulseOff: fRand()
        });
      }
    }

    const resizeFooterCanvas = () => {
      const rect = footerEl.getBoundingClientRect();
      fdpr = Math.min(window.devicePixelRatio || 1, 2);
      fw = Math.max(1, rect.width);
      fh = Math.max(1, rect.height);
      fCanvas.width = Math.floor(fw * fdpr);
      fCanvas.height = Math.floor(fh * fdpr);
      fCtx.setTransform(fdpr, 0, 0, fdpr, 0, 0);
    };
    resizeFooterCanvas();
    window.addEventListener('resize', resizeFooterCanvas, { passive: true });

    footerEl.addEventListener('pointermove', (e) => {
      const rect = footerEl.getBoundingClientRect();
      fMouseX = e.clientX - rect.left;
      fMouseY = e.clientY - rect.top;
    }, { passive: true });
    footerEl.addEventListener('pointerleave', () => {
      fMouseX = -9999;
      fMouseY = -9999;
    });

    const drawFooterNerves = (now) => {
      if (!fActive) return;
      const t = now * 0.001;
      const isDark = document.body.classList.contains('atmosphere-dark');
      fCtx.clearRect(0, 0, fw, fh);

      // Compute current drifting positions + wide pointer attraction across whole footer
      const interactR = Math.max(240, fw * 0.22);
      const pos = new Array(nodes.length);
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        let x = (n.bx + Math.sin(t * n.sx + n.px) * n.ax) * fw;
        let y = (n.by + Math.cos(t * n.sy + n.py) * n.ay) * fh;
        let hover = 0;
        if (fMouseX > -100) {
          const dx = fMouseX - x;
          const dy = fMouseY - y;
          const dist = Math.hypot(dx, dy);
          if (dist < interactR && dist > 1) {
            hover = (1 - dist / interactR);
            hover = hover * hover;
            x += dx * hover * 0.16;
            y += dy * hover * 0.16;
          }
        }
        pos[i] = { x, y, hover, n };
      }

      // Soft cursor aura + direct synaptic links from pointer to nearby nodes
      if (fMouseX > -100) {
        const aura = fCtx.createRadialGradient(fMouseX, fMouseY, 0, fMouseX, fMouseY, interactR * 0.72);
        aura.addColorStop(0, isDark ? 'rgba(92, 225, 255, 0.11)' : 'rgba(0, 112, 255, 0.09)');
        aura.addColorStop(1, 'transparent');
        fCtx.fillStyle = aura;
        fCtx.beginPath();
        fCtx.arc(fMouseX, fMouseY, interactR * 0.72, 0, Math.PI * 2);
        fCtx.fill();

        for (let i = 0; i < pos.length; i++) {
          const pNode = pos[i];
          if (pNode.hover <= 0.04) continue;
          fCtx.beginPath();
          fCtx.moveTo(fMouseX, fMouseY);
          fCtx.lineTo(pNode.x, pNode.y);
          fCtx.lineWidth = 0.8 + pNode.hover * 0.9;
          fCtx.strokeStyle = isDark
            ? `rgba(92, 225, 255, ${(pNode.hover * 0.34).toFixed(3)})`
            : `rgba(0, 112, 255, ${(pNode.hover * 0.28).toFixed(3)})`;
          fCtx.stroke();
        }
      }

      // Draw synaptic constellation links & traveling data pulses
      const linkDist = Math.min(230, Math.max(150, fw * 0.19));
      for (let i = 0; i < pos.length; i++) {
        const a = pos[i];
        for (let j = i + 1; j < pos.length; j++) {
          const b = pos[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const d = Math.hypot(dx, dy);
          if (d > linkDist) continue;

          const proximity = 1 - d / linkDist;
          const boost = Math.max(a.hover, b.hover);
          const alpha = (isDark ? 0.22 : 0.16) * proximity + boost * 0.22;

          fCtx.beginPath();
          fCtx.moveTo(a.x, a.y);
          fCtx.lineTo(b.x, b.y);
          fCtx.lineWidth = (a.n.isHub || b.n.isHub ? 1.15 : 0.8) + boost * 0.8;
          fCtx.strokeStyle = isDark
            ? `rgba(92, 225, 255, ${alpha.toFixed(3)})`
            : `rgba(0, 112, 255, ${alpha.toFixed(3)})`;
          fCtx.stroke();

          // Traveling synaptic pulse on hub links or hovered links
          if ((a.n.isHub || boost > 0.2) && proximity > 0.22) {
            const p = (t * (0.28 + boost * 0.25) + a.n.pulseOff + j * 0.13) % 1;
            const px = a.x + dx * p;
            const py = a.y + dy * p;
            fCtx.beginPath();
            fCtx.arc(px, py, 1.5 + boost * 1.1, 0, Math.PI * 2);
            fCtx.fillStyle = isDark
              ? `rgba(147, 240, 255, ${(0.55 * proximity + boost * 0.35).toFixed(3)})`
              : `rgba(0, 112, 255, ${(0.45 * proximity + boost * 0.35).toFixed(3)})`;
            fCtx.fill();
          }
        }
      }

      // Draw neural nodes & hub aura rings
      for (let i = 0; i < pos.length; i++) {
        const { x, y, hover, n } = pos[i];
        if (n.isHub || hover > 0.25) {
          const ringR = n.r + 5 + Math.sin(t * 2.1 + n.px) * 1.8 + hover * 4;
          fCtx.beginPath();
          fCtx.arc(x, y, ringR, 0, Math.PI * 2);
          fCtx.lineWidth = 1;
          fCtx.strokeStyle = isDark
            ? `rgba(92, 225, 255, ${(0.18 + hover * 0.28).toFixed(3)})`
            : `rgba(0, 112, 255, ${(0.14 + hover * 0.24).toFixed(3)})`;
          fCtx.stroke();
        }
        fCtx.beginPath();
        fCtx.arc(x, y, n.r + hover * 1.4, 0, Math.PI * 2);
        fCtx.fillStyle = isDark
          ? `rgba(92, 225, 255, ${(n.isHub ? 0.55 : 0.32) + hover * 0.35})`
          : `rgba(0, 112, 255, ${(n.isHub ? 0.42 : 0.22) + hover * 0.35})`;
        fCtx.fill();
      }

      fRaf = requestAnimationFrame(drawFooterNerves);
    };

    if ('IntersectionObserver' in window) {
      const fObs = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!fActive) {
              fActive = true;
              resizeFooterCanvas();
              fRaf = requestAnimationFrame(drawFooterNerves);
            }
          } else {
            fActive = false;
            if (fRaf) cancelAnimationFrame(fRaf);
          }
        });
      }, { threshold: 0.02 });
      fObs.observe(footerEl);
    }
  };

  const existingFooter = document.querySelector('footer');
  if (existingFooter) {
    attachFooterNerves(existingFooter);
  } else {
    const footerHost = document.getElementById('site-footer');
    if (footerHost && 'MutationObserver' in window) {
      const fMut = new MutationObserver(() => {
        const f = footerHost.querySelector('footer');
        if (f) {
          attachFooterNerves(f);
          fMut.disconnect();
        }
      });
      fMut.observe(footerHost, { childList: true });
    }
    setTimeout(() => {
      const f = document.querySelector('footer');
      if (f) attachFooterNerves(f);
    }, 50);
  }

  // WhatsApp Float — Atomic Electron Orbits around Blue Proton Core
  document.querySelectorAll('.whatsapp-float').forEach((btn) => {
    if (btn.querySelector('.wa-orbit-tilt')) return;
    [1, 2, 3].forEach((n) => {
      const tilt = document.createElement('span');
      tilt.className = `wa-orbit-tilt wa-orbit-tilt-${n}`;
      tilt.setAttribute('aria-hidden', 'true');
      const ring = document.createElement('span');
      ring.className = 'wa-orbit-ring';
      const electron = document.createElement('span');
      electron.className = 'wa-electron';
      ring.appendChild(electron);
      tilt.appendChild(ring);
      btn.appendChild(tilt);
    });
  });
});
