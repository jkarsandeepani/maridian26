/*=========================================================
    IMPORT FIREBASE
=========================================================*/

import { db, auth } from "./firebase.js";

import {

    onAuthStateChanged

} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

import {
    collection,
    onSnapshot,
    doc,
    deleteDoc
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

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



/*=========================================================
    HTML ELEMENTS
=========================================================*/

const tableBody = document.getElementById("registrationTable");
const totalRegistrations = document.getElementById("totalRegistrations");
const noDataMessage = document.getElementById("noDataMessage");

let registrations = [];


/*=========================================================
    LOAD REGISTRATIONS
=========================================================*/

function loadRegistrations() {

    onSnapshot(collection(db, "registrations"), (snapshot) => {

        tableBody.innerHTML = "";
        registrations = [];

        if (snapshot.empty) {

            noDataMessage.classList.remove("d-none");
            totalRegistrations.textContent = 0;

            return;

        }

        noDataMessage.classList.add("d-none");

        snapshot.forEach((docSnap, index) => {

            const data = docSnap.data();

            registrations.push({

                id: docSnap.id,
                ...data

            });

            tableBody.innerHTML += `

            <tr>

                <td>${index + 1}</td>

                <td>${data.fullName || "-"}</td>

                <td>${data.batch || "-"}</td>

                <td>${data.phone || "-"}</td>

                <td>
                    ${data.registeredAt
                        ? data.registeredAt.toDate().toLocaleDateString()
                        : "-"}
                </td>

                <td>

                    <button
                        class="btn btn-primary btn-sm"
                        onclick="viewRegistration('${docSnap.id}')">

                        <i class="bi bi-eye-fill"></i>

                        View

                    </button>

                    <button
                        class="btn btn-danger btn-sm"
                        onclick="deleteRegistration('${docSnap.id}')">

                        <i class="bi bi-trash-fill"></i>

                        Delete

                    </button>

                </td>

            </tr>

            `;

        });

        totalRegistrations.textContent = registrations.length;

    });

}



/*=========================================================
    SEARCH
=========================================================*/

const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("input", function () {

    const keyword = this.value.toLowerCase();

    const rows = tableBody.querySelectorAll("tr");

    rows.forEach(row => {

        if (row.textContent.toLowerCase().includes(keyword)) {

            row.style.display = "";

        } else {

            row.style.display = "none";

        }

    });

});


/*=========================================================
    DELETE
=========================================================*/

window.deleteRegistration = async function(id){

    if(!confirm("Delete this registration?")){

        return;

    }

    try{

        await deleteDoc(doc(db,"registrations",id));

        alert("Registration deleted successfully!");

    }

    catch(error){

        console.error(error);

        alert("Delete failed.");

    }

}


/*=========================================================
    VIEW DETAILS
=========================================================*/

window.viewRegistration = function(id){

    const person = registrations.find(item => item.id === id);

    if(!person){

        alert("Registration not found.");

        return;

    }

    document.getElementById("detailName").textContent = person.fullName || "-";
    document.getElementById("detailEmail").textContent = person.email || "-";
    document.getElementById("detailPhone").textContent = person.phone || "-";
    document.getElementById("detailBatch").textContent = person.batch || "-";
    document.getElementById("detailAge").textContent = person.age || "-";
    document.getElementById("detailShirt").textContent = person.shirt || "-";
    document.getElementById("detailDiet").textContent = person.diet || "-";
    document.getElementById("detailEmergencyName").textContent = person.emergencyName || "-";
    document.getElementById("detailEmergencyPhone").textContent = person.emergencyPhone || "-";
    document.getElementById("detailMessage").textContent = person.message || "No message";

    const modal = new bootstrap.Modal(document.getElementById("detailsModal"));

    modal.show();

}


/*=========================================================
    EXPORT EXCEL
=========================================================*/

document.getElementById("exportExcel").addEventListener("click", function(){

    if(registrations.length===0){

        alert("No registrations available!");

        return;

    }

    const excelData = registrations.map((person,index)=>({

        "Registration No": index+1,
        "Full Name": person.fullName,
        "Email": person.email,
        "Phone": person.phone,
        "Age": person.age,
        "Batch": person.batch,
        "Shirt": person.shirt,
        "Diet": person.diet,
        "Emergency Name": person.emergencyName,
        "Emergency Phone": person.emergencyPhone,
        "Message": person.message,
        "Registration Date": person.registeredAt
            ? person.registeredAt.toDate().toLocaleString()
            : "-"

    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Registrations");

    XLSX.writeFile(workbook, "MARIDIAN26_Registrations.xlsx");

});

