let menuToggle = document.getElementById("hamburger");
let header=document.querySelector("header");
let gallery=document.querySelector(".gallery");


menuToggle.addEventListener("click",()=>{
    header.classList.toggle("header-nav-open");
});

const searchToggle = document.getElementById("searchToggle");
const searchBox = document.querySelector(".search");

if (searchToggle) {
  searchToggle.addEventListener("click", () => {
    searchBox.classList.toggle("active");
  });
}


// --- Modal Elements ---
let modal = document.getElementById('card-modal');
let modalTrailer = document.getElementById('modal-trailer'); 
let modalTitle = document.getElementById('modal-title');
let modalText = document.getElementById('modal-text');
let modalClose = document.getElementById('modal-close');

// --- Map of Movie Titles to Trailer Embed URLs (Your manual links) ---
const TRAILER_URLS = {
    // 🎬 FIX: New, reliable embed ID for Barbie (Official Warner Bros. Trailer)
    "Barbie": "https://www.youtube.com/embed/pBk4NYhWNMM",
    "It Ends With Us": "https://www.youtube.com/embed/DLET_u31M4M", 
    "IT": "https://www.youtube.com/embed/xKJmEC5ieOk",
    "Jurassic World Rebirth": "https://www.youtube.com/embed/jan5CFWs9ic",
    "Split": "https://www.youtube.com/embed/Qsr6SgcKNiM",
    "White Chicks": "https://www.youtube.com/embed/aeVkbNka9HM",
    "SuperMan": "https://www.youtube.com/embed/Ox8ZLF6cGM0",
    "The Conjuring": "https://www.youtube.com/embed/FSAz556s0fM",
    "Truth or Dare": "https://www.youtube.com/embed/BjRNY3u3bUw",
    "Avengers": "https://www.youtube.com/embed/eOrNdBpGMv8",
    "Countdown": "https://www.youtube.com/embed/t72R6wZ0zQ8",
    "Interstellar": "https://www.youtube.com/embed/zSWdZVtXT7E",
    "Bad Guys": "https://www.youtube.com/embed/TY1lWh20VSw",
    "Avatar": "https://www.youtube.com/embed/nb_fFj_0rq8",
    "Extraction 2": "https://www.youtube.com/embed/Y274jZs5s7s",
    "The Discovery": "https://www.youtube.com/embed/z9j6WcdU-ts",
    
};

// Selecting all elements with the class 'movie-card'
let figure = document.querySelectorAll('.movie-card'); 

// --- Function to Close Modal ---
function closeModal() {
    if (modal) {
        modal.classList.remove('open');
    }
    document.body.style.overflow = '';
    
    // Stop the video by clearing the src
    if (modalTrailer) {
        modalTrailer.src = ''; 
    }
}

const movieContainer = document.getElementById('movie');


// --- Event Listener for Clicking Movie Cards ---
figure.forEach(function (cardEl) {
    cardEl.onclick = function () {
        let card = cardEl.closest('figure');
        
        if (!card) {
            console.error("Could not find parent <figure> element for the clicked .movie-card element.");
            return; 
        }
        
        let titleEl = card.querySelector('figcaption');
        
        let title = titleEl ? titleEl.textContent.trim() : card.getAttribute('data-title');
        let text = card.getAttribute('data-description') || 'No movie description available yet.'; 
        
        const youtubeEmbedUrl = TRAILER_URLS[title] || ''; 
        
        if (modalTitle) modalTitle.textContent = title;
        if (modalText) modalText.textContent = text;
        
       if (youtubeEmbedUrl && modalTrailer) {
            const params = "?autoplay=1&mute=1&rel=0&playsinline=1&modestbranding=1";
            modalTrailer.src = youtubeEmbedUrl + params;
            modalTrailer.style.display = 'block';
        } else if (modalTrailer) {
            modalTrailer.src = '';
            modalTrailer.style.display = 'none';
            console.warn(`No trailer link found for movie: ${title}. Displaying content only.`);
        }

        if (modal) { // Check before accessing modal properties
            modal.classList.add('open');
            document.body.style.overflow = 'hidden';
        }
    };
});

// --- Event Listeners for Closing Modal (Original safety checks maintained) ---
if (modalClose) {
    modalClose.onclick = closeModal;
}

if (modal) {
    modal.onclick = function (event) {
        if (event.target === modal || event.target.hasAttribute('data-close-modal')) {
            closeModal();
        }
    };
}

  const heroBox = document.getElementById("heroBox");
  const heroImages = [
    "imgs/welcome page.png",
    "imgs/RT.png",
    "imgs/welcome3.png"
  ];

  let heroIndex = 0;

  function setHero(i) {
    heroIndex = (i + heroImages.length) % heroImages.length;
    heroBox.style.backgroundImage = `url("${heroImages[heroIndex]}")`;
  }

  function nextImage() { setHero(heroIndex + 1); }
  function prevImage() { setHero(heroIndex - 1); }


// --- Add to Watchlist Logic ---
document.querySelectorAll('.add-watchlist-btn').forEach((btn) => {
  btn.addEventListener('click', function (e) {
    e.stopPropagation(); // prevent clicking opening modal

    const card = this.closest('.movie-card');
    const title = card.getAttribute('data-title');
    const image = card.getAttribute('data-image') || card.querySelector('img').src;

    // Get watchlist from localStorage
    let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];

    // Check if already saved
    const exists = watchlist.some(movie => movie.title === title);
    if (!exists) {
      watchlist.push({ title, image });
      localStorage.setItem('watchlist', JSON.stringify(watchlist));
      alert(`${title} added to Watchlist ✅`);
    } else {
      alert(`${title} is already in your Watchlist!`);
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("SearchInput");
  const movieCards = document.querySelectorAll(".movie-card");
  const overlay = document.getElementById("searchOverlay");
  const resultsContainer = overlay.querySelector(".search-results");

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase().trim();

  
    resultsContainer.innerHTML = "";

    if (query === "") {
      overlay.style.display = ""; 
      return;
    }

    
    const matches = Array.from(movieCards).filter(card => {
      const title = card.dataset.title.toLowerCase();
      const description = card.dataset.description.toLowerCase();
      return title.includes(query) || description.includes(query);
    });

    
    if (matches.length > 0) {
      overlay.style.display = "flex";
      matches.forEach(card => {
        const clone = card.cloneNode(true);
        resultsContainer.appendChild(clone);
      });
    } else {
      overlay.style.display = "flex";
      resultsContainer.innerHTML = `<p style="color:white; font-size:1.2em;">No movies found</p>`;
    }
  });

  
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      overlay.style.display = "none";
      searchInput.value = "";
    }
  });
});



