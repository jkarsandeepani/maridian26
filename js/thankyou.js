/*=========================================================
    GLOBAL VILLAGE 5.0
    THANK YOU PAGE
=========================================================*/


/*=========================================================
    DISPLAY REGISTERED USER NAME
=========================================================*/

document.addEventListener("DOMContentLoaded", function () {

    // Get user name from localStorage

    const userName = localStorage.getItem("userName");

    // Display name

    if (userName && userName.trim() !== "") {

        document.getElementById("username").textContent = userName;

    } else {

        document.getElementById("username").textContent = "Guest";

    }

});


/*=========================================================
    EVENT COUNTDOWN
=========================================================*/

// Event Date
const eventDate = new Date("August 20, 2026 09:00:00").getTime();


// Update every second

const countdown = setInterval(function () {

    const now = new Date().getTime();

    const distance = eventDate - now;


    // Time calculations

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));

    const hours = Math.floor(

        (distance % (1000 * 60 * 60 * 24))

        / (1000 * 60 * 60)

    );

    const minutes = Math.floor(

        (distance % (1000 * 60 * 60))

        / (1000 * 60)

    );

    const seconds = Math.floor(

        (distance % (1000 * 60))

        / 1000

    );


    // Display countdown

    document.getElementById("days").textContent = days;

    document.getElementById("hours").textContent = hours;

    document.getElementById("minutes").textContent = minutes;

    document.getElementById("seconds").textContent = seconds;


    // Event Started

    if (distance < 0) {

        clearInterval(countdown);

        document.getElementById("days").textContent = "00";

        document.getElementById("hours").textContent = "00";

        document.getElementById("minutes").textContent = "00";

        document.getElementById("seconds").textContent = "00";

        document.querySelector(".countdown-heading").innerHTML =
            "🎉 Global Village 5.0 Has Started!";

    }

}, 1000);



/*=========================================================
    NAVBAR SCROLL EFFECT
=========================================================*/

window.addEventListener("scroll", function () {

    const navbar = document.querySelector(".navbar");

    if (window.scrollY > 50) {

        navbar.style.background = "rgba(10,20,40,.95)";

        navbar.style.backdropFilter = "blur(15px)";

    }

    else {

        navbar.style.background = "rgba(0,0,0,.45)";

    }

});



/*=========================================================
    BUTTON ANIMATION
=========================================================*/

const buttons = document.querySelectorAll(".btn");

buttons.forEach(function (button) {

    button.addEventListener("mouseenter", function () {

        this.style.transform = "translateY(-5px)";

    });

    button.addEventListener("mouseleave", function () {

        this.style.transform = "translateY(0px)";

    });

});



/*=========================================================
    FADE IN EFFECT
=========================================================*/

window.addEventListener("load", function () {

    const card = document.querySelector(".thankyou-card");

    card.style.opacity = "0";

    card.style.transform = "translateY(50px)";

    card.style.transition = "1s";

    setTimeout(function () {

        card.style.opacity = "1";

        card.style.transform = "translateY(0)";

    }, 300);

});