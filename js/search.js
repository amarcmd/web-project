$(function () {

    let $input = $("#mainSearchInput");
    let $btn = $("#mainSearchBtn");
    let $grid = $("#searchResults");
    let $empty = $("#searchEmpty");
    let $count = $("#resultsCount");
    let $sort = $("#searchSort");

    let allMovies = [];
    //la njeeb l watchlist
    let watchlistTitles = new Set();
    function refreshWatchlistTitles() {
        try {
            let userData = JSON.parse(sessionStorage.getItem("loggedInUser"));
            if (!userData) {
                watchlistTitles = new Set();
                return;
            }

            let saved = JSON.parse(localStorage.getItem("watchlist")) || [];

            watchlistTitles = new Set(
                saved
                    .filter(item => item.username === userData.username)
                    .map(item => item.title)
            );
        } catch (err) {
            console.error("Error building watchlist titles:", err);
            watchlistTitles = new Set();
        }
    }
    window.addEventListener('watchlist-updated', () => {
    refreshWatchlistTitles();
    triggerSearch();   // render cards with updated inWatchlist 
    });

    

    $.getJSON("../data/movies.json")
        .done(function (data) {
            allMovies = [];
            window.movieComments = window.movieComments || [];
            data.categories.forEach((cat) => {
                (cat.movies || []).forEach((m) => {
                    allMovies.push(m);
                    if (Array.isArray(m.comments) && m.comments.length) {
                        window.movieComments[m.title] = m.comments;
                    }
                });
            });
            refreshWatchlistTitles();
            // initial render 
            triggerSearch();
        })
        .fail(function () {
            $count.text("Couldn't load movies.");
        });

    function resolveImagePath(image) {
        if (!image) return "../imgs/default-movie.jpg";
        if (image.startsWith("../")) return image;
        if (image.startsWith("/")) return ".." + image;
        return "../" + image.replace(/^\/+/, "");
    }

    function applySort(list, mode) {
        let copy = [...list];
        if (mode === "title-asc") {
            copy.sort((a, b) => a.title.localeCompare(b.title));
        } else if (mode === "title-desc") {
            copy.sort((a, b) => b.title.localeCompare(a.title));
        } else if (mode === "rating-desc") {
            copy.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        } else if (mode === "rating-asc") {
            copy.sort((a, b) => (a.rating || 0) - (b.rating || 0));
        }
        return copy; // relevance = original order
    }


    function renderResults(list) {
        $grid.empty();

        if (!list.length) {
            $count.text("0 results");
            if ($empty.length) $empty.show();
          
            return;
        }

        if ($empty.length) $empty.hide();
        $count.text(`${list.length} result${list.length !== 1 ? "s" : ""} found`);

        list.forEach((m) => {
            let imgSrc = resolveImagePath(m.image);
            let rating = m.rating ?? "N/A";

            let inWatchlist = watchlistTitles && watchlistTitles.has(m.title);
            let description = m.description || m.overview || "";
            let cast = Array.isArray(m.cast) ? m.cast.join(", ") : (m.cast || "");
            let genres = Array.isArray(m.genres)
                ? m.genres.join(", ")
                : (m.genre || m.genres || "");
            let mood = Array.isArray(m.tags)
                ? m.tags.join(", ")
                : (m.thisMovieIs || m.tags || "");
            let $card = $(`
            <figure class="movie-card"
                    data-title="${m.title}"
                    data-description="${m.description || ''}"
                    data-rating="${rating}"
                    data-cast="${(m.cast || '').toString()}"
                    data-genres="${m.genre || (m.genres || '').toString()}"
                    data-this-movie-is="${m.thisMovieIs || ''}">
                   <span class="watch-flag ${inWatchlist ? "in-watchlist" : ""}"
                    data-title="${m.title}"
                    title="${inWatchlist ? "In your watchlist" : "Not in watchlist"}">
                    <i class="${inWatchlist ? "fa-solid" : "fa-regular"} fa-heart"></i>
                    </span>
                   
                <img src="${imgSrc}" alt="${m.title}"
                    onerror="this.src='../imgs/default-movie.jpg'">
                <div class="movie-overlay">
                    <p class="movie-overlay-title">${m.title || ""}</p>
                    <p class="movie-overlay-desc">${m.description || ""}</p>
                    <div class="movie-overlay-bottom">
                        <span class="film-overlay">${m.time}</span>
                        <span class="movie-overlay-rating">${rating} / 5 ★</span>
                    </div>
                </div>
            </figure>
      `);
            

          
            $grid.append($card);

        });
    }


    function triggerSearch() {
        let q = $input.val().toLowerCase().trim();
        let sortMode = $sort.val() || "relevance";

        let filtered = allMovies.filter((m) => {
            if (!q) return true;
            let haystack = [
                m.title,
                m.genre,
                m.description,
                (m.year || "").toString()
            ]
                .join(" ")
                .toLowerCase();
            return haystack.includes(q);
        });

        filtered = applySort(filtered, sortMode);
        renderResults(filtered);
    }


    $btn.on("click", function (e) {
        e.preventDefault();
        triggerSearch();
    });

    $input.on("keydown", function (e) {
        if (e.key === "Enter") {
            e.preventDefault();
            triggerSearch();
        }
    });

    $input.on("input", function () {
        triggerSearch();
    });

    $sort.on("change", function () {
        triggerSearch();
    });



});
