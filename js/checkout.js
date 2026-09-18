// ================================
// LOAD CART
// ================================

let cart = JSON.parse(localStorage.getItem("cart")) || [];


// ================================
// ELEMENTS
// ================================

const orderSummary =
    document.getElementById("orderSummary");

const orderTotal =
    document.getElementById("orderTotal");

const checkoutForm =
    document.getElementById("checkoutForm");

const continuePayment =
    document.getElementById("continuePayment");


// ================================
// DISPLAY ORDER SUMMARY
// ================================

function displayOrderSummary() {

    orderSummary.innerHTML = "";

    let total = 0;


    // ================================
    // EMPTY CART
    // ================================

    if (cart.length === 0) {

        orderSummary.innerHTML = `
            <div class="empty-checkout">

                <i class="bi bi-cart-x"></i>

                <p>
                    Your cart is empty.
                </p>

                <a
                    href="shop.html"
                    class="btn btn-warning">

                    Go to Shop

                </a>

            </div>
        `;

        orderTotal.textContent = "Rs. 0";

        continuePayment.disabled = true;

        return;
    }


    // ================================
    // DISPLAY PRODUCTS
    // ================================

    cart.forEach(item => {

        const itemTotal =
            Number(item.price) *
            Number(item.quantity);

        total += itemTotal;


        orderSummary.innerHTML += `

            <div class="order-item">


                <!-- PRODUCT IMAGE -->

                <img
                    src="${item.image}"
                    alt="${item.name}"
                >


                <!-- PRODUCT DETAILS -->

                <div class="order-item-details">

                    <h6>
                        ${item.name}
                    </h6>


                    ${
                        item.color
                            ? `
                                <small>
                                    Color: ${item.color}
                                </small>
                              `
                            : ""
                    }


                    ${
                        item.size
                            ? `
                                <small>
                                    Size: ${item.size}
                                </small>
                              `
                            : ""
                    }


                    ${
                        item.option
                            ? `
                                <small>
                                    ${item.option}
                                </small>
                              `
                            : ""
                    }


                    <small>
                        Quantity: ${item.quantity}
                    </small>

                </div>


                <!-- PRICE -->

                <div class="order-item-price">

                    Rs. ${itemTotal.toLocaleString()}

                </div>

            </div>

        `;
    });


    // ================================
    // TOTAL
    // ================================

    orderTotal.textContent =
        "Rs. " + total.toLocaleString();
}


// ================================
// CONTINUE TO PAYMENT
// ================================

continuePayment.addEventListener(
    "click",
    function () {


        // ================================
        // FORM VALIDATION
        // ================================

        if (!checkoutForm.checkValidity()) {

            checkoutForm.reportValidity();

            return;
        }


        // ================================
        // CHECK CART
        // ================================

        if (cart.length === 0) {

            alert("Your cart is empty.");

            return;
        }


        // ================================
        // CUSTOMER DETAILS
        // ================================

        const customerDetails = {

            fullName:
                document
                    .getElementById("fullName")
                    .value
                    .trim(),

            email:
                document
                    .getElementById("email")
                    .value
                    .trim(),

            phone:
                document
                    .getElementById("phone")
                    .value
                    .trim(),

            batch:
                document
                    .getElementById("batch")
                    .value
                    .trim(),


        };


        // ================================
        // CALCULATE TOTAL
        // ================================

        const total = cart.reduce(
            (sum, item) => {

                return sum +
                    Number(item.price) *
                    Number(item.quantity);

            },
            0
        );


        // ================================
        // CHECKOUT DATA
        // ================================

        const checkoutData = {

            customer: customerDetails,

            cart: cart,

            total: total

        };


        // ================================
        // SAVE CHECKOUT DATA
        // ================================

        localStorage.setItem(
            "checkoutData",
            JSON.stringify(checkoutData)
        );


        // ================================
        // GO TO PAYMENT
        // ================================

        window.location.href =
            "payment.html";

    }
);


// ================================
// INITIAL LOAD
// ================================

displayOrderSummary();