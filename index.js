
const nowPlaying = document.querySelector('.now-playing-song');


// Create the Genre Icons Container
let genreIcons = [
  {
    name: 'Country Icon',
    file: 'images/Genre Icons/Country Icon.png',
  },
  {
    name: 'Guitar Icon',
    file: 'images/Genre Icons/Guitar Icon.png',
  },
  {
    name: 'Mic Icon',
    file: 'images/Genre Icons/Mic Icon.png',
  },
  {
    name: 'Music Note Icon',
    file: 'images/Genre Icons/Music Note Icon.png',
  },
  {
    name: 'Radio Icon',
    file: 'images/Genre Icons/Radio Icon.png',
  },
  {
    name: 'Record Icon',
    file: 'images/Genre Icons/Record Icon.png',
  },
]

let genreIconsElement = document.querySelector('.genre-icons-container')
let genreIconsList = ''
genreIcons.forEach((icon) => {
  genreIconsList += `
    <div class="${icon.name.replace(/\s+/g, '-').toLowerCase()}-container">
      <img class="${icon.name.replace(/\s+/g, '-').toLowerCase()}" src="${icon.file}" alt="${icon.name}">
    </div>
  `
});
genreIconsElement.innerHTML = genreIconsList


//103.9 The Jason Button audio
let theJasonButton = document.querySelector('.logo-button');
let theJasonAudio = new Audio('audio/103.9 The Jason.mp3');
theJasonButton.addEventListener('click', () => {
  if (theJasonAudio.paused) {
    theJasonAudio.play();
    nowPlaying.innerHTML = '103.9 The Jason';
    nowPlaying.style.opacity = '1';
  } else {
    theJasonAudio.pause();
    nowPlaying.style.opacity = '0';
    theJasonAudio.currentTime = 0;
  }
});
theJasonAudio.addEventListener('ended', () => {
  nowPlaying.style.opacity = '0';
});

// Create the Library Container
let library = [];

const songs = [
  {
    name: 'Like The Others',
  },
  {
    name: 'Commercial Break...',
    audio: 'audio/library/Transition1.mp3',
  }
];
songs.forEach((song) => {
  let audioObj;
  if (song.audio) {
    audioObj = new Audio(song.audio);
  } else {
    audioObj = new Audio(`audio/library/${song.name}.mp3`);
  }
  audioObj.addEventListener('ended', () => {
    nowPlaying.innerHTML = '';
    nowPlaying.style.opacity = '0';
  });
  library.push({
    name: song.name,
    audio: audioObj,
  });
});

function shuffleLibrary() {
  for (let i = library.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [library[i], library[j]] = [library[j], library[i]];
  }
}

// Create interactive Live Buttons
const liveNowButton = document.querySelector('.live-now-button');
const listenLiveButton = document.querySelector('.listen-live-button');
liveNowButton.addEventListener('click', () => {
  toggleLiveNow();
  goLive();
});
listenLiveButton.addEventListener('click', () => {
  toggleLiveNow();
  goLive();
});

//Main function to play songs
let isLiveNow = false;
function toggleLiveNow() {
  isLiveNow = !isLiveNow;
};

function goLive(index = 0) {
  if (!isLiveNow) {
    nowPlaying.innerHTML = '';
    library.forEach((song) => {
      song.audio.pause();
      song.audio.currentTime = 0;
      song.audio.onended = null;
    });
  } else {
    if (index === 0) {
      shuffleLibrary();
      // Reset all audio before starting
      library.forEach((song) => {
        song.audio.pause();
        song.audio.currentTime = 0;
        song.audio.onended = null;
      });
    }

    if (index < library.length) {
      const song = library[index];
      song.audio.play();
      setTimeout(() => {
        nowPlaying.innerHTML = song.name;
        nowPlaying.style.opacity = '1';
      }, 600);

      song.audio.onended = () => {
        nowPlaying.innerHTML = '';
        nowPlaying.style.opacity = '0';
        goLive(index + 1);
      };
    } else {
      // All songs finished
      nowPlaying.innerHTML = '';
      nowPlaying.style.opacity = '0';
      goLive(0); // Restart the playlist
    }
  }
}

