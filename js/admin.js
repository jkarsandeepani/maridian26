/* =========================================================
   MARIDIAN '26
   ADMIN DASHBOARD
========================================================= */


/* =========================================================
   FIREBASE IMPORT
========================================================= */

import {
    db,
    auth,
    collection,
    getDocs
} from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js"

/*=========================================================
    ADMIN AUTH CHECK
=========================================================*/
onAuthStateChanged(auth, (user) => {

    console.log("Current user:", user);

    if (!user) {

        console.log("No user logged in");

        window.location.href = "admin-login.html";
        return;

    }

    console.log("Logged in as:", user.email);

    loadRegistrations();

});


/* =========================================================
   GLOBAL DATA
========================================================= */

let allRegistrations = [];

let delegateRegistrations = [];

let individualRegistrations = [];

let groupRegistrations = [];



/* =========================================================
   PAGE LOAD
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadRegistrations();

        setupExportButtons();

    }
);



/* =========================================================
   LOAD FIRESTORE DATA
========================================================= */

async function loadRegistrations() {

    try {

        console.log(
            "Loading registrations from Firestore..."
        );


        const snapshot = await getDocs(
            collection(
                db,
                "registrations"
            )
        );


        allRegistrations = [];


        snapshot.forEach(
            function (doc) {

                const data = doc.data();


                allRegistrations.push({

                    id: doc.id,

                    ...data

                });

            }
        );


        console.log(
            "Registrations found:",
            allRegistrations.length
        );


        /* =============================================
           SEPARATE REGISTRATION TYPES
        ============================================= */

        delegateRegistrations =
            allRegistrations.filter(
                function (item) {

                    return String(
                        item.registrationType || ""
                    ).toLowerCase() === "delegate";

                }
            );


        individualRegistrations =
            allRegistrations.filter(
                function (item) {

                    return String(
                        item.registrationType || ""
                    ).toLowerCase() === "individual";

                }
            );


        groupRegistrations =
            allRegistrations.filter(
                function (item) {

                    return String(
                        item.registrationType || ""
                    ).toLowerCase() === "group";

                }
            );


        console.log(
            "Delegate:",
            delegateRegistrations.length
        );


        console.log(
            "Individual:",
            individualRegistrations.length
        );


        console.log(
            "Group:",
            groupRegistrations.length
        );


        /* =============================================
           UPDATE STATISTICS
        ============================================= */

        updateStatistics();


        /* =============================================
           DISPLAY TABLES
        ============================================= */

        displayDelegates();

        displayIndividuals();

        displayGroups();

    }


    catch (error) {

        console.error(
            "ERROR LOADING FIRESTORE:",
            error
        );


        showDatabaseError();

    }

}



/* =========================================================
   STATISTICS
========================================================= */

function updateStatistics() {


    document.getElementById(
        "totalRegistrations"
    ).textContent =
        allRegistrations.length;


    document.getElementById(
        "delegateCount"
    ).textContent =
        delegateRegistrations.length;


    document.getElementById(
        "individualCount"
    ).textContent =
        individualRegistrations.length;


    document.getElementById(
        "groupCount"
    ).textContent =
        groupRegistrations.length;

}



/* =========================================================
   DELEGATE TABLE
========================================================= */

function displayDelegates() {

    const tbody =
        document.getElementById(
            "delegateTableBody"
        );


    if (
        delegateRegistrations.length === 0
    ) {

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    class="empty">

                    No delegate registrations found.

                </td>

            </tr>

        `;

        return;

    }


    tbody.innerHTML = "";


    delegateRegistrations.forEach(
        function (data, index) {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${index + 1}
                </td>


                <td>
                    ${safe(data.fullName)}
                </td>


                <td>
                    ${safe(data.phone)}
                </td>


                <td>
                    ${safe(data.email)}
                </td>


                <td>
                    ${safe(data.facultyBatch)}
                </td>


                <td>
                    ${formatDate(data.registeredAt)}
                </td>


                <td>

                    <button
                        class="view-btn"
                        data-id="${data.id}">

                        <i class="bi bi-eye"></i>

                        View

                    </button>

                </td>

            `;


            row
                .querySelector(".view-btn")
                .addEventListener(
                    "click",
                    function () {

                        showDetails(data);

                    }
                );


            tbody.appendChild(row);

        }
    );

}



