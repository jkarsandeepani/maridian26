/* =========================================================
   MARIDIAN '26
   INDIVIDUAL REGISTRATION JAVASCRIPT
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
            "individualRegistrationForm"
        );


    if (!form) {

        console.error(
            "Individual registration form not found."
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
               BASIC INFORMATION
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


            const faculty =
                document.getElementById(
                    "faculty"
                ).value.trim();


            const batch =
                document.getElementById(
                    "batch"
                ).value.trim();


            const studentId =
                document.getElementById(
                    "studentId"
                ).value.trim();



            /* =================================================
               COOKING EXPERIENCE
            ================================================= */

            const cookingExperience =
                document.getElementById(
                    "cookingExperience"
                ).value;


            /* -------------------------------------------------
               FOOD TYPES
            ------------------------------------------------- */

            const foodTypeElements =
                document.querySelectorAll(
                    ".food-type:checked"
                );


            const foodTypes = [];


            foodTypeElements.forEach(
                function (item) {

                    foodTypes.push(
                        item.value
                    );

                }
            );


            const otherFood =
                document.getElementById(
                    "otherFood"
                ).value.trim();


            /* -------------------------------------------------
               COOKING SPECIALITY
            ------------------------------------------------- */

            const specialityElement =
                document.querySelector(
                    'input[name="speciality"]:checked'
                );


            const speciality =
                specialityElement
                    ? specialityElement.value
                    : "";


            const specialityDetails =
                document.getElementById(
                    "specialityDetails"
                ).value.trim();


            /* -------------------------------------------------
               COOKING COMPETITION
            ------------------------------------------------- */

            const competitionElement =
                document.querySelector(
                    'input[name="competition"]:checked'
                );


            const competition =
                competitionElement
                    ? competitionElement.value
                    : "";



            /* =================================================
               FOOD SAFETY
            ================================================= */

            /* -------------------------------------------------
               ALLERGY
            ------------------------------------------------- */

            const allergyElement =
                document.querySelector(
                    'input[name="allergy"]:checked'
                );


            const allergy =
                allergyElement
                    ? allergyElement.value
                    : "";


            const allergyDetails =
                document.getElementById(
                    "allergyDetails"
                ).value.trim();


            /* -------------------------------------------------
               DIETARY RESTRICTIONS
            ------------------------------------------------- */

            const dietaryElement =
                document.querySelector(
                    'input[name="dietary"]:checked'
                );


            const dietary =
                dietaryElement
                    ? dietaryElement.value
                    : "";


            const dietaryDetails =
                document.getElementById(
                    "dietaryDetails"
                ).value.trim();


            /* -------------------------------------------------
               FOOD SAFETY NOTES
            ------------------------------------------------- */

            const foodSafetyNotes =
                document.getElementById(
                    "foodSafetyNotes"
                ).value.trim();



            /* =================================================
               FINAL DETAILS
            ================================================= */

            const lookingForward =
                document.getElementById(
                    "lookingForward"
                ).value;


            const additionalComments =
                document.getElementById(
                    "additionalComments"
                ).value.trim();



            /* =================================================
               MEDIA CONSENT
            ================================================= */

            const mediaConsentElement =
                document.querySelector(
                    'input[name="mediaConsent"]:checked'
                );


            const mediaConsent =
                mediaConsentElement
                    ? mediaConsentElement.value
                    : "";



            /* =================================================
               DECLARATION
            ================================================= */

            const declaration =
                document.getElementById(
                    "declaration"
                ).checked;



            /* =================================================
               REQUIRED FIELD VALIDATION
            ================================================= */

            if (
                fullName === "" ||
                phone === "" ||
                email === "" ||
                faculty === "" ||
                batch === "" ||
                studentId === "" ||
                cookingExperience === "" ||
                speciality === "" ||
                competition === "" ||
                allergy === "" ||
                dietary === "" ||
                lookingForward === "" ||
                mediaConsent === ""
            ) {

                alert(
                    "Please complete all required fields."
                );

                return;

            }



            /* =================================================
               FOOD TYPE VALIDATION
            ================================================= */

            if (foodTypes.length === 0) {

                alert(
                    "Please select at least one food type."
                );

                return;

            }



            /* =================================================
               EMAIL VALIDATION
            ================================================= */

            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


            if (
                !emailPattern.test(email)
            ) {

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


            if (
                !phonePattern.test(phone)
            ) {

                alert(
                    "Please enter a valid Sri Lankan mobile number."
                );

                return;

            }



            /* =================================================
               DECLARATION CHECK
            ================================================= */

            if (!declaration) {

                alert(
                    "Please accept the declaration before submitting."
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

                        /* =====================================
                           REGISTRATION INFORMATION
                        ===================================== */

                        registrationType:
                            "individual",


                        /* =====================================
                           BASIC INFORMATION
                        ===================================== */

                        fullName:
                            fullName,

                        phone:
                            phone,

                        email:
                            email,

                        faculty:
                            faculty,

                        batch:
                            batch,

                        studentId:
                            studentId,


                        /* =====================================
                           COOKING EXPERIENCE
                        ===================================== */

                        cookingExperience:
                            cookingExperience,

                        foodTypes:
                            foodTypes,

                        otherFood:
                            otherFood,

                        speciality:
                            speciality,

                        specialityDetails:
                            specialityDetails,

                        competition:
                            competition,


                        /* =====================================
                           FOOD SAFETY
                        ===================================== */

                        allergy:
                            allergy,

                        allergyDetails:
                            allergyDetails,

                        dietary:
                            dietary,

                        dietaryDetails:
                            dietaryDetails,

                        foodSafetyNotes:
                            foodSafetyNotes,


                        /* =====================================
                           FINAL DETAILS
                        ===================================== */

                        lookingForward:
                            lookingForward,

                        additionalComments:
                            additionalComments,


                        /* =====================================
                           MEDIA CONSENT
                        ===================================== */

                        mediaConsent:
                            mediaConsent,


                        /* =====================================
                           DECLARATION
                        ===================================== */

                        declaration:
                            declaration,


                        /* =====================================
                           REGISTRATION DATE
                        ===================================== */

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
                    "Individual registration submitted successfully!"
                );


                /* =============================================
                   REDIRECT TO THANK YOU PAGE
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
       INPUT FOCUS EFFECT
    ===================================================== */

    const inputs =
        document.querySelectorAll(
            ".form-control, .form-select"
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



    /* =====================================================
       CART COUNT
    ===================================================== */

    const cartCount =
        document.getElementById(
            "cartCount"
        );


    if (cartCount) {

        const cart =
            JSON.parse(
                localStorage.getItem(
                    "cart"
                )
            ) || [];


        let totalItems = 0;


        cart.forEach(
            function (item) {

                totalItems +=
                    Number(
                        item.quantity
                    ) || 0;

            }
        );


        cartCount.textContent =
            totalItems;

    }

});