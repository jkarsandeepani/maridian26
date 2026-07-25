/*=========================================================
     MARIDIAN WEBSITE
    script.js
=========================================================*/

/*=========================================================
    NAVBAR SCROLL EFFECT
=========================================================*/

window.addEventListener("scroll", function () {

    const navbar = document.querySelector(".navbar");

    if (window.scrollY > 50) {

        navbar.classList.add("scrolled");

    } else {

        navbar.classList.remove("scrolled");

    }

});


/*=========================================================
    ACTIVE NAVIGATION LINK
=========================================================*/

const navLinks = document.querySelectorAll(".nav-link");

navLinks.forEach(link => {

    link.addEventListener("click", function () {

        navLinks.forEach(item => {

            item.classList.remove("active");

        });

        this.classList.add("active");

    });

});


/*=========================================================
    SMOOTH SCROLL
=========================================================*/

document.querySelectorAll('a[href^="#"]').forEach(anchor => {

    anchor.addEventListener("click", function (e) {

        const target = document.querySelector(this.getAttribute("href"));

        if (target) {

            e.preventDefault();

            target.scrollIntoView({

                behavior: "smooth"

            });

        }

    });

});


/*=========================================================
    HERO CTA ANIMATION
=========================================================*/


window.addEventListener("load",()=>{


const heroButton=document.querySelector(".hero-main-btn");


if(heroButton){


heroButton.style.opacity="0";

heroButton.style.transform="translateY(40px)";


setTimeout(()=>{


heroButton.style.transition="1s";


heroButton.style.opacity="1";


heroButton.style.transform="translateY(0)";


},500);


}


});




/*=========================================================
    BACK TO TOP ON PAGE REFRESH
=========================================================*/

window.onbeforeunload = function () {

    window.scrollTo(0, 0);

};


// ==========================================
// PAGE LOADER
// ==========================================

window.addEventListener("load", () => {

    const loader = document.getElementById("loader");

    document.body.style.overflow = "hidden";

    setTimeout(() => {

        loader.style.opacity = "0";

        setTimeout(() => {

            loader.style.display = "none";

            document.body.style.overflow = "auto";

        },800);

    },3000);

});

/*=========================================================
    UPDATE CART COUNT
=========================================================*/

function updateCartCount() {

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    let totalItems = 0;

    cart.forEach(item => {

        totalItems += item.quantity;

    });

    const cartCount = document.getElementById("cartCount");

    if (cartCount) {

        cartCount.textContent = totalItems;

    }

}

updateCartCount();