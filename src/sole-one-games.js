const gameLauncher = document.querySelector('#open-signal-game');
const gameContent = document.querySelector('#signal-game');
const backButton = document.querySelector('#back-to-games');
const startButton = document.querySelector('#game-start');
const status = document.querySelector('#game-status');
const roundLabel = document.querySelector('#game-round');
const bestLabel = document.querySelector('#game-best');
const pads = [...document.querySelectorAll('.signal-pad')];
let sequence = [];
let inputIndex = 0;
let acceptingInput = false;
let round = 0;
let runId = 0;
let best = Number(sessionStorage.getItem('sole-one-signal-best') || 0);

if (bestLabel) bestLabel.textContent = best ? String(best) : '—';
const sleep = duration => new Promise(resolve => window.setTimeout(resolve, duration));
const light = (index, on) => pads[index]?.classList.toggle('is-lit', on);
const enablePads = enabled => pads.forEach(pad => { pad.disabled = !enabled; });

async function showSequence(id) {
  acceptingInput = false;
  enablePads(false);
  status.textContent = 'Watch the signal...';
  await sleep(550);
  for (const index of sequence) {
    if (id !== runId) return;
    light(index, true);
    await sleep(420);
    light(index, false);
    await sleep(210);
  }
  if (id !== runId) return;
  inputIndex = 0;
  acceptingInput = true;
  enablePads(true);
  status.textContent = 'Your turn. Repeat the sequence.';
}

function nextRound() {
  round += 1;
  roundLabel.textContent = String(round);
  sequence.push(Math.floor(Math.random() * pads.length));
  showSequence(runId);
}

function finishRun() {
  runId += 1;
  acceptingInput = false;
  enablePads(false);
  if (round > best) {
    best = round;
    bestLabel.textContent = String(best);
    sessionStorage.setItem('sole-one-signal-best', String(best));
  }
  status.textContent = round ? `Signal lost. You reached round ${round}.` : 'Ready when you are.';
  startButton.textContent = 'PLAY AGAIN';
}

function receive(index) {
  if (!acceptingInput) return;
  light(index, true);
  window.setTimeout(() => light(index, false), 180);
  if (sequence[inputIndex] !== index) { finishRun(); return; }
  inputIndex += 1;
  if (inputIndex === sequence.length) {
    acceptingInput = false;
    enablePads(false);
    status.textContent = 'Signal matched. Preparing next round...';
    const id = runId;
    window.setTimeout(() => { if (id === runId) nextRound(); }, 650);
  }
}

function stopRun() {
  runId += 1;
  acceptingInput = false;
  enablePads(false);
  pads.forEach((_, index) => light(index, false));
  status.textContent = 'Ready when you are.';
  roundLabel.textContent = '—';
  startButton.textContent = 'START GAME';
}

function startRun() {
  runId += 1;
  sequence = [];
  round = 0;
  roundLabel.textContent = '—';
  startButton.textContent = 'RESTART GAME';
  status.textContent = 'Locking onto a new signal...';
  nextRound();
}

gameLauncher.addEventListener('click', () => {
  gameLauncher.setAttribute('aria-expanded', 'true');
  gameLauncher.hidden = true;
  gameContent.hidden = false;
  gameContent.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
});
backButton.addEventListener('click', () => {
  stopRun();
  gameContent.hidden = true;
  gameLauncher.hidden = false;
  gameLauncher.setAttribute('aria-expanded', 'false');
  gameLauncher.focus();
});
startButton.addEventListener('click', startRun);
pads.forEach((pad, index) => pad.addEventListener('click', () => receive(index)));
window.addEventListener('keydown', event => {
  if (!acceptingInput || event.altKey || event.ctrlKey || event.metaKey) return;
  const index = Number(event.key) - 1;
  if (index >= 0 && index < pads.length) { event.preventDefault(); receive(index); }
});
enablePads(false);
