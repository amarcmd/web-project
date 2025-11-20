$('.add-watchlist-btn').on('click', function () {
  let userData = JSON.parse(sessionStorage.getItem('loggedInUser'));
  if (!userData) {
    alert("Please log in to add to your watchlist.");
    return;
  }

  let movieTitle = $('#modal-title').text();
  let movieImage = $('.modal__media img, #modal-trailer').attr('src') ;
  let movieRating = $('.movie-card[data-title="' + movieTitle + '"]').data('rating') || 0;

  let saved = JSON.parse(localStorage.getItem('watchlist')) || [];

  let alreadyAdded = saved.some(m => m.title === movieTitle && m.username === userData.username);
  if (alreadyAdded) {
    alert("This movie is already in your watchlist.");
    return;
  }

  // lal localStorage
  saved.push({
    username: userData.username,
    title: movieTitle,
    image: movieImage,
    rating: movieRating
  });
  localStorage.setItem('watchlist', JSON.stringify(saved));

  // lal sessionStorage
  let updatedUser = { ...userData };
  updatedUser.watchlist = saved
    .filter(m => m.username === userData.username)
    .map(m => m.title); 

  sessionStorage.setItem('loggedInUser', JSON.stringify(updatedUser));

  alert(`"${movieTitle}" added to your watchlist.`);
});