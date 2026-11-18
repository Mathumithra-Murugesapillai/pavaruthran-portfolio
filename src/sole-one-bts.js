const gallery = document.querySelector('#bts-gallery');
const status = document.querySelector('#bts-status');

function buildMediaCard(item) {
  const card = document.createElement('article');
  card.className = 'archive-card';
  const media = document.createElement('div');
  media.className = 'archive-media';
  if (item.asset && item.mediaType === 'video') {
    const video = document.createElement('video');
    video.src = item.asset;
    video.controls = true;
    video.playsInline = true;
    video.preload = 'metadata';
    video.setAttribute('aria-label', item.title || 'SOLE ONE behind-the-scenes video');
    media.append(video);
  } else if (item.asset && item.mediaType === 'image') {
    const image = document.createElement('img');
    image.src = item.asset;
    image.alt = item.alt || item.title || 'SOLE ONE production photograph';
    image.loading = 'lazy';
    media.append(image);
  } else {
    media.classList.add('archive-placeholder');
    const mark = document.createElement('span');
    mark.className = 'archive-placeholder__mark';
    mark.setAttribute('aria-hidden', 'true');
    mark.textContent = '✳';
    const label = document.createElement('span');
    label.textContent = item.placeholder || 'PROJECT MEDIA TO BE ADDED';
    media.append(mark, label);
  }
  const eyebrow = document.createElement('p');
  eyebrow.className = 'archive-card__eyebrow';
  eyebrow.textContent = item.eyebrow || 'SOLE ONE ARCHIVE';
  const title = document.createElement('h2');
  title.textContent = item.title || 'Untitled';
  const description = document.createElement('p');
  description.textContent = item.description || '';
  card.append(media, eyebrow, title, description);
  return card;
}

async function populateGallery() {
  try {
    const response = await fetch('/api/sole-one/content', { credentials: 'same-origin' });
    if (response.status === 401) {
      window.location.replace('/sole-one-entry.html#extra-access');
      return;
    }
    if (!response.ok) throw new Error('Gallery unavailable.');
    const archive = await response.json();
    const sections = archive.sections || {};
    const items = [...(sections['behind-scenes']?.items || []), ...(sections['photos-videos']?.items || [])];
    if (items.length) gallery.replaceChildren(...items.map(buildMediaCard));
    status.textContent = items.length ? `${items.length} gallery spaces ready for SOLE ONE media.` : 'The gallery is ready for your SOLE ONE media.';
  } catch {
    status.textContent = 'The gallery could not load just now. Please try again.';
  }
}

window.addEventListener('sole-one-authorized', populateGallery, { once: true });
