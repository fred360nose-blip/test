// script.js - Updated with Ted, Euphoria, and The Capture

const mainContent = document.getElementById('mainContent');
const searchInput = document.getElementById('searchInput');

const API_KEY = "731a747b7083a0bdd240c0a658431e7f";
const IMAGE_BASE = "https://image.tmdb.org/t/p/w342";

const movies = [
  {title: "Deadpool & Wolverine", id: 533535},
  {title: "Dune: Part Two", id: 693134},
  {title: "Spider-Man: No Way Home", id: 634649},
  {title: "The Batman", id: 414906},
  {title: "Top Gun: Maverick", id: 361743},
  {title: "Avengers: Endgame", id: 299534},
  {title: "John Wick: Chapter 4", id: 603692},
  {title: "The Dark Knight", id: 155},
  {title: "Inception", id: 27205},
  {title: "Mad Max: Fury Road", id: 76341},
  {title: "Joker", id: 475557},
  {title: "Guardians of the Galaxy Vol. 3", id: 447365},
  {title: "Mission: Impossible - Dead Reckoning", id: 575264},
  {title: "Extraction 2", id: 961323},
  {title: "The Equalizer 3", id: 926393},
  {title: "Godzilla x Kong: The New Empire", id: 823464},
  {title: "Furiosa: A Mad Max Saga", id: 786892},
  {title: "Kingdom of the Planet of the Apes", id: 653346},
  {title: "Bad Boys: Ride or Die", id: 573435},
  {title: "The Fall Guy", id: 746036},
  {title: "Twisters", id: 718821},
  {title: "Bullet Train", id: 729165},
  {title: "Road House", id: 1191610},
  {title: "Monkey Man", id: 1008409},
  {title: "Civil War", id: 929204},
  {title: "Challengers", id: 1079091},
  {title: "A Quiet Place: Day One", id: 1010600},
  {title: "Longlegs", id: 1226578},
  {title: "Trap", id: 1125311},
  {title: "The Crow", id: 957452},
  {title: "Beetlejuice Beetlejuice", id: 1094458},
  {title: "Joker: Folie à Deux", id: 889737},
  {title: "Sonic the Hedgehog 3", id: 939243},
  {title: "Transformers One", id: 1181610},
  {title: "Gladiator II", id: 558449},
  {title: "The Wild Robot", id: 1184918},
  {title: "Wicked", id: 402431},
  {title: "Smile 2", id: 1125510},
  {title: "Terrifier 3", id: 1034541},
  {title: "It", id: 346364}
];

const shows = [
  {title: "Breaking Bad", id: 1396},
  {title: "Better Call Saul", id: 60059},
  {title: "Snowfall", id: 71694},
  {title: "The Boys", id: 76479},
  {title: "Reacher", id: 94997},
  {title: "Stranger Things", id: 66732},
  {title: "The Walking Dead", id: 1402},
  {title: "Arcane", id: 94605},
  {title: "The Mandalorian", id: 82856},
  {title: "House of the Dragon", id: 94997},
  {title: "Peaky Blinders", id: 60574},
  {title: "Power", id: 54650},
  {title: "Narcos", id: 63351},
  {title: "The Witcher", id: 71912},
  {title: "The Last of Us", id: 100088},
  {title: "Fallout", id: 106379},
  {title: "Shogun", id: 128512},
  {title: "Squid Game", id: 93405},
  {title: "True Detective", id: 61889},
  {title: "Sons of Anarchy", id: 1408},
  {title: "Mayans M.C.", id: 78545},
  {title: "BMF", id: 110492},
  {title: "Yellowstone", id: 73596},
  {title: "The Bear", id: 103286},
  {title: "Succession", id: 76331},
  {title: "Chernobyl", id: 87108},
  {title: "Band of Brothers", id: 4613},
  {title: "The Night Agent", id: 120268},
  {title: "FUBAR", id: 130542},
  {title: "Halo", id: 106432},
  {title: "Silo", id: 126280},
  {title: "Foundation", id: 105971},
  {title: "The Expanse", id: 63639},
  {title: "Westworld", id: 63247},
  {title: "Black Mirror", id: 42009},
  {title: "Dark", id: 70523},
  {title: "The 100", id: 62286},
  {title: "The Sandman", id: 90802},
  {title: "Invincible", id: 95557},
  {title: "Gen V", id: 119051},
  {title: "All of Us Are Dead", id: 99966},
  {title: "Wednesday", id: 119051},
  {title: "Euphoria", id: 85552},          // Added
  {title: "Ted", id: 201834},              // Added
  {title: "The Capture", id: 93166}        // Added
];

