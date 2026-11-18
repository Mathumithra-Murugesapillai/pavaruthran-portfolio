const contentRoot = document.querySelector('#archive-content');
const navButtons = [...document.querySelectorAll('.archive-nav button')];
const html = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
let archive;

function sectionMarkup(id) {
  const section = archive.sections[id];
  if (id === 'games') {
    return `<section class="archive-section" aria-labelledby="archive-title">
      <div class="archive-section__heading"><p class="universe-kicker">EXTRA / GAMES</p><h1 id="archive-title">${html(section.title)}</h1><p>${html(section.intro)}</p></div>
      <div class="signal-game">
        <div class="signal-game__copy"><p class="universe-kicker">SIGNAL PROTOCOL / 01</p><h2>Echo the pulse</h2><p>Watch the four directional signals, then repeat them in order. Each round adds one more pulse to the sequence.</p></div>
        <div class="signal-game__display">
          <div class="signal-game__score"><span>ROUND <strong id="signal-round">00</strong></span><span>BEST <strong id="signal-best">00</strong></span></div>
          <div class="signal-game__board" role="group" aria-label="Repeat the signal sequence">
            <button class="signal-pad" type="button" data-signal="0" aria-label="North signal">NORTH</button>
            <button class="signal-pad" type="button" data-signal="1" aria-label="East signal">EAST</button>
            <button class="signal-pad" type="button" data-signal="2" aria-label="South signal">SOUTH</button>
            <button class="signal-pad" type="button" data-signal="3" aria-label="West signal">WEST</button>
          </div>
          <p class="signal-game__status" id="signal-status" role="status" aria-live="polite">Start when you are ready.</p>
          <button class="signal-game__start" id="signal-start" type="button">START SIGNAL</button>
        </div>
      </div>
    </section>`;
  }
  const items = section.items.map(item => `
    <article class="archive-card">
      <div class="archive-placeholder" role="img" aria-label="${html(item.placeholder)}">
        <span class="archive-placeholder__mark" aria-hidden="true">✳</span>
        <span>${html(item.placeholder)}</span>
      </div>
      <p class="archive-card__eyebrow">${html(item.eyebrow)}</p>
      <h3>${html(item.title)}</h3>
      <p>${html(item.description)}</p>
    </article>`).join('');
  return `<section class="archive-section" aria-labelledby="archive-title">
    <div class="archive-section__heading"><p class="universe-kicker">SOLE ONE / ARCHIVE</p><h1 id="archive-title">${html(section.title)}</h1><p>${html(section.intro)}</p></div>
    <div class="archive-grid">${items}</div>
  </section>`;
}

function activateSection(id) {
  if (gameCleanup) {
    gameCleanup();
    gameCleanup = null;
  }
  navButtons.forEach(button => {
    const active = button.dataset.section === id;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-current', active ? 'page' : 'false');
  });
  contentRoot.innerHTML = sectionMarkup(id);
  if (id === 'games') gameCleanup = bindSignalGame();
}

let gameCleanup = null;

function bindSignalGame() {
  const startButton = contentRoot.querySelector('#signal-start');
  const status = contentRoot.querySelector('#signal-status');
  const roundOutput = contentRoot.querySelector('#signal-round');
  const bestOutput = contentRoot.querySelector('#signal-best');
  const pads = [...contentRoot.querySelectorAll('.signal-pad')];
  const timers = new Set();
  let sequence = [];
  let inputIndex = 0;
  let round = 0;
  let best = 0;
  let acceptingInput = false;

  const schedule = (callback, delay) => {
    const timer = window.setTimeout(() => {
      timers.delete(timer);
      callback();
    }, delay);
    timers.add(timer);
  };

  const setPadsEnabled = enabled => pads.forEach(pad => { pad.disabled = !enabled; });
  const pulse = index => {
    const pad = pads[index];
    pad.classList.add('is-lit');
    schedule(() => pad.classList.remove('is-lit'), 290);
  };

  const showSequence = () => {
    acceptingInput = false;
    setPadsEnabled(false);
    let step = 0;
    status.textContent = 'WATCH THE SIGNALS';
    const playNext = () => {
      if (step === sequence.length) {
        schedule(() => {
          inputIndex = 0;
          acceptingInput = true;
          setPadsEnabled(true);
          status.textContent = 'YOUR TURN — REPEAT THE SIGNALS';
        }, 430);
        return;
      }
      status.textContent = `SIGNAL ${step + 1} OF ${sequence.length}`;
      pulse(sequence[step]);
      step += 1;
      schedule(playNext, 560);
    };
    schedule(playNext, 360);
  };

  startButton.addEventListener('click', () => {
    timers.forEach(window.clearTimeout);
    timers.clear();
    pads.forEach(pad => pad.classList.remove('is-lit'));
    sequence = [Math.floor(Math.random() * pads.length)];
    inputIndex = 0;
    round = 0;
    acceptingInput = false;
    roundOutput.textContent = '00';
    startButton.textContent = 'RESTART SIGNAL';
    setPadsEnabled(false);
    showSequence();
  });

  pads.forEach((pad, index) => pad.addEventListener('click', () => {
    if (!acceptingInput) return;
    if (sequence[inputIndex] !== index) {
      acceptingInput = false;
      setPadsEnabled(false);
      status.textContent = `SIGNAL LOST — YOU REACHED ROUND ${String(round).padStart(2, '0')}`;
      best = Math.max(best, round);
      bestOutput.textContent = String(best).padStart(2, '0');
      startButton.textContent = 'TRY AGAIN';
      return;
    }
    pulse(index);
    inputIndex += 1;
    if (inputIndex === sequence.length) {
      round += 1;
      roundOutput.textContent = String(round).padStart(2, '0');
      best = Math.max(best, round);
      bestOutput.textContent = String(best).padStart(2, '0');
      acceptingInput = false;
      setPadsEnabled(false);
      status.textContent = `SIGNAL LOCKED — ROUND ${String(round).padStart(2, '0')}`;
      sequence.push(Math.floor(Math.random() * pads.length));
      schedule(showSequence, 760);
    }
  }));

  return () => {
    timers.forEach(window.clearTimeout);
    pads.forEach(pad => pad.classList.remove('is-lit'));
  };
}

try {
  const response = await fetch('/api/sole-one/content', { credentials: 'same-origin' });
  if (response.status === 401) window.location.replace('/sole-one-entry.html');
  if (!response.ok) throw new Error('The archive could not be loaded.');
  archive = await response.json();
  navButtons.forEach(button => button.addEventListener('click', () => activateSection(button.dataset.section)));
  activateSection('behind-scenes');
} catch (error) {
  contentRoot.innerHTML = `<section class="archive-section"><p class="universe-kicker">SOLE ONE / ARCHIVE</p><h1>Archive unavailable</h1><p>${html(error.message)}</p><a class="archive-return" href="/sole-one-entry.html">RETURN TO ACCESS</a></section>`;
}

document.querySelector('#archive-logout').addEventListener('click', async () => {
  await fetch('/api/sole-one/logout', { method: 'POST', credentials: 'same-origin' });
  window.location.assign('/sole-one');
});
