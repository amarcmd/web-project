let menuToggle = document.getElementById("hamburger");
let header = document.querySelector("header");
let gallery = document.querySelector(".gallery");


menuToggle.addEventListener("click", () => {
  header.classList.toggle("header-nav-open");
});


let modal = document.getElementById('card-modal');
let modalTrailer = document.getElementById('modal-trailer');
let modalTitle = document.getElementById('modal-title');
let modalText = document.getElementById('modal-text');
let modalClose = document.getElementById('modal-close');


const TRAILER_URLS = {
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
};

// Selecting all elements with the class 'movie-card'
// let figure = document.querySelectorAll('.movie-card'); 


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


// /*lama yekbus aal card*/
// figure.forEach(function (cardEl) {
//     cardEl.onclick = function () {
//         let card = cardEl.closest('figure');

//         if (!card) {
//             console.error("Could not find parent <figure> element for the clicked .movie-card element.");
//             return; 
//         }

//         let titleEl = card.querySelector('figcaption');

//         let title = titleEl ? titleEl.textContent.trim() : card.getAttribute('data-title');
//         let text = card.getAttribute('data-description') || 'No movie description available yet.'; 

//         const youtubeEmbedUrl = TRAILER_URLS[title] || ''; 

//         if (modalTitle) modalTitle.textContent = title;
//         if (modalText) modalText.textContent = text;

//        if (youtubeEmbedUrl && modalTrailer) {
//             const params = "?autoplay=1&mute=1&rel=0&playsinline=1&modestbranding=1";
//             modalTrailer.src = youtubeEmbedUrl + params;
//             modalTrailer.style.display = 'block';
//         } else if (modalTrailer) {
//             modalTrailer.src = '';
//             modalTrailer.style.display = 'none';
//             console.warn(`No trailer link found for movie: ${title}. Displaying content only.`);
//         }

//         if (modal) { 
//             modal.classList.add('open');
//             document.body.style.overflow = 'hidden';
//         }
//     };
// });

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
  "imgs/Premiere.png",
  "imgs/theatre.png"

];

let heroIndex = 0;

function setHero(i) {
  heroIndex = (i + heroImages.length) % heroImages.length;
  heroBox.style.backgroundImage = `url("${heroImages[heroIndex]}")`;
}

function nextImage() { setHero(heroIndex + 1); }
function prevImage() { setHero(heroIndex - 1); }



