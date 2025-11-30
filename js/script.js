document.getElementById('hamburger').addEventListener("click", () => {
document.querySelector("header").classList.toggle("header-nav-open");});


let modal = document.getElementById('card-modal');
let modalTrailer = document.getElementById('modal-trailer');
let modalTitle = document.getElementById('modal-title');
let modalText = document.getElementById('modal-text');
let modalClose = document.getElementById('modal-close');
let modalCast = document.getElementById('modal-cast');
let modalGenres = document.getElementById('modal-genres');
let modalThisMovieIs = document.getElementById('modal-this-movie-is');

let TRAILER_URLS = {
  "Barbie": "https://www.youtube.com/embed/pBk4NYhWNMM",
  "It Ends With Us": "https://www.youtube.com/embed/DLET_u31M4M",
  "IT": "https://www.youtube.com/embed/xKJmEC5ieOk",
  "Jurassic World Rebirth": "https://www.youtube.com/embed/jan5CFWs9ic",
  "Split": "https://www.youtube.com/embed/Qsr6SgcKNiM",
  "White Chicks": "https://www.youtube.com/embed/aeVkbNka9HM",
  "SuperMan": "https://www.youtube.com/embed/Ox8ZLF6cGM0",
  "The conjuring 2": "https://www.youtube.com/embed/FSAz556s0fM",
  "Truth or Dare": "https://www.youtube.com/embed/BjRNY3u3bUw",
  "Avengers": "https://www.youtube.com/embed/eOrNdBpGMv8",
  "Countdown": "https://www.youtube.com/embed/t72R6wZ0zQ8",
  "Interstellar": "https://www.youtube.com/embed/zSWdZVtXT7E",
  "Bad Guys": "https://www.youtube.com/embed/TY1lWh20VSw",
  "Avatar": "https://www.youtube.com/embed/nb_fFj_0rq8",
  "Extraction 2": "https://www.youtube.com/embed/Y274jZs5s7s",
  "The Discovery": "https://www.youtube.com/embed/z9j6WcdU-ts",
  "Predator: Badlands": "https://www.youtube.com/embed/43R9l7EkJwE",
  "HardaBasht": "https://www.youtube.com/embed/Z2yUk7IaE9A",
  "Jujutsu Kaisen:Execution": "https://www.youtube.com/embed/oCIgbchrtu4",
  "Playdate": "https://www.youtube.com/embed/ooJ8bJt-Y9A",
  "El Selem W El Thoban": "https://www.youtube.com/embed/NwlRuumdJEA",
  "the litle stranger": "https://www.youtube.com/embed/iPDA7Z1c-Eg",
  "Black Phone2": "https://www.youtube.com/embed/v0kqkRZHqk4",
  "Turno nocturno": "https://www.youtube.com/embed/M7oU0ocIyrc",
  "The Forest": "https://www.youtube.com/embed/lBgKi0XVn4A",
  "Mirrors 2": "https://www.youtube.com/embed/5HZ9WM2W0pg",
  "One Battle After Another": "https://www.youtube.com/embed/feOQFKv2Lw4",
  "Countdown": "https://www.youtube.com/embed/t72R6wZ0zQ8",
  "Sovereign": "https://www.youtube.com/embed/55tuwgvaMHY",
  "Insidious": "https://www.youtube.com/embed/zuZnRUcoWos",
  "Insidious 2": "https://www.youtube.com/embed/fBbi4NeebAk",
  "Insidious 3": "https://www.youtube.com/embed/3HxEXnVSr1w",
  "WorldWar Z": "https://www.youtube.com/embed/Md6Dvxdr0AQ",
  "Damsel": "https://www.youtube.com/embed/iM150ZWovZM",
  "Mr. and Mrs. Smith": "https://www.youtube.com/embed/CZ0B22z22pI",
  "Bullet Train": "https://www.youtube.com/embed/0IOsk2Vlc4o",
  "The Lion King": "https://www.youtube.com/embed/7TavVZMewpY",
  "Frozen": "https://www.youtube.com/embed/FLzfXQSPBOg",
  "Frozen 2": "https://www.youtube.com/embed/bwzLiQZDw2I",
  "Minions: The Rise of Gru": "https://www.youtube.com/embed/--rV9wXzIeE",
  "Toy Story 4": "https://www.youtube.com/embed/wmiIUN-7qhE",
  "Moana": "https://www.youtube.com/embed/LKFuXETZUsI",
  "Coco": "https://www.youtube.com/embed/xlnPHQ3TLX8", // sar working
  "Spider-Man: Into the Spider-Verse": "https://www.youtube.com/embed/g4Hbz2jLxvQ",
  "Encanto": "https://www.youtube.com/embed/CaimKeDcudo",
  "Minions: The Rise of Gru": "https://www.youtube.com/embed/6DxjJzmYsXo",//sar  working
  "The Running Man": "https://www.youtube.com/embed/KD18ddeFuyM",
};

