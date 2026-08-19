/* =====================================================
   MARIDIAN '26
   REGISTRATION LANDING PAGE
===================================================== */


document.addEventListener("DOMContentLoaded", function () {


    /* =================================================
       REGISTRATION BUTTONS
    ================================================= */

    const registrationButtons =
        document.querySelectorAll(".register-choice-btn");


    registrationButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            console.log(
                "Opening registration:",
                this.textContent.trim()
            );

        });

    });


    /* =================================================
       NAVBAR SCROLL EFFECT
    ================================================= */

    window.addEventListener("scroll", function () {

        const navbar =
            document.querySelector(".navbar");


        if (!navbar) {
            return;
        }


        if (window.scrollY > 30) {

            navbar.style.background = "#050609";

            navbar.style.boxShadow =
                "0 8px 20px rgba(0,0,0,.25)";

        }

        else {

            navbar.style.background = "#050609";

            navbar.style.boxShadow =
                "0 5px 15px rgba(0,0,0,.25)";

        }

    });


});