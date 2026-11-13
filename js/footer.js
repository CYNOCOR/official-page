document.addEventListener('DOMContentLoaded', () => {
  const footerHost = document.getElementById('site-footer');
  if (!footerHost) return;

  footerHost.innerHTML = `
    <footer class="cyno-editorial-footer">
      <div class="cyno-footer-inner">
        <div class="cyno-footer-top">
          <div class="cyno-footer-col cyno-footer-col--info">
            <span class="cyno-footer-kicker">&copy; CYNOCOR <span id="year"></span></span>
            <p class="cyno-footer-desc">
              The Apex Animal of Advanced Systems.<br>
              Software, IoT automation, and AI robotics engineered with precision.
            </p>
            <div class="cyno-footer-meta">
              <a href="mailto:cynocorofficial@gmail.com">cynocorofficial@gmail.com</a>
              <span>Colombo, Sri Lanka &middot; <a href="tel:+94742321760">+94 74 232 1760</a></span>
            </div>
          </div>

          <div class="cyno-footer-col cyno-footer-col--form">
            <span class="cyno-footer-kicker">Project Updates</span>
            <p class="cyno-footer-desc">Be the first to know about new releases, CynoBot &amp; systems.</p>
            <form class="cyno-footer-email-form" id="cynoFooterEmailForm">
              <input type="email" id="cynoFooterEmailInput" placeholder="Email" aria-label="Email address" required>
              <button type="submit" aria-label="Continue to contact">&rarr;</button>
            </form>
          </div>

          <div class="cyno-footer-col cyno-footer-col--links">
            <span class="cyno-footer-kicker">Say Hello</span>
            <div class="cyno-footer-link-lists">
              <ul>
                <li><a href="about.html">About</a></li>
                <li><a href="services.html">Services</a></li>
                <li><a href="team.html">Team</a></li>
              </ul>
              <ul>
                <li><a href="projects.html">Projects</a></li>
                <li><a href="gallery.html">Gallery</a></li>
                <li><a href="contact.html">Contact Us</a></li>
              </ul>
            </div>
            <div class="footer-social cyno-footer-social">
              <a href="https://www.facebook.com/profile.php?id=61593575481680" target="_blank" rel="noopener" aria-label="CYNOCOR on Facebook">
                <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
                  <path d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.9.3-1.5 1.6-1.5h1.7V4.9c-.3 0-1.3-.1-2.5-.1-2.5 0-4.1 1.5-4.1 4.3V11H8v3h2.2v8h3.3z"></path>
                </svg>
              </a>
              <a href="https://www.instagram.com/cynocorofficial/" target="_blank" rel="noopener" aria-label="CYNOCOR on Instagram">
                <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="5"></rect>
                  <circle cx="12" cy="12" r="4"></circle>
                  <circle cx="17.2" cy="6.8" r="1"></circle>
                </svg>
              </a>
              <a href="https://www.linkedin.com/company/cynocor/" target="_blank" rel="noopener" aria-label="CYNOCOR on LinkedIn">
                <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
                  <path d="M6.94 8.5H4.12V20h2.82V8.5Z"></path>
                  <path d="M5.53 3.97a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28Z"></path>
                  <path d="M20 20h-2.81v-5.58c0-1.33-.03-3.04-1.86-3.04-1.86 0-2.15 1.45-2.15 2.95V20H10.4V8.5h2.7v1.57h.04c.38-.72 1.31-1.86 3.2-1.86 3.43 0 4.06 2.26 4.06 5.21V20Z"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <a href="index.html" class="cyno-footer-mega" aria-label="CYNOCOR Home">
          <img src="assets/logo2.png" alt="CYNOCOR — The Apex Animal of Advanced Systems" class="cyno-footer-mega-logo">
        </a>
      </div>
    </footer>
  `;

  const emailForm = document.getElementById('cynoFooterEmailForm');
  const emailInput = document.getElementById('cynoFooterEmailInput');
  if (emailForm && emailInput) {
    emailForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = emailInput.value.trim();
      window.location.href = val ? `contact.html?email=${encodeURIComponent(val)}` : 'contact.html';
    });
  }

  const yearEl = document.querySelector('#year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
});
