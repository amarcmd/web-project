$(document).ready(function () {
    loadModernProfile();
});

function loadModernProfile() {
    const userData = sessionStorage.getItem('loggedInUser');

    if (!userData) {
        $('main').html(`
            <div class="profile-modern">
                <div class="empty-watchlist">
                    <div class="empty-icon">🎬</div>
                    <h3>Please Log In</h3>
                    <p>You need to be logged in to view your profile and ratings.</p>
                    <a href="index.html" style="color: #8a2be2; text-decoration: none; font-weight: bold;">Go to Login →</a>
                </div>
            </div>
        `);
        return;
    }

    const user = JSON.parse(userData);
    renderModernProfile(user);
    loadModernWatchlist(user);
    loadRatedMovies(user);
}

function renderModernProfile(user) {
    const profileHTML = `
        <div class="profile-modern">
            <div class="profile-hero">
                <div class="user-avatar-container">
                    <img src="${user.img}" alt="${user.username}" class="user-avatar" onerror="this.src='imgs/default-avatar.jpg'">
                    <div class="online-status"></div>
                </div>
                <div class="profile-info-modern">
                    <h1>${user.username}</h1>
                    <p style="color: #ccc; margin-bottom: 15px;">Movie Enthusiast</p>
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
                            <span class="stat-number" id="member-since">2024</span>
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
                <div class="watchlist-grid-modern" id="modern-watchlist"></div>
            </div>
            
            <div class="rated-section">
                <div class="section-header">
                    <div class="section-title">My Rated Movies</div>
                    <div class="watchlist-count" id="rated-counter">0 movies rated</div>
                </div>
                <div class="rated-grid-modern" id="modern-rated"></div>
            </div>
        </div>
    `;
    
    $('main').html(profileHTML);
}

function loadModernWatchlist(user) {
    const saved = JSON.parse(localStorage.getItem('watchlist')) || [];
    const userWatchlist = saved.filter(movie => movie.username === user.username);
    
    // Get user ratings to show which movies are already rated
    const savedRatings = JSON.parse(localStorage.getItem('movieRatings')) || {};
    const userRatings = savedRatings[user.username] || {};

    $('#watchlist-count').text(userWatchlist.length);
    $('#watchlist-counter').text(userWatchlist.length + ' movie' + (userWatchlist.length !== 1 ? 's' : ''));

    const $modernWatchlist = $('#modern-watchlist');
    
    if (userWatchlist.length > 0) {
        const watchlistHTML = userWatchlist.map(movie => {
            const isRated = userRatings[movie.title];
            
            return `
                <div class="watchlist-card-modern">
                    <img src="${movie.image}" alt="${movie.title}" class="card-image" onerror="this.src='imgs/default-movie.jpg'">
                    
                    ${isRated ? `
                        <div class="rated-badge">Rated ${userRatings[movie.title].rating}/5</div>
                    ` : ''}
                    
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
        
        // Add event handlers for rating buttons
        $modernWatchlist.off('click', '.btn-rate-large').on('click', '.btn-rate-large', function() {
            const title = $(this).data('title');
            const savedRatings = JSON.parse(localStorage.getItem('movieRatings')) || {};
            const userRatings = savedRatings[user.username] || {};
            const currentRating = userRatings[title] ? userRatings[title].rating : 0;
            
            openLargeRatingModal(title, currentRating);
        });
        
        // Remove from watchlist
        $modernWatchlist.off('click', '.btn-remove').on('click', '.btn-remove', function() {
            const title = $(this).data('title');
            removeFromModernWatchlist(title);
        });
        
    } else {
        $modernWatchlist.html(`
            <div class="empty-watchlist" style="grid-column: 1 / -1;">
                <div class="empty-icon">📽️</div>
                <h3>Your Watchlist is Empty</h3>
                <p>Start adding movies to build your personalized collection!</p>
                <a href="index.html" style="color: #8a2be2; text-decoration: none; font-weight: bold;">Browse Movies →</a>
            </div>
        `);
    }
}

function loadRatedMovies(user) {
    const savedRatings = JSON.parse(localStorage.getItem('movieRatings')) || {};
    const userRatings = savedRatings[user.username] || {};
    
    // Update rated count in stats
    const ratedCount = Object.keys(userRatings).length;
    $('#rated-count').text(ratedCount);
    $('#rated-counter').text(ratedCount + ' movie' + (ratedCount !== 1 ? 's' : '') + ' rated');
    
    const $ratedGrid = $('#modern-rated');
    
    if (ratedCount > 0) {
        const ratedHTML = Object.entries(userRatings).map(([movieTitle, ratingData]) => `
            <div class="rated-card-modern">
                <img src="${ratingData.image}" alt="${movieTitle}" class="card-image" onerror="this.src='imgs/default-movie.jpg'">
                <div class="rated-badge">${ratingData.rating}/5 ★</div>
                <div class="card-content">
                    <h3 class="card-title">${movieTitle}</h3>
                    <div class="card-actions">
                        <button class="btn-edit-rating" data-title="${movieTitle}">  Edit
                            </button>
                        <button class="btn-remove-rated" data-title="${movieTitle}">
                            Remove
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
        
        $ratedGrid.html(ratedHTML);
        
        // Add event handlers for rated movies
        $ratedGrid.off('click', '.btn-edit-rating').on('click', '.btn-edit-rating', function() {
            const title = $(this).data('title');
            const currentRating = userRatings[title].rating;
            openLargeRatingModal(title, currentRating);
        });
        
        $ratedGrid.off('click', '.btn-remove-rated').on('click', '.btn-remove-rated', function() {
            const title = $(this).data('title');
            removeMovieRating(title);
            showToast(`Rating for "${title}" removed`, 'removed');
        });
        
    } else {
        $ratedGrid.html(`
            <div class="empty-rated">
                <div class="empty-rated-icon">⭐</div>
                <h3>No Movies Rated Yet</h3>
                <p>Rate movies from your watchlist to see them here!</p>
            </div>
        `);
    }
}

function openLargeRatingModal(movieTitle, currentRating = 0) {
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
    
    // Initialize stars with current rating
    if (currentRating > 0) {
        highlightLargeStars(currentRating);
    }
    
    // Star hover and click events
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
            saveMovieRating(movieTitle, selectedRating);
            $('#largeRatingModal').remove();
            showToast(`"${movieTitle}" rated ${selectedRating}/5 stars!`, 'rated');
        }
    });
    
    // Close modal when clicking outside
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

