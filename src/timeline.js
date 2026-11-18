const projects = [
  { year: '2022', category: 'FOUNDATIONS', title: 'Finding Our Rhythm', description: 'A year of ideas taking their first shape.', detail: 'Experiments, new skills, and early collaborations shaped a more confident creative voice.', image: '/public/reference/pr-years/pr-2022%20.png' },
  { year: '2023', category: 'EXPLORATION', title: 'A Year of Becoming', description: 'Learning, making, and growing together.', detail: 'Each project added another layer to the craft and strengthened the way the team worked together.', image: '/public/reference/pr-years/pr-2023.png' },
  { year: '2024', category: 'COLLABORATION', title: 'Building Together', description: 'Turning shared ambition into real work.', detail: 'New concepts, bolder visual choices, and stories built with a clearer point of view.', image: '/public/reference/pr-years/pr-2024.png' },
  { year: '2025', category: 'NEW HORIZONS', title: 'New Horizons', description: 'A wider horizon for moving images.', detail: 'Fresh challenges and opportunities opened new ways to explore the moving image.', image: '/public/reference/pr-years/pr-2025.png' },
  { year: '2026', category: 'IN PROGRESS', title: 'Still Unfolding', description: 'The next part of the journey is taking shape.', detail: 'A living chapter for ideas and work still in progress.', image: '/public/reference/pr-years/pr-2026.png' },
];
const desktopTimeline = window.matchMedia('(min-width: 761px)').matches;
const milestoneX = desktopTimeline ? [9.5, 30, 50, 70, 90.5] : [12, 31, 50, 69, 88];
const milestoneY = desktopTimeline ? [0, 94, 188, 282, 376] : [120, 140, 160, 180, 200];
const cardDropHalfFrames = desktopTimeline ? [0, 8, 19, 33, 42] : [0, 0, 0, 0, 0];
const cardOffsetVw = desktopTimeline ? [0, 0.35, -0.35, 0.35, -0.35] : [0, 0, 0, 0, 0];
const frameScales = [0.92, 1.05, 1.12, 1.05, 0.92];
const timelinePath = desktopTimeline
  ? 'M210 0 C280 27 328 81 390 94 C452 107 512 175 570 188 C628 201 688 269 750 282 C812 295 872 350 930 376'
  : 'M120 120 C180 122 245 135 310 140 C375 145 435 155 500 160 C565 165 625 175 690 180 C755 185 820 198 880 200';

