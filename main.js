
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
if (genreIconsElement) {
  genreIconsElement.innerHTML = genreIconsList;
}


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
    name: 'Rebel Souls',
  },
  {
    name: 'You Are Listening To THE JASON',
    audio: 'audio/library/Transition1.mp3',
  },
  {
    name: 'You Are Listening To THE JASON',
    audio: 'audio/library/Transition2.mp3',
  },
  {
    name: 'You Are Listening To THE JASON',
    audio: 'audio/library/Transition3.mp3',
  },
  {
    name: 'Roll The Dice',
  },
  {
    name: 'Born to Burn',
  },
  {
    name: 'Live Wild Die Loud',
  },
  {
    name: 'Small Town Thunder',
  },
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

//alphabetize the library
library.sort((a, b) => {
  if (a.name < b.name) return -1;
  if (a.name > b.name) return 1;
  return 0;
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
  if (liveNowButton) {
    liveNowButton.addEventListener('click', () => {
      toggleLiveNow();
      goLive();
    });
  }
  if (listenLiveButton) {
    listenLiveButton.addEventListener('click', () => {
      toggleLiveNow();
      goLive();
    });
  }


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

//create the song library layout
let songLibrary = document.querySelector('.song-library');
songLibrary.innerHTML = '';
library.forEach((song) => {
  if (song.name === "You Are Listening To THE JASON") return; // Skip this song

  let songElement = document.createElement('div');
  songElement.classList.add('song');
  songElement.innerHTML = `
    <div class="song-name">${song.name}
    <button class="play-button" src="${song.audio}">Play</button>
    </div>
  `;
  songLibrary.appendChild(songElement);
  let playButton = songElement.querySelector('.play-button');
  playButton.addEventListener('click', () => {
    if (song.audio.paused) {
      pauseAllSongsExcept(song);
      song.audio.play();
      playButton.innerHTML = 'Playing...';
      nowPlaying.innerHTML = song.name;
      nowPlaying.style.opacity = '1';
    } else {
      song.audio.pause();
      playButton.innerHTML = 'Play';
      nowPlaying.style.opacity = '0';
      song.audio.currentTime = 0;
    }
  });

  // Update play button when song ends
  song.audio.addEventListener('ended', () => {
    playButton.innerHTML = 'Play';
    nowPlaying.style.opacity = '0';
  });
});

// Function to pause all songs except the current one and update play buttons
function pauseAllSongsExcept(currentSong) {
  library.forEach((song, idx) => {
    if (song !== currentSong) {
      song.audio.pause();
      song.audio.currentTime = 0;
      song.audio.onended = null;
      // Update play button UI
      let btn = document.querySelectorAll('.play-button')[idx];
      if (btn) btn.innerHTML = 'Play';
    }
  });
}