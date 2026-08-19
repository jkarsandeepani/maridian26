
/* =========================================================
   MARIDIAN '26
   GROUP REGISTRATION JAVASCRIPT
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
       GROUP REGISTRATION FORM
    ===================================================== */

    const form =
        document.getElementById(
            "groupRegistrationForm"
        );


    if (!form) {

        console.error(
            "Group registration form not found."
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
               GROUP INFORMATION
            ================================================= */

            const groupName =
                document.getElementById(
                    "groupName"
                ).value.trim();


            /* =================================================
               GROUP REPRESENTATIVE
            ================================================= */

            const representativeName =
                document.getElementById(
                    "representativeName"
                ).value.trim();


            const representativePhone =
                document.getElementById(
                    "representativePhone"
                ).value.trim();


            const representativeEmail =
                document.getElementById(
                    "representativeEmail"
                ).value.trim();


            const representativeStudentId =
                document.getElementById(
                    "representativeStudentId"
                ).value.trim();


            const representativeBatch =
                document.getElementById(
                    "representativeBatch"
                ).value.trim();


            /* =================================================
               MEMBER 01
            ================================================= */

            const member1Name =
                document.getElementById(
                    "member1Name"
                ).value.trim();


            const member1Phone =
                document.getElementById(
                    "member1Phone"
                ).value.trim();


            const member1FacultyBatch =
                document.getElementById(
                    "member1FacultyBatch"
                ).value.trim();


            const member1StudentId =
                document.getElementById(
                    "member1StudentId"
                ).value.trim();


            /* =================================================
               MEMBER 02
            ================================================= */

            const member2Name =
                document.getElementById(
                    "member2Name"
                ).value.trim();


            const member2Phone =
                document.getElementById(
                    "member2Phone"
                ).value.trim();


            const member2FacultyBatch =
                document.getElementById(
                    "member2FacultyBatch"
                ).value.trim();


            const member2StudentId =
                document.getElementById(
                    "member2StudentId"
                ).value.trim();


            /* =================================================
               MEMBER 03
            ================================================= */

            const member3Name =
                document.getElementById(
                    "member3Name"
                ).value.trim();


            const member3Phone =
                document.getElementById(
                    "member3Phone"
                ).value.trim();


            const member3FacultyBatch =
                document.getElementById(
                    "member3FacultyBatch"
                ).value.trim();


            const member3StudentId =
                document.getElementById(
                    "member3StudentId"
                ).value.trim();


            /* =================================================
               GROUP COOKING EXPERIENCE
            ================================================= */

            const cookingExperience =
                document.getElementById(
                    "cookingExperience"
                ).value;


            /* =================================================
               FOOD TYPES
            ================================================= */

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


            /* =================================================
               COOKING SPECIALITY
            ================================================= */

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


            /* =================================================
               COOKING COMPETITION
            ================================================= */

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
               ALLERGIES
            ------------------------------------------------- */

            const allergyElement =
                document.querySelector(
                    'input[name="allergies"]:checked'
                );


            const allergies =
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
                groupName === "" ||

                representativeName === "" ||
                representativePhone === "" ||
                representativeEmail === "" ||
                representativeStudentId === "" ||
                representativeBatch === "" ||

                member1Name === "" ||
                member1Phone === "" ||
                member1FacultyBatch === "" ||
                member1StudentId === "" ||

                member2Name === "" ||
                member2Phone === "" ||
                member2FacultyBatch === "" ||
                member2StudentId === "" ||

                member3Name === "" ||
                member3Phone === "" ||
                member3FacultyBatch === "" ||
                member3StudentId === "" ||

                cookingExperience === "" ||
                speciality === "" ||
                competition === "" ||
                allergies === "" ||
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
                !emailPattern.test(
                    representativeEmail
                )
            ) {

                alert(
                    "Please enter a valid representative email address."
                );

                return;

            }


            /* =================================================
               SRI LANKAN PHONE VALIDATION
            ================================================= */

            const phonePattern =
                /^07[0-9]{8}$/;


            if (
                !phonePattern.test(
                    representativePhone
                )
            ) {

                alert(
                    "Please enter a valid representative Sri Lankan mobile number."
                );

                return;

            }


            if (
                !phonePattern.test(
                    member1Phone
                )
            ) {

                alert(
                    "Please enter a valid Member 01 Sri Lankan mobile number."
                );

                return;

            }


            if (
                !phonePattern.test(
                    member2Phone
                )
            ) {

                alert(
                    "Please enter a valid Member 02 Sri Lankan mobile number."
                );

                return;

            }


            if (
                !phonePattern.test(
                    member3Phone
                )
            ) {

                alert(
                    "Please enter a valid Member 03 Sri Lankan mobile number."
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
                            "group",


                        /* =====================================
                           GROUP INFORMATION
                        ===================================== */

                        groupName:
                            groupName,


                        /* =====================================
                           REPRESENTATIVE INFORMATION
                        ===================================== */

                        representative: {

                            name:
                                representativeName,

                            phone:
                                representativePhone,

                            email:
                                representativeEmail,

                            studentId:
                                representativeStudentId,

                            batch:
                                representativeBatch

                        },


                        /* =====================================
                           MEMBER INFORMATION
                        ===================================== */

                        members: [

                            {

                                memberNumber:
                                    1,

                                name:
                                    member1Name,

                                phone:
                                    member1Phone,

                                facultyBatch:
                                    member1FacultyBatch,

                                studentId:
                                    member1StudentId

                            },

                            {

                                memberNumber:
                                    2,

                                name:
                                    member2Name,

                                phone:
                                    member2Phone,

                                facultyBatch:
                                    member2FacultyBatch,

                                studentId:
                                    member2StudentId

                            },

                            {

                                memberNumber:
                                    3,

                                name:
                                    member3Name,

                                phone:
                                    member3Phone,

                                facultyBatch:
                                    member3FacultyBatch,

                                studentId:
                                    member3StudentId

                            }

                        ],


                        /* =====================================
                           GROUP COOKING EXPERIENCE
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

                        allergies:
                            allergies,

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
                   SAVE GROUP NAME FOR THANK YOU PAGE
                ============================================= */

                localStorage.setItem(
                    "userName",
                    groupName
                );


                /* =============================================
                   SAVE REGISTRATION TYPE
                ============================================= */

                localStorage.setItem(
                    "registrationType",
                    "group"
                );


                /* =============================================
                   SUCCESS MESSAGE
                ============================================= */

                alert(
                    "Group registration submitted successfully!"
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