const root = document.querySelector('#timeline-root');
root.innerHTML = `
  <section class="journey" id="timeline" aria-labelledby="journey-title">
    <div class="journey__light" aria-hidden="true"></div>
    <header class="journey__heading">
      <p class="journey__eyebrow">PAVARUTHRAN · CINEMATIC ARCHIVE</p>
      <h2 id="journey-title">Stories Across Time</h2>
      <p class="journey__subheading">Five chapters<br>one evolving frame</p>
    </header>
    <div class="journey-clock-window" aria-hidden="true">
    <div class="journey-orbit journey-clock">
      <svg viewBox="0 0 620 620">
        <circle class="journey-orbit__ring journey-clock__ring journey-orbit__ring--outer" cx="310" cy="310" r="276" />
        <circle class="journey-orbit__ring journey-clock__ring journey-orbit__ring--middle" cx="310" cy="310" r="228" />
        <ellipse class="journey-orbit__ring journey-clock__ring journey-orbit__ring--inner" cx="310" cy="310" rx="172" ry="244" transform="rotate(32 310 310)" />
        <path class="journey-orbit__arc" d="M52 360 C116 102 389 12 570 176" />
        <path class="journey-orbit__arc journey-orbit__arc--fine" d="M94 426 C193 185 410 113 560 245" />
        <circle class="journey-orbit__particle" r="4"><animateMotion class="journey-clock__particle-motion" begin="indefinite" dur="18s" repeatCount="indefinite" path="M52 360 C116 102 389 12 570 176" /></circle>
        <circle class="journey-orbit__marker" cx="110" cy="125" r="3" />
        <circle class="journey-orbit__marker journey-orbit__marker--gold" cx="514" cy="359" r="3" />
        <g class="journey-clock__ticks"></g>
      </svg>
    </div>
    <svg class="journey-hands" viewBox="0 0 620 620" aria-hidden="true">
      <defs><linearGradient id="journey-hand-gold" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff3cf"/><stop offset=".48" stop-color="#efbf65"/><stop offset="1" stop-color="#d88e32"/></linearGradient></defs>
      <g class="journey-clock__hand journey-clock__hand--long"><path d="M310 306 L-322 309.2 L-350 310 L-322 310.8 L310 314 Z" /></g>
      <g class="journey-clock__hand journey-clock__hand--short"><path d="M310 305.5 L-202 309 L-230 310 L-202 311 L310 314.5 Z" /></g>
      <circle class="journey-clock__pivot-halo" cx="310" cy="310" r="11" />
      <circle class="journey-clock__pivot-core" cx="310" cy="310" r="4.5" />
    </svg>
    </div>
    <div class="journey-archive" aria-label="Five project chapters">
      <div class="journey-timeline" aria-label="Select a project year"><svg class="journey-timeline__svg" viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="journey-timeline-gold"><stop stop-color="#bd852f"/><stop offset=".48" stop-color="#ffe3a1"/><stop offset="1" stop-color="#dc9b3f"/></linearGradient><filter id="journey-timeline-glow" x="-20%" y="-300%" width="140%" height="700%"><feGaussianBlur stdDeviation="3"/></filter></defs><path class="journey-timeline__track" d="${timelinePath}"/><path class="journey-timeline__active" d="${timelinePath}"/><g class="journey-ruler-ticks"></g><g class="journey-timeline__traveler"><ellipse class="journey-timeline__traveler-tail" cx="0" cy="0" rx="14" ry="3"/><circle class="journey-timeline__traveler-core" cx="0" cy="0" r="4.4"/><animateMotion class="journey-timeline__traveler-motion" begin="indefinite" dur="5s" repeatCount="indefinite" rotate="auto" path="${timelinePath}"/></g></svg></div>
      <div class="journey-cards" tabindex="0" aria-label="Project cards. Swipe horizontally on touch screens."></div>
      <div class="journey-controls" aria-label="Project navigation">
        <button class="journey-controls__button journey-controls__button--prev" type="button" aria-label="Previous project">←</button>
        <span class="journey-controls__count" aria-live="polite">01 / 05</span>
        <button class="journey-controls__button journey-controls__button--next" type="button" aria-label="Next project">→</button>
      </div>
    </div>
    <p class="journey__footer">PAVARUTHRAN <span>✦</span> ALWAYS IN MOTION</p>
    <div class="journey-modal" role="dialog" aria-modal="true" aria-hidden="true" aria-labelledby="journey-modal-title">
      <button class="journey-modal__scrim" type="button" aria-label="Close project presentation"></button>
      <article class="journey-modal__panel">
        <button class="journey-modal__close" type="button" aria-label="Close project presentation">×</button>
        <div class="journey-modal__image" aria-hidden="true"></div>
        <div class="journey-modal__copy">
          <p class="journey-modal__eyebrow"></p>
          <h3 id="journey-modal-title"></h3>
          <p class="journey-modal__description"></p>
          <div class="journey-modal__switch">
            <button class="journey-modal__previous" type="button">← Previous</button>
            <button class="journey-modal__next" type="button">Next →</button>
          </div>
        </div>
      </article>
    </div>
  </section>`;

