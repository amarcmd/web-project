//bookings
let selectedSeats = new Set();
const SEAT_PRICE = 7;  //7$ l price la el seat

$(function(){
    function appendSeats(seats, rowType ){
        const row= $("." + rowType)
        for(let i=1;i<=seats;i++){
            const seat= $("<div>")
            seat.addClass("seat");
            seat.attr("data-seat-id", rowType + "-" +i)
            row.append(seat);
        }
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

   
    markRandomSeats(SEATS_RESERVED);
    //for selecting seats
 

    $(document).on("click", ".seat:not(.reserved)", function () {
        $(this).toggleClass("selected");

        const id = $(this).data("seat-id");

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

    updateReserveBtn(); // disable at start

//login 

let users = [
    { username: "Tasneem", password: "AbdAlkareem" ,img:"https://robohash.org/Amar",email:"tasneem@gmail.com",id:2025001,watchlist:[]},
    { username: "Amar", password: "444" ,img:"https://robohash.org/tasneem",email:"Amar444@gmail.com",id:2025002,watchlist:[]},
    { username: "roaa", password: "soloh",img:"https://robohash.org/roaa",email:"roaasoloh@gmail.com",id:2025003,watchlist:[] },
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
        e.preventDefault(); 

        const enteredUsername = $('#username').val().trim();
        const enteredPassword = $('#password').val();

        const matchedUser = users.find(user =>
            user.username === enteredUsername && user.password === enteredPassword
            
        );

        if (matchedUser) {
            currentUser = matchedUser.username;
           sessionStorage.setItem('loggedInUser', JSON.stringify(matchedUser));

            // Hide login panel
            $loginPanel.fadeOut(); // Smooth hide


           
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
        if (current === 4) {
        const count = selectedSeats.size;
        const total = count * SEAT_PRICE;

        $("#TotalPrice").html(`
            <p><strong>Seats Selected:</strong> ${count}</p>
            <p><strong>Total Price:</strong> $${total}</p>
            <hr>
        `);

        // Store totals so Step 5 can save them
        sessionStorage.setItem("selectedSeats", JSON.stringify([...selectedSeats]));
        sessionStorage.setItem("totalPrice", total);
        }
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
    const card = $("#CardNumber").val();
    const cvv = $("#CVV").val();
    const phone =$("#PhoneNumber").val();
    const seats = JSON.parse(sessionStorage.getItem("selectedSeats")) || [];
    const price = sessionStorage.getItem("totalPrice") || 0;

    if (!user) {
        $("#confirmation").html(
            `<span>You must be logged in to confirm a booking.</span>`
        );
        return;
    }

    if (!name.trim()) {
        $("#confirmation").html(`<span style="color:red">Please enter your full name.</span>`);
        return;  
    }
    if(!phone.trim()){
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
            <li><strong>Seats:</strong> ${seats.join(", ")}</li>
            <li><strong>Total Price:</strong> $${price}</li>
        </ul>
        <p style="color:#7a5cff;">Enjoy your movie!</p>
    `);
    console.log(allBookings);
});



