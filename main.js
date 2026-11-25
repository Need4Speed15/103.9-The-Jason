const clips = [
  '911', 'always search', 'Animals', 'back on the line', 'banshee scream',
  'billions', 'cant believe', 'Cody come home', 'cut your toe off', 'debt collector',
  'dongle', 'Down', 'drive thru order', 'dumb lil hook', 'eat me', 'formal invitation',
  'goosebumps', 'higher', 'it is 8pm', 'it it it its time', 'its your mother', 'kms',
  'mayday', 'mongoose', 'pickle ball coach', 'poop on forehead', 'Red handed',
  'Siamese twins', 'When the sky falls', 'When you call my name',
].sort((first, second) => first.localeCompare(second)).map((title) => ({
  title,
  path: 'audio/voicemails/Jason- ' + title + '.m4a',
  volume: 0.65,
}));

const stationID = { title: '103.9 The Jason', path: 'audio/103.9 The Jason.mp3', volume: 1 };
const intro = { title: 'Welcome to 103.9 The Jason', path: 'audio/103.9 The Jason Intro.mp3', volume: 0.4 };
const breaks = [1, 2, 3].map((number) => ({
  title: 'You Are Listening To THE JASON',
  path: 'audio/voicemails/Transition' + number + '.mp3',
  volume: 0.65,
}));

const logoButton = document.querySelector('.logo-button');
const liveButtons = document.querySelectorAll('[data-live]');
const trackStatus = document.querySelector('[data-track]');
const stationStatus = document.querySelector('[data-station-status]');
const stopButton = document.querySelector('[data-stop]');
const idleTitle = trackStatus?.textContent;
const clipButtons = new Map();
const progress = document.querySelector('.archive-progress');
const seek = progress?.querySelector('input');
const meterPattern = [12, 24, 42, 27, 56, 36, 70, 45, 82, 60, 92, 64, 46, 77, 53, 31, 48, 22, 34, 13];
// Keep the element that the user started so the live queue can advance without another gesture.
const audio = new Audio();

const transmission = document.createElement('div');
transmission.className = 'transmission';
transmission.setAttribute('aria-hidden', 'true');
transmission.innerHTML =
  '<div class="transmission-wash"></div><div class="transmission-rings"><i></i><i></i><i></i></div>' +
  '<div class="transmission-readout"><img src="images/Logo.png" alt=""><span>Listen live</span></div>' +
  '<div class="transmission-meter">' + meterPattern.map((level, index) =>
    '<i style="--level:' + level + '%;--beat:' + index + '"></i>'
  ).join('') + '</div>';
document.body.append(transmission);

const stationHUD = document.createElement('p');
stationHUD.className = 'station-hud';
stationHUD.setAttribute('aria-hidden', 'true');
stationHUD.hidden = true;
if (!trackStatus) document.body.append(stationHUD);

let playback = null;
let queue = [];
let queueIndex = 0;
let broadcastEffect = null;

function stopBroadcastEffect() {
  if (!broadcastEffect) return;
  clearTimeout(broadcastEffect.timer);
  transmission.removeAttribute('data-broadcast');
  broadcastEffect = null;
}

function startBroadcastEffect(mode) {
  stopBroadcastEffect();
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Use a fresh animation timeline when the listener switches modes quickly.
  const effect = { timer: 0 };
  broadcastEffect = effect;
  requestAnimationFrame(() => requestAnimationFrame(() => {
    if (effect !== broadcastEffect || playback?.mode !== mode) return;
    transmission.dataset.broadcast = mode;
    effect.timer = setTimeout(stopBroadcastEffect, 2800);
  }));
}

function formatTime(time) {
  const seconds = Math.floor(time);
  return Math.floor(seconds / 60) + ':' + String(seconds % 60).padStart(2, '0');
}

