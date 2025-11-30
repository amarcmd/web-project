
$(document).ready(function() {
    initializeWatchlist();
    setupWatchlistEventHandlers();
});

function initializeWatchlist() {
    const userData = sessionStorage.getItem('loggedInUser');
   
    
    
        const user = JSON.parse(userData);
       if (!user.watchlist) {
            const saved = JSON.parse(localStorage.getItem('watchlist')) || [];
            user.watchlist = saved.filter(movie => movie.username === user.username);
            sessionStorage.setItem('loggedInUser', JSON.stringify(user));
       }
    
}

function setupWatchlistEventHandlers() {
   
    // Remove any existing handlers and add fresh ones
    $(document).off('click', '.add-watchlist-btn').on('click', '.add-watchlist-btn', function(event) {
        event.preventDefault();
        event.stopPropagation();
        handleWatchlistAdd($(this));
    });
}

function handleWatchlistAdd($button) {
   
    // Check if user is logged in
    let userData;
        userData = JSON.parse(sessionStorage.getItem('loggedInUser'));
         let movieTitle = '';
   
        movieTitle = $('#modal-title').text().trim();
       
       
let movieImage = '';

    const $modalImage = $('.modal__media img');
    if ($modalImage.length) {
        // DOM property absolute URL
        movieImage = $modalImage[0].src || '';
    }

    if (!movieImage) {
        const cardImg = $(`.movie-card[data-title="${movieTitle}"] img`).get(0);
        if (cardImg) {
            movieImage = cardImg.src;  // absolute URL, works from any page
        } else {
            movieImage = 'imgs/default-movie.jpg';
        }
    }
    // Get movie rating
    let movieRating = '0';
    
        const $movieCard = $(`.movie-card[data-title="${movieTitle}"]`).first();
        movieRating = $movieCard.attr('data-rating') || '0';
   

    // Get current watchlist
    let saved = [];
    
        saved = JSON.parse(localStorage.getItem('watchlist')) || [];
       

    // Check if movie is already in watchlist
    const alreadyAdded = saved.some(m => m.title === movieTitle && m.username === userData.username);
   
        if (alreadyAdded) {
            // REMOVE from watchlist
            saved = saved.filter(m => !(m.title === movieTitle && m.username === userData.username));
            $button.text('+ Add to Watchlist').removeClass('added');
            $button.css('background', '');
           } else {
            // ADD to watchlist
            const newMovie = {
                username: userData.username,
                title: movieTitle,
                image: movieImage,
                rating: movieRating,
                dateAdded: new Date().toISOString()
            };
            saved.push(newMovie);
            $button.text('Remove from Watchlist').addClass('added');
            $button.css('background', '#5f10a0');
           }

        // Save to localStorage
        localStorage.setItem('watchlist', JSON.stringify(saved));
       
        // Update user data in sessionStorage
        userData.watchlist = saved.filter(m => m.username === userData.username);
        sessionStorage.setItem('loggedInUser', JSON.stringify(userData));
       
        // Refresh profile if we're on profile page
        if (typeof loadModernWatchlist === 'function') {
            loadModernWatchlist(userData);
        }

    } 

