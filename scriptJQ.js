// Enhanced scriptJQ.js with better error handling and data management
$(function() {

     if (sessionStorage.getItem('loggedInUser')) {
        $('.login').hide();
        $('body').removeClass('login-active');
    }
    // Initialize all systems
    initializeStorage();
    initializeUsers();
    loadMovies();
    setupBookingSystem();
    setupLoginSystem();
});

// ===== STORAGE MANAGEMENT =====
function initializeStorage() {
    console.log('🔄 Initializing storage...');
    
    const storageDefaults = {
        'watchlist': '[]',
        'movieRatings': '{}',
        'movieCommentsExtra': '{}',
        'bookings': '{}',
        'movieGamesLeaderboard': '[]'
    };

    Object.entries(storageDefaults).forEach(([key, defaultValue]) => {
        if (!localStorage.getItem(key)) {
            localStorage.setItem(key, defaultValue);
            console.log(`✅ Created missing storage: ${key}`);
        }
    });
}

function initializeUsers() {
    const defaultUsers = [
        { 
            username: "Tasneem", 
            password: "AbdAlkareem", 
            img: "https://robohash.org/Amar", 
            email: "tasneem@gmail.com", 
            id: 2025001, 
            watchlist: [], 
            booking: [] 
        },
        { 
            username: "Amar", 
            password: "444", 
            img: "https://robohash.org/tasneem", 
            email: "Amar444@gmail.com", 
            id: 2025002, 
            watchlist: [], 
            booking: [] 
        },
        { 
            username: "roaa", 
            password: "soloh", 
            img: "https://robohash.org/roaa", 
            email: "roaasoloh@gmail.com", 
            id: 2025003, 
            watchlist: [], 
            booking: [] 
        }
    ];
    
    // Store users in sessionStorage for demo (not secure for production)
    if (!sessionStorage.getItem('defaultUsers')) {
        sessionStorage.setItem('defaultUsers', JSON.stringify(defaultUsers));
    }
}

// ===== MOVIE DATA LOADING =====
function loadMovies() {
    const $gallery = $("#gallery");
    if (!$gallery.length) {
        console.log('ℹ️ No gallery found on this page');
        return;
    }

    console.log('🎬 Loading movies...');
    showLoadingState($gallery);

    $.getJSON("movies.json")
        .done(function(data) {
            if (!data || !Array.isArray(data.categories)) {
                throw new Error("Invalid movies.json format");
            }
            
            renderMovies($gallery, data);
            console.log(`✅ Loaded ${data.categories.length} categories`);
        })
        .fail(function(jqxhr, textStatus, error) {
            console.error("❌ Failed to load movies:", error);
            showErrorState($gallery, "Failed to load movies. Please refresh the page.");
        });
}

function renderMovies($gallery, data) {
    $gallery.empty().removeClass('loading');

    data.categories.forEach(category => {
        const $section = $(`
            <section class="movies-cat">
                <h3>${escapeHtml(category.name)}</h3>
                <div class="movie"></div>
            </section>
        `);

        const $row = $section.find(".movie");
        const movies = category.movies || [];

        movies.forEach(movie => {
            const rating = movie.rating ?? "N/A";
            const $card = createMovieCard(movie, rating);
            
            // Store comments globally for modal access
            if (Array.isArray(movie.comments)) {
                window.movieComments = window.movieComments || {};
                window.movieComments[movie.title] = movie.comments;
            }

            $row.append($card);
        });

        $gallery.append($section);
    });
}

function createMovieCard(movie, rating) {
    const $card = $(`
        <figure class="movie-card">
            <img src="${escapeHtml(movie.image)}" alt="${escapeHtml(movie.title)} poster" 
                 onerror="this.src='imgs/default-movie.jpg'">
            <figcaption>${escapeHtml(movie.title)}</figcaption>
        </figure>
    `);

    $card.attr({
        "data-movie-id": movie.id || "",
        "data-title": movie.title || "",
        "data-description": movie.description || "",
        "data-trailer-id": movie.trailerId || "",
        "data-rating": rating
    });

    const $overlay = $(`<span class="rating-overlay">${rating} / 5 ★</span>`);
    $card.append($overlay);

    return $card;
}

// ===== BOOKING SYSTEM =====
function setupBookingSystem() {
    if (!$("#cinemasSelect").length) return; // Only on booking page
    
    initializeSeats();
    setupBookingEventHandlers();
}

function initializeSeats() {
    const seatConfig = {
        "first-front-row": 10,
        "second-front-row": 14,
        "middle-row": 80,
        "second-last-row": 14,
        "first-last-row": 12
    };

    Object.entries(seatConfig).forEach(([rowClass, seatCount]) => {
        const $row = $(`.${rowClass}`);
        if ($row.length) {
            for (let i = 1; i <= seatCount; i++) {
                const $seat = $("<div>").addClass("seat").attr("data-seat-id", `${rowClass}-${i}`);
                $row.append($seat);
            }
        }
    });

    markRandomReservedSeats(15); // Reserve 15 random seats
}

function setupBookingEventHandlers() {
    // Seat selection
    $(document).on("click", ".seat:not(.reserved)", function() {
        const $seat = $(this);
        const seatId = $seat.data("seat-id");

        $seat.toggleClass("selected");
        
        if ($seat.hasClass("selected")) {
            window.selectedSeats.add(seatId);
        } else {
            window.selectedSeats.delete(seatId);
        }

        updateReserveButton();
    });

    // Step navigation
    $(document).on("click", ".stepsbtn.enabled", function() {
        const stepNum = parseInt(this.id.replace("btn", ""));
        if (validateStep(stepNum - 1)) {
            showStep(stepNum);
        }
    });

    $(document).on("click", ".next", function() {
        const currentStep = parseInt($(".step-content.default").attr("id").replace("step", ""));
        if (validateStep(currentStep)) {
            completeStep();
        }
    });
}

