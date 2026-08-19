/* ======================================================
   MARIDIAN '26 — DELEGATE REGISTRATION
====================================================== */

import {
    db,
    collection,
    addDoc
} from "./firebase.js";


/* ======================================================
   FORM
====================================================== */

const form = document.getElementById(
    "delegateRegistrationForm"
);


if (form) {

    form.addEventListener("submit", async function (event) {

        event.preventDefault();


        /* ==================================================
           GET VALUES
        ================================================== */

        const fullName =
            document.getElementById("fullName").value.trim();

        const phone =
            document.getElementById("phone").value.trim();

        const email =
            document.getElementById("email").value.trim();

        const facultyBatch =
            document.getElementById("facultyBatch").value.trim();

        const agree =
            document.getElementById("agree").checked;


        /* ==================================================
           REQUIRED FIELD CHECK
        ================================================== */

        if (
            fullName === "" ||
            phone === "" ||
            email === "" ||
            facultyBatch === ""
        ) {

            alert(
                "Please fill in all required fields."
            );

            return;

        }


        /* ==================================================
           EMAIL VALIDATION
        ================================================== */

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (!emailPattern.test(email)) {

            alert(
                "Please enter a valid email address."
            );

            return;

        }


        /* ==================================================
           SRI LANKAN PHONE VALIDATION
        ================================================== */

        const phonePattern =
            /^07[0-9]{8}$/;


        if (!phonePattern.test(phone)) {

            alert(
                "Please enter a valid Sri Lankan mobile number."
            );

            return;

        }


        /* ==================================================
           DECLARATION CHECK
        ================================================== */

        if (!agree) {

            alert(
                "Please agree to the declaration before registering."
            );

            return;

        }


        /* ==================================================
           SAVE TO FIREBASE
        ================================================== */

        try {

            await addDoc(
                collection(db, "registrations"),
                {

                    registrationType: "Delegate",

                    fullName: fullName,

                    phone: phone,

                    email: email,

                    facultyBatch: facultyBatch,

                    registeredAt: new Date()

                }
            );


            /* ==============================================
               SAVE NAME FOR THANK YOU PAGE
            ============================================== */

            localStorage.setItem(
                "userName",
                fullName
            );


            localStorage.setItem(
                "registrationType",
                "delegate"
            );


            /* ==============================================
               REDIRECT
            ============================================== */

            window.location.href =
                "thankyou.html";


        }

        catch (error) {

            console.error(
                "Firebase Error:",
                error
            );

            alert(
                "Registration failed. Please try again."
            );

        }

    });

}


/* ======================================================
   NAVBAR SCROLL EFFECT
====================================================== */

window.addEventListener(
    "scroll",
    function () {

        const navbar =
            document.querySelector(".navbar");


        if (!navbar) return;


        if (window.scrollY > 30) {

            navbar.style.background =
                "#0f172a";

            navbar.style.boxShadow =
                "0 8px 20px rgba(0,0,0,.2)";

        }

        else {

            navbar.style.background =
                "#050609";

            navbar.style.boxShadow =
                "0 5px 15px rgba(0,0,0,.25)";

        }

    }
);


/* ======================================================
   INPUT FOCUS EFFECT
====================================================== */

const inputs =
    document.querySelectorAll(
        ".form-control"
    );


inputs.forEach(function (input) {

    input.addEventListener(
        "focus",
        function () {

            this.style.transform =
                "scale(1.01)";

        }
    );


    input.addEventListener(
        "blur",
        function () {

            this.style.transform =
                "scale(1)";

        }
    );

});