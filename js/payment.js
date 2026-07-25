/*=========================================================
    IMPORT FIREBASE
=========================================================*/

import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    Timestamp
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

/*=========================================================
    LOAD DATA
=========================================================*/

const customer = JSON.parse(
    localStorage.getItem("customer")
);

const cart = JSON.parse(
    localStorage.getItem("cart")
) || [];

/*=========================================================
    HTML ELEMENTS
=========================================================*/

const customerName =
    document.getElementById("customerName");

const customerEmail =
    document.getElementById("customerEmail");

const customerPhone =
    document.getElementById("customerPhone");

const customerBatch =
    document.getElementById("customerBatch");



const paymentSummary =
    document.getElementById("paymentSummary");

const paymentTotal =
    document.getElementById("paymentTotal");

const placeOrder =
    document.getElementById("placeOrder");

const paymentSlip =
    document.getElementById("paymentSlip");

const previewImage =
    document.getElementById("previewImage");
/*=========================================================
    SHOW CUSTOMER DETAILS
=========================================================*/

customerName.textContent =
    customer?.fullName || "-";

customerEmail.textContent =
    customer?.email || "-";

customerPhone.textContent =
    customer?.phone || "-";

customerBatch.textContent =
    customer?.batch|| "-";


/*=========================================================
    DISPLAY ORDER
=========================================================*/

/*=========================================================
    DISPLAY ORDER
=========================================================*/

let total = 0;

paymentSummary.innerHTML = "";

cart.forEach(item => {

    const itemTotal = item.price * item.quantity;

    total += itemTotal;

    paymentSummary.innerHTML += `

    <div class="order-item">

        <div>

            <div class="order-name">
                ${item.name}
            </div>

            ${
                item.size
                ? `
                <div class="order-size">
                    Size : <strong>${item.size}</strong>
                </div>
                `
                : ""
            }

            <div class="order-qty">
                Qty : ${item.quantity}
            </div>

        </div>

        <div class="order-price">
            Rs. ${itemTotal.toLocaleString()}
        </div>

    </div>

    `;

});

paymentTotal.textContent =
    "Rs. " + total.toLocaleString();
/*=========================================================
    GENERATE ORDER NUMBER
=========================================================*/

function generateOrderNumber(){

    const now = new Date();

    const year =
        now.getFullYear();

    const random =
        Math.floor(Math.random()*9000)+1000;

    return `GV-${year}-${random}`;

}
/*=========================================================
    PAYMENT SLIP PREVIEW
=========================================================*/

paymentSlip.addEventListener("change", function () {

    const file = this.files[0];

    if (!file) {

        previewImage.style.display = "none";

        return;

    }

    const reader = new FileReader();

    reader.onload = function (e) {

        previewImage.src = e.target.result;

        previewImage.style.display = "block";

    };

    reader.readAsDataURL(file);

});

/*=========================================================
    UPLOAD PAYMENT SLIP TO CLOUDINARY
=========================================================*/

async function uploadPaymentSlip(file){

    const formData = new FormData();

    formData.append("file", file);

    formData.append("upload_preset", "payment_slips");

    const response = await fetch(

        "https://api.cloudinary.com/v1_1/j85sktnd/image/upload",

        {

            method:"POST",

            body:formData

        }

    );

    if(!response.ok){

        throw new Error("Upload failed.");

    }

    const data = await response.json();

    return data.secure_url;

}
/*=========================================================
    PLACE ORDER
=========================================================*/

placeOrder.addEventListener("click", async function () {

    if (cart.length === 0) {

        alert("Cart is empty.");

        return;

    }

    const file = paymentSlip.files[0];

    if (!file) {

        alert("Please upload your payment receipt.");

        return;

    }

    try {

        placeOrder.disabled = true;

        placeOrder.innerHTML = "Uploading Receipt...";

        // Upload image to Cloudinary
        const imageURL = await uploadPaymentSlip(file);

        // Generate Order Number
        const orderNumber = generateOrderNumber();

        // Save order to Firebase
        await addDoc(

            collection(db, "orders"),

            {

                orderNumber: orderNumber,

                customer: customer,

                customerName: customer.fullName,

                customerEmail: customer.email,

                customerPhone: customer.phone,

                batch: customer.batch,

                

                items: cart,

                total: total,

                totalItems: cart.length,

                paymentSlipURL: imageURL,

                paymentStatus: "Pending",

                collectionStatus: "Pending",

                createdAt: Timestamp.now()

            }

        );

        // Clear local storage
        localStorage.removeItem("cart");

        localStorage.removeItem("customer");

        localStorage.setItem("orderNumber", orderNumber);

        // Redirect
        window.location.href = "order-success.html";

    }

    catch (error) {

        console.error(error);

        alert("Failed to place order.");

    }

    finally {

        placeOrder.disabled = false;

        placeOrder.innerHTML = `
            <i class="bi bi-check-circle-fill"></i>
            Confirm Order
        `;

    }

});