// ===== LOGIN SYSTEM =====
function setupLoginSystem() {
    const $loginPanel = $('.login');
    const loggedInUser = sessionStorage.getItem('loggedInUser');

    if (loggedInUser) {
        hideLoginOverlay();
        initializeUserData(JSON.parse(loggedInUser));
    } else {
        showLoginOverlay();
    }
    
    $('.login-form').on('submit', handleLoginSubmit);
}

function handleLoginSubmit(e) {
    e.preventDefault();

    const enteredUsername = $('#username').val().trim();
    const enteredPassword = $('#password').val();

    if (!enteredUsername || !enteredPassword) {
        showLoginError("Please enter both username and password");
        return;
    }

    const defaultUsers = JSON.parse(sessionStorage.getItem('defaultUsers') || '[]');
    const matchedUser = defaultUsers.find(user =>
        user.username === enteredUsername && user.password === enteredPassword
    );

    if (matchedUser) {
        successfulLogin(matchedUser);
    } else {
        showLoginError("Invalid username or password");
    }
}

function successfulLogin(user) {
    // Initialize user data
    initializeUserData(user);
    
    // Store in session
    sessionStorage.setItem('loggedInUser', JSON.stringify(user));
    
    // Hide login
    hideLoginOverlay();
    
    console.log(`✅ User ${user.username} logged in successfully`);
    
    // Refresh page-specific features
    if (typeof initializeGames === 'function') initializeGames();
    if (typeof loadModernProfile === 'function') loadModernProfile();
}

function initializeUserData(user) {
    // Ensure user has proper data structures
    const savedWatchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    user.watchlist = savedWatchlist.filter(movie => movie.username === user.username);
    
    // Update session storage with initialized user
    sessionStorage.setItem('loggedInUser', JSON.stringify(user));
}

// ===== UTILITY FUNCTIONS =====
function escapeHtml(unsafe) {
    if (typeof unsafe !== 'string') return unsafe;
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function showLoadingState($container) {
    $container.addClass('loading').html(`
        <div class="loading-state">
            <div class="loading-spinner"></div>
            <p>Loading movies...</p>
        </div>
    `);
}

function showErrorState($container, message) {
    $container.html(`
        <div class="error-state">
            <div class="error-icon">🎬</div>
            <h3>Something went wrong</h3>
            <p>${message}</p>
            <button onclick="location.reload()" class="retry-btn">Try Again</button>
        </div>
    `);
}

function showLoginError(message) {
    $('.login-content-panel').css('animation', 'shake 0.5s ease-in-out');
    setTimeout(() => {
        $('.login-content-panel').css('animation', '');
    }, 500);
    
    // Optional: Show error message element
    $('.login-error').remove();
    $('.login-form').prepend(`<div class="login-error" style="color: #ff6b6b; padding: 10px; background: rgba(255,107,107,0.1); border-radius: 5px; margin-bottom: 15px;">${message}</div>`);
}

function validateStep(step) {
    const validators = {
        1: () => $("#cinemasSelect").val() ? true : "Please select a cinema",
        2: () => $("#movieselect").val() ? true : "Please select a movie", 
        3: () => $("#dateselect").val() && $("#timeselect").val() ? true : "Please select both date and time",
        4: () => window.selectedSeats.size > 0 ? true : "Please select at least one seat"
    };

    const validator = validators[step];
    if (validator) {
        const result = validator();
        if (result !== true) {
            showStepError(result);
            return false;
        }
    }
    return true;
}

function showStepError(message) {
    $('.step-error').remove();
    $('.step-content.default').prepend(
        `<div class="step-error">${message}</div>`
    );
}

// ===== GLOBAL VARIABLES INITIALIZATION =====
window.selectedSeats = new Set();
window.movieComments = {};
window.SEAT_PRICE = 7;

// ===== EXPOSE FUNCTIONS TO GLOBAL SCOPE =====
window.showLoginOverlay = function() {
    $('body').addClass('login-active');
    $('.login').fadeIn();
}

window.hideLoginOverlay = function() {
    $('body').removeClass('login-active');
    $('.login').fadeOut();
}

window.showStep = function(n) {
    const btn = $("#btn" + n);
    if (!btn.hasClass("enabled")) return;

    $(".step-content").removeClass("default");
    $("#step" + n).addClass("default");
    $(".stepsbtn").removeClass("default");
    btn.addClass("default");
    window.currentStep = n;
}

window.completeStep = function() {
    const next = window.currentStep + 1;
    
    if (window.currentStep === 4) {
        const count = window.selectedSeats.size;
        const total = count * window.SEAT_PRICE;
        $("#TotalPrice").html(`
            <p><strong>Seats Selected:</strong> ${count}</p>
            <p><strong>Total Price:</strong> $${total}</p>
            <hr>
        `);
        sessionStorage.setItem("selectedSeats", JSON.stringify([...window.selectedSeats]));
        sessionStorage.setItem("totalPrice", total);
    }
    
    if (next <= 5) {
        const nextBtn = $("#btn" + next);
        nextBtn.addClass("enabled").css("cursor", "pointer");
        showStep(next);
    }
}

window.markRandomReservedSeats = function(count) {
    const allSeats = $(".seat").toArray();
    const shuffled = allSeats.sort(() => 0.5 - Math.random());
    shuffled.slice(0, count).forEach(seat => {
        $(seat).addClass("reserved");
    });
}

window.updateReserveButton = function() {
    $("#reserveBtn").prop("disabled", window.selectedSeats.size === 0);
}