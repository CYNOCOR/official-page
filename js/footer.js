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
            <div class="footer-social cyno-footer-social">
              <a href="https://www.facebook.com/profile.php?id=61593575481680" target="_blank" rel="noopener noreferrer" aria-label="CYNOCOR on Facebook">
                <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
                  <path d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.9.3-1.5 1.6-1.5h1.7V4.9c-.3 0-1.3-.1-2.5-.1-2.5 0-4.1 1.5-4.1 4.3V11H8v3h2.2v8h3.3z"></path>
                </svg>
              </a>
              <a href="https://www.instagram.com/cynocorofficial/" target="_blank" rel="noopener noreferrer" aria-label="CYNOCOR on Instagram">
                <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="5"></rect>
                  <circle cx="12" cy="12" r="4"></circle>
                  <circle cx="17.2" cy="6.8" r="1"></circle>
                </svg>
              </a>
              <a href="https://www.linkedin.com/company/cynocor/" target="_blank" rel="noopener noreferrer" aria-label="CYNOCOR on LinkedIn">
                <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
                  <path d="M6.94 8.5H4.12V20h2.82V8.5Z"></path>
                  <path d="M5.53 3.97a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28Z"></path>
                  <path d="M20 20h-2.81v-5.58c0-1.33-.03-3.04-1.86-3.04-1.86 0-2.15 1.45-2.15 2.95V20H10.4V8.5h2.7v1.57h.04c.38-.72 1.31-1.86 3.2-1.86 3.43 0 4.06 2.26 4.06 5.21V20Z"></path>
                </svg>
              </a>
              <a href="https://wa.me/94742321760?text=Hi%20CYNOCOR%2C%20I%27d%20like%20to%20get%20in%20touch." target="_blank" rel="noopener noreferrer" aria-label="CYNOCOR on WhatsApp">
                <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
                  <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2Zm5.76 14.01c-.24.68-1.42 1.3-1.97 1.38-.5.08-1.14.11-1.84-.11-.43-.14-.98-.32-1.69-.63-2.98-1.29-4.92-4.3-5.07-4.5-.15-.2-1.21-1.61-1.21-3.07 0-1.46.77-2.18 1.04-2.48.27-.3.6-.37.8-.37h.58c.18 0 .43-.07.67.51.24.59.82 2.02.9 2.17.07.15.12.32.02.52-.1.2-.15.32-.3.5-.15.17-.31.39-.44.52-.15.15-.3.31-.13.61.17.3.76 1.26 1.63 2.04 1.12 1 2.06 1.31 2.36 1.46.3.15.47.13.65-.07.18-.2.74-.86.94-1.16.2-.3.4-.25.67-.15.27.1 1.72.81 2.02.96.3.15.5.22.57.34.08.13.08.73-.16 1.41Z"></path>
                </svg>
              </a>
              <a href="https://www.tiktok.com/@cynocor.official?is_from_webapp=1&amp;sender_device=pc" target="_blank" rel="noopener noreferrer" aria-label="CYNOCOR on TikTok">
                <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.81a8.23 8.23 0 0 0 4.76 1.5v-3.4a4.85 4.85 0 0 1-1-.22Z"></path>
                </svg>
              </a>
              <a href="https://www.youtube.com/@cynocorofficial" target="_blank" rel="noopener noreferrer" aria-label="CYNOCOR on YouTube">
                <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
                  <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.55A3.02 3.02 0 0 0 .5 6.19C0 8.08 0 12 0 12s0 3.92.5 5.81a3.02 3.02 0 0 0 2.12 2.14c1.88.55 9.38.55 9.38.55s7.5 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14C24 15.92 24 12 24 12s0-3.92-.5-5.81ZM9.55 15.57V8.43L15.82 12l-6.27 3.57Z"></path>
                </svg>
              </a>
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