/* =========================================================
   INDIVIDUAL TABLE
========================================================= */

function displayIndividuals() {

    const tbody =
        document.getElementById(
            "individualTableBody"
        );


    if (
        individualRegistrations.length === 0
    ) {

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    class="empty">

                    No individual registrations found.

                </td>

            </tr>

        `;

        return;

    }


    tbody.innerHTML = "";


    individualRegistrations.forEach(
        function (data, index) {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${index + 1}
                </td>


                <td>
                    ${safe(
                        data.fullName ||
                        data.name
                    )}
                </td>


                <td>
                    ${safe(data.email)}
                </td>


                <td>
                    ${safe(data.phone)}
                </td>


                <td>
                    ${safe(
                        data.faculty ||
                        data.facultyBatch
                    )}
                </td>


                <td>
                    ${safe(data.batch)}
                </td>


                <td>

                    <button
                        class="view-btn">

                        <i class="bi bi-eye"></i>

                        View

                    </button>

                </td>

            `;


            row
                .querySelector(".view-btn")
                .addEventListener(
                    "click",
                    function () {

                        showDetails(data);

                    }
                );


            tbody.appendChild(row);

        }
    );

}



/* =========================================================
   GROUP TABLE
========================================================= */

function displayGroups() {

    const tbody =
        document.getElementById(
            "groupTableBody"
        );


    if (
        groupRegistrations.length === 0
    ) {

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    class="empty">

                    No group registrations found.

                </td>

            </tr>

        `;

        return;

    }


    tbody.innerHTML = "";


    groupRegistrations.forEach(
        function (data, index) {

            const representative =
                data.representative || {};


            const members =
                Array.isArray(data.members)
                    ? data.members
                    : [];


            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${index + 1}
                </td>


                <td>
                    ${safe(data.groupName)}
                </td>


                <td>
                    ${safe(
                        representative.name
                    )}
                </td>


                <td>
                    ${safe(
                        representative.email
                    )}
                </td>


                <td>
                    ${safe(
                        representative.phone
                    )}
                </td>


                <td>

                    <span class="badge bg-secondary">

                        ${members.length} Members

                    </span>

                </td>


                <td>

                    <button
                        class="view-btn">

                        <i class="bi bi-eye"></i>

                        View

                    </button>

                </td>

            `;


            row
                .querySelector(".view-btn")
                .addEventListener(
                    "click",
                    function () {

                        showDetails(data);

                    }
                );


            tbody.appendChild(row);

        }
    );

}



/* =========================================================
   SHOW DETAILS
========================================================= */