function saveMovieRating(movieTitle, rating) {
    const userData = JSON.parse(sessionStorage.getItem('loggedInUser'));
    let savedRatings = JSON.parse(localStorage.getItem('movieRatings')) || {};
    
    if (!savedRatings[userData.username]) {
        savedRatings[userData.username] = {};
    }
    
    // Get movie image from watchlist
    const savedWatchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    const movieFromWatchlist = savedWatchlist.find(m => m.title === movieTitle && m.username === userData.username);
    const movieImage = movieFromWatchlist ? movieFromWatchlist.image : 'imgs/default-movie.jpg';
    
    // Save rating
    savedRatings[userData.username][movieTitle] = {
        rating: rating,
        image: movieImage,
        dateRated: new Date().toISOString()
    };
    
    localStorage.setItem('movieRatings', JSON.stringify(savedRatings));
    
    // Refresh both sections
    loadModernWatchlist(userData);
    loadRatedMovies(userData);
}

function removeMovieRating(movieTitle) {
    const userData = JSON.parse(sessionStorage.getItem('loggedInUser'));
    let savedRatings = JSON.parse(localStorage.getItem('movieRatings')) || {};
    
    if (savedRatings[userData.username] && savedRatings[userData.username][movieTitle]) {
        delete savedRatings[userData.username][movieTitle];
        localStorage.setItem('movieRatings', JSON.stringify(savedRatings));
        
        // Refresh both sections
        loadModernWatchlist(userData);
        loadRatedMovies(userData);
    }
}

function removeFromModernWatchlist(title) {
    const userData = JSON.parse(sessionStorage.getItem('loggedInUser'));
    
    // Remove from watchlist
    let saved = JSON.parse(localStorage.getItem('watchlist')) || [];
    saved = saved.filter(m => !(m.title === title && m.username === userData.username));
    localStorage.setItem('watchlist', JSON.stringify(saved));
    
    // Also remove rating if it exists
    removeMovieRating(title);
    
    // Update session storage
    userData.watchlist = saved.filter(m => m.username === userData.username);
    sessionStorage.setItem('loggedInUser', JSON.stringify(userData));
    
    // Reload both watchlist and ratings
    loadModernWatchlist(userData);
    loadRatedMovies(userData);
    
    showToast(`"${title}" removed from watchlist and ratings`, 'removed');
}

function showToast(message, type) {
    // Remove existing toast
    $('.toast').remove();
    
    const toast = $(`
        <div class="toast toast-${type}">
            ${message}
        </div>
    `);
    
    $('body').append(toast);
    
    // Add show class with delay for animation
    setTimeout(() => toast.addClass('show'), 10);
    
    setTimeout(() => {
        toast.removeClass('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Initialize toast styles if they don't exist
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
                    background: linear-gradient(135deg, rgba(122, 21, 97, 0.678), var(--accent))
                    color: #000;
                }
                .toast-removed {
                    background: linear-gradient(135deg, rgba(122, 21, 97, 0.678), var(--accent))
                }
            </style>
        `);
    }
}

// Initialize when document is ready
$(document).ready(function() {
    initializeToastStyles();
});