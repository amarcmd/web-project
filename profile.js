$(document).ready(function () {
    loadUserProfile();
});

function loadUserProfile() {
    let userData = sessionStorage.getItem('loggedInUser');

    if (!userData) {
        $('.Profile-container').html(`
            <div style="text-align: center; padding: 50px; color: #ccc;">
                <h3>Please Log In</h3>
                <p>You need to be logged in to view your profile and watchlist.</p>
                <a href="index.html" style="color: #7765fa; text-decoration: underline;">Go to Login</a>
            </div>
        `);
        return;
    }

    let user = JSON.parse(userData);
    renderProfile(user);
    loadWatchlist(user);
}

function renderProfile(user) {
    let banner = $('<div></div>').addClass('profile-banner');

    let img = $('<img>')
        .attr('src', user.img)
        .attr('alt', user.username);

    let info = $('<div></div>').addClass('profile-info');
    let name = $('<h2></h2>').text(user.username);
    let email = $('<p></p>').text('Email: ' + user.email);
    let id = $('<p></p>').text('ID: ' + user.id);

    info.append(name, email, id);
    banner.append(img, info);
    $('.Profile-container').append(banner);
}

function loadWatchlist(user) {
    let saved = JSON.parse(localStorage.getItem('watchlist')) || [];
    let userWatchlist = saved.filter(movie => movie.username === user.username);

    if (userWatchlist.length > 0) {
        let watchlistSection = $('<div></div>').addClass('favorites-section');
        let title = $('<h3></h3>').text('My Watchlist');
        let list = $('<div></div>').addClass('watchlist-cards');

        userWatchlist.forEach(movie => {
            let card = $('<div></div>').addClass('watch-card');

            let poster = $('<img>')
                .attr('src', movie.image)
                .attr('alt', movie.title)
                .on('error', function () {
                    $(this).attr('src', 'imgs/default.jpg');
                });

            let movieTitle = $('<h4></h4>').text(movie.title);
            let rating = $('<p></p>').text('Rating: ' + movie.rating);

            let removeBtn = $('<button></button>')
                .addClass('remove-btn')
                .text('Remove')
                .on('click', function () {
                    // Remove from localStorage
                    let saved = JSON.parse(localStorage.getItem('watchlist')) || [];
                    saved = saved.filter(m => !(m.title === movie.title && m.username === user.username));
                    localStorage.setItem('watchlist', JSON.stringify(saved));

                    // Update sessionStorage
                    let updated = saved.filter(m => m.username === user.username);
                    user.watchlist = updated;
                    sessionStorage.setItem('loggedInUser', JSON.stringify(user));

                    // Remove card visually
                    card.remove();
                    
                    // Show message if empty
                    if (saved.filter(m => m.username === user.username).length === 0) {
                        list.html('<p style="color: #ccc; padding: 20px; text-align: center;">Your watchlist is empty. Add movies from the home page!</p>');
                    }
                });

            card.append(poster, movieTitle, rating, removeBtn);
            list.append(card);
        });

        watchlistSection.append(title, list);
        $('.Profile-container').append(watchlistSection);
    } else {
        // Show empty state
        let emptySection = $('<div></div>').addClass('favorites-section');
        let title = $('<h3></h3>').text('My Watchlist');
        let emptyMsg = $('<p></p>')
            .text('Your watchlist is empty. Add some movies from the home page!')
            .css({ 'color': '#ccc', 'padding': '20px', 'text-align': 'center' });
        
        emptySection.append(title, emptyMsg);
        $('.Profile-container').append(emptySection);
    }
}