function showDetails(data) {

    const container =
        document.getElementById(
            "registrationDetails"
        );


    let html = "";


    /* =====================================================
       BASIC INFORMATION
    ===================================================== */

    html += `

        <div class="detail-section">

            <div class="detail-section-title">

                <i class="bi bi-info-circle me-2"></i>

                Registration Information

            </div>

            <div class="row">

                ${detail(
                    "Registration Type",
                    data.registrationType
                )}

                ${detail(
                    "Registration ID",
                    data.id
                )}

                ${detail(
                    "Registered Date",
                    formatDate(data.registeredAt)
                )}

            </div>

        </div>

    `;



    /* =====================================================
       DELEGATE
    ===================================================== */

    if (
        String(
            data.registrationType || ""
        ).toLowerCase() === "delegate"
    ) {

        html += `

            <div class="detail-section">

                <div class="detail-section-title">

                    <i class="bi bi-person me-2"></i>

                    Delegate Information

                </div>

                <div class="row">

                    ${detail(
                        "Full Name",
                        data.fullName
                    )}

                    ${detail(
                        "Phone",
                        data.phone
                    )}

                    ${detail(
                        "Email",
                        data.email
                    )}

                    ${detail(
                        "Faculty / Batch",
                        data.facultyBatch
                    )}

                </div>

            </div>

        `;

    }



    /* =====================================================
       INDIVIDUAL
    ===================================================== */

    if (
        String(
            data.registrationType || ""
        ).toLowerCase() === "individual"
    ) {

        html += buildIndividualDetails(
            data
        );

    }



    /* =====================================================
       GROUP
    ===================================================== */

    if (
        String(
            data.registrationType || ""
        ).toLowerCase() === "group"
    ) {

        html += buildGroupDetails(
            data
        );

    }



    /* =====================================================
       COMMON EXTRA DETAILS
    ===================================================== */

    html += buildCommonDetails(
        data
    );


    container.innerHTML =
        html;


    const modalElement =
        document.getElementById(
            "detailsModal"
        );


    const modal =
        bootstrap.Modal.getOrCreateInstance(
            modalElement
        );


    modal.show();

}



/* =========================================================
   INDIVIDUAL DETAILS
========================================================= */

function buildIndividualDetails(data) {

    let html = `

        <div class="detail-section">

            <div class="detail-section-title">

                <i class="bi bi-person me-2"></i>

                Personal Information

            </div>

            <div class="row">

    `;


    const fields = [

        ["Full Name", data.fullName],

        ["Phone", data.phone],

        ["Email", data.email],

        ["Faculty", data.faculty],

        ["Batch", data.batch],

        ["Student ID", data.studentId]

    ];


    fields.forEach(
        function (field) {

            if (
                field[1] !== undefined
            ) {

                html += detail(
                    field[0],
                    field[1]
                );

            }

        }
    );


    html += `

            </div>

        </div>

    `;


    return html;

}



/* =========================================================
   GROUP DETAILS
========================================================= */

function buildGroupDetails(data) {

    const representative =
        data.representative || {};


    let html = `

        <div class="detail-section">

            <div class="detail-section-title">

                <i class="bi bi-people me-2"></i>

                Group Information

            </div>

            <div class="row">

                ${detail(
                    "Group Name",
                    data.groupName
                )}

            </div>

        </div>


        <div class="detail-section">

            <div class="detail-section-title">

                <i class="bi bi-person-badge me-2"></i>

                Representative Information

            </div>

            <div class="row">

                ${detail(
                    "Name",
                    representative.name
                )}

                ${detail(
                    "Phone",
                    representative.phone
                )}

                ${detail(
                    "Email",
                    representative.email
                )}

                ${detail(
                    "Student ID",
                    representative.studentId
                )}

                ${detail(
                    "Batch",
                    representative.batch
                )}

            </div>

        </div>

    `;


    /* =====================================================
       MEMBERS
    ===================================================== */

    if (
        Array.isArray(data.members)
    ) {

        html += `

            <div class="detail-section">

                <div class="detail-section-title">

                    <i class="bi bi-people-fill me-2"></i>

                    Group Members

                </div>

        `;


        data.members.forEach(
            function (member, index) {

                html += `

                    <div class="member-card">

                        <h6>
                            Member ${index + 1}
                        </h6>

                        <div class="row">

                            ${detail(
                                "Name",
                                member.name
                            )}

                            ${detail(
                                "Phone",
                                member.phone
                            )}

                            ${detail(
                                "Faculty / Batch",
                                member.facultyBatch
                            )}

                            ${detail(
                                "Student ID",
                                member.studentId
                            )}

                        </div>

                    </div>

                `;

            }
        );


        html += `</div>`;

    }


    return html;

}



/* =========================================================
   COOKING + FOOD SAFETY + FINAL DETAILS
========================================================= */

