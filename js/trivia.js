// Enhanced trivia.js with better error handling
$(document).ready(function() {
    initializeGames();
});

function initializeGames() {
    try {
        const userData = sessionStorage.getItem('loggedInUser');
        const $gamesContainer = $('#gamesContainer');
        const $loginRequired = $('#loginRequired');

        if (userData) {
            $gamesContainer.show();
            $loginRequired.hide();
            loadLeaderboard();
        } else {
            $gamesContainer.hide();
            $loginRequired.show();
        }
    } catch (error) {
        console.error('❌ Error initializing games:', error);
        $('#gamesContainer').html('<div class="error">Error loading games</div>');
    }
}

function loadLeaderboard() {
    try {
        const leaderboard = JSON.parse(localStorage.getItem('movieGamesLeaderboard')) || [];
        const $leaderboard = $('#leaderboard');
        
        if (leaderboard.length === 0) {
            $leaderboard.html('<p>No scores yet. Be the first to play!</p>');
            return;
        }

        const leaderboardHTML = leaderboard.map((entry, index) => `
            <div class="leaderboard-item">
                <span class="leaderboard-rank">#${index + 1}</span>
                <span class="leaderboard-name">${entry.name || 'Unknown'}</span>
                <span class="leaderboard-score">${entry.score || 0} pts</span>
                <span class="leaderboard-game">${entry.game || 'unknown'}</span>
            </div>
        `).join('');
        
        $leaderboard.html(leaderboardHTML);
        
    } catch (error) {
        console.error('❌ Error loading leaderboard:', error);
        $('#leaderboard').html('<p>Error loading leaderboard</p>');
    }
}

function saveToLeaderboard(score) {
    try {
        let leaderboard = JSON.parse(localStorage.getItem('movieGamesLeaderboard')) || [];
        const userData = JSON.parse(sessionStorage.getItem('loggedInUser'));
        
        if (!userData) {
            console.error('No user data found for leaderboard');
            return;
        }

        leaderboard.push({
            name: userData.username,
            score: score,
            game: currentGame,
            date: new Date().toISOString()
        });

        // Sort and limit to top 10
        leaderboard.sort((a, b) => (b.score || 0) - (a.score || 0));
        leaderboard = leaderboard.slice(0, 10);

        localStorage.setItem('movieGamesLeaderboard', JSON.stringify(leaderboard));
        
    } catch (error) {
        console.error('❌ Error saving to leaderboard:', error);
    }
}

// Add similar error handling to all game functions...