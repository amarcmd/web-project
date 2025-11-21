$(function() {
    
    WatchlistBtnS();
    
    // Single event handler for watchlist buttons
    $(document).on('click', '.add-watchlist-btn', function () {
       
        handleWatchlistAdd($(this));
    });
});

function handleWatchlistAdd($button) {
  
    let userData = JSON.parse(sessionStorage.getItem('loggedInUser'));
    if (!userData) {
        showToast("Please log in to add to your watchlist.", "error");
        return;
    }

    let movieTitle = $('#modal-title').text();
    let movieImage = $('.movie-card[data-title="' + movieTitle + '"] img').attr('src');
    let movieRating = $('.movie-card[data-title="' + movieTitle + '"]').data('rating') || '0';

    let saved = JSON.parse(localStorage.getItem('watchlist')) || [];

   let alreadyAdded = saved.some(m => 
        m.title === movieTitle && m.username === userData.username
    );

    if (alreadyAdded) {
        // If already added, remove from watchlist
         removeFromWatchlist(movieTitle, userData.username);
        $button.text('+ Add to Watchlist').removeClass('added');
        showToast(`"${movieTitle}" removed from your watchlist.`, 'removed');
    } else {
        addToWatchlist(movieTitle, movieImage, movieRating, userData.username);
        $button.text('✓ Added to Watchlist').addClass('added');
        showToast(`"${movieTitle}" added to your watchlist.`, 'added');
    }
}

function addToWatchlist(title, image, rating, username) {
    let saved = JSON.parse(localStorage.getItem('watchlist')) || [];
    
    let movieObj = {
        username: username,
        title: title,
        image: image,
        rating: rating
    };
    
    saved.push(movieObj);
    localStorage.setItem('watchlist', JSON.stringify(saved));
    
   updateUserSessionStorage(username);
}

function removeFromWatchlist(title, username) {
    let saved = JSON.parse(localStorage.getItem('watchlist')) || [];
    let initialLength = saved.length;
    
    saved = saved.filter(m => !(m.title === title && m.username === username));
    localStorage.setItem('watchlist', JSON.stringify(saved));
    updateUserSessionStorage(username);
}

function updateUserSessionStorage(username) {
    let saved = JSON.parse(localStorage.getItem('watchlist')) || [];
    let userData = JSON.parse(sessionStorage.getItem('loggedInUser'));
    
    if (userData && userData.username === username) {
        userData.watchlist = saved.filter(m => m.username === username);
        sessionStorage.setItem('loggedInUser', JSON.stringify(userData));
        }
}

function WatchlistBtnS() {
    let userData = JSON.parse(sessionStorage.getItem('loggedInUser'));
  

    let saved = JSON.parse(localStorage.getItem('watchlist')) || [];
    let userWatchlist = saved.filter(m => m.username === userData.username);
    
    //
    $(document).on('click', '.movie-card', function() {
        
            let movieTitle = $('#modal-title').text();
            let $button = $('.add-watchlist-btn');
            let isInWatchlist = userWatchlist.some(m => m.title === movieTitle);
           
            if (isInWatchlist) {
                $button.text('✓ Added to Watchlist').addClass('added');
               
            } else {
                $button.text('+ Add to Watchlist').removeClass('added');
                
            }
        
    });
}

function showToast(message, type) {
    // Create toast element if mana exist
    if ($('#watchlist-toast').length === 0) {
        $('body').append('<div id="watchlist-toast"></div>');
       
    }
    
    let $toast = $('#watchlist-toast');
    $toast.text(message)
          .removeClass('added-removed')
          .addClass('show');
    
    setTimeout(() => {  //apear after DOM elements(toast)completes
        $toast.removeClass('show');
        
    }, 3000);
}