function updateProgress() {
  if (!progress) return;
  const audio = playback?.mode === 'clip' ? playback.audio : null;
  const available = Boolean(audio && Number.isFinite(audio.duration) && audio.duration > 0);
  progress.hidden = !available;
  if (!available) return;
  seek.max = String(audio.duration);
  seek.value = String(audio.currentTime);
  progress.style.setProperty('--progress', (100 * audio.currentTime / audio.duration) + '%');
  seek.setAttribute('aria-valuetext', formatTime(audio.currentTime) + ' of ' + formatTime(audio.duration));
  progress.querySelector('[data-elapsed]').textContent = formatTime(audio.currentTime);
  progress.querySelector('[data-duration]').textContent = formatTime(audio.duration);
}

seek?.addEventListener('input', () => {
  if (playback?.mode !== 'clip') return;
  playback.audio.currentTime = Number(seek.value);
  updateProgress();
});

function updatePlayer(message) {
  const stationIDActive = playback?.mode === 'id';
  const live = playback?.mode === 'live';
  document.body.toggleAttribute('data-playing', Boolean(playback?.started));
  if (playback) {
    document.body.dataset.playback = playback.mode;
  } else {
    document.body.removeAttribute('data-playback');
  }
  logoButton.setAttribute('aria-pressed', String(stationIDActive));
  logoButton.setAttribute('aria-label', (stationIDActive ? 'Stop' : 'Play') + ' the 103.9 The Jason station ID');
  logoButton.title = stationIDActive ? 'Stop station ID' : 'Play station ID';

  for (const button of liveButtons) {
    button.querySelector('[data-live-label]').textContent = live ? 'Stop live' : 'Listen live';
    button.querySelector('.play-icon')?.classList.toggle('is-playing', live);
  }
  for (const [clip, button] of clipButtons) {
    const active = playback?.mode === 'clip' && playback.track === clip;
    button.setAttribute('aria-pressed', String(active));
    button.setAttribute('aria-label', (active ? 'Stop ' : 'Play ') + clip.title);
    button.querySelector('.clip-label').textContent = active ? 'Stop' : 'Play';
    button.querySelector('.play-icon').classList.toggle('is-playing', active);
    button.closest('.song').toggleAttribute('data-active', active);
  }

  if (stopButton) {
    if (!playback && document.activeElement === stopButton) {
      document.querySelector('#track-search').focus();
    }
    stopButton.hidden = !playback;
  }
  const title = message ?? (playback
    ? (playback.started ? playback.track.title : 'Loading ' + playback.track.title + '…')
    : idleTitle ?? '');
  if (trackStatus) {
    if (trackStatus.textContent !== title) trackStatus.textContent = title;
  } else if (stationStatus.textContent !== title) {
    stationStatus.textContent = title;
    stationHUD.textContent = title;
    stationHUD.hidden = !title;
  }
  updateProgress();
}

function stopPlayback() {
  const previous = playback;
  playback = null;
  if (previous) {
    previous.listeners.abort();
    audio.pause();
    audio.removeAttribute('src');
    audio.load();
  }
}

function play(track, mode) {
  if (playback?.mode !== mode) stopBroadcastEffect();
  playback?.listeners.abort();
  const listeners = new AbortController();
  const current = { audio, track, mode, started: false, listeners };
  playback = current;
  audio.src = track.path;
  audio.volume = track.volume;
  updatePlayer();

  function onError() {
    if (playback !== current) return;
    stopBroadcastEffect();
    stopPlayback();
    updatePlayer('Couldn’t play this audio. Try again.');
  }

  audio.addEventListener('playing', () => {
    if (playback !== current) return;
    current.started = true;
    updatePlayer();
  }, { signal: listeners.signal });
  if (mode === 'clip') {
    for (const event of ['loadedmetadata', 'durationchange', 'timeupdate', 'seeked']) {
      audio.addEventListener(event, () => {
        if (playback === current) updateProgress();
      }, { signal: listeners.signal });
    }
  }
  audio.addEventListener('error', onError, { once: true, signal: listeners.signal });
  audio.addEventListener('ended', () => {
    if (playback !== current) return;
    if (mode === 'live') {
      playNextLiveTrack();
    } else {
      stopBroadcastEffect();
      stopPlayback();
      updatePlayer();
    }
  }, { once: true, signal: listeners.signal });
  audio.play().catch(onError);
}

