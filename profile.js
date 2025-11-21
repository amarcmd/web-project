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
                    <p>You need to be logged in to view your profile and watchlist.</p>
                    <a href="index.html" style="color: #8a2be2; text-decoration: none; font-weight: bold;">Go to Login →</a>
                </div>
            </div>
        `);
        return;
    }

    const user = JSON.parse(userData);
    renderModernProfile(user);
    loadModernWatchlist(user);
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
        </div>
    `;
    
    $('main').html(profileHTML);
}

function loadModernWatchlist(user) {
    const saved = JSON.parse(localStorage.getItem('watchlist')) || [];
    const userWatchlist = saved.filter(movie => movie.username === user.username);

    // Update counters using jQuery
    $('#watchlist-count').text(userWatchlist.length);
    $('#watchlist-counter').text(userWatchlist.length + ' movie' + (userWatchlist.length !== 1 ? 's' : ''));

    const $modernWatchlist = $('#modern-watchlist');
    
    if (userWatchlist.length > 0) {
        const watchlistHTML = userWatchlist.map(movie => `
            <div class="watchlist-card-modern">
                <img src="${movie.image}" alt="${movie.title}" class="card-image" onerror="this.src='imgs/default-movie.jpg'">
                <div class="card-content">
                    <h3 class="card-title">${movie.title}</h3>
                    <div class="card-rating">⭐ ${movie.rating}/5</div>
                    <div class="card-actions">
                        <button class="btn-remove" data-title="${movie.title}">
                            Remove
                        </button>
                        <button class="btn-play">
                            ▶
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
        
        $modernWatchlist.html(watchlistHTML);
        
        // Add event handlers using jQuery event delegation
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

function removeFromModernWatchlist(title) {
    const userData = JSON.parse(sessionStorage.getItem('loggedInUser'));
    let saved = JSON.parse(localStorage.getItem('watchlist')) || [];
    
    saved = saved.filter(m => !(m.title === title && m.username === userData.username));
    localStorage.setItem('watchlist', JSON.stringify(saved));
    
    // Update session storage
    userData.watchlist = saved.filter(m => m.username === userData.username);
    sessionStorage.setItem('loggedInUser', JSON.stringify(userData));
    
    // Reload watchlist
    loadModernWatchlist(userData);
    
    // Show toast notification
    showToast(`"${title}" removed from watchlist`, 'removed');
}