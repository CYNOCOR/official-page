document.addEventListener('DOMContentLoaded', () => {
  // 1. Update copyright year
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 2. Intersection Observer for Fade-Up animations
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      } else {
        // Optional: remove visible class if you want animation to repeat
        entry.target.classList.remove('visible');
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-up').forEach((el) => {
    observer.observe(el);
  });

  // 3. Mobile Menu Toggle
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
      document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });
  }

  // 4. Parallax Effect (Index page)
  const ambientCore = document.querySelector('.ambient-core');
  if (ambientCore) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      ambientCore.style.transform = `translate(-50%, -50%) scale(${1 + scrolled * 0.001}) translateY(${scrolled * 0.5}px)`;
      ambientCore.style.opacity = Math.max(0.4 - scrolled * 0.001, 0);
    });
  }

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

});
