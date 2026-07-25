/*=========================================================
    IMPORT FIREBASE AUTH
=========================================================*/

import { auth } from "./firebase.js";

import {
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";


/*=========================================================
    HTML ELEMENTS
=========================================================*/

const loginForm = document.getElementById("loginForm");

const email = document.getElementById("email");

const password = document.getElementById("password");

const loginError = document.getElementById("loginError");

const togglePassword = document.getElementById("togglePassword");


/*=========================================================
    SHOW / HIDE PASSWORD
=========================================================*/

togglePassword.addEventListener("click", function () {

    if (password.type === "password") {

        password.type = "text";

        this.innerHTML = '<i class="bi bi-eye-slash"></i>';

    }

    else {

        password.type = "password";

        this.innerHTML = '<i class="bi bi-eye"></i>';

    }

});


/*=========================================================
    ADMIN LOGIN
=========================================================*/

loginForm.addEventListener("submit", async function (e) {

    e.preventDefault();

    loginError.classList.add("d-none");

    try {

        await signInWithEmailAndPassword(

            auth,

            email.value.trim(),

            password.value

        );

        alert("Login Successful!");

        window.location.href = "admin.html";

    }

    catch (error) {

        console.error(error);

        loginError.textContent = "Invalid email or password.";

        loginError.classList.remove("d-none");

    }

});