//Search functionality 
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("SearchInput");
  const searchContainer = document.querySelector(".search");
  const searchToggle = document.getElementById("searchToggle");
  const movieCards = document.querySelectorAll(".movie-card");
  const overlay = document.getElementById("searchOverlay");
  const resultsContainer = overlay.querySelector(".search-results");

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
    const allCards = document.querySelectorAll(".movie-card");
    const query = searchInput.value.toLowerCase().trim();

    resultsContainer.innerHTML = "";

    if (query === "") {
      overlay.style.display = "none";
      return;
    }
    let seenTitles = new Set();
    let matches=[];

  Array.from(allCards).forEach(card => {
    const titleText =(card.dataset.title ||card.querySelector("figcaption")?.textContent ||"").toLowerCase();
    const descText =(card.dataset.description || "").toLowerCase();

    if (!titleText && !descText) return;

    const isMatch = titleText.includes(query) || descText.includes(query);

    if (isMatch && !seenTitles.has(titleText)) {
      seenTitles.add(titleText);
      matches.push(card); 
    }
  });

  if (matches.length > 0) {
    overlay.style.display = "flex";

    matches.forEach(card => {
      const clone = card.cloneNode(true);

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
    const commentsContainer = document.getElementById("comments-list");
  if (!commentsContainer) return;

  commentsContainer.innerHTML = "";

  //comments from movies.json
  const baseComments =
    (window.movieComments && window.movieComments[title]) || [];

  // Extra comments users added (localStorage)
  const extraStore = JSON.parse(localStorage.getItem("movieCommentsExtra")) || {};
  const extraForMovie = extraStore[title] || [];

  // jam3 el comments mn movies.json w el extra
  const allComments = [...baseComments, ...extraForMovie];

  if (!allComments.length) {
    commentsContainer.innerHTML =
      `<p class="no-comments">No comments yet.</p>`;
    return;
  }

  allComments.forEach(c => {
    const div = document.createElement("div");
    div.className = "comment";

    const rating = c.rating || 0;
    const stars =
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
function openMovieModal(cardElement) {
  let card = cardElement.closest('figure');

  if (!card) {
    console.error("Could not find parent <figure> element for the clicked movie card.");
    return;
  }

  let titleEl = card.querySelector('figcaption');
  let title = titleEl ? titleEl.textContent.trim() : card.getAttribute('data-title');
  let text = card.getAttribute('data-description') || 'No movie description available yet.';
  let rating = card.getAttribute('data-rating') || 'N/A';

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
  renderCommentsForMovie(title);
  updateWatchlistButton(title);

  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }


  const searchOverlay = document.getElementById("searchOverlay");
  if (searchOverlay) {
    searchOverlay.style.display = "none";
  }


  const searchInput = document.getElementById("SearchInput");
  if (searchInput) {
    searchInput.value = "";
  }
}
document.addEventListener("click", (e) => {
  const card = e.target.closest(".movie-card");
  if (!card) return;
  openMovieModal(card);
});

function updateWatchlistButton(movieTitle) {
  const watchlistBtn = document.querySelector('.add-watchlist-btn');
  if (!watchlistBtn) return;

  const newWatchlistBtn = watchlistBtn.cloneNode(true);
  watchlistBtn.parentNode.replaceChild(newWatchlistBtn, watchlistBtn);

  let userData = JSON.parse(sessionStorage.getItem('loggedInUser'));

  // Not logged in ma fee button
  if (!userData) {
    newWatchlistBtn.textContent = "Log in to use Watchlist";
    newWatchlistBtn.disabled = true;
    return;
  }

  let saved = JSON.parse(localStorage.getItem('watchlist'));
  let inList = saved.some(
    m => m.title === movieTitle && m.username === userData.username
  );

  if (inList) {
    newWatchlistBtn.textContent = "Remove from Watchlist";
    newWatchlistBtn.style.background = "#5f10a0";
    newWatchlistBtn.disabled = false;

    newWatchlistBtn.addEventListener('click', function () {
      removeFromWatchlistFromModal(movieTitle);
      updateWatchlistButton(movieTitle); // refresh button state
    });
  } else {
    newWatchlistBtn.textContent = "+ Add to Watchlist";
    newWatchlistBtn.style.background = "";
    newWatchlistBtn.disabled = false;

    newWatchlistBtn.addEventListener('click', function () {
      addToWatchlistFromModal(movieTitle);
      updateWatchlistButton(movieTitle); // refresh button state
    });
  }
}
function addToWatchlistFromModal(movieTitle) {
  let userData = JSON.parse(sessionStorage.getItem('loggedInUser'));
  if (!userData) {
    alert("Please log in to add to your watchlist.");
    return;
  }
  const originalCard = Array.from(document.querySelectorAll('.movie-card')).find(card => {
    const titleEl = card.querySelector('figcaption');
    const title = titleEl ? titleEl.textContent.trim() : card.getAttribute('data-title');
    return title === movieTitle;
  });

  let movieImage = '';
  let movieRating = '0';

  if (originalCard) {
    const imgElement = originalCard.querySelector('img');
    movieImage = imgElement ? imgElement.src : '';
    movieRating = originalCard.getAttribute('data-rating') || '0';
  }

  let saved = JSON.parse(localStorage.getItem('watchlist')) || [];

  let alreadyAdded = saved.some(m => m.title === movieTitle && m.username === userData.username);
  if (alreadyAdded) {
    alert("This movie is already in your watchlist.");
    return;
  }

  saved.push({
    username: userData.username,
    title: movieTitle,
    image: movieImage,
    rating: movieRating
  });
  localStorage.setItem('watchlist', JSON.stringify(saved));

  let updatedUser = { ...userData };
  updatedUser.watchlist = saved.filter(m => m.username === userData.username);
  sessionStorage.setItem('loggedInUser', JSON.stringify(updatedUser));



  const watchlistBtn = document.querySelector('.add-watchlist-btn');
  if (watchlistBtn) {
    watchlistBtn.textContent = "Remove from Watchlist";
    watchlistBtn.style.background = "#5f10a0";
    watchlistBtn.disabled = true;
  }
}

// overlay.addEventListener("click", (e) => {
//   if (e.target === overlay) {
//     overlay.style.display = "none";
//     searchInput.value = "";
//   }
// });


const container = document.getElementById('watchlist-container');
let currentUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
let saved = JSON.parse(localStorage.getItem('watchlist')) || [];

// Filter bas ll user's watchlist
let userWatchlist = saved.filter(movie => movie.username === currentUser.username);

if (userWatchlist.length === 0) {
  container.innerHTML = "<p style='padding:20px;'>No movies added yet.</p>";
} else {
  container.innerHTML = `<div class="watchlist-grid"></div>`;
  let movieRow = container.querySelector(".watchlist-grid");

  userWatchlist.forEach(movie => {
    movieRow.innerHTML += `
      <figure class="watchlist-card" data-rating="${movie.rating}">
        <img src="${movie.image}" alt="${movie.title}" onerror="this.src='imgs/default.jpg'">
        <figcaption>${movie.title}</figcaption>
        <span class="rating-overlay">${movie.rating} / 5 ★</span>
      </figure>
    `;
  });
}