function buildCommonDetails(data) {

    let html = "";


    /* =====================================================
       COOKING
    ===================================================== */

    if (
        data.cookingExperience ||
        data.foodTypes ||
        data.speciality ||
        data.competition
    ) {

        html += `

            <div class="detail-section">

                <div class="detail-section-title">

                    <i class="bi bi-egg-fried me-2"></i>

                    Cooking Experience

                </div>

                <div class="row">

                    ${detail(
                        "Cooking Experience",
                        data.cookingExperience
                    )}

                    ${detail(
                        "Food Types",
                        Array.isArray(data.foodTypes)
                            ? data.foodTypes.join(", ")
                            : data.foodTypes
                    )}

                    ${detail(
                        "Other Food",
                        data.otherFood
                    )}

                    ${detail(
                        "Cooking Speciality",
                        data.speciality
                    )}

                    ${detail(
                        "Speciality Details",
                        data.specialityDetails
                    )}

                    ${detail(
                        "Previous Competition",
                        data.competition
                    )}

                </div>

            </div>

        `;

    }



    /* =====================================================
       FOOD SAFETY
    ===================================================== */

    if (
        data.allergies ||
        data.dietary ||
        data.foodSafetyNotes
    ) {

        html += `

            <div class="detail-section">

                <div class="detail-section-title">

                    <i class="bi bi-shield-exclamation me-2"></i>

                    Food Safety

                </div>

                <div class="row">

                    ${detail(
                        "Food Allergies",
                        data.allergies
                    )}

                    ${detail(
                        "Allergy Details",
                        data.allergyDetails
                    )}

                    ${detail(
                        "Dietary Restrictions",
                        data.dietary
                    )}

                    ${detail(
                        "Dietary Details",
                        data.dietaryDetails
                    )}

                    ${detail(
                        "Food Safety Notes",
                        data.foodSafetyNotes
                    )}

                </div>

            </div>

        `;

    }



    /* =====================================================
       FINAL DETAILS
    ===================================================== */

    if (
        data.lookingForward ||
        data.additionalComments
    ) {

        html += `

            <div class="detail-section">

                <div class="detail-section-title">

                    <i class="bi bi-chat-square-text me-2"></i>

                    Final Details

                </div>

                <div class="row">

                    ${detail(
                        "Looking Forward To",
                        data.lookingForward
                    )}

                    ${detail(
                        "Additional Comments",
                        data.additionalComments
                    )}

                </div>

            </div>

        `;

    }



    /* =====================================================
       MEDIA CONSENT
    ===================================================== */

    if (
        data.mediaConsent !== undefined
    ) {

        html += `

            <div class="detail-section">

                <div class="detail-section-title">

                    <i class="bi bi-camera me-2"></i>

                    Media Consent

                </div>

                <div class="row">

                    ${detail(
                        "Media Consent",
                        data.mediaConsent
                    )}

                    ${detail(
                        "Declaration Accepted",
                        data.declaration
                            ? "Yes"
                            : "No"
                    )}

                </div>

            </div>

        `;

    }


    return html;

}



/* =========================================================
   DETAIL HTML
========================================================= */

function detail(label, value) {

    if (
        value === undefined ||
        value === null ||
        value === ""
    ) {

        value = "Not provided";

    }


    return `

        <div class="col-lg-4 col-md-6">

            <div class="detail-item">

                <span class="detail-label">

                    ${safe(label)}

                </span>

                <span class="detail-value">

                    ${safe(String(value))}

                </span>

            </div>

        </div>

    `;

}



/* =========================================================
   SAFE TEXT
========================================================= */

function safe(value) {

    if (
        value === undefined ||
        value === null
    ) {

        return "";

    }


    return String(value)

        .replaceAll("&", "&amp;")

        .replaceAll("<", "&lt;")

        .replaceAll(">", "&gt;")

        .replaceAll('"', "&quot;")

        .replaceAll("'", "&#039;");

}



/* =========================================================
   DATE FORMAT
========================================================= */

