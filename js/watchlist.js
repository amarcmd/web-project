// watchlist.js - COMPLETE WORKING VERSION
$(document).ready(function() {
    initializeWatchlist();
    setupWatchlistEventHandlers();
});

function initializeWatchlist() {
    const userData = sessionStorage.getItem('loggedInUser');
    if (!userData) {
       return;
    }
    
    
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
        if (!userData) {
            alert("Please log in to use the watchlist.");
            return;
        }
        

    // Get movie title from modal
    let movieTitle = '';
   
        movieTitle = $('#modal-title').text().trim();
        if (!movieTitle) {
             return;
        }
       

    // Get movie image
    // Get movie image safely
let movieImage = '';

    const $modalImage = $('.modal__media img');
    if ($modalImage.length) {
        // DOM property → absolute URL
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
            showToast(`"${movieTitle}" removed from your watchlist`, 'removed');
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
            showToast(`"${movieTitle}" added to your watchlist!`, 'added');
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


function showToast(message, type) {
   
    // Remove existing toasts
    $('.watchlist-toast').remove();
    
    const backgroundColor = type === 'added' ? 
        'linear-gradient(135deg, #8a2be2, #8662a3ff)' : 
        'linear-gradient(135deg, #8a2be2, #8662a3ff)' 
    
    const $toast = $(`
        <div class="watchlist-toast toast-${type}">
            ${message}
        </div>
    `).css({
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        background: backgroundColor,
        color: 'white',
        padding: '12px 20px',
        borderRadius: '8px',
        fontWeight: '600',
        zIndex: '10000',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        maxWidth: '300px'
        
    });
    
    $('body').append($toast);
    
    // Animate in
    setTimeout(() => $toast.css('transform', 'translateX(0)'), 10);
    
    // Remove after delay
    setTimeout(() => {
        $toast.css('transform', 'translateX(100%)');
        setTimeout(() => $toast.remove(), 300);
    }, 3000);
}