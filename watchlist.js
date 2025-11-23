$(function() {
    // Initialize watchlist system immediately
    initializeWatchlist();
    
    // Handle watchlist button clicks
    $(document).on('click', '.add-watchlist-btn', function () {
        handleWatchlistAdd($(this));
    });
});

function initializeWatchlist() {
    // Ensure user has watchlist array
    let userData = sessionStorage.getItem('loggedInUser');
    if (!userData) return;
    
    let user = JSON.parse(userData);
    if (!user.watchlist) {
        let saved = JSON.parse(localStorage.getItem('watchlist')) || [];
        user.watchlist = saved.filter(movie => movie.username === user.username);
        sessionStorage.setItem('loggedInUser', JSON.stringify(user));
    }
}

function handleWatchlistAdd($button) {
    let userData = JSON.parse(sessionStorage.getItem('loggedInUser'));
    if (!userData) {
        alert("Please log in to add to your watchlist.");
        return;
    }

    let movieTitle = $('#modal-title').text();
    let movieImage = $('.movie-card[data-title="' + movieTitle + '"] img').attr('src');
    let movieRating = $('.movie-card[data-title="' + movieTitle + '"]').data('rating') || '0';

    let saved = JSON.parse(localStorage.getItem('watchlist')) || [];
    let alreadyAdded = saved.some(m => m.title === movieTitle && m.username === userData.username);

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

    // Update localStorage
    localStorage.setItem('watchlist', JSON.stringify(saved));
    
    // Update user session
    userData.watchlist = saved.filter(m => m.username === userData.username);
    sessionStorage.setItem('loggedInUser', JSON.stringify(userData));
}

function showToast(message, type) {
    if ($('#watchlist-toast').length === 0) {
        $('body').append('<div id="watchlist-toast"></div>');
    }
    
    let $toast = $('#watchlist-toast');
    $toast.text(message).addClass('show ' + type);
    
    setTimeout(() => {
        $toast.removeClass('show');
    }, 3000);
}