/*=========================================================
    LOAD CART
=========================================================*/

let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartItems = document.getElementById("cartItems");
const subtotal = document.getElementById("subtotal");
const grandTotal = document.getElementById("grandTotal");


/*=========================================================
    DISPLAY CART
=========================================================*/

function displayCart() {

    cartItems.innerHTML = "";

    let total = 0;

    if (cart.length === 0) {

        cartItems.innerHTML = `

        <div class="text-center py-5">

            <i class="bi bi-cart-x display-1 text-warning"></i>

            <h3 class="mt-3">

                Your cart is empty

            </h3>

            <p>

                Browse our official merchandise.

            </p>

            <a href="shop.html"
                class="btn btn-warning">

                Continue Shopping

            </a>

        </div>

        `;

        subtotal.textContent = "Rs. 0";
        grandTotal.textContent = "Rs. 0";

        return;

    }

    cart.forEach(item => {

        total += item.price * item.quantity;

        cartItems.innerHTML += `

        <div class="cart-item">

            <div class="row align-items-center">

                <div class="col-md-3">

                    <img
                        src="${item.image}"
                        class="img-fluid rounded">

                </div>

                <div class="col-md-3">

                    <h4>${item.name}</h4>

${item.size ? `

<p class="mb-1">

<strong>Size :</strong>

${item.size}

</p>

` : ""}

<p class="text-warning">

Rs. ${item.price.toLocaleString()}

</p>

                </div>

                <div class="col-md-3 text-center">

                    <button
                        class="btn btn-warning btn-sm"
                         onclick="changeQuantity(${item.id},'${item.size}',-1)" -1)">

                        -

                    </button>

                    <span class="mx-3 fw-bold">

                        ${item.quantity}

                    </span>

                    <button
                        class="btn btn-warning btn-sm"
                        onclick="changeQuantity(${item.id},'${item.size}',1)"1)"">

                        +

                    </button>

                </div>

                <div class="col-md-2 text-center">

                    <strong>

                        Rs. ${(item.price * item.quantity).toLocaleString()}

                    </strong>

                </div>

                <div class="col-md-1 text-center">

                    <button
                        class="btn btn-danger btn-sm"
                       onclick="removeItem(${item.id},'${item.size}')"">

                        <i class="bi bi-trash-fill"></i>

                    </button>

                </div>

            </div>

        </div>

        `;

    });

    subtotal.textContent = "Rs. " + total.toLocaleString();

    grandTotal.textContent = "Rs. " + total.toLocaleString();

}


/*=========================================================
    REMOVE ITEM
=========================================================*/

window.removeItem = function (id, size) {

    const confirmDelete = confirm(
        "Remove this product from the cart?"
    );

    if (!confirmDelete) {

        return;

    }
     cart = cart.filter(item =>

!(item.id === id && item.size === size)

);
   

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    displayCart();

};


/*=========================================================
    CHANGE QUANTITY
=========================================================*/

window.changeQuantity = function (id, size, change) {

    const product = cart.find(item =>

item.id === id && item.size === size

);

    if (!product) {

        return;

    }

    product.quantity += change;

    if (product.quantity <= 0) {

        cart = cart.filter(item => item.id !== id);

    }

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    displayCart();

};


/*=========================================================
    PAGE LOAD
=========================================================*/

displayCart();