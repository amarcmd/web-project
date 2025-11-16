//bookings
$(function(){
    function appendSeats(seats, rowType ){
        const row= $("." + rowType)
        for(let i=1;i<=seats;i++){
            const seat= $("<div>")
            seat.addClass("seat");
            seat.appendTo(row);
        }
    }
    function selectSeats(){
        const seat = $(".seat");
        seat.on("click", function(){
            $(this).toggleClass("selected");
            });
    }
    function getRandomSeats(seats,count){
        let shuffledSeats = seats.toArray().sort(()=> 0.5-Math.random());
        return shuffledSeats.slice(0,count);
    }
    function markRandomSeats(SEATS_RESERVED){
    const totalSeats =$(".seat");
    const reservedSeats = getRandomSeats(totalSeats,SEATS_RESERVED);
    reservedSeats.forEach(seat=>{
        $(seat).addClass("reserved");
    });
    }
    const SEATS_RESERVED = 10;
//instead of adding div aa kel wehde mennon
    appendSeats(10, "first-front-row");
    appendSeats(14, "second-front-row");
    appendSeats(80, "middle-row");
    appendSeats(14, "second-last-row");
    appendSeats(12, "first-last-row");

    selectSeats();
    markRandomSeats(SEATS_RESERVED);

//login 

let users = [
    { username: "Tasneem", password: "AbdAlkareem" },
    { username: "Amar", password: "444" },
    { username: "roaa", password: "soloh" },
];

let currentUser = null;

$(document).ready(function () {
    const $loginPanel = $('.login');
    const loggedInUser = sessionStorage.getItem('loggedInUser');

    if (loggedInUser) {
        $loginPanel.hide();
        if (typeof loadWatchlist === 'function') {
            loadWatchlist();
        }
    } else {
        $loginPanel.css('display', 'flex');
    }

    $('.login-form').on('submit', function (e) {
        e.preventDefault(); // Stop page reload

        const enteredUsername = $('#username').val().trim();
        const enteredPassword = $('#password').val();

        const matchedUser = users.find(user =>
            user.username === enteredUsername && user.password === enteredPassword
        );

        if (matchedUser) {
            currentUser = matchedUser.username;
            sessionStorage.setItem('loggedInUser', currentUser);

            // Hide login panel
            $loginPanel.fadeOut(); // Smooth hide

            // Clear inputs
            $('#username, #password').val('');

            // Load watchlist or show success
            if (typeof loadWatchlist === 'function') {
                loadWatchlist();
            } else {
                console.log("Logged in as " + currentUser);
            }
        } else {
            alert("Invalid username or password");
        }
    });
});

});
    let current=1;
    function showStep(n){
        const btn= $("#btn"+n);
        if(!btn.hasClass("enabled")) {
            return;
        }
        $(".step-content").removeClass("default");
        $("#step"+n).addClass("default");

        $(".stepsbtn").removeClass("default");
        btn.addClass("default");
        current=n;
    }
    function completeStep(){
        const next=current+1;
        if(next<=5){
            const nextBtn=$("#btn"+next);
            nextBtn.addClass("enabled");
            nextBtn.css("cursor", "pointer");

            showStep(next);
        }
    }
// confirm booing
$("#confirmbtn").on("click", function () {
    let user = sessionStorage.getItem("loggedInUser");
    const cinema = $("#cinemasSelect").val();
    const movie = $("#movieselect").val();
    const date = $("#dateselect").val();
    const time = $("#timeselect").val();
    const name = $("#Name").val();
    if (!user) {
        $("#confirmation").html(
            `<span>You must be logged in to confirm a booking.</span>`
        );
        return;
    }

    if (!name || !date) {
        $("#confirmation").html(
            `<span>Please enter your name and choose a date.</span>`
        );
        return;
    }

    const booking = {name, cinema, movie, date, time};
    let allBookings = JSON.parse(localStorage.getItem("bookings")) || {};

    if (!allBookings[user]) {
        allBookings[user] = [];
    }

    allBookings[user].push(booking);
    localStorage.setItem("bookings", JSON.stringify(allBookings));

    $("#confirmation").html(`
        <p>Thank you, <strong>${name}</strong>!</p>
        <p>Your booking is confirmed:</p>
        <ul style="margin-left:15px;">
            <li><strong>Movie:</strong> ${movie}</li>
            <li><strong>Date:</strong> ${date}</li>
            <li><strong>Time:</strong> ${time}</li>
            <li><strong>Cinema:</strong> ${cinema}</li>
        </ul>
        <p style="color:#7a5cff;">Enjoy your movie!</p>
    `);
    console.log(allBookings);
});



