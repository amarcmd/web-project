// Enhanced watchlist.js with better error handling
$(function() {
    initializeWatchlist();
    setupWatchlistEventHandlers();
});

function initializeWatchlist() {
    const userData = sessionStorage.getItem('loggedInUser');
    if (!userData) return;
    
    try {
        const user = JSON.parse(userData);
        if (!user.watchlist) {
            const saved = JSON.parse(localStorage.getItem('watchlist')) || [];
            user.watchlist = saved.filter(movie => movie.username === user.username);
            sessionStorage.setItem('loggedInUser', JSON.stringify(user));
        }
    } catch (error) {
        console.error('❌ Error initializing watchlist:', error);
    }
}

function setupWatchlistEventHandlers() {
    $(document).on('click', '.add-watchlist-btn', function() {
        handleWatchlistAdd($(this));
    });
}

function handleWatchlistAdd($button) {
    let userData;
    try {
        userData = JSON.parse(sessionStorage.getItem('loggedInUser'));
    } catch (error) {
        console.error('❌ Error parsing user data:', error);
        alert("Please log in again.");
        return;
    }

    if (!userData) {
        alert("Please log in to add to your watchlist.");
        return;
    }

    const movieTitle = $('#modal-title').text().trim();
    if (!movieTitle) {
        console.error('❌ No movie title found');
        return;
    }

    // Get movie image safely
    let movieImage = '';
    try {
        const $modalImage = $('.modal__media img');
        if ($modalImage.length) {
            movieImage = $modalImage.attr('src') || '';
        }
        
        if (!movieImage) {
            const $movieCard = $(`.movie-card[data-title="${movieTitle}"] img`).first();
            movieImage = $movieCard.attr('src') || 'imgs/default-movie.jpg';
        }
    } catch (error) {
        console.error('❌ Error getting movie image:', error);
        movieImage = 'imgs/default-movie.jpg';
    }

    const movieRating = $('.movie-card[data-title="' + movieTitle + '"]').first().data('rating') || '0';

    let saved;
    try {
        saved = JSON.parse(localStorage.getItem('watchlist')) || [];
    } catch (error) {
        console.error('❌ Error parsing watchlist:', error);
        saved = [];
    }

    const alreadyAdded = saved.some(m => m.title === movieTitle && m.username === userData.username);

    try {
        if (alreadyAdded) {
            // Remove from watchlist
            saved = saved.filter(m => !(m.title === movieTitle && m.username === userData.username));
            $button.text('+ Add to Watchlist').removeClass('added');
            showToast(`"${movieTitle}" removed from your watchlist.`, 'removed');
        } else {
            // Add to watchlist
            saved.push({
                username: userData.username,
                title: movieTitle,
                image: movieImage,
                rating: movieRating
            });
            $button.text('✓ Added to Watchlist').addClass('added');
            showToast(`"${movieTitle}" added to your watchlist.`, 'added');
        }

        // Update storage
        localStorage.setItem('watchlist', JSON.stringify(saved));
        
        // Update user session
        userData.watchlist = saved.filter(m => m.username === userData.username);
        sessionStorage.setItem('loggedInUser', JSON.stringify(userData));
        
    } catch (error) {
        console.error('❌ Error updating watchlist:', error);
        showToast('Error updating watchlist. Please try again.', 'error');
    }
}

function showToast(message, type) {
    // Remove existing toasts
    $('.watchlist-toast').remove();
    
    const $toast = $('<div class="watchlist-toast"></div>')
        .text(message)
        .addClass(`toast-${type}`)
        .css({
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            background: type === 'added' ? 
                'linear-gradient(135deg, #8a2be2, #5f10a0)' : 
                'linear-gradient(135deg, #8a2be2, #5f10a0)',
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