const journey = root.querySelector('.journey');
const timeline = root.querySelector('.journey-timeline');
const cards = root.querySelector('.journey-cards');
const counter = root.querySelector('.journey-controls__count');
const timelineActive = root.querySelector('.journey-timeline__active');
const timelineTrack = root.querySelector('.journey-timeline__track');
const timelineTravelerMotion = root.querySelector('.journey-timeline__traveler-motion');
const clockParticleMotion = root.querySelector('.journey-clock__particle-motion');
const longHand = root.querySelector('.journey-clock__hand--long');
const shortHand = root.querySelector('.journey-clock__hand--short');
const modal = root.querySelector('.journey-modal');
const modalTitle = root.querySelector('#journey-modal-title');
const modalEyebrow = root.querySelector('.journey-modal__eyebrow');
const modalDescription = root.querySelector('.journey-modal__description');
const modalImage = root.querySelector('.journey-modal__image');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let selected = 0;
let modalOpen = false;
const sequenceTimers = [];
let animationRunning = false;
let handAnimations = [];
const yearStepMs = 300;

timeline.insertAdjacentHTML('beforeend', projects.map((project, index) => `
  <button class="journey-year${index === 0 ? ' is-active' : ''}" type="button" data-index="${index}" aria-pressed="${index === 0}" aria-label="Select ${project.year}">
    <span class="journey-year__node"></span><span>${project.year}</span>
  </button>`).join(''));
timeline.querySelectorAll('.journey-year').forEach((button, index) => {
  const y = milestoneY[index];
  button.style.left = `${milestoneX[index]}%`;
  button.style.top = `calc(${(y / 1000) * 100}% + 11px)`;
});
timelineActive.style.strokeDasharray = `${timelineActive.getTotalLength()}`;
timelineActive.style.strokeDashoffset = `${timelineActive.getTotalLength()}`;
timelineTrack.style.strokeDasharray = `${timelineTrack.getTotalLength()}`;
timelineTrack.style.strokeDashoffset = `${timelineTrack.getTotalLength()}`;

const clockTicks = root.querySelector('.journey-clock__ticks');
for (let tick = 0; tick < 60; tick += 1) {
  const angle = (tick * Math.PI) / 30 - Math.PI / 2;
  const outer = 263;
  const inner = tick % 5 === 0 ? 237 : 251;
  const mark = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  mark.setAttribute('x1', 310 + Math.cos(angle) * inner);
  mark.setAttribute('y1', 310 + Math.sin(angle) * inner);
  mark.setAttribute('x2', 310 + Math.cos(angle) * outer);
  mark.setAttribute('y2', 310 + Math.sin(angle) * outer);
  mark.classList.add('journey-clock__tick');
  if (tick % 5 === 0) mark.classList.add('journey-clock__tick--major');
  clockTicks.append(mark);
}

cards.innerHTML = projects.map((project, index) => `
  <article class="journey-card${index === 0 ? ' is-active' : ''}" data-index="${index}" tabindex="0" aria-label="${project.year}: ${project.title}. Open project details.">
    <div class="journey-card__face">
      <div class="journey-card__image"><img src="${project.image}" alt="Pavaruthran archive image from ${project.year}" loading="lazy" decoding="async"${index === 0 ? ' fetchpriority="high"' : ''} /></div>
      <div class="journey-card__info">
        <p class="journey-card__year">${project.year}<span>${project.category}</span></p>
        <h3>${project.title}</h3>
        <p class="journey-card__description">${project.description}</p>
        <p class="journey-card__more">${project.detail}</p>
      </div>
    </div>
  </article>`).join('');