// Auto-close burger menu on resize
function handleResize() {
    let header = document.querySelector("header");
    if (window.innerWidth > 978 && header.classList.contains("header-nav-open")) {
        header.classList.remove("header-nav-open");
    }
}

// Add resize event listener
window.addEventListener('resize', handleResize);

// Also close menu when clicking on links (optional)
document.addEventListener('click', function(e) {
    let header = document.querySelector("header");
    if (header.classList.contains("header-nav-open") && 
        e.target.closest('.main-nav a')) {
        header.classList.remove("header-nav-open");
    }
});
function closeModal() {
  if (modal) {
    modal.classList.remove('open');
  }
  document.body.style.overflow = '';
  if (modalTrailer) {
    modalTrailer.src = '';
  }
}
let movieContainer = document.getElementById('movie');
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

//for the welcome box to active the btns set indicator and trnsform to the next img every 3 sec
let heroBox = document.getElementById("heroBox");
let heroImages = [
  "../imgs/welcome page.png",
  "../imgs/Premiere.png",
  "../imgs/theatre.png"
];
let heroIndex = 0;
let autoAdvanceInterval;
let isTransitioning = false;
if(heroBox){

  // Create indicator container and circles
  let indicatorsContainer = document.createElement('div');
  indicatorsContainer.className = 'carousel-indicators';
  heroBox.appendChild(indicatorsContainer);

  // Create indicators
  heroImages.forEach((_, index) => {
    let indicator = document.createElement('div');
    indicator.className = 'indicator';
    if (index === 0) indicator.classList.add('active');
    indicator.addEventListener('click', () => setHero(index));
    indicatorsContainer.appendChild(indicator);
  });
  //initialize
  setHero(0);
  startAutoAdvance();
  //pasue when hover
  heroBox.addEventListener('mouseenter', () => {
    clearInterval(autoAdvanceInterval);
  });
  //resume when no hover
  heroBox.addEventListener('mouseleave', () => {
    startAutoAdvance();
  });
}
function setHero(i) {
  if(!heroBox) return; //la2an mafee hero box ella b index.html
  if (isTransitioning) return;

  isTransitioning = true;
  heroIndex = (i + heroImages.length) % heroImages.length;
  heroBox.style.backgroundImage = `url("${heroImages[heroIndex]}")`;
  // Update active indicator
  document.querySelectorAll('.indicator').forEach((indicator, index) => {
    indicator.classList.toggle('active', index === heroIndex);
  });
  // Reset transitioning flag after transition completes
  setTimeout(() => {
    isTransitioning = false;
  }, 800);
}
function nextImage() { 
  setHero(heroIndex + 1); 
}
function prevImage() { 
  setHero(heroIndex - 1); 
}
// Start auto-advancing every 3 seconds
function startAutoAdvance() {
  if(!heroBox) return; //la2an mafee hero box ella b index.html
  autoAdvanceInterval = setInterval(() => {
    if (!isTransitioning) {
      nextImage();
    }
  }, 3000);
}


