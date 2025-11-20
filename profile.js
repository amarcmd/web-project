$(document).ready(function () {
  let userData = sessionStorage.getItem('loggedInUser');

  if (!userData) {
    $('.Profile-container').html('<p>No user data found. Please log in first.</p>');
    return;
  }

  let user = JSON.parse(userData);

  /* profile (mtel small new header)*/
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


  /*watchlist*/
  if (Array.isArray(user.watchlist) && user.watchlist.length > 0) {
    
    let watchlistSection = $('<div></div>').addClass('favorites-section');
    let title = $('<h3></h3>').text('My Watchlist');
    let list = $('<div></div>').addClass('watchlist-cards');

    user.watchlist.forEach(movie => {
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
          
          // Remove min localStorage
          let saved = JSON.parse(localStorage.getItem('watchlist')) || [];
          saved = saved.filter(m => !(m.title === movie.title && m.username === user.username));
          localStorage.setItem('watchlist', JSON.stringify(saved));

          // lal sessionStorage
          let updated = saved.filter(m => m.username === user.username);
          user.watchlist = updated;
          sessionStorage.setItem('loggedInUser', JSON.stringify(user));

          // Remove card visually
          card.remove();
        });

      card.append(poster, movieTitle, rating, removeBtn);
      list.append(card);
    });

    watchlistSection.append(title, list);
    $('.Profile-container').append(watchlistSection);
  }
});