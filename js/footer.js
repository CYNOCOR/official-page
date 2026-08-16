document.addEventListener('DOMContentLoaded', () => {
  const footerHost = document.getElementById('site-footer');
  if (!footerHost) return;

  footerHost.innerHTML = `
    <footer>
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <a href="index.html" class="brand" aria-label="CYNOCOR home">
              <img src="assets/logo2.png" alt="CYNOCOR logo">
            </a>
            <p>The Apex Animal of Advanced Systems. Software, automation, and business systems engineered with precision.</p>
          </div>

          <div class="footer-col">
            <h4>Navigate</h4>
            <ul>
              <li><a href="about.html">About</a></li>
              <li><a href="team.html">Team</a></li>
              <li><a href="services.html">Services</a></li>
              <li><a href="projects.html">Projects</a></li>
            </ul>
          </div>

          <div class="footer-col">
            <h4>Services</h4>
            <ul>
              <li><a href="services.html">Web Design</a></li>
              <li><a href="services.html">Social Media Marketing</a></li>
              <li><a href="services.html">Graphic Design</a></li>
              <li><a href="services.html">Software Development</a></li>
            </ul>
          </div>

          <div class="footer-col">
            <h4>Contact</h4>
            <ul>
              <li><p>contact@cynocor.com</p></li>
              <li><p>+94 7X XXX XXXX</p></li>
              <li><p>Horana, Sri Lanka</p></li>
            </ul>
          </div>
        </div>

        <div class="footer-bottom">
          <p>&copy; <span id="year"></span> All rights reserved.</p>
          <div class="footer-social">
            <a href="mailto:contact@cynocor.com" aria-label="Email CYNOCOR">
              <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="5" width="18" height="14" rx="2"></rect>
                <path d="M3 7l9 6 9-6"></path>
              </svg>
            </a>
            <a href="https://www.facebook.com/cynocor" target="_blank" rel="noopener" aria-label="CYNOCOR on Facebook">
              <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
                <path d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.9.3-1.5 1.6-1.5h1.7V4.9c-.3 0-1.3-.1-2.5-.1-2.5 0-4.1 1.5-4.1 4.3V11H8v3h2.2v8h3.3z"></path>
              </svg>
            </a>
            <a href="https://www.instagram.com/cynocor" target="_blank" rel="noopener" aria-label="CYNOCOR on Instagram">
              <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="5"></rect>
                <circle cx="12" cy="12" r="4"></circle>
                <circle cx="17.2" cy="6.8" r="1"></circle>
              </svg>
            </a>
            <a href="https://www.linkedin.com/company/cynocor" target="_blank" rel="noopener" aria-label="CYNOCOR on LinkedIn">
              <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
                <path d="M6.94 8.5H4.12V20h2.82V8.5Z"></path>
                <path d="M5.53 3.97a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28Z"></path>
                <path d="M20 20h-2.81v-5.58c0-1.33-.03-3.04-1.86-3.04-1.86 0-2.15 1.45-2.15 2.95V20H10.4V8.5h2.7v1.57h.04c.38-.72 1.31-1.86 3.2-1.86 3.43 0 4.06 2.26 4.06 5.21V20Z"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  `;

  const yearEl = document.querySelector('#year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
});