//when the sceen become smaller the behavior of burger
function handleResize() {
    let header = document.querySelector("header");
    if (window.innerWidth > 978 && header.classList.contains("header-nav-open")) {
        header.classList.remove("header-nav-open");
    }
}
//  event listener
window.addEventListener('resize', handleResize);


//Search functionality 
document.addEventListener("DOMContentLoaded", () => {
  let searchInput = document.getElementById("SearchInput");
  let searchContainer = document.querySelector(".search");
  let searchToggle = document.getElementById("searchToggle");
  let movieCards = document.querySelectorAll(".movie-card");
  let overlay = document.getElementById("searchOverlay");
  let resultsContainer = document.querySelector(".search-results");

  if (searchContainer && searchInput && searchToggle) {
    searchToggle.addEventListener("click", (e) => {
      e.preventDefault();
      searchContainer.classList.toggle("active");
      if (searchContainer.classList.contains("active")) {
        searchInput.focus();
      } else {
        searchInput.value = "";
      }
    });
  }

  if (!searchInput || !overlay || !resultsContainer) return;

  searchInput.addEventListener("input", () => {
  let allCards = document.querySelectorAll(".movie-card");
  let query = searchInput.value.toLowerCase().trim();
  resultsContainer.innerHTML = "";

    if (query === "") {
      overlay.style.display = "none";
      return;
    }
    let seenTitles = new Set();
    let matches=[];

  Array.from(allCards).forEach(card => {
    let titleText =(card.dataset.title ||card.querySelector("figcaption")?.textContent ||"").toLowerCase();
    let descText =(card.dataset.description || "").toLowerCase();
    let castText   = (card.dataset.cast || "").toLowerCase();
    let genresText = (card.dataset.genres || "").toLowerCase();
    if (!titleText && !descText && !castText && !genresText) return;

    let isMatch = titleText.includes(query) || descText.includes(query) || castText.includes(query) || genresText.includes(query);

    if (isMatch && !seenTitles.has(titleText)) {
      seenTitles.add(titleText);
      matches.push(card); 
    }
  });

  if (matches.length > 0) {
    overlay.style.display = "flex";

    matches.forEach(card => {
      let clone = card.cloneNode(true);

      clone.addEventListener("click", function () {
        openMovieModal(this);
      });

      resultsContainer.appendChild(clone);
    });
  } else {
    overlay.style.display = "flex";
    resultsContainer.innerHTML =
      `<div class="no-results">No movies found for "${query}"</div>`;
  }
  });

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      overlay.style.display = "none";
      searchInput.value = "";
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.style.display === "flex") {
      overlay.style.display = "none";
      searchInput.value = "";
    }
  });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.style.display === "flex") {
      overlay.style.display = "none";
      searchInput.value = "";
    }
  });

//render comments
function renderCommentsForMovie(title) {
    let commentsContainer = document.getElementById("comments-list");
  if (!commentsContainer) return;

  commentsContainer.innerHTML = "";

  //comments from movies.json
  let baseComments =
    (window.movieComments && window.movieComments[title]) || [];

  // Extra comments users added (localStorage)
let extraStore = JSON.parse(localStorage.getItem("movieCommentsExtra")) || {};
  let extraForMovie = extraStore[title] || [];

  // jam3 el comments mn movies.json w el extra
let allComments = [...baseComments, ...extraForMovie];

  if (!allComments.length) {
    commentsContainer.innerHTML =
      `<p class="no-comments">No comments yet.</p>`;
    return;
  }

  allComments.forEach(c => {
  let div = document.createElement("div");
    div.className = "comment";

  let rating = c.rating || 0;
  let stars =
      "★".repeat(rating) + "☆".repeat(5 - rating);

    div.innerHTML = `
      <div class="comment-header">
        <span class="comment-user">${c.user}</span>
        <span class="comment-rating">${stars}</span>
      </div>
      <p class="comment-text">${c.text}</p>
    `;
    commentsContainer.appendChild(div);
  });
}

