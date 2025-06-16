
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

// const songs = [
//   {
//     name: 'Like The Others',
//   },
//   {
//     name: 'Rebel Souls',
//   },
//   {
//     name: 'You Are Listening To THE JASON',
//     audio: 'audio/library/Transition1.mp3',
//   },
//   {
//     name: 'You Are Listening To THE JASON',
//     audio: 'audio/library/Transition2.mp3',
//   },
//   {
//     name: 'You Are Listening To THE JASON',
//     audio: 'audio/library/Transition3.mp3',
//   },
//   {
//     name: 'Roll The Dice',
//   },
//   {
//     name: 'Born to Burn',
//   },
//   {
//     name: 'Live Wild Die Loud',
//   },
//   {
//     name: 'Small Town Thunder',
//   },
// ];


const songs = [
  {
    name: 'Jason- 911',
  },
  {
    name: 'Jason- always search',
  },
  {
    name: 'Jason- Animals',
  },
  {
    name: 'Jason- back on the line',
  },
  {
    name: 'Jason- banshee scream',
  },
  {
    name: 'Jason- billions',
  },
  {
    name: 'Jason- cant believe',
  },
  {
    name: 'Jason- Cody come home',
  },
  {
    name: 'Jason- cut your toe off',
  },
  {
    name: 'Jason- debt collector',
  },
  {
    name: 'Jason- dongle',
  },
  {
    name: 'Jason- Down',
  },
  {
    name: 'Jason- drive thru order',
  },
  {
    name: 'Jason- dumb lil hook',
  },
  {
    name: 'Jason- eat me',
  },
  {
    name: 'Jason- formal invitation',
  },
  {
    name: 'Jason- goosebumps',
  },
  {
    name: 'Jason- higher',
  },
  {
    name: 'Jason- it is 8pm',
  },
  {
    name: 'Jason- it it it its time',
  },
  {
    name: 'Jason- its your mother',
  },
  {
    name: 'Jason- kms',
  },
  {
    name: 'Jason- mayday',
  },
  {
    name: 'Jason- mongoose',
  },
  {
    name: 'Jason- pickle ball coach',
  },
  {
    name: 'Jason- poop on forehead',
  },
  {
    name: 'Jason- Red handed',
  },
  {
    name: 'Jason- Siamese twins',
  },
  {
    name: 'Jason- When the sky falls',
  },
  {
    name: 'Jason- When you call my name',
  },
  {
    name: 'You Are Listening To THE JASON',
    audio: 'audio/voicemails/Transition1.mp3',
  },
  {
    name: 'You Are Listening To THE JASON',
    audio: 'audio/voicemails/Transition2.mp3',
  },
  {
    name: 'You Are Listening To THE JASON',
    audio: 'audio/voicemails/Transition3.mp3',
  },
];
songs.forEach((song) => {
  let audioObj;
  if (song.audio) {
    audioObj = new Audio(song.audio);
  } else {
    audioObj = new Audio(`audio/voicemails/${song.name}.m4a`);
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
const introAudio = new Audio('audio/103.9 The Jason Intro.mp3');
const liveNowButton = document.querySelector('.live-now-button');
const listenLiveButton = document.querySelector('.listen-live-button');
if (liveNowButton) {
  liveNowButton.addEventListener('click', () => {
    if (!isLiveNow) {
      toggleLiveNow();
      introAudio.currentTime = 0;
      introAudio.volume = 0.4; // Set volume
      introAudio.play();
      nowPlaying.innerHTML = 'Welcome to 103.9 The Jason';
      nowPlaying.style.opacity = '1';
      introAudio.onended = () => {
        goLive();
        introAudio.onended = null;
      };
    } else {
      introAudio.pause();
      nowPlaying.innerHTML = '';
      nowPlaying.style.opacity = '0';
      toggleLiveNow();
      library.forEach((song) => {
        song.audio.pause();
        song.audio.currentTime = 0;
        song.audio.onended = null;
      });
    }
  });
}
if (listenLiveButton) {
  listenLiveButton.addEventListener('click', () => {
    if (!isLiveNow) {
      toggleLiveNow();
      introAudio.currentTime = 0;
      introAudio.volume = 0.4; // Set volume 
      introAudio.play();
      nowPlaying.innerHTML = 'Welcome to 103.9 The Jason';
      nowPlaying.style.opacity = '1';
      introAudio.onended = () => {
        goLive();
        introAudio.onended = null;
      };
    } else {
      introAudio.pause();
      nowPlaying.innerHTML = '';
      nowPlaying.style.opacity = '0';
      toggleLiveNow();
      library.forEach((song) => {
        song.audio.pause();
        song.audio.currentTime = 0;
        song.audio.onended = null;
      });
    }
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
      song.audio.volume = 0.65; // Set volume to 65%
      song.audio.play();
      setTimeout(() => {
        nowPlaying.innerHTML = song.name.replace(/jason- /i, '');
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
  // Replace "jason- " (case-insensitive) in the song name
  const displayName = song.name.replace(/jason- /i, '');
  songElement.innerHTML = `
    <div class="song-name">${displayName}
      <button class="play-button" src="${song.audio}">Play</button>
    </div>
  `;
  songLibrary.appendChild(songElement);
  let playButton = songElement.querySelector('.play-button');
  playButton.addEventListener('click', () => {
    if (song.audio.paused) {
      pauseAllSongsExcept(song);
      song.audio.volume = 0.65; // Set volume to 65%
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