function formatDate(timestamp) {

    if (!timestamp) {

        return "Not available";

    }


    try {

        let date;


        if (
            typeof timestamp.toDate ===
            "function"
        ) {

            date =
                timestamp.toDate();

        }

        else if (
            timestamp.seconds
        ) {

            date =
                new Date(
                    timestamp.seconds * 1000
                );

        }

        else {

            date =
                new Date(timestamp);

        }


        return date.toLocaleString(
            "en-LK",
            {

                year: "numeric",

                month: "short",

                day: "numeric",

                hour: "2-digit",

                minute: "2-digit"

            }
        );

    }

    catch {

        return "Invalid date";

    }

}



/* =========================================================
   EXPORT BUTTONS
========================================================= */

function setupExportButtons() {


    document
        .getElementById(
            "exportDelegateBtn"
        )
        .addEventListener(
            "click",
            function () {

                exportExcel(
                    delegateRegistrations,
                    "MARIDIAN_26_Delegate_Registrations"
                );

            }
        );


    document
        .getElementById(
            "exportIndividualBtn"
        )
        .addEventListener(
            "click",
            function () {

                exportExcel(
                    individualRegistrations,
                    "MARIDIAN_26_Individual_Registrations"
                );

            }
        );


    document
        .getElementById(
            "exportGroupBtn"
        )
        .addEventListener(
            "click",
            function () {

                exportExcel(
                    groupRegistrations,
                    "MARIDIAN_26_Group_Registrations"
                );

            }
        );

}



/* =========================================================
   EXPORT EXCEL
========================================================= */

function exportExcel(
    registrations,
    filename
) {

    if (
        registrations.length === 0
    ) {

        alert(
            "There are no registrations to export."
        );

        return;

    }


    const rows =
        registrations.map(
            function (data) {

                return flattenObject(
                    data
                );

            }
        );


    const worksheet =
        XLSX.utils.json_to_sheet(
            rows
        );


    const workbook =
        XLSX.utils.book_new();


    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Registrations"
    );


    XLSX.writeFile(
        workbook,
        filename + ".xlsx"
    );

}



/* =========================================================
   FLATTEN FIRESTORE DATA
========================================================= */

function flattenObject(
    object,
    prefix = "",
    result = {}
) {

    Object.keys(object).forEach(
        function (key) {

            const value =
                object[key];


            const newKey =
                prefix
                    ? prefix + "." + key
                    : key;


            if (
                value !== null &&
                typeof value === "object" &&
                !Array.isArray(value) &&
                typeof value.toDate !== "function"
            ) {

                flattenObject(
                    value,
                    newKey,
                    result
                );

            }

            else if (
                Array.isArray(value)
            ) {

                result[newKey] =
                    value
                        .map(
                            function (item) {

                                if (
                                    typeof item === "object"
                                ) {

                                    return JSON.stringify(
                                        item
                                    );

                                }

                                return item;

                            }
                        )
                        .join(" | ");

            }

            else if (
                value &&
                typeof value.toDate ===
                "function"
            ) {

                result[newKey] =
                    formatDate(value);

            }

            else {

                result[newKey] =
                    value;

            }

        }
    );


    return result;

}



/* =========================================================
   DATABASE ERROR
========================================================= */

function showDatabaseError() {


    document.getElementById(
        "delegateTableBody"
    ).innerHTML = `

        <tr>

            <td
                colspan="7"
                class="empty">

                <i class="bi bi-exclamation-triangle"></i>

                Unable to load registrations.

                Check Firebase configuration and Firestore
                permissions.

            </td>

        </tr>

    `;


    document.getElementById(
        "individualTableBody"
    ).innerHTML = `

        <tr>

            <td
                colspan="7"
                class="empty">

                Unable to load registrations.

            </td>

        </tr>

    `;


    document.getElementById(
        "groupTableBody"
    ).innerHTML = `

        <tr>

            <td
                colspan="7"
                class="empty">

                Unable to load registrations.

            </td>

        </tr>

    `;

}