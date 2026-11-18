const scene = document.querySelector('.sole-title-scene');
const canvas = document.querySelector('#sole-title-particles');
const context = canvas.getContext('2d', { alpha: true });
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const pointer = { x: 0, y: 0 };
let width = 0;
let height = 0;
let pixelRatio = 1;
let particles = [];
let frame = 0;

function resizeField() {
  const bounds = scene.getBoundingClientRect();
  width = bounds.width;
  height = bounds.height;
  pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
  canvas.width = Math.round(width * pixelRatio);
  canvas.height = Math.round(height * pixelRatio);
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  const count = Math.min(76, Math.max(28, Math.round((width * height) / 14500)));
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: .35 + Math.random() * 1.15,
    depth: .25 + Math.random() * .75,
    drift: .025 + Math.random() * .095,
    phase: Math.random() * Math.PI * 2,
    twinkle: .18 + Math.random() * .42,
  }));
  drawField(0);
}

function drawField(time) {
  if (!context || !width || !height) return;
  const seconds = time * .001;
  context.clearRect(0, 0, width, height);
  for (const particle of particles) {
    const driftX = reducedMotion ? 0 : Math.sin(seconds * particle.drift + particle.phase) * 7;
    const driftY = reducedMotion ? 0 : Math.cos(seconds * particle.drift + particle.phase) * 5;
    const reactX = pointer.x * particle.depth * 12;
    const reactY = pointer.y * particle.depth * 9;
    const pulse = reducedMotion ? 1 : .68 + Math.sin(seconds * .7 + particle.phase) * particle.twinkle;
    const alpha = Math.max(.09, Math.min(.8, pulse * particle.depth));
    const x = particle.x + driftX - reactX;
    const y = particle.y + driftY - reactY;
    context.beginPath();
    context.fillStyle = `rgba(146, 218, 255, ${alpha})`;
    context.arc(x, y, particle.radius * (.8 + particle.depth * .4), 0, Math.PI * 2);
    context.fill();
  }
  if (!reducedMotion) frame = window.requestAnimationFrame(drawField);
}

function onPointerMove(event) {
  if (reducedMotion || event.pointerType === 'touch') return;
  const bounds = scene.getBoundingClientRect();
  pointer.x = (event.clientX / bounds.width - .5) * 2;
  pointer.y = (event.clientY / bounds.height - .5) * 2;
  scene.style.setProperty('--sole-pointer-x', `${pointer.x * 18}px`);
  scene.style.setProperty('--sole-pointer-y', `${pointer.y * 13}px`);
  scene.style.setProperty('--sole-grid-x', `${pointer.x * -2.7}px`);
  scene.style.setProperty('--sole-grid-y', `${pointer.y * -1.95}px`);
  scene.style.setProperty('--sole-floor-x', `${pointer.x * -1.44}px`);
  scene.style.setProperty('--sole-floor-y', `${pointer.y * -1.04}px`);
  scene.style.setProperty('--sole-atmosphere-x', `${pointer.x * -5.04}px`);
  scene.style.setProperty('--sole-atmosphere-y', `${pointer.y * -3.64}px`);
  scene.style.setProperty('--sole-presentation-x', `${pointer.x * 1.8}px`);
  scene.style.setProperty('--sole-presentation-y', `${pointer.y * 1.3}px`);
  if (!frame) frame = window.requestAnimationFrame(drawField);
}

function resetPointer() {
  pointer.x = 0;
  pointer.y = 0;
  scene.style.setProperty('--sole-pointer-x', '0px');
  scene.style.setProperty('--sole-pointer-y', '0px');
  scene.style.setProperty('--sole-grid-x', '0px');
  scene.style.setProperty('--sole-grid-y', '0px');
  scene.style.setProperty('--sole-floor-x', '0px');
  scene.style.setProperty('--sole-floor-y', '0px');
  scene.style.setProperty('--sole-atmosphere-x', '0px');
  scene.style.setProperty('--sole-atmosphere-y', '0px');
  scene.style.setProperty('--sole-presentation-x', '0px');
  scene.style.setProperty('--sole-presentation-y', '0px');
}

function onVisibilityChange() {
  if (document.hidden && frame) {
    window.cancelAnimationFrame(frame);
    frame = 0;
  } else if (!document.hidden && !reducedMotion) {
    frame = window.requestAnimationFrame(drawField);
  }
}

resizeField();
window.addEventListener('resize', resizeField, { passive: true });
scene.addEventListener('pointermove', onPointerMove, { passive: true });
scene.addEventListener('pointerleave', resetPointer, { passive: true });
document.addEventListener('visibilitychange', onVisibilityChange);
window.addEventListener('pagehide', () => {
  if (frame) window.cancelAnimationFrame(frame);
  window.removeEventListener('resize', resizeField);
  scene.removeEventListener('pointermove', onPointerMove);
  scene.removeEventListener('pointerleave', resetPointer);
  document.removeEventListener('visibilitychange', onVisibilityChange);
}, { once: true });