// MAIN FUNCTION TO OPEN MODAL
function openMovieModal(cardElement) {
  let card = cardElement.closest('figure');

 

  let titleEl = card.querySelector('figcaption');
  let title = titleEl ? titleEl.textContent.trim() : card.getAttribute('data-title');
  let text = card.getAttribute('data-description') || 'No movie description available yet.';
  let rating = card.getAttribute('data-rating') || 'N/A';
  let cast = card.getAttribute('data-cast') || 'N/A';
  let genres = card.getAttribute('data-genres') || 'N/A';
  let thisMovieIs = card.getAttribute('data-this-movie-is') || 'N/A';
  let youtubeEmbedUrl = TRAILER_URLS[title] || '';

  if (modalTitle) modalTitle.textContent = title;
  if (modalText) modalText.textContent = text;
  if (modalCast) modalCast.textContent = cast;
  if (modalGenres) modalGenres.textContent = genres;
  if (modalThisMovieIs) modalThisMovieIs.textContent = thisMovieIs;
  
  if (youtubeEmbedUrl && modalTrailer) {
    let params = "?autoplay=1&mute=1&rel=0&playsinline=1&modestbranding=1";
    modalTrailer.src = youtubeEmbedUrl + params;
    modalTrailer.style.display = 'block';
  } 
  
  renderCommentsForMovie(title);
  updateWatchlistButton(title);

  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }


  let searchOverlay = document.getElementById("searchOverlay");
  if (searchOverlay) {
    searchOverlay.style.display = "none";
  }


  let searchInput = document.getElementById("SearchInput");
  if (searchInput) {
    searchInput.value = "";
  }
}


function updateWatchlistButton(movieTitle) {
    let watchlistBtn = document.querySelector('.add-watchlist-btn');
    let newWatchlistBtn = watchlistBtn.cloneNode(true);
    watchlistBtn.parentNode.replaceChild(newWatchlistBtn, watchlistBtn);

    let userData;
    
        userData = JSON.parse(sessionStorage.getItem('loggedInUser'));
   

    if (!userData) {
        newWatchlistBtn.textContent = "Log in to use Watchlist";
        newWatchlistBtn.disabled = true;
        newWatchlistBtn.style.opacity = "0.6";
        return;
    }

    let saved = [];
   
        saved = JSON.parse(localStorage.getItem('watchlist')) || [];
    

    let inList = saved.some(m => m.title === movieTitle && m.username === userData.username);

    if (inList) {
        newWatchlistBtn.textContent = " Remove from Watchlist";
        newWatchlistBtn.classList.add('added');
        newWatchlistBtn.style.background = "#5f10a0";
    } else {
        newWatchlistBtn.textContent = "+ Add to Watchlist";
        newWatchlistBtn.classList.remove('added');
        newWatchlistBtn.style.background = "";
    }
    newWatchlistBtn.disabled = false;
    newWatchlistBtn.style.opacity = "1";

  }
// Event listeners
document.addEventListener("click", (e) => {
  let card = e.target.closest(".movie-card");
  if (!card) return;
  openMovieModal(card);
});

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
//for modal to be responsive
function repositionModalTitle() {
  let modalTitle = document.getElementById("modal-title");
  let modalMedia = document.querySelector(".modal__media");
  let modalBody  = document.querySelector(".modal__body");
  let movieInfo  = document.getElementById("movieinfo");

  if (!modalTitle || !modalMedia || !modalBody) return;

  if (window.innerWidth <= 974) {
    if (modalTitle.parentElement !== modalMedia) {
      // hatet l title after the trailer, before cast info
      modalMedia.insertBefore(modalTitle, movieInfo);
    }
  } else {
    // hatet l title metel ma kenet(old layout)
    if (modalTitle.parentElement !== modalBody) {
      modalBody.insertBefore(modalTitle, modalBody.firstChild);
    }
  }
}

// Run once on load w kel ma l window resizes
window.addEventListener("load", repositionModalTitle);
window.addEventListener("resize", repositionModalTitle);
