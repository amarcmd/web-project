
//bookings
let selectedSeats = new Set();
let SEAT_PRICE = 7;  //7$ l price la el seat
//movie comments
window.movieComments = {};
$(function () {
    window.movieComments = window.movieComments || {};
    // comments lal movies in bookings
let bookingMovieComments = {
  "The Running Man": [
      {
        user: "user1",
        rating: 5,
        text: "Great movie, def recommend!"
      },
      {
        user: "movieFan99",
        rating: 4,
        text: "Loved the show concept and action."
      },
      {
        user: "retroAddict",
        rating: 5,
        text: "Pure 80s chaos in the best way."
      }
    ],

  "Predator:Badlands": [
      {
        user: "sciFiNerd",
        rating: 4,
        text: "Cool expansion of the Predator universe."
      }
    ],

  "HardaBasht": [
      {
        user: "beirutWatcher",
        rating: 5,
        text: "Hits hard. Really good Lebanese drama."
      }
    ],

  "Jujutsu Kaisen:Execution": [
      {
        user: "animeFan",
        rating: 5,
        text: "Peak JJK energy, fights are insane."
      }
    ],

  "Playdate": [
      {
        user: "dadJokes",
        rating: 4,
        text: "Weird but fun, loved the dynamic."
      }
    ],

  "El Selem W El Thoban": [
      {
        user: "dramaQueen",
        rating: 5,
        text: "Beautiful story, really liked the chemistry."
      }
    ]
};
    // Merge booking movie comments into global movieComments kermel el render te2dar testa3mela
    Object.entries(bookingMovieComments).forEach(([title, comments]) => {
    // if title already exists from movies.json, we append
    let existing = window.movieComments[title] || [];
    window.movieComments[title] = existing.concat(comments);
  });

    let $gallery = $("#gallery");

    $.getJSON("../data/movies.json")
        .done(function (data) {
            if (!$gallery.length) return;
            $gallery.empty();

            if (!data || !Array.isArray(data.categories)) {
                console.error("movies.json: 'categories' is missing or not an array.");
                return;
            }

            data.categories.forEach(category => {
                // Create the category section
                let $section = $(`
          <section class="movies-cat">
            <h3>${category.name}</h3>
            <div class="movie"></div>
          </section>
        `);

                let $row = $section.find(".movie");

                // Add each movie card
                (category.movies || []).forEach(movie => {
                    let rating = movie.rating ?? "N/A";

                    let $card = $(`
            <figure class="movie-card">
              <img src="${movie.image}" alt="${movie.title} poster">
              <figcaption>${movie.title}</figcaption>
            </figure>`
                    );

                    // Data attributes so script.js can use them
                    $card.attr("data-movie-id", movie.id || "");
                    $card.attr("data-title", movie.title || "");
                    $card.attr("data-description", movie.description || "");
                    $card.attr("data-trailer-id", movie.trailerId || "");
                    $card.attr("data-rating", rating);
                    $card.attr("data-cast", (movie.cast || []).join(", "));
                    $card.attr("data-genres", (movie.genres || []).join(", "));
                    $card.attr("data-this-movie-is", (movie.thisMovieIs || []).join(", "));
                    // Store comments globally
                    if (Array.isArray(movie.comments)) {
                        window.movieComments[movie.title] = movie.comments;
                    }
                    // Rating overlay
                    let $overlay = $(
                        `<span class="rating-overlay">${rating} / 5 ★</span>`
                    );
                    $card.append($overlay);

                    $row.append($card);
                });

                $gallery.append($section);
            });
        })
        .fail(function (jqxhr, textStatus, error) {
            console.error("Failed to load movies.json:", textStatus, error);
        });
    //seat selection
    function appendSeats(seats, rowType) {
        let row = $("." + rowType)
        for (let i = 1; i <= seats; i++) {
            let seat = $("<div>")
            seat.addClass("seat");
            seat.attr("data-seat-id", rowType + "-" + i)
            row.append(seat);
        }
    }

    function getRandomSeats(seats, count) {
        let shuffledSeats = seats.toArray().sort(() => 0.5 - Math.random());
        return shuffledSeats.slice(0, count);
    }
    function markRandomSeats(SEATS_RESERVED) {
        let totalSeats = $(".seat");
        let reservedSeats = getRandomSeats(totalSeats, SEATS_RESERVED);
        reservedSeats.forEach(seat => {
            $(seat).addClass("reserved");
        });
    }
    let SEATS_RESERVED = 10;
    //instead of adding div aa kel wehde mennon
    appendSeats(10, "first-front-row");
    appendSeats(14, "second-front-row");
    appendSeats(80, "middle-row");
    appendSeats(14, "second-last-row");
    appendSeats(12, "first-last-row");


    markRandomSeats(SEATS_RESERVED);
    //for selecting seats


    $(document).on("click", ".seat:not(.reserved)", function () {
        $(this).toggleClass("selected");

        let id = $(this).data("seat-id");

        if ($(this).hasClass("selected")) {
            selectedSeats.add(id);
        } else {
            selectedSeats.delete(id);
        }

        updateReserveBtn();
    });

    function updateReserveBtn() {
        $("#reserveBtn").prop("disabled", selectedSeats.size === 0);
    }

    updateReserveBtn();

    //login 

    let users = [
        { username: "Tasneem", password: "AbdAlkareem", img: "https://robohash.org/Amar", email: "tasneem@gmail.com", id: 2025001, since: 2023, watchlist: [], booking: [], },
        { username: "Amar", password: "444", img: "https://robohash.org/tasneem", email: "Amar444@gmail.com", id: 2025002, since: 2024, watchlist: [], booking: [] },
        { username: "roaa", password: "soloh", img: "https://robohash.org/roaa", email: "roaasoloh@gmail.com", id: 2025003, since: 2024, watchlist: [], booking: [] },
    ];

    let currentUser = null;

    $(document).ready(function () {
        let $loginPanel = $('.login');
        let loggedInUser = sessionStorage.getItem('loggedInUser');

        if (loggedInUser) {
            $loginPanel.hide();
            if (typeof loadWatchlist === 'function') {
                loadWatchlist();
            }
        } else {
            $loginPanel.css('display', 'flex');
        }
        $('.login-form').on('submit', function (e) {
            e.preventDefault();

            let enteredUsername = $('#username').val().trim();
            let enteredPassword = $('#password').val();

            let matchedUser = users.find(user =>
                user.username === enteredUsername && user.password === enteredPassword
            );

            if (matchedUser) {
                currentUser = matchedUser.username;

                // CRITICAL: Initialize the user's watchlist array from localStorage
                let savedWatchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
                let userWatchlist = savedWatchlist.filter(movie => movie.username === matchedUser.username);

                // Ensure the user object has the watchlist array
                matchedUser.watchlist = userWatchlist;
                sessionStorage.setItem('loggedInUser', JSON.stringify(matchedUser));
                 // Hide login panel
                $loginPanel.fadeOut();
                if (typeof loadWatchlist === 'function') {
                    loadWatchlist();
                }
            } else {
                alert("Invalid username or password");
            }
        });
    });

});
let current = 1;
function showStep(n) {
    let btn = $("#btn" + n);
    if (!btn.hasClass("enabled")) {
        return;
    }
    $(".step-content").removeClass("default");
    $("#step" + n).addClass("default");

    $(".stepsbtn").removeClass("default");
    btn.addClass("default");
    current = n;
}
function completeStep() {
    let next = current + 1;
    if (current === 4) {
        let count = selectedSeats.size;
        let total = count * SEAT_PRICE;

        $("#TotalPrice").html(`
            <p><strong>Seats Selected:</strong> ${count}</p>
            <p><strong>Total Price:</strong> $${total}</p>
            <hr>
        `);

        // Store totals so Step 5 can save them
        sessionStorage.setItem("selectedSeats", JSON.stringify([...selectedSeats]));
        sessionStorage.setItem("totalPrice", total);
    }
    if (next <= 5) {
        let nextBtn = $("#btn" + next);
        nextBtn.addClass("enabled");
        nextBtn.css("cursor", "pointer");

        showStep(next);
    }
}

