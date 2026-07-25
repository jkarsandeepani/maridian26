import { db, collection, addDoc } from "./firebase.js";


/*=========================================================
    GLOBAL VILLAGE 5.0
    REGISTER PAGE JAVASCRIPT
=========================================================*/

document.addEventListener("DOMContentLoaded", function () {

    // Get the form
    const form = document.getElementById("registrationForm");

    // Submit Event
    form.addEventListener("submit", async function (event) {

        // Stop form from submitting immediately
        event.preventDefault();

        /*=========================================
            GET FORM VALUES
        =========================================*/

        const fullName = document.getElementById("fullname").value.trim();

        const phone = document.getElementById("phone").value.trim();

        const email = document.getElementById("email").value.trim();

        const age = document.getElementById("age").value;

        const batch = document.getElementById("batch").value.trim();



        const shirt = document.getElementById("shirt").value;

        const diet = document.getElementById("diet").value.trim();

        const emergencyName = document.getElementById("emergencyName").value.trim();

        const emergencyPhone = document.getElementById("emergencyPhone").value.trim();

        const message = document.getElementById("message").value.trim();

        const agree = document.getElementById("agree").checked;

        /*=========================================
            REQUIRED FIELD CHECK
        =========================================*/

        if (
            fullName === "" ||
            phone === "" ||
            email === "" ||
            age === "" ||
            batch=== "" ||
            shirt === "" ||
            emergencyName === "" ||
            emergencyPhone === ""
        ) {

            alert("Please fill in all required fields.");

            return;

        }

        /*=========================================
            EMAIL VALIDATION
        =========================================*/

        const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;

        if (!email.match(emailPattern)) {

            alert("Please enter a valid email address.");

            return;

        }

        /*=========================================
            SRI LANKAN PHONE VALIDATION
        =========================================*/

        const phonePattern = /^(07)[0-9]{8}$/;

        if (!phone.match(phonePattern)) {

            alert("Enter a valid Sri Lankan mobile number.");

            return;

        }

        if (!emergencyPhone.match(phonePattern)) {

            alert("Enter a valid emergency contact number.");

            return;

        }

        /*=========================================
            TERMS CHECK
        =========================================*/

        if (!agree) {

            alert("Please agree to the Terms & Conditions.");

            return;

        }

        /*=========================================
            SUCCESS MESSAGE
        =========================================*/

   /*=========================================
    SAVE DATA TO FIREBASE
=========================================*/

try {

    await addDoc(collection(db, "registrations"), {

        fullName: fullName,

        phone: phone,

        email: email,

        age: age,

        batch:batch,

    

        shirt: shirt,

        diet: diet,

        emergencyName: emergencyName,

        emergencyPhone: emergencyPhone,

        message: message,

        registeredAt: new Date()

    });

    // Save name for Thank You page
    localStorage.setItem("userName", fullName);

    // Redirect
    window.location.href = "../html/thankyou.html";

}

catch (error) {

    console.error("Firebase Error:", error);

    alert("Registration failed. Please try again.");

}

        /*=========================================
            RESET FORM
        =========================================*/

        form.reset();

    });

});


/*=========================================================
    NAVBAR SCROLL EFFECT
=========================================================*/

window.addEventListener("scroll", function () {

    const navbar = document.querySelector(".navbar");

    if (window.scrollY > 30) {

        navbar.style.background = "#0f172a";

        navbar.style.boxShadow = "0 8px 20px rgba(0,0,0,.2)";

    }

    else {

        navbar.style.background = "#111827";

        navbar.style.boxShadow = "0 5px 15px rgba(0,0,0,.1)";

    }

});


/*=========================================================
    INPUT FOCUS EFFECT
=========================================================*/

const inputs = document.querySelectorAll(".form-control, .form-select");

inputs.forEach(function(input){

    input.addEventListener("focus", function(){

        this.style.transform = "scale(1.02)";

    });

    input.addEventListener("blur", function(){

        this.style.transform = "scale(1)";

    });

});


/*=========================================================
    CHARACTER COUNTER FOR MESSAGE
=========================================================*/

const messageBox = document.getElementById("message");

if(messageBox){

    messageBox.addEventListener("input", function(){

        console.log("Characters : " + this.value.length);

    });

}