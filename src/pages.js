const pagesRoot = document.querySelector('#main-pages-root');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

pagesRoot.innerHTML = `
  <section class="sole-one-page" id="sole-one" aria-labelledby="sole-one-title">
    <div class="main-page-glow" aria-hidden="true"></div>
    <div class="sole-one-page__copy">
      <p class="main-page-eyebrow">PAVARUTHRAN PRESENTS · FEATURE PROJECT</p>
      <h2 id="sole-one-title">SOLE ONE</h2>
      <p class="sole-one-page__description">A story with its own universe. Step inside the Sole One archive for its characters, making, and media.</p>
      <a class="sole-one-enter" href="/sole-one-entry.html" aria-label="Enter the SOLE ONE universe">
        <span class="sole-one-enter__label">ENTER THE UNIVERSE</span>
        <span class="sole-one-enter__arrow" aria-hidden="true">↗</span>
      </a>
      <p class="sole-one-page__note">A private archive · Access required</p>
    </div>
    <a class="sole-one-page__visual-link" href="/sole-one-entry.html" aria-label="Open the Sole One experience">
      <div class="sole-one-poster" role="img" aria-label="Sole One film still placeholder; project photography has not been provided">
        <span class="sole-one-poster__index">PAVARUTHRAN / 04</span>
        <span class="sole-one-poster__orbit sole-one-poster__orbit--outer" aria-hidden="true"></span>
        <span class="sole-one-poster__orbit sole-one-poster__orbit--inner" aria-hidden="true"></span>
        <span class="sole-one-poster__placeholder">FILM STILL<br>TO BE ADDED</span>
        <span class="sole-one-poster__title" aria-hidden="true">SOLE<br>ONE</span>
        <span class="sole-one-poster__footer">A PAVARUTHRAN PROJECT</span>
      </div>
    </a>
    <span class="main-page-index" aria-hidden="true">04 / 05</span>
  </section>

  <section class="final-page" id="finale" aria-labelledby="final-page-title">
    <div class="main-page-glow main-page-glow--final" aria-hidden="true"></div>
    <div class="final-page__center">
      <p class="main-page-eyebrow">PAVARUTHRAN · END CREDITS</p>
      <h2 id="final-page-title">Until the next story.</h2>
      <p class="final-page__subheading">Thank you for being here.</p>
      <div class="final-socials" aria-label="Social media links, awaiting supplied URLs">
        <span class="final-social" role="img" aria-label="YouTube icon; link not configured" title="YouTube link not configured">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.6 3.6 12 3.6 12 3.6s-7.6 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.8.5 9.4.5 9.4.5s7.6 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.2 3.6-6.2 3.6Z"/></svg>
        </span>
        <span class="final-social" role="img" aria-label="Instagram icon; link not configured" title="Instagram link not configured">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2Zm0 2A3.8 3.8 0 0 0 4 7.8v8.4A3.8 3.8 0 0 0 7.8 20h8.4a3.8 3.8 0 0 0 3.8-3.8V7.8A3.8 3.8 0 0 0 16.2 4H7.8ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm5.4-3.5a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4Z"/></svg>
        </span>
        <span class="final-social" role="img" aria-label="GitHub icon; link not configured" title="GitHub link not configured">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 .8a11.2 11.2 0 0 0-3.54 21.83c.56.1.76-.24.76-.54v-2.1c-3.1.68-3.76-1.32-3.76-1.32-.5-1.3-1.23-1.65-1.23-1.65-1.01-.69.08-.68.08-.68 1.12.08 1.71 1.15 1.71 1.15 1 1.7 2.62 1.2 3.26.92.1-.72.39-1.2.7-1.48-2.47-.28-5.07-1.23-5.07-5.5 0-1.21.43-2.2 1.15-2.98-.12-.28-.5-1.42.11-2.95 0 0 .94-.3 3.08 1.14a10.7 10.7 0 0 1 5.6 0c2.14-1.45 3.08-1.14 3.08-1.14.61 1.53.23 2.67.11 2.95.72.78 1.15 1.77 1.15 2.98 0 4.28-2.61 5.22-5.09 5.49.4.35.75 1.02.75 2.06v3.06c0 .3.2.65.77.54A11.2 11.2 0 0 0 12 .8Z"/></svg>
        </span>
      </div>
      <p class="final-page__links-note">Social links will appear here when configured.</p>
      <a class="final-page__top" href="#intro">RETURN TO THE BEGINNING <span aria-hidden="true">↑</span></a>
    </div>
    <span class="main-page-index" aria-hidden="true">05 / 05</span>
  </section>`;

const soleOneLink = pagesRoot.querySelector('.sole-one-enter');
const soleOneSection = pagesRoot.querySelector('.sole-one-page');
pagesRoot.querySelector('.sole-one-page__visual-link').addEventListener('click', event => {
  if (!reducedMotion) {
    event.preventDefault();
    soleOneSection.classList.add('is-entering');
    window.setTimeout(() => window.location.assign(soleOneLink.href), 640);
  }
});
soleOneLink.addEventListener('click', event => {
  if (!reducedMotion) {
    event.preventDefault();
    soleOneSection.classList.add('is-entering');
    window.setTimeout(() => window.location.assign(soleOneLink.href), 640);
  }
});
