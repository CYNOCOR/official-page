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
    const titleText = link.getAttribute("data-title");
    const descText = link.getAttribute("data-desc");

    // Modal elements walata set karanawa
    videoSource.src = videoUrl;
    modalTitle.textContent = titleText;
    modalDesc.textContent = descText;

    // Video reload karala modal eka open karanawa
    video.load();

    // Modal ekata active class eka add karannai (CSS eke display:flex thiyena nisa center wenawa)
    modal.classList.add("active");

    video.play();
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
  if (video) {
    video.pause();
    video.currentTime = 0;
  }
}
