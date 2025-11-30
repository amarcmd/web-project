
$(document).ready(function() {
    initializeProfile();
    initializeToastStyles();
   


function initializeProfile() {
        let userData = sessionStorage.getItem('loggedInUser'); 
        if (!userData) {
            showLoginRequired();
            return;
        }
        let user = JSON.parse(userData);
        renderProfile(user);
        loadWatchlist(user);
        loadRatedMovies(user);
        loadBookedMovies(user);
        //.off to remove previous handlers and .on to add new handler and rerender booked movies
        $(document).off('change', '#booked-sort').on('change', '#booked-sort', function () {
          loadBookedMovies(user);
        });
}


//this function if no one login
function showLoginRequired() {
    $('main').html(`
        <div class="profile-modern">
            <div class="empty-watchlist">
                <div class="empty-icon">🎬</div>
                <h3>Please Log In</h3>
                <p>You need to be logged in to view your profile and ratings.</p>
                <a href="../../index.html" style="color: #8a2be2; text-decoration: none; font-weight: bold;">Go to Login →</a>
            </div>
        </div>
    `);
}

//this function giv all part of DOM in html
function renderProfile(user) {
    $('main').html(`
        <div class="profile-modern">
            <div class="profile-hero">
                <div class="user-avatar-container">
                    <img src="${user.img || '../../imgs/default-avatar.jpg'}" alt="${user.username}" class="user-avatar" onerror="this.src='../../imgs/default-avatar.jpg'">
                    <div class="online-status"></div>
                </div>
                <div class="profile-info-modern">
                    <h1>${user.username}</h1>
                    <p style="color: #ccc; margin-bottom: 15px;">${user.email}</p>
                    <p style="color: #ccc; margin-bottom: 15px;">${user.id}</p>
                    <div class="profile-stats">
                        <div class="stat-item">
                            <span class="stat-number" id="watchlist-count">0</span>
                            <span class="stat-label">In Watchlist</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number" id="rated-count">0</span>
                            <span class="stat-label">Movies Rated</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number" id="total-bookings">0</span>
                            <span class="stat-label">Total Bookings</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number" id="member-since">${user.since}</span>
                            <span class="stat-label">Member Since</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="watchlist-section">
                <div class="section-header">
                    <div class="section-title">My Watchlist</div>
                    <div class="watchlist-count" id="watchlist-counter">0 movies</div>
                </div>
                <div class="watchlist-grid-modern" id="modern-watchlist">
                    <div class="loading-watchlist">Loading watchlist...</div>
                </div>
            </div>
            
            <div class="rated-section">
                <div class="section-header">
                    <div class="section-title">My Rated Movies</div>
                    <div class="watchlist-count" id="rated-counter">0 movies rated</div>
                </div>
                <div class="rated-grid-modern" id="modern-rated">
                    <div class="loading-rated">Loading ratings...</div>
                </div>
            </div>
            
            <div class="booked-section">
                <div class="section-header">
                    <div class="section-title">My Booked Movies</div>
                    <div class="watchlist-count" id="booked-counter">0 bookings</div>
                    <select id="booked-sort">
                    <option value="nearest">Nearest date first</option>
                    <option value="latest">Farthest date first</option>
                    <option value="original">Original order</option>
                     </select>
                </div>
                <div class="booked-grid-modern" id="booked-grid">
                    <div class="loading-booked">Loading bookings...</div>
                </div>
            </div>
        </div>
    `);
     }


//this function load the movies in watch list and its rating if it has
function loadWatchlist(user) {
        let saved= JSON.parse(localStorage.getItem('watchlist')) || [];
        let userWatchlist = saved.filter(movie => movie.username === user.username);
       $('#watchlist-count').text(userWatchlist.length);
        $('#watchlist-counter').text(userWatchlist.length + ' movie' + (userWatchlist.length !== 1 ? 's' : ''));
        let $modernWatchlist = $('#modern-watchlist');
        if (userWatchlist.length === 0) {
            $modernWatchlist.html(`
                <div class="empty-watchlist" style="grid-column: 1 / -1;">
                    <div class="empty-icon">📽️</div>
                    <h3>Your Watchlist is Empty</h3>
                    <p>Start adding movies to build your personalized collection!</p>
                    <a href="index.html" style="color: #8a2be2; text-decoration: none; font-weight: bold;">Browse Movies →</a>
                </div>
            `);
            return;
        }
        // Get user ratings
        let savedRatings = {};
        savedRatings = JSON.parse(localStorage.getItem('movieRatings')) || {};
        const userRatings = savedRatings[user.username] || {};
        const watchlistHTML = userWatchlist.map(movie => {
        const isRated = userRatings[movie.title];
        const safeImage = movie.image || '../../imgs/default-movie.jpg';
            return `
                <div class="watchlist-card-modern">
                    <img src="${safeImage}" alt="${movie.title}" class="card-image" onerror="this.src='../../imgs/default-movie.jpg'">
                    ${isRated ? `<div class="rated-badge">Rated ${userRatings[movie.title].rating}/5</div>` : ''}
                    <div class="card-content">
                        <h3 class="card-title">${movie.title}</h3>
                        <div class="card-rating">⭐ ${movie.rating}/5</div>
                        <div class="card-actions">
                            <button class="btn-rate-large" data-title="${movie.title}">
                                ${isRated ? 'Update' : 'Rate'}
                            </button>
                            <button class="btn-remove" data-title="${movie.title}">
                                Remove
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        $modernWatchlist.html(watchlistHTML);
        // Add event handlers
        $modernWatchlist.off('click', '.btn-rate-large').on('click', '.btn-rate-large', function() {
            const title = $(this).data('title');
            const currentRating = userRatings[title] ? userRatings[title].rating : 0;
            openLargeRatingModal(title, currentRating);
        });
        $modernWatchlist.off('click', '.btn-remove').on('click', '.btn-remove', function() {
            const title = $(this).data('title');
            removeFromWatchlist(title);
        });
}


//this function load the movies that is rated and we can edit the rate or remove
function loadRatedMovies(user) {
        let savedRatings = {};
            savedRatings = JSON.parse(localStorage.getItem('movieRatings')) || {};
        const userRatings = savedRatings[user.username] || {};
        const ratedCount = Object.keys(userRatings).length;
        $('#rated-count').text(ratedCount);
        $('#rated-counter').text(ratedCount + ' movie' + (ratedCount !== 1 ? 's' : '') + ' rated');
        const $ratedGrid = $('#modern-rated');
        if (ratedCount === 0) {
            $ratedGrid.html(`
                <div class="empty-rated">
                    <div class="empty-rated-icon">⭐</div>
                    <h3>No Movies Rated Yet</h3>
                    <p>Rate movies from your watchlist to see them here!</p>
                </div>
            `);
            return;
        }
        const ratedHTML = Object.entries(userRatings).map(([movieTitle, ratingData]) => {
            const safeImage = ratingData.image || '../imgs/default-movie.jpg';
            
            return `
                <div class="rated-card-modern">
                    <img src="${safeImage}" alt="${movieTitle}" class="card-image" onerror="this.src='../imgs/default-movie.jpg'">
                    <div class="rated-badge">${ratingData.rating}/5 ★</div>
                    <div class="card-content">
                        <h3 class="card-title">${movieTitle}</h3>
                        <div class="card-actions">
                            <button class="btn-edit-rating" data-title="${movieTitle}">Edit</button>
                            <button class="btn-remove-rated" data-title="${movieTitle}">Remove</button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        $ratedGrid.html(ratedHTML);
        // Add event handlers
        $ratedGrid.off('click', '.btn-edit-rating').on('click', '.btn-edit-rating', function() {
            const title = $(this).data('title');
            const currentRating = userRatings[title].rating;
            openLargeRatingModal(title, currentRating);
        });
        $ratedGrid.off('click', '.btn-remove-rated').on('click', '.btn-remove-rated', function() {
            const title = $(this).data('title');
            removeMovieRating(title);
        });
}


function loadBookedMovies(user) {
        let allBookings = {};
        
            allBookings = JSON.parse(localStorage.getItem('bookings')) || {};
    
     const userBookings = allBookings[user.username] || [];
      
        const $bookedGrid = $('#booked-grid');
        const $bookedCounter = $('#booked-counter');
        const bookedCount = userBookings.length;
        
        $('#total-bookings').text(bookedCount);
        $bookedCounter.text(bookedCount + (bookedCount === 1 ? ' booking' : ' bookings'));

        if (userBookings.length === 0) {
            $bookedGrid.html(`
                <div class="empty-booked">
                    <div class="empty-rated-icon">🎟️</div>
                    <h3>No Bookings Yet</h3>
                    <p>Book a movie from the bookings page and it will appear here.</p>
                </div>
            `);
            return;
        }
        const sortMode = $('#booked-sort').val() || 'nearest';
        const sortedBookings = sortBookingsByMode(userBookings, sortMode);
        const bookedHTML = sortedBookings.map((b, index) => `
            <div class="booked-card-modern">
                <div class="booked-header">
                    <h3 class="booked-movie-title">${b.movie || 'Unknown Movie'}</h3>
                    <span class="booked-cinema">${b.cinema || 'Unknown Cinema'}</span>
                </div>
                <div class="booked-details">
                    <span><strong>Name:</strong> ${b.name || 'Not specified'}</span>
                </div>
                <div class="booked-meta">
                    <span><strong>Date:</strong> ${b.date || 'Not specified'}</span>
                    <span><strong>Time:</strong> ${b.time || 'Not specified'}</span>
                </div>
                <div class="booked-extra">
                    ${b.seats && b.seats.length ? `<div><strong>Seats:</strong> ${Array.isArray(b.seats) ? b.seats.join(', ') : b.seats}</div>` : ''}
                    ${b.price ? `<div><strong>Total:</strong> $${b.price}</div>` : ''}
                </div>
            </div>
        `).join('');

        $bookedGrid.html(bookedHTML);
}



function parseBookingDate(booking) {
    if (!booking || !booking.date) return null;

    // booking.date aam yethawwal la "YYYY-MM-DD" wl time la "HH:MM"
     const [year, month, day] = booking.date.split("-").map(Number);
     let hour=0, minute=0;
     if(booking.time){
        const[h,m]=booking.time.split(":").map(Number);
        hour=h;
        minute=m;
     }
    return new Date(year, month - 1, day, hour, minute);
}

function sortBookingsByMode(bookings, mode) {
    // Keep original index in case we need to preserve order
    const withMeta = bookings.map((b, idx) => ({
        ...b,
        _idx: idx,
        _dateObj: parseBookingDate(b)
    }));

    if (mode === "nearest") {
        // Ascending date (earliest first)
        withMeta.sort((a, b) => {
            if (!a._dateObj && !b._dateObj) return a._idx - b._idx;
            if (!a._dateObj) return 1;   // no date => push to bottom
            if (!b._dateObj) return -1;
            return a._dateObj - b._dateObj;
        });
    } else if (mode === "latest") {
        // Descending date (latest first)
        withMeta.sort((a, b) => {
            if (!a._dateObj && !b._dateObj) return a._idx - b._idx;
            if (!a._dateObj) return 1;
            if (!b._dateObj) return -1;
            return b._dateObj - a._dateObj;
        });
    } else {
        withMeta.sort((a, b) => a._idx - b._idx);
    }
    return withMeta.map(({ _idx, _dateObj, ...rest }) => rest);
}

//this function open RATING MODAL FUNCTIONS 
function openLargeRatingModal(movieTitle, currentRating = 0) {
   
        const userData = JSON.parse(sessionStorage.getItem('loggedInUser'));
        if (!userData) {
            alert('Please log in to rate movies.');
            return;
        }

        let savedRatingsAll = {};
      
            savedRatingsAll = JSON.parse(localStorage.getItem('movieRatings')) || {};
       
        
        const userRatingsAll = savedRatingsAll[userData.username] || {};
        const existingRatingData = userRatingsAll[movieTitle];
        const existingComment = existingRatingData ? (existingRatingData.comment || "") : "";

        const modalHTML = `
            <div class="rating-modal-overlay" id="largeRatingModal">
                <div class="rating-modal-large">
                    <div class="rating-modal-header">
                        <h3>Rate "${movieTitle}"</h3>
                        <p>How would you rate this movie?</p>
                    </div>
                    
                    <div class="rating-stars-large" id="largeRatingStars">
                        <span class="rating-star-large" data-rating="1">★</span>
                        <span class="rating-star-large" data-rating="2">★</span>
                        <span class="rating-star-large" data-rating="3">★</span>
                        <span class="rating-star-large" data-rating="4">★</span>
                        <span class="rating-star-large" data-rating="5">★</span>
                    </div>
                    
                    <div class="rating-value-large" id="largeRatingValue">
                        ${currentRating > 0 ? `Current Rating: ${currentRating}/5` : 'Select your rating'}
                    </div>
                    
                    <div class="rating-comment-wrapper">
                        <label for="largeRatingComment">Your comment (optional)</label>
                        <textarea id="largeRatingComment" rows="3" placeholder="What did you think of this movie?">${existingComment}</textarea>
                    </div>

                    <div class="rating-actions-large">
                        <button class="btn-rating-large btn-cancel-large" id="cancelLargeRating">Cancel</button>
                        <button class="btn-rating-large btn-confirm-large" id="confirmLargeRating" 
                                ${currentRating === 0 ? 'disabled style="opacity:0.5"' : ''}>
                            ${currentRating > 0 ? 'Update Rating' : 'Confirm Rating'}
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        $('body').append(modalHTML);
        
        let selectedRating = currentRating;
        const $confirmBtn = $('#confirmLargeRating');
        
        // Initialize stars
        if (currentRating > 0) {
            highlightLargeStars(currentRating);
        }
        
        // Star interactions
        $('#largeRatingStars .rating-star-large').hover(
            function() {
                const rating = $(this).data('rating');
                highlightLargeStars(rating);
            },
            function() {
                highlightLargeStars(selectedRating);
            }
        ).click(function() {
            selectedRating = $(this).data('rating');
            highlightLargeStars(selectedRating);
            $('#largeRatingValue').text(`Your Rating: ${selectedRating}/5`);
            $confirmBtn.prop('disabled', false).css('opacity', '1');
        });
        
        // Button events
        $('#cancelLargeRating').click(() => {
            $('#largeRatingModal').remove();
        });
        
        $('#confirmLargeRating').click(() => {
            if (selectedRating > 0) {
                const commentText = $('#largeRatingComment').val().trim();
                saveMovieRating(movieTitle, selectedRating, commentText);
                $('#largeRatingModal').remove();
                showToast(`"${movieTitle}" rated ${selectedRating}/5 stars!`, 'rated');
            }
        });
        
        // Close modal on outside click
        $('#largeRatingModal').click(function(e) {
            if (e.target === this) {
                $(this).remove();
            }
        });
        
        // Close with Escape key
        $(document).on('keydown.ratingModal', function(e) {
            if (e.key === 'Escape') {
                $('#largeRatingModal').remove();
                $(document).off('keydown.ratingModal');
            }
        });
}



function highlightLargeStars(rating) {
    $('#largeRatingStars .rating-star-large').each(function() {
        if ($(this).data('rating') <= rating) {
            $(this).addClass('active');
        } else {
            $(this).removeClass('active');
        }
    });
}

function saveMovieRating(movieTitle, rating, commentText = "") {
        const userData = JSON.parse(sessionStorage.getItem('loggedInUser'));
        if (!userData) return;

        let savedRatings = {};
       
            savedRatings = JSON.parse(localStorage.getItem('movieRatings')) || {};
      

        if (!savedRatings[userData.username]) {
            savedRatings[userData.username] = {};
        }

        // Get movie image from watchlist
        let movieImage = '../imgs/default-movie.jpg';
     
            const savedWatchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
            const movieFromWatchlist = savedWatchlist.find(
                m => m.title === movieTitle && m.username === userData.username
            );
            if (movieFromWatchlist) {
                movieImage = movieFromWatchlist.image || '../imgs/default-movie.jpg';
            }
       
        // Save rating
        savedRatings[userData.username][movieTitle] = {
            rating: rating,
            image: movieImage,
            dateRated: new Date().toISOString(),
            comment: commentText
        };

        localStorage.setItem('movieRatings', JSON.stringify(savedRatings));

        // Save comment to extra comments if provided
        if (commentText) {
            let extraComments = {};
            
                extraComments = JSON.parse(localStorage.getItem('movieCommentsExtra')) || {};
          
            
            if (!extraComments[movieTitle]) extraComments[movieTitle] = [];

            extraComments[movieTitle].push({
                user: userData.username,
                rating: rating,
                text: commentText,
                date: new Date().toISOString()
            });

            localStorage.setItem('movieCommentsExtra', JSON.stringify(extraComments));
        }

        // Refresh profile
        loadWatchlist(userData);
        loadRatedMovies(userData);
        
}

function removeMovieRating(movieTitle) {
   
        const userData = JSON.parse(sessionStorage.getItem('loggedInUser'));
        let savedRatings = JSON.parse(localStorage.getItem('movieRatings')) || {};
        
        if (savedRatings[userData.username] && savedRatings[userData.username][movieTitle]) {
            delete savedRatings[userData.username][movieTitle];
            localStorage.setItem('movieRatings', JSON.stringify(savedRatings));
            
            loadWatchlist(userData);
            loadRatedMovies(userData);
            
            showToast(`Rating for "${movieTitle}" removed`, 'removed');
        }
    
}



function removeFromWatchlist(title) {
        const userData = JSON.parse(sessionStorage.getItem('loggedInUser'));
        
        // Remove from watchlist
        let saved = JSON.parse(localStorage.getItem('watchlist')) || [];
        saved = saved.filter(m => !(m.title === title && m.username === userData.username));
        localStorage.setItem('watchlist', JSON.stringify(saved));
        
        // Remove rating if exists
        removeMovieRating(title);
        
        // Update session storage
        userData.watchlist = saved.filter(m => m.username === userData.username);
        sessionStorage.setItem('loggedInUser', JSON.stringify(userData));
        
        // Reload
        loadWatchlist(userData);
        loadRatedMovies(userData);
        
        showToast(`"${title}" removed from watchlist and ratings`, 'removed');
        
  
}

function showToast(message, type) {
    
        $('.toast').remove();
        
        const toast = $(`
            <div class="toast toast-${type}">
                ${message}
            </div>
        `);
        
        $('body').append(toast);
        
        setTimeout(() => toast.addClass('show'), 10);
        
        setTimeout(() => {
            toast.removeClass('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
   
}

// Initialize toast styles
function initializeToastStyles() {
    if (!$('#toast-styles').length) {
        $('head').append(`
            <style id="toast-styles">
                .toast {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    background: linear-gradient(135deg, rgba(122, 21, 97, 0.678), var(--accent));
                    color: white;
                    padding: 12px 20px;
                    border-radius: 8px;
                    font-weight: 600;
                    z-index: 10000;
                    transform: translateX(100%);
                    transition: transform 0.3s ease;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                    max-width: 300px;
                }
                .toast.show {
                    transform: translateX(0);
                }
                .toast-rated {
                    background: linear-gradient(135deg, rgba(122, 21, 97, 0.678), var(--accent));
                }
                .toast-removed {
                    background: linear-gradient(135deg, rgba(122, 21, 97, 0.678), var(--accent));
                }
                
                /* Loading states */
                .loading-watchlist, .loading-rated, .loading-booked {
                    grid-column: 1 / -1;
                    text-align: center;
                    padding: 40px;
                    color: #888;
                }
                
                .error-state {
                    grid-column: 1 / -1;
                    text-align: center;
                    padding: 40px;
                    color: #ff6b6b;
                }
                
                .error-icon {
                    font-size: 3em;
                    margin-bottom: 15px;
                    opacity: 0.7;
                }
                
                .retry-btn {
                    background: var(--accent-purple);
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                    margin-top: 15px;
                }
            </style>
        `);
    }
}

   
});
//profile search 
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("SearchInput");
  if (!searchInput) return;

  searchInput.addEventListener("input", () => {
    const q = searchInput.value.toLowerCase().trim();

    const watchContainer = document.getElementById("modern-watchlist");
    const ratedContainer = document.getElementById("modern-rated");
    if (!watchContainer && !ratedContainer) return; 

    const watchCards = watchContainer
      ? watchContainer.querySelectorAll(".watchlist-card-modern"): [];
    const ratedCards = ratedContainer
      ? ratedContainer.querySelectorAll(".rated-card-modern"): [];

    const filterCards = (cards) => {
      cards.forEach((card) => {
        const titleEl = card.querySelector(".card-title");
        const ratingEl = card.querySelector(".rated-badge, .card-rating");

        const titleText = (titleEl?.textContent || "").toLowerCase();
        const ratingText = (ratingEl?.textContent || "").toLowerCase();

        const matches =
          !q || titleText.includes(q) || ratingText.includes(q);

        card.style.display = matches ? "" : "none";
      });
    };

   // to display msg eza ma mawjood l movie
    const updateEmptyMessage = (container, cardsNodeList, sectionLabel) => {
      if (!container) return;

      const existingMsg = container.querySelector(".search-empty-msg");

      // eza ma fi search, remove msg
      if (!q) {
        if (existingMsg) existingMsg.remove();
        return;
      }

      // Count kam card
      const visibleCount = Array.from(cardsNodeList).filter(
        (card) => card.style.display !== "none"
      ).length;

      if (visibleCount === 0) {
        // eza ma fi cards, add msg
        if (!existingMsg) {
          const msg = document.createElement("div");
          msg.className = "search-empty-msg";
          msg.style.gridColumn = "1 / -1";
          msg.style.textAlign = "center";
          msg.style.padding = "20px";
          msg.style.opacity = "0.8";
          msg.textContent = `No movies match your search in ${sectionLabel}.`;
          container.appendChild(msg);
        }
      } else {
        // cards mawjoodin remove msg
        if (existingMsg) existingMsg.remove();
      }
    };

    // filter cards
    filterCards(watchCards);
    filterCards(ratedCards);

    // update empty msg
    updateEmptyMessage(watchContainer, watchCards, "Watchlist");
    updateEmptyMessage(ratedContainer, ratedCards, "Rated Movies");
  });
});