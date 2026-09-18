/*=========================================================
    IMPORT FIREBASE
=========================================================*/

import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    Timestamp
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";


/*=========================================================
    LOAD CHECKOUT DATA
=========================================================*/

const checkoutData = JSON.parse(
    localStorage.getItem("checkoutData")
);

const customer =
    checkoutData?.customer || null;

const cart =
    checkoutData?.cart || [];


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

const confirmPayment =
    document.getElementById("confirmPayment");


/*=========================================================
    CHECK CHECKOUT DATA
=========================================================*/

if (!checkoutData || !customer || cart.length === 0) {

    alert("Checkout information was not found.");

    window.location.href = "cart.html";

}


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
    customer?.batch || "-";


/*=========================================================
    DISPLAY ORDER
=========================================================*/

let total = 0;

paymentSummary.innerHTML = "";


cart.forEach(item => {

    const itemTotal =
        Number(item.price) *
        Number(item.quantity);

    total += itemTotal;


    paymentSummary.innerHTML += `

        <div class="order-item">

            <div class="order-item-info">

                <div class="order-name">
                    ${item.name}
                </div>


                ${
                    item.color
                    ? `
                        <div class="order-detail">
                            Color : ${item.color}
                        </div>
                      `
                    : ""
                }


                ${
                    item.size
                    ? `
                        <div class="order-detail">
                            Size : ${item.size}
                        </div>
                      `
                    : ""
                }


                ${
                    item.option
                    ? `
                        <div class="order-detail">
                            Option : ${item.option}
                        </div>
                      `
                    : ""
                }


                <div class="order-detail">

                    Quantity : ${item.quantity}

                </div>

            </div>


            <div class="order-price">

                Rs. ${itemTotal.toLocaleString()}

            </div>

        </div>

    `;

});


/*=========================================================
    DISPLAY TOTAL
=========================================================*/

paymentTotal.textContent =
    "Rs. " + total.toLocaleString();


/*=========================================================
    GENERATE ORDER NUMBER
=========================================================*/

function generateOrderNumber() {

    const now = new Date();

    const year =
        now.getFullYear();

    const random =
        Math.floor(Math.random() * 9000) + 1000;

    return `GV-${year}-${random}`;

}


/*=========================================================
    PAYMENT SLIP PREVIEW
=========================================================*/

paymentSlip.addEventListener(
    "change",
    function () {

        const file = this.files[0];


        if (!file) {

            previewImage.style.display = "none";

            previewImage.src = "";

            return;

        }


        /* Check file type */

        const allowedTypes = [
            "image/jpeg",
            "image/png"
        ];


        if (!allowedTypes.includes(file.type)) {

            alert(
                "Please select a JPG, JPEG or PNG image."
            );

            paymentSlip.value = "";

            previewImage.style.display = "none";

            return;

        }


        /* Check file size */

        const maxSize =
            5 * 1024 * 1024;


        if (file.size > maxSize) {

            alert(
                "Payment receipt must be smaller than 5 MB."
            );

            paymentSlip.value = "";

            previewImage.style.display = "none";

            return;

        }


        /* Preview */

        const reader =
            new FileReader();


        reader.onload = function (e) {

            previewImage.src =
                e.target.result;

            previewImage.style.display =
                "block";

        };


        reader.readAsDataURL(file);

    }
);


/*=========================================================
    UPLOAD PAYMENT SLIP TO CLOUDINARY
=========================================================*/

async function uploadPaymentSlip(file) {

    const formData =
        new FormData();


    formData.append(
        "file",
        file
    );


    /* KEEPING YOUR EXISTING CLOUDINARY PRESET */

    formData.append(
        "upload_preset",
        "payment_slips"
    );


    /* KEEPING YOUR EXISTING CLOUDINARY LINK */

    const response = await fetch(

        "https://api.cloudinary.com/v1_1/j85sktnd/image/upload",

        {

            method: "POST",

            body: formData

        }

    );


    if (!response.ok) {

        throw new Error(
            "Upload failed."
        );

    }


    const data =
        await response.json();


    return data.secure_url;

}


/*=========================================================
    PLACE ORDER
=========================================================*/

placeOrder.addEventListener(
    "click",
    async function () {


        /* Check cart */

        if (cart.length === 0) {

            alert("Cart is empty.");

            return;

        }


        /* Check payment slip */

        const file =
            paymentSlip.files[0];


        if (!file) {

            alert(
                "Please upload your payment receipt."
            );

            return;

        }


        /* Check confirmation */

        if (!confirmPayment.checked) {

            alert(
                "Please confirm that you have completed the payment."
            );

            return;

        }


        try {

            /* Disable button */

            placeOrder.disabled = true;

            placeOrder.innerHTML = `
                <i class="bi bi-hourglass-split"></i>
                Uploading Receipt...
            `;


            /*========================================
                UPLOAD TO CLOUDINARY
            ========================================*/

            const imageURL =
                await uploadPaymentSlip(file);


            /*========================================
                GENERATE ORDER NUMBER
            ========================================*/

            const orderNumber =
                generateOrderNumber();


            /*========================================
                TOTAL ITEMS
            ========================================*/

            const totalItems =
                cart.reduce(
                    (sum, item) =>
                        sum +
                        Number(item.quantity),
                    0
                );


            /*========================================
                SAVE ORDER TO FIREBASE
            ========================================*/

            await addDoc(

                collection(
                    db,
                    "orders"
                ),

                {

                    orderNumber:
                        orderNumber,


                    /* Customer */

                    customer:
                        customer,

                    customerName:
                        customer.fullName,

                    customerEmail:
                        customer.email,

                    customerPhone:
                        customer.phone,

                    batch:
                        customer.batch,


                    /* Products */

                    items:
                        cart,


                    total:
                        total,

                    totalItems:
                        totalItems,


                    /* Payment */

                    paymentSlipURL:
                        imageURL,

                    paymentStatus:
                        "Pending",


                    /* Collection */

                    collectionStatus:
                        "Pending",


                    /* Date */

                    createdAt:
                        Timestamp.now()

                }

            );


            /*========================================
                CLEAR LOCAL STORAGE
            ========================================*/

            localStorage.removeItem(
                "cart"
            );

            localStorage.removeItem(
                "checkoutData"
            );


            localStorage.setItem(
                "orderNumber",
                orderNumber
            );


            /*========================================
                REDIRECT
            ========================================*/

            window.location.href =
                "order-success.html";

        }


        catch (error) {

            console.error(
                "Order error:",
                error
            );

            alert(
                "Failed to place order. Please try again."
            );

        }


        finally {

            placeOrder.disabled = false;

            placeOrder.innerHTML = `
                <i class="bi bi-check-circle-fill"></i>
                Confirm Order
            `;

        }

    }
);