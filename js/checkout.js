/*=========================================================
    LOAD CART
=========================================================*/

let cart = JSON.parse(localStorage.getItem("cart")) || [];

/*=========================================================
    HTML ELEMENTS
=========================================================*/

const orderSummary = document.getElementById("orderSummary");
const orderTotal = document.getElementById("orderTotal");
const continueBtn = document.getElementById("continuePayment");

/*=========================================================
    DISPLAY ORDER SUMMARY
=========================================================*/

function displayOrder() {

    if (cart.length === 0) {

        orderSummary.innerHTML = `

            <div class="alert alert-warning">

                Your cart is empty.

            </div>

        `;

        orderTotal.textContent = "Rs.0";

        continueBtn.disabled = true;

        return;

    }

    let total = 0;

    orderSummary.innerHTML = "";

    cart.forEach(item => {

        const itemTotal = item.price * item.quantity;

        total += itemTotal;

        orderSummary.innerHTML += `

            <div class="order-item">

                <div>

                    <div class="order-name">

                        ${item.name}

                    </div>

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

    orderTotal.textContent =

        "Rs. " + total.toLocaleString();

}

/*=========================================================
    CONTINUE TO PAYMENT
=========================================================*/

continueBtn.addEventListener("click", function () {

    const customer = {

        fullName: document.getElementById("fullName").value.trim(),

        email: document.getElementById("email").value.trim(),

        phone: document.getElementById("phone").value.trim(),

        batch: document.getElementById("batch").value.trim(),

        notes: document.getElementById("notes").value.trim()

    };

    if (

        customer.fullName === "" ||

        customer.email === "" ||

        customer.phone === ""

    ) {

        alert("Please complete all required fields.");

        return;

    }

    localStorage.setItem(

        "customer",

        JSON.stringify(customer)

    );

    window.location.href = "payment.html";

});

/*=========================================================
    PAGE LOAD
=========================================================*/

displayOrder();