/* =========================================================
   MARIDIAN '26
   DELEGATE REGISTRATION JAVASCRIPT
========================================================= */


/* =========================================================
   IMPORT FIREBASE
========================================================= */

import {
    db,
    collection,
    addDoc
} from "./firebase.js";


/* =========================================================
   DOM CONTENT LOADED
========================================================= */

document.addEventListener("DOMContentLoaded", function () {


    /* =====================================================
       REGISTRATION FORM
    ===================================================== */

    const form =
        document.getElementById(
            "delegateRegistrationForm"
        );


    if (!form) {

        console.error(
            "Delegate registration form not found."
        );

        return;

    }


    /* =====================================================
       FORM SUBMISSION
    ===================================================== */

    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            /* =================================================
               GET FORM VALUES
            ================================================= */

            const fullName =
                document.getElementById(
                    "fullName"
                ).value.trim();


            const phone =
                document.getElementById(
                    "phone"
                ).value.trim();


            const email =
                document.getElementById(
                    "email"
                ).value.trim();


            const facultyBatch =
                document.getElementById(
                    "facultyBatch"
                ).value.trim();


            const agree =
                document.getElementById(
                    "agree"
                ).checked;



            /* =================================================
               REQUIRED FIELD CHECK
            ================================================= */

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



            /* =================================================
               DECLARATION CHECK
            ================================================= */

            if (!agree) {

                alert(
                    "Please accept the declaration before submitting."
                );

                return;

            }



            /* =================================================
               EMAIL VALIDATION
            ================================================= */

            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


            if (!emailPattern.test(email)) {

                alert(
                    "Please enter a valid email address."
                );

                return;

            }



            /* =================================================
               SRI LANKAN PHONE VALIDATION
            ================================================= */

            const phonePattern =
                /^07[0-9]{8}$/;


            if (!phonePattern.test(phone)) {

                alert(
                    "Please enter a valid Sri Lankan mobile number."
                );

                return;

            }



            /* =================================================
               SAVE TO FIREBASE
            ================================================= */

            try {

                await addDoc(
                    collection(
                        db,
                        "registrations"
                    ),
                    {

                        /* Registration Type */

                        registrationType:
                            "delegate",


                        /* Basic Information */

                        fullName:
                            fullName,

                        phone:
                            phone,

                        email:
                            email,

                        facultyBatch:
                            facultyBatch,


                        /* Declaration */

                        declaration:
                            agree,


                        /* Registration Date */

                        registeredAt:
                            new Date()

                    }
                );


                /* =============================================
                   SAVE NAME FOR THANK YOU PAGE
                ============================================= */

                localStorage.setItem(
                    "userName",
                    fullName
                );


                /* =============================================
                   SUCCESS MESSAGE
                ============================================= */

                alert(
                    "Delegate registration submitted successfully!"
                );


                /* =============================================
                   GO TO THANK YOU PAGE
                ============================================= */

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

        }
    );



    /* =====================================================
       NAVBAR SCROLL EFFECT
    ===================================================== */

    window.addEventListener(
        "scroll",
        function () {

            const navbar =
                document.querySelector(
                    ".navbar"
                );


            if (!navbar) {

                return;

            }


            if (window.scrollY > 30) {

                navbar.style.background =
                    "#0f172a";

                navbar.style.boxShadow =
                    "0 8px 20px rgba(0,0,0,.2)";

            }

            else {

                navbar.style.background =
                    "#111827";

                navbar.style.boxShadow =
                    "0 5px 15px rgba(0,0,0,.1)";

            }

        }
    );



    /* =====================================================
       INPUT FOCUS EFFECT
    ===================================================== */

    const inputs =
        document.querySelectorAll(
            ".form-control"
        );


    inputs.forEach(
        function (input) {

            input.addEventListener(
                "focus",
                function () {

                    this.style.transform =
                        "scale(1.02)";

                }
            );


            input.addEventListener(
                "blur",
                function () {

                    this.style.transform =
                        "scale(1)";

                }
            );

        }
    );


});