// confirm booing
$("#confirmbtn").on("click", function () {
    let userData = sessionStorage.getItem("loggedInUser");

    let userObj = JSON.parse(userData);
    let username = userObj.username;
    let cinema = $("#cinemasSelect").val();
    let movie = $("#movieselect").val();
    let date = $("#dateselect").val();
    let time = $("#timeselect").val();
    let name = $("#Name").val();
    let card = $("#CardNumber").val();
    let cvv = $("#CVV").val();
    let phone = $("#PhoneNumber").val();
    let seats = JSON.parse(sessionStorage.getItem("selectedSeats")) || [];
    let price = sessionStorage.getItem("totalPrice") || 0;


    if (!name.trim()) {
        $("#confirmation").html(`<span style="color:red">Please enter your full name.</span>`);
        return;
    }
    if (!phone.trim()) {
        $("#confirmation").html(`<span style="color:red">Please enter your Phone Number.</span>`);
        return;
    }
    if (!card.trim()) {
        $("#confirmation").html(`<span style="color:red">Please enter your card number.</span>`);
        return;
    }
    if (!cvv.trim()) {
        $("#confirmation").html(`<span style="color:red">Please enter your CVV.</span>`);
        return;
    }
    // byekhdo aa step 3
    if (!date) {
        $("#confirmation").html(
            `<span style="color:red">Please choose a date. Returning to Step 3...</span>`
        );
        setTimeout(() => showStep(3), 800);
        return;
    }

    let booking = { name, cinema, movie, date, time, seats, price };
    let allBookings = JSON.parse(localStorage.getItem("bookings")) || {};

    if (!allBookings[username]) {
        allBookings[username] = [];
    }

    allBookings[username].push(booking);
    localStorage.setItem("bookings", JSON.stringify(allBookings));


    console.log(allBookings);
    // Disable l confirm button 
    let $confirmBtn = $("#confirmbtn");
    $confirmBtn.prop("disabled", true);
    $confirmBtn.text("Processing...");
     $("#confirmation").html(`
        <p style="margin-top:8px;font-size:0.95rem;opacity:0.9;">
          Processing your booking, please wait...
        </p>
    `);
    setTimeout(() => {
             $("#confirmation").html(`
        <p>Thank you, <strong>${name}</strong>!</p>
        <p>Your booking is confirmed:</p>
        <ul style="margin-left:15px;">
            <li><strong>Movie:</strong> ${movie}</li>
            <li><strong>Date:</strong> ${date}</li>
            <li><strong>Time:</strong> ${time}</li>
            <li><strong>Cinema:</strong> ${cinema}</li>
            <li><strong>Seats:</strong> ${seats.join(", ")}</li>
            <li><strong>Total Price:</strong> $${price}</li>
        </ul>
        <p style="color:#7a5cff;">Enjoy your movie!</p>
    `); 
         //small msg tahet l confirm
    $("#confirmation").append(`
        <p style="margin-top:8px;font-size:0.9rem;opacity:0.8; color:red;">
        Going back to Step 1 so you can make another booking in 10 seconds...
        </p>
    `);
    // After 10 secs, reset w back to Step 1
    setTimeout(() => {
        //clear
        $("#Name, #Email, #PhoneNumber, #CardNumber, #CVV").val("");
        $("#TotalPrice").empty();
        $("#confirmation").empty();
        $("#movieselect").prop("selectedIndex", 0); 
        $("#dateselect").val("");                 
        $("#timeselect").prop("selectedIndex", 0);
        $("#cinemasSelect").prop("selectedIndex", 0);
        // Reset seats
        selectedSeats.clear();
        $(".seat.selected").removeClass("selected");
        sessionStorage.removeItem("selectedSeats");
        sessionStorage.removeItem("totalPrice");
        $("#reserveBtn").prop("disabled", true);

        // Reset
        $(".stepsbtn").removeClass("default enabled").css("cursor", "default");
        $("#btn1").addClass("default enabled").css("cursor", "pointer");
        $(".step-content").removeClass("default");
        $("#step1").addClass("default");
        current = 1;
        showStep(1);
        //10 secs
        $confirmBtn.prop("disabled", false);
        $confirmBtn.text("Confirm");
        }, 10000); 
    }, 3000); // Simulate processing delay
});


