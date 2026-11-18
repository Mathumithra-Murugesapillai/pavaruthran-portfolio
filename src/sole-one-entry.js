const form = document.querySelector('#sole-one-login');
const message = document.querySelector('#auth-message');
const submit = form?.querySelector('button[type="submit"]');
const launchButton = document.querySelector('#extra-launch');
const extraSection = document.querySelector('#extra');
const accessSection = document.querySelector('#extra-access');
const gate = document.querySelector('#extra-gate');
const destinations = document.querySelector('#extra-destinations');
const hint = document.querySelector('#password-hint');
const lockButton = document.querySelector('#lock-archive');
let sessionValid = false;

function showGate() {
  extraSection.hidden = true;
  accessSection.hidden = false;
  gate.hidden = false;
  destinations.hidden = true;
  form.reset();
  message.textContent = '';
  launchButton.setAttribute('aria-expanded', 'true');
  requestAnimationFrame(() => accessSection.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }));
}

function showDestinations() {
  extraSection.hidden = true;
  accessSection.hidden = false;
  gate.hidden = true;
  destinations.hidden = false;
  launchButton.setAttribute('aria-expanded', 'true');
}

function showExtraButton() {
  accessSection.hidden = true;
  extraSection.hidden = false;
  launchButton.setAttribute('aria-expanded', 'false');
  form.reset();
  message.textContent = '';
  requestAnimationFrame(() => extraSection.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }));
}

function renderHashState() {
  if (location.hash === '#extra-access') {
    if (sessionValid) showDestinations();
    else showGate();
  } else if (location.hash === '#extra') {
    showExtraButton();
  } else {
    accessSection.hidden = true;
    extraSection.hidden = false;
  }
}

async function loadHint() {
  try {
    const response = await fetch('/api/sole-one/hints', { credentials: 'same-origin' });
    if (!response.ok) return;
    const result = await response.json();
    if (typeof result.hint === 'string' && result.hint.trim()) hint.textContent = result.hint;
  } catch { /* The configured JSON hint is optional in static previews. */ }
}

async function checkSession() {
  try {
    const response = await fetch('/api/sole-one/session', { credentials: 'same-origin' });
    sessionValid = response.ok;
  } catch { sessionValid = false; }
  renderHashState();
}

launchButton.addEventListener('click', () => {
  if (location.hash !== '#extra-access') history.pushState(null, '', `${location.pathname}${location.search}#extra-access`);
  if (sessionValid) showDestinations();
  else showGate();
});

form.addEventListener('submit', async event => {
  event.preventDefault();
  message.textContent = '';
  submit.disabled = true;
  submit.innerHTML = '<span>VERIFYING ACCESS...</span><span aria-hidden="true">◌</span>';
  try {
    const response = await fetch('/api/sole-one/login', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: new FormData(form).get('password') })
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'That name did not match. Please try again.');
    sessionValid = true;
    message.textContent = 'ACCESS GRANTED';
    showDestinations();
    destinations.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
  } catch (error) {
    message.textContent = error instanceof SyntaxError || error instanceof TypeError
      ? 'EXTRA access is unavailable right now. Please use the SOLE ONE server and try again.'
      : (error.message || 'That name did not match. Please try again.');
    form.elements.password.select();
  } finally {
    submit.disabled = false;
    submit.innerHTML = '<span>CONTINUE</span><span aria-hidden="true">↗</span>';
  }
});

lockButton.addEventListener('click', async () => {
  try { await fetch('/api/sole-one/logout', { method: 'POST', credentials: 'same-origin' }); } catch { /* Lock this view even if the server is offline. */ }
  sessionValid = false;
  showGate();
});

window.addEventListener('hashchange', renderHashState);
window.addEventListener('popstate', renderHashState);
loadHint();
checkSession();
