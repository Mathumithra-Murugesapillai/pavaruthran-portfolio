const video = document.querySelector('#intro-video');
const intro = document.querySelector('#intro');
const home = document.querySelector('#home');
const progress = document.querySelector('#progress-bar');
const playbackFallback = document.querySelector('#playback-fallback');
const playbackError = document.querySelector('#playback-error');
const naturalVolume = 1;
const scrollFloor = 0;
const scrollFadeDistance = () => Math.max(1, document.querySelector('.intro-scroll-track').offsetHeight);

let scrollFrame = 0;
let volumeFrame = 0;
let desiredVolume = naturalVolume;
let desiredOpacity = 1;
let opacityFrame = 0;

function clamp01(value) {
  return Math.min(1, Math.max(0, value));
}

function smoothstep(value) {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
}

function getScrollFade() {
  const progressThroughIntro = clamp01(window.scrollY / scrollFadeDistance());
  return 1 - (1 - scrollFloor) * smoothstep(progressThroughIntro);
}

function animateOpacity() {
  const current = Number.parseFloat(getComputedStyle(video).opacity);
  const difference = desiredOpacity - current;
  if (Math.abs(difference) > 0.002) {
    video.style.opacity = String(current + difference * 0.16);
    opacityFrame = requestAnimationFrame(animateOpacity);
  } else {
    video.style.opacity = String(desiredOpacity);
    opacityFrame = 0;
  }
}

function updateVisualFade() {
  const scrollProgress = clamp01(window.scrollY / scrollFadeDistance());
  const fade = smoothstep(scrollProgress);
  desiredOpacity = 1 - (1 - scrollFloor) * fade;
  intro.style.setProperty('--intro-overlay-opacity', String(1 - fade));
  if (!opacityFrame) opacityFrame = requestAnimationFrame(animateOpacity);
}

function updateDesiredVolume() {
  desiredVolume = naturalVolume * getScrollFade();
}

function animateVolume() {
  const difference = desiredVolume - video.volume;
  if (Math.abs(difference) > 0.001) {
    video.volume += difference * 0.18;
    volumeFrame = requestAnimationFrame(animateVolume);
  } else {
    video.volume = desiredVolume;
    volumeFrame = 0;
  }
}

function requestVolumeUpdate() {
  updateDesiredVolume();
  if (!volumeFrame) volumeFrame = requestAnimationFrame(animateVolume);
}

function updateScrollState() {
  scrollFrame = 0;
  requestVolumeUpdate();
  updateVisualFade();
  home.classList.toggle('is-visible', window.scrollY > 1);
}

function requestScrollUpdate() {
  if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScrollState);
}

function playWithSoundFromGesture() {
  playbackFallback.hidden = true;
  playbackError.hidden = true;
  video.muted = false;
  requestVolumeUpdate();
  video.play().catch(showPlaybackFallback);
}

function showPlaybackFallback() {
  playbackFallback.hidden = false;
}

function onTimeUpdate() {
  if (!Number.isFinite(video.duration) || video.duration <= 0) return;
  const ratio = clamp01(video.currentTime / video.duration);
  progress.style.transform = `scaleX(${ratio})`;

}

function onError() {
  playbackError.hidden = false;
  playbackFallback.hidden = true;
}

function onVisibilityChange() {
  if (document.hidden && volumeFrame) {
    cancelAnimationFrame(volumeFrame);
    volumeFrame = 0;
    video.volume = desiredVolume;
  } else if (!document.hidden) {
    requestVolumeUpdate();
  }
}

window.addEventListener('scroll', requestScrollUpdate, { passive: true });
window.addEventListener('resize', requestScrollUpdate, { passive: true });
document.addEventListener('visibilitychange', onVisibilityChange);
video.addEventListener('timeupdate', onTimeUpdate);
video.addEventListener('error', onError);
document.querySelector('#scroll-cue').addEventListener('click', event => {
  event.preventDefault();
  home.scrollIntoView({ behavior: 'smooth', block: 'start' });
});
playbackFallback.addEventListener('click', playWithSoundFromGesture);
// Prefer the original audio at its natural level. If audible autoplay is denied,
// immediately retry muted and offer an explicit gesture to restore the soundtrack.
video.muted = false;
video.volume = naturalVolume;
video.play().then(requestVolumeUpdate).catch(() => {
  video.muted = true;
  video.play().then(() => {
    playbackFallback.hidden = false;
  }).catch(() => showPlaybackFallback());
});

requestScrollUpdate();

// Keep the browser from retaining animation callbacks after leaving this page.
window.addEventListener('pagehide', () => {
  if (scrollFrame) cancelAnimationFrame(scrollFrame);
  if (volumeFrame) cancelAnimationFrame(volumeFrame);
  if (opacityFrame) cancelAnimationFrame(opacityFrame);
});
