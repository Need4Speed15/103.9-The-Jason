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

let playback = null;
let queue = [];
let queueIndex = 0;

function updatePlayer(message) {
  const stationIDActive = playback?.mode === 'id';
  const live = playback?.mode === 'live';
  document.body.toggleAttribute('data-playing', Boolean(playback?.started));
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
  if (trackStatus) {
    trackStatus.textContent = message ?? (playback
      ? (playback.started ? playback.track.title : 'Loading ' + playback.track.title + '…')
      : idleTitle);
  } else {
    stationStatus.textContent = message ?? (stationIDActive ? 'Playing the station ID.' : '');
  }
}

function stopPlayback() {
  const previous = playback;
  playback = null;
  if (previous) {
    previous.audio.pause();
    previous.audio.removeAttribute('src');
    previous.audio.load();
  }
}

function play(track, mode) {
  stopPlayback();
  const audio = new Audio();
  const current = { audio, track, mode, started: false };
  playback = current;
  audio.volume = track.volume;
  updatePlayer();

  function onError() {
    if (playback !== current) return;
    stopPlayback();
    updatePlayer('Couldn’t play this audio. Try again.');
  }

  audio.addEventListener('playing', () => {
    if (playback !== current) return;
    current.started = true;
    updatePlayer();
  });
  audio.addEventListener('error', onError, { once: true });
  audio.addEventListener('ended', () => {
    if (playback !== current) return;
    if (mode === 'live') {
      playNextLiveTrack();
    } else {
      stopPlayback();
      updatePlayer();
    }
  }, { once: true });
  audio.src = track.path;
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
    stopPlayback();
    updatePlayer();
  } else {
    if (mode === 'live') queue = [];
    play(track, mode);
  }
}

logoButton.addEventListener('click', () => togglePlayback(stationID, 'id'));
for (const button of liveButtons) {
  button.addEventListener('click', () => togglePlayback(intro, 'live'));
}
stopButton?.addEventListener('click', () => {
  stopPlayback();
  updatePlayer();
});
window.addEventListener('pagehide', () => {
  stopPlayback();
  updatePlayer();
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
    row.innerHTML = '<span class="song-name"></span><button type="button" class="button clip-button" aria-pressed="false"><span class="control-icon play-icon" aria-hidden="true"></span><span class="clip-label">Play</span></button>';
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
