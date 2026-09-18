let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartItems = document.getElementById("cartItems");
const subtotal = document.getElementById("subtotal");
const grandTotal = document.getElementById("grandTotal");

function displayCart() {

    cartItems.innerHTML = "";

    let total = 0;

    // Empty cart
    if (cart.length === 0) {

        cartItems.innerHTML = `
            <div class="empty-cart text-center">
                <i class="bi bi-cart-x"></i>
                <h3>Your cart is empty</h3>
                <p>Add some products to your cart.</p>
                <a href="shop.html" class="btn btn-warning">
                    Continue Shopping
                </a>
            </div>
        `;

        subtotal.textContent = "Rs. 0";
        grandTotal.textContent = "Rs. 0";

        return;
    }

    // Display cart items
    cart.forEach(item => {

        const itemTotal =
            Number(item.price) * Number(item.quantity);

        total += itemTotal;

        cartItems.innerHTML += `
            <div class="cart-item">

                <div class="row align-items-center">

                    <!-- Product Image -->
                    <div class="col-md-3">

                        <img
                            src="${item.image}"
                            class="img-fluid rounded"
                            alt="${item.name}"
                        >

                    </div>


                    <!-- Product Details -->
                    <div class="col-md-3">

                        <h4>${item.name}</h4>

                        ${
                            item.color
                                ? `
                                    <p class="mb-1">
                                        <strong>Color :</strong>
                                        ${item.color}
                                    </p>
                                  `
                                : ""
                        }

                        ${
                            item.size
                                ? `
                                    <p class="mb-1">
                                        <strong>Size :</strong>
                                        ${item.size}
                                    </p>
                                  `
                                : ""
                        }

                        ${
                            item.option
                                ? `
                                    <p class="mb-1">
                                        <strong>Option :</strong>
                                        ${item.option}
                                    </p>
                                  `
                                : ""
                        }

                        <p class="text-warning">
                            Rs. ${Number(item.price).toLocaleString()}
                        </p>

                    </div>


                    <!-- Quantity -->
                    <div class="col-md-3 text-center">

                        <button
                            class="btn btn-warning btn-sm"
                            onclick="changeQuantity(
                                '${item.cartItemId}',
                                -1
                            )"
                        >
                            -
                        </button>

                        <span class="mx-3 fw-bold">
                            ${item.quantity}
                        </span>

                        <button
                            class="btn btn-warning btn-sm"
                            onclick="changeQuantity(
                                '${item.cartItemId}',
                                1
                            )"
                        >
                            +
                        </button>

                    </div>


                    <!-- Item Total -->
                    <div class="col-md-2 text-center">

                        <strong>
                            Rs. ${itemTotal.toLocaleString()}
                        </strong>

                    </div>


                    <!-- Delete -->
                    <div class="col-md-1 text-center">

                        <button
                            class="btn btn-danger btn-sm"
                            onclick="removeItem(
                                '${item.cartItemId}'
                            )"
                        >
                            <i class="bi bi-trash-fill"></i>
                        </button>

                    </div>

                </div>

            </div>
        `;
    });


    // Update totals
    subtotal.textContent =
        "Rs. " + total.toLocaleString();

    grandTotal.textContent =
        "Rs. " + total.toLocaleString();
}


// Remove item
window.removeItem = function(cartItemId) {

    const confirmDelete =
        confirm("Remove this product from the cart?");

    if (!confirmDelete) {
        return;
    }

    cart = cart.filter(
        item => item.cartItemId !== cartItemId
    );

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    displayCart();
};


// Change quantity
window.changeQuantity = function(cartItemId, change) {

    const product = cart.find(
        item => item.cartItemId === cartItemId
    );

    if (!product) {
        return;
    }

    product.quantity =
        Number(product.quantity) + Number(change);


    // Remove when quantity becomes 0
    if (product.quantity <= 0) {

        cart = cart.filter(
            item => item.cartItemId !== cartItemId
        );
    }


    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    displayCart();
};


// Load cart when page opens
displayCart();