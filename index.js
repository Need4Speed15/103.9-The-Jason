
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
  } else {
    theJasonAudio.pause();
    theJasonAudio.currentTime = 0;
  }
});

