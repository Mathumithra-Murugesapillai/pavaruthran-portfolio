async function verifyDestinationSession() {
  try {
    const response = await fetch('/api/sole-one/session', { credentials: 'same-origin' });
    if (!response.ok) {
      window.location.replace('/sole-one-entry.html#extra-access');
      return;
    }
    document.body.classList.add('is-authorized');
    window.dispatchEvent(new Event('sole-one-authorized'));
  } catch {
    window.location.replace('/sole-one-entry.html#extra-access');
  }
}

verifyDestinationSession();