// Get Continue Watching with poster recovery
function getContinueWatching() {
  let list = JSON.parse(localStorage.getItem('continueWatching') || '[]');
  
  return list.map(saved => {
    const original = [...movies, ...shows].find(item => item.id == saved.id);
    if (original && original.poster_path) {
      saved.poster_path = original.poster_path;
    }
    return saved;
  });
}

// Create Card - Shows Season & Episode for TV in Continue Watching
function createCard(item) {
  const isMovie = movies.some(m => m.id === item.id);
  const type = isMovie ? 'movie' : 'tv';

  let subtitle = '';
  if (!isMovie && item.season && item.episode) {
    subtitle = `<p style="font-size:0.95rem; color:#aaa; margin-top:4px;">S${item.season} • E${item.episode}</p>`;
  }

  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <div class="poster-container">
      <img src="${IMAGE_BASE}${item.poster_path || ''}" 
           alt="${item.title}" 
           onerror="this.src='https://via.placeholder.com/260x390/1f1f1f/666?text=${encodeURIComponent(item.title)}'">
    </div>
    <div class="card-info">
      <h3>${item.title}</h3>
      ${subtitle}
    </div>
  `;

  card.addEventListener('click', () => {
    const titleEncoded = encodeURIComponent(item.title);
    let url = `player.html?title=${titleEncoded}&id=${item.id}&type=${type}`;
    if (!isMovie && item.season && item.episode) {
      url += `&season=${item.season}&episode=${item.episode}`;
    } else if (!isMovie) {
      url += "&season=1&episode=1";
    }
    window.location.href = url;
  });

  return card;
}

// Render
function renderRows(searchTerm = '') {
  mainContent.innerHTML = '';

  const continueList = getContinueWatching();

  const categories = [
    { title: "Continue Watching", items: continueList },
    { 
      title: "Trending Now", 
      items: [
        shows.find(s => s.id === 71694), // Snowfall
        shows.find(s => s.id === 1396),  // Breaking Bad
        shows.find(s => s.id === 60059), // Better Call Saul
        shows.find(s => s.id === 76479), // The Boys
        ...movies.slice(0, 12),
        ...shows.slice(4, 20)
      ].filter(Boolean)
    },
    { title: "Action Movies", items: movies },
    { title: "Crime & Drama", items: shows.filter(s => 
        ["Breaking Bad", "Better Call Saul", "Snowfall", "Narcos", "Peaky Blinders", "Power"].some(n => s.title.includes(n))) },
    { title: "Popular TV Shows", items: shows }
  ];

  categories.forEach(cat => {
    let items = cat.items.filter(item => 
      item && item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (items.length === 0) return;

    const section = document.createElement('div');
    section.innerHTML = `<h2 class="section-title">${cat.title}</h2><div class="row" id="row-${cat.title.replace(/\s+/g,'')}"></div>`;
    mainContent.appendChild(section);

    const row = document.getElementById(`row-${cat.title.replace(/\s+/g,'')}`);

    items.forEach(item => {
      if (item) row.appendChild(createCard(item));
    });
  });

  if (searchTerm && mainContent.children.length === 0) {
    mainContent.innerHTML = `<p class="no-results">No results found for "<strong>${searchTerm}</strong>"</p>`;
  }
}

// Fetch Posters
async function fetchPosters() {
  const allItems = [...movies, ...shows];
  for (let item of allItems) {
    try {
      const type = movies.some(m => m.id === item.id) ? 'movie' : 'tv';
      const res = await fetch(`https://api.themoviedb.org/3/${type}/${item.id}?api_key=${API_KEY}`);
      const data = await res.json();
      if (data.poster_path) item.poster_path = data.poster_path;
    } catch (e) {}
  }
  renderRows();
}

// Event Listeners
searchInput.addEventListener('input', (e) => renderRows(e.target.value.trim()));

window.addEventListener('scroll', () => {
  document.querySelector('.header').classList.toggle('scrolled', window.scrollY > 80);
});

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function scrollToContent() {
  mainContent.scrollIntoView({ behavior: 'smooth' });
}

// Start
fetchPosters();