let timelineLayoutSignature = '';
function layoutDesktopTimeline() {
  if (!desktopTimeline) return;
  const timelineWidth = timeline.clientWidth;
  const timelineHeight = timeline.clientHeight;
  const frameCards = [...cards.querySelectorAll('.journey-card')];
  if (!timelineWidth || !timelineHeight || frameCards.some(card => !card.offsetWidth || !card.offsetHeight)) return;
  const signature = [window.innerWidth, window.innerHeight, timelineWidth, timelineHeight, ...frameCards.map(card => `${card.offsetWidth}x${card.offsetHeight}`)].join(':');
  if (signature === timelineLayoutSignature) return;
  timelineLayoutSignature = signature;

  const points = frameCards.map((card, index) => {
    const centerX = (cards.clientWidth * milestoneX[index]) / 100 + (window.innerWidth * cardOffsetVw[index]) / 100;
    const frameRight = centerX + (card.offsetWidth * frameScales[index]) / 2;
    const frameTop = (card.offsetHeight * cardDropHalfFrames[index]) / 100;
    const markerX = frameRight + 12;
    const markerY = frameTop - 30;
    const button = timeline.querySelector(`.journey-year[data-index="${index}"]`);
    button.style.left = `${markerX}px`;
    button.style.top = `${markerY + 9}px`;
    return { x: (markerX / timelineWidth) * 1000, y: (markerY / timelineHeight) * 1000 };
  });

  const path = points.reduce((d, point, index, all) => {
    if (index === 0) return `M${point.x} ${point.y}`;
    const previous = all[index - 1];
    const before = all[index - 2] || previous;
    const after = all[index + 1] || point;
    const c1 = { x: previous.x + (point.x - before.x) / 6, y: previous.y + (point.y - before.y) / 6 };
    const c2 = { x: point.x - (after.x - previous.x) / 6, y: point.y - (after.y - previous.y) / 6 };
    return `${d} C${c1.x} ${c1.y} ${c2.x} ${c2.y} ${point.x} ${point.y}`;
  }, '');

  timelineTrack.setAttribute('d', path);
  timelineActive.setAttribute('d', path);
  timelineTravelerMotion.setAttribute('path', path);
  const length = timelineTrack.getTotalLength();
  timelineTrack.style.strokeDasharray = `${length}`;
  timelineTrack.style.strokeDashoffset = journey.classList.contains('journey-line-ready') ? '0' : `${length}`;
  timelineActive.style.strokeDasharray = `${length}`;
  timelineActive.style.strokeDashoffset = `${length * (1 - selected / (projects.length - 1))}`;

  const tickGroup = root.querySelector('.journey-ruler-ticks');
  tickGroup.replaceChildren();
  const tickCount = 48;
  for (let tick = 0; tick <= tickCount; tick += 1) {
    const distance = (length * tick) / tickCount;
    const point = timelineTrack.getPointAtLength(distance);
    const before = timelineTrack.getPointAtLength(Math.max(0, distance - 1));
    const after = timelineTrack.getPointAtLength(Math.min(length, distance + 1));
    const tangentX = ((after.x - before.x) * timelineWidth) / 1000;
    const tangentY = ((after.y - before.y) * timelineHeight) / 1000;
    const tangentLength = Math.hypot(tangentX, tangentY) || 1;
    const normalX = -tangentY / tangentLength;
    const normalY = tangentX / tangentLength;
    const halfLength = tick % 6 === 0 ? 8 : 4.5;
    const mark = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    mark.setAttribute('x1', point.x - (normalX * halfLength * 1000) / timelineWidth);
    mark.setAttribute('y1', point.y - (normalY * halfLength * 1000) / timelineHeight);
    mark.setAttribute('x2', point.x + (normalX * halfLength * 1000) / timelineWidth);
    mark.setAttribute('y2', point.y + (normalY * halfLength * 1000) / timelineHeight);
    mark.classList.add('journey-ruler-tick');
    if (tick % 6 === 0) mark.classList.add('journey-ruler-tick--major');
    tickGroup.append(mark);
  }
}

let timelineResizeFrame = 0;
function onTimelineResize() {
  if (!desktopTimeline) return;
  window.cancelAnimationFrame(timelineResizeFrame);
  timelineResizeFrame = window.requestAnimationFrame(() => {
    timelineLayoutSignature = '';
    layoutDesktopTimeline();
  });
}