function playNextLiveTrack() {
  if (queueIndex >= queue.length) {
    queue = [...clips, ...breaks];
    for (let index = queue.length - 1; index > 0; index--) {
      const pick = Math.floor(Math.random() * (index + 1));
      [queue[index], queue[pick]] = [queue[pick], queue[index]];
    }
    queueIndex = 0;
  }
  play(queue[queueIndex++], 'live');
}

function togglePlayback(track, mode) {
  if (playback?.mode === mode && (mode === 'live' || playback.track === track)) {
    resetPlayer();
  } else {
    if (mode === 'live') queue = [];
    play(track, mode);
    if (mode !== 'clip') startBroadcastEffect(mode);
  }
}

function resetPlayer() {
  stopBroadcastEffect();
  stopPlayback();
  updatePlayer();
}

logoButton.addEventListener('click', () => togglePlayback(stationID, 'id'));
for (const button of liveButtons) {
  button.addEventListener('click', () => togglePlayback(intro, 'live'));
}
stopButton?.addEventListener('click', resetPlayer);
window.addEventListener('pagehide', resetPlayer);
window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') stopBroadcastEffect();
});

const iconContainer = document.querySelector('.genre-icons');
if (iconContainer) {
  for (const name of ['Country', 'Guitar', 'Mic', 'Music Note', 'Radio', 'Record']) {
    const image = document.createElement('img');
    image.src = 'images/Genre Icons/' + name + ' Icon.png';
    image.alt = name;
    image.width = 34;
    image.height = 34;
    iconContainer.append(image);
  }
}

const songLibrary = document.querySelector('.song-library');
if (songLibrary) {
  const search = document.querySelector('#track-search');
  const results = document.querySelector('[data-results]');
  const emptyState = document.querySelector('.empty-state');

  for (const clip of clips) {
    const row = document.createElement('li');
    row.className = 'song';
    const patternOffset = clip.title.length % meterPattern.length;
    row.innerHTML = '<span class="clip-reel" aria-hidden="true"></span><span class="song-name"></span>' +
      '<span class="clip-wave" aria-hidden="true">' + meterPattern.map((_, index) => {
        const level = meterPattern[(index + patternOffset) % meterPattern.length];
        return '<i style="--level:' + level + '%;--beat:' + index + '"></i>';
      }).join('') + '</span>' +
      '<button type="button" class="button clip-button" aria-pressed="false"><span class="control-icon play-icon" aria-hidden="true"></span><span class="clip-label">Play</span></button>';
    row.querySelector('.song-name').textContent = clip.title;
    const button = row.querySelector('button');
    button.setAttribute('aria-label', 'Play ' + clip.title);
    button.addEventListener('click', () => togglePlayback(clip, 'clip'));
    clipButtons.set(clip, button);
    songLibrary.append(row);
  }

  function filterClips() {
    const query = search.value.trim().toLowerCase();
    let visible = 0;
    for (const [clip, button] of clipButtons) {
      const match = clip.title.toLowerCase().includes(query);
      button.closest('.song').hidden = !match;
      if (match) visible++;
    }
    results.textContent = query ? visible + ' of ' + clips.length + ' clips' : clips.length + ' clips';
    emptyState.hidden = visible !== 0;
    songLibrary.hidden = visible === 0;
  }

  search.addEventListener('input', filterClips);
  filterClips();
}

if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const reveal = new IntersectionObserver((entries, observer) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('motion-arrival');
      observer.unobserve(entry.target);
    }
  }, { threshold: 0.12 });

  document.querySelectorAll('.show, .station-story, .story-notes, .contact-form, .archive-head')
    .forEach((element) => reveal.observe(element));
}

const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  const response = contactForm.querySelector('.form-response');
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    response.textContent = 'Expect to hear back whenever I feel like it.';
  });
  contactForm.addEventListener('input', () => {
    response.textContent = '';
  });
}
