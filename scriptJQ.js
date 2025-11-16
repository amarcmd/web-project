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
    appendSeats(12, "first-front-row");
    appendSeats(14, "second-front-row");
    appendSeats(96, "middle-row");
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