function setActive(index, focusCard = false) {
  selected = (index + projects.length) % projects.length;
  timeline.querySelectorAll('.journey-year').forEach((button, buttonIndex) => {
    const active = buttonIndex === selected;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  cards.querySelectorAll('.journey-card').forEach((card, cardIndex) => {
    card.classList.toggle('is-active', cardIndex === selected);
    card.style.setProperty('--stack-index', cardIndex - selected);
    card.style.setProperty('--card-y', `${cardDropHalfFrames[cardIndex]}%`);
    card.style.setProperty('--card-x', `${cardOffsetVw[cardIndex]}vw`);
    const frameScale = frameScales[cardIndex];
    card.style.setProperty('--frame-scale', String(frameScale));
    card.style.setProperty('--frame-arrive-scale', String(frameScale * 0.84));
    card.style.setProperty('--frame-hover-scale', String(frameScale * 1.035));
    card.style.left = `${milestoneX[cardIndex]}%`;
    card.style.zIndex = cardIndex === selected ? '20' : String(5 + cardIndex);
  });
  layoutDesktopTimeline();
  counter.textContent = `${String(selected + 1).padStart(2, '0')} / ${String(projects.length).padStart(2, '0')}`;
  timeline.style.setProperty('--timeline-progress', `${(selected / (projects.length - 1)) * 100}%`);
  timelineActive.style.strokeDashoffset = `${timelineActive.getTotalLength() * (1 - selected / (projects.length - 1))}`;
  journey.style.setProperty('--selected-index', selected);
  if (selected === 0 && journey.classList.contains('journey-clock-ready')) {
    journey.classList.remove('journey-start-pulse');
    void journey.offsetWidth;
    journey.classList.add('journey-start-pulse');
    sequenceTimers.push(window.setTimeout(() => journey.classList.remove('journey-start-pulse'), 820));
  }
  if (focusCard) cards.querySelector(`[data-index="${selected}"]`).scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'nearest', inline: 'center' });
  if (modalOpen) updateModal();
}

function updateModal() {
  const project = projects[selected];
  modalEyebrow.textContent = `${project.year} · ${project.category}`;
  modalTitle.textContent = project.title;
  modalDescription.textContent = project.detail;
  modalImage.style.backgroundImage = `url("${project.image}")`;
  modal.classList.toggle('is-year-2022', selected === 0);
}

function openModal(index) {
  setActive(index);
  modalOpen = true;
  updateModal();
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('journey-modal-open');
  modal.querySelector('.journey-modal__close').focus();
}

function closeModal() {
  modalOpen = false;
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('journey-modal-open');
}

timeline.addEventListener('click', event => {
  const button = event.target.closest('.journey-year');
  if (button) setActive(Number(button.dataset.index), true);
});
timeline.addEventListener('pointerover', event => {
  const button = event.target.closest('.journey-year');
  if (button) setActive(Number(button.dataset.index));
});
timeline.addEventListener('focusin', event => {
  const button = event.target.closest('.journey-year');
  if (button) setActive(Number(button.dataset.index));
});
setActive(0);
window.addEventListener('resize', onTimelineResize, { passive: true });
cards.addEventListener('pointerover', event => {
  const card = event.target.closest('.journey-card');
  if (card) setActive(Number(card.dataset.index));
});
cards.addEventListener('click', event => {
  const card = event.target.closest('.journey-card');
  if (card) openModal(Number(card.dataset.index));
});
cards.addEventListener('keydown', event => {
  if ((event.key === 'Enter' || event.key === ' ') && event.target.matches('.journey-card')) {
    event.preventDefault();
    openModal(Number(event.target.dataset.index));
  }
  if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
    event.preventDefault();
    setActive(selected + (event.key === 'ArrowRight' ? 1 : -1), true);
  }
});
root.querySelector('.journey-controls__button--prev').addEventListener('click', () => setActive(selected - 1, true));
root.querySelector('.journey-controls__button--next').addEventListener('click', () => setActive(selected + 1, true));
root.querySelector('.journey-modal__previous').addEventListener('click', () => setActive(selected - 1));
root.querySelector('.journey-modal__next').addEventListener('click', () => setActive(selected + 1));
root.querySelectorAll('.journey-modal__close,.journey-modal__scrim').forEach(button => button.addEventListener('click', closeModal));
function onModalKeydown(event) {
  if (!modalOpen) return;
  if (event.key === 'Escape') closeModal();
  if (event.key === 'ArrowRight') setActive(selected + 1);
  if (event.key === 'ArrowLeft') setActive(selected - 1);
}
document.addEventListener('keydown', onModalKeydown);

function clearSequence() {
  sequenceTimers.splice(0).forEach(timer => clearTimeout(timer));
  handAnimations.forEach(animation => animation.cancel());
  handAnimations = [];
}

function resetRevealSequence() {
  animationRunning = false;
  clearSequence();
  if (typeof timelineTravelerMotion.endElement === 'function') timelineTravelerMotion.endElement();
  if (typeof clockParticleMotion.endElement === 'function') clockParticleMotion.endElement();
  longHand.style.transform = 'rotate(-45deg)';
  shortHand.style.transform = 'rotate(45deg)';
  journey.classList.remove('is-revealed', 'journey-clock-ready', 'journey-line-ready', 'journey-start-pulse');
  timeline.querySelectorAll('.journey-year').forEach(button => button.classList.remove('is-visible'));
  cards.querySelectorAll('.journey-card').forEach(card => card.classList.remove('is-visible'));
  timelineTrack.style.strokeDashoffset = String(timelineTrack.getTotalLength());
  timelineActive.style.strokeDashoffset = String(timelineActive.getTotalLength());
  setActive(0);
  if (modalOpen) closeModal();
}

function startRevealSequence() {
  if (animationRunning) return;
  clearSequence();
  animationRunning = true;
  longHand.style.transform = 'rotate(-45deg)';
  shortHand.style.transform = 'rotate(45deg)';
  journey.classList.add('is-revealed');
  sequenceTimers.push(window.setTimeout(() => {
    journey.classList.add('journey-clock-ready');
    if (!reducedMotion) clockParticleMotion.beginElement();
  }, reducedMotion ? 0 : 340));
  sequenceTimers.push(window.setTimeout(() => {
    journey.classList.add('journey-line-ready');
    timelineTrack.style.strokeDashoffset = '0';
    if (!reducedMotion) timelineTravelerMotion.beginElement();
  }, reducedMotion ? 0 : 420));
  projects.forEach((project, index) => {
    sequenceTimers.push(window.setTimeout(() => {
      timeline.querySelector(`.journey-year[data-index="${index}"]`).classList.add('is-visible');
      cards.querySelector(`.journey-card[data-index="${index}"]`).classList.add('is-visible');
      setActive(index);
      if (index === projects.length - 1) scheduleYearLoop();
    }, reducedMotion ? 0 : 700 + index * yearStepMs));
  });
  sequenceTimers.push(window.setTimeout(() => {
    if (reducedMotion) {
      longHand.style.transform = 'rotate(-117deg)';
      shortHand.style.transform = 'rotate(-27deg)';
      return;
    }
    handAnimations = [
      longHand.animate([
        { transform: 'rotate(-45deg)', offset: 0 },
        { transform: 'rotate(-55deg)', offset: 1 / 3 },
        { transform: 'rotate(-80deg)', offset: 2 / 3 },
        { transform: 'rotate(-117deg)', offset: 1 },
      ], { duration: 900, easing: 'cubic-bezier(.52,0,.3,1)', fill: 'forwards' }),
      shortHand.animate([
        { transform: 'rotate(45deg)', offset: 0 },
        { transform: 'rotate(35deg)', offset: 1 / 3 },
        { transform: 'rotate(10deg)', offset: 2 / 3 },
        { transform: 'rotate(-27deg)', offset: 1 },
      ], { duration: 900, easing: 'cubic-bezier(.52,0,.3,1)', fill: 'forwards' }),
    ];
  }, reducedMotion ? 0 : 1300));
}

const reveal = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      startRevealSequence();
    } else resetRevealSequence();
  });
}, { threshold: 0.12 });
reveal.observe(journey);

window.addEventListener('pagehide', () => {
  resetRevealSequence();
  document.removeEventListener('keydown', onModalKeydown);
  window.removeEventListener('resize', onTimelineResize);
  window.cancelAnimationFrame(timelineResizeFrame);
  document.body.classList.remove('journey-modal-open');
  reveal.disconnect();
}, { once: true });
