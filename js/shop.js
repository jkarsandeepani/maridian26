
/*=========================================================
    MARIDIAN '26 SHOP
=========================================================*/


/*=========================================================
    PRODUCTS
=========================================================*/


/*
    T-SHIRT
    -------------------------------------------------------
    Option 1 = White
    Option 2 = Blue
    Option 3 = Black
*/

const tshirtOptions = [

    {
        id: "tshirt-white",
        name: "Official T-Shirt",
        option: "White",
        color: "White",
        price: 1899,
        stock: 50,
        category: "Clothing",
        image: "../imagess/4.jpg"
    },

    {
        id: "tshirt-blue",
        name: "Official T-Shirt",
        option: "Blue",
        color: "Blue",
        price: 1999,
        stock: 50,
        category: "Clothing",
        image: "../imagess/6.jpg"
    },

    {
        id: "tshirt-black",
        name: "Official T-Shirt",
        option: "Black",
        color: "Black",
        price: 1999,
        stock: 50,
        category: "Clothing",
        image: "../imagess/5.jpg"
    }

];


/*
    CAP
    -------------------------------------------------------
*/

const capProduct = {

    id: "cap",
    name: "Event Cap",
    option: "Official MARIDIAN Cap",
    price: 900,
    stock: 40,
    category: "Clothing",
    image: "../imagess/7.jpg"

};


/*
    MERCH PACK
    -------------------------------------------------------
    Pack 1 = White
    Pack 2 = Blue
    Pack 3 = Black
*/

const merchPackOptions = [

    {
        id: "pack-white",
        name: "MARIDIAN Merch Pack",
        option: "White T-Shirt Pack",
        color: "White",
        price: 2599,
        stock: 20,
        category: "Bundle",
        image: "../imagess/1.jpg"
    },

    {
        id: "pack-blue",
        name: "MARIDIAN Merch Pack",
        option: "Blue T-Shirt Pack",
        color: "Blue",
        price: 2699,
        stock: 20,
        category: "Bundle",
        image: "../imagess/3.jpg"
    },

    {
        id: "pack-black",
        name: "MARIDIAN Merch Pack",
        option: "Black T-Shirt Pack",
        color: "Black",
        price: 2699,
        stock: 20,
        category: "Bundle",
        image: "../imagess/2.jpg"
    }

];


/*=========================================================
    HTML ELEMENTS
=========================================================*/

const tshirtImage =
    document.getElementById("tshirtImage");

const tshirtPrice =
    document.getElementById("tshirtPrice");

const tshirtOptionCount =
    document.getElementById("tshirtOptionCount");


const packImage =
    document.getElementById("packImage");

const packPrice =
    document.getElementById("packPrice");

const packOptionCount =
    document.getElementById("packOptionCount");


const capPrice =
    document.getElementById("capPrice");


const cartCount =
    document.getElementById("cartCount");


/*=========================================================
    CURRENT OPTIONS
=========================================================*/

let tshirtIndex = 0;

let packIndex = 0;


/*=========================================================
    SELECTED SIZES
=========================================================*/

let selectedTshirtSize = "";

let selectedPackSize = "";


/*=========================================================
    LOAD CART
=========================================================*/

let cart =
    JSON.parse(localStorage.getItem("cart")) || [];


updateCartCount();


/*=========================================================
    UPDATE T-SHIRT
=========================================================*/

function updateTshirt() {

    const product =
        tshirtOptions[tshirtIndex];


    tshirtImage.src =
        product.image;


    tshirtImage.alt =
        product.name + " - " + product.color;


    tshirtPrice.textContent =
        product.price.toLocaleString();


    tshirtOptionCount.textContent =
        `Option ${tshirtIndex + 1} / ${tshirtOptions.length}`;

}


/*=========================================================
    T-SHIRT PREVIOUS
=========================================================*/

const tshirtPrev =
    document.getElementById("tshirtPrev");


if (tshirtPrev) {

    tshirtPrev.addEventListener("click", function () {

        tshirtIndex--;


        if (tshirtIndex < 0) {

            tshirtIndex =
                tshirtOptions.length - 1;

        }


        updateTshirt();

    });

}


/*=========================================================
    T-SHIRT NEXT
=========================================================*/

const tshirtNext =
    document.getElementById("tshirtNext");


if (tshirtNext) {

    tshirtNext.addEventListener("click", function () {

        tshirtIndex++;


        if (tshirtIndex >= tshirtOptions.length) {

            tshirtIndex = 0;

        }


        updateTshirt();

    });

}


/*=========================================================
    UPDATE MERCH PACK
=========================================================*/

function updatePack() {

    const product =
        merchPackOptions[packIndex];


    packImage.src =
        product.image;


    packImage.alt =
        product.name + " - " + product.color;


    packPrice.textContent =
        product.price.toLocaleString();


    packOptionCount.textContent =
        `Pack ${packIndex + 1} / ${merchPackOptions.length}`;

}


/*=========================================================
    PACK PREVIOUS
=========================================================*/

const packPrev =
    document.getElementById("packPrev");


if (packPrev) {

    packPrev.addEventListener("click", function () {

        packIndex--;


        if (packIndex < 0) {

            packIndex =
                merchPackOptions.length - 1;

        }


        updatePack();

    });

}


/*=========================================================
    PACK NEXT
=========================================================*/

const packNext =
    document.getElementById("packNext");


if (packNext) {

    packNext.addEventListener("click", function () {

        packIndex++;


        if (packIndex >= merchPackOptions.length) {

            packIndex = 0;

        }


        updatePack();

    });

}


/*=========================================================
    SIZE BUTTONS
=========================================================*/

const sizeButtons =
    document.querySelectorAll(".size-btn");


sizeButtons.forEach(button => {

    button.addEventListener("click", function () {

        const product =
            this.dataset.product;


        const size =
            this.dataset.size;


        /*
            T-SHIRT SIZE
        */

        if (product === "tshirt") {

            selectedTshirtSize =
                size;

        }


        /*
            MERCH PACK SIZE
        */

        if (product === "pack") {

            selectedPackSize =
                size;

        }


        /*
            Remove selected class
            from the same product
        */

        document
            .querySelectorAll(
                `.size-btn[data-product="${product}"]`
            )
            .forEach(btn => {

                btn.classList.remove("selected");

            });


        /*
            Select clicked button
        */

        this.classList.add("selected");

    });

});


/*=========================================================
    ADD T-SHIRT TO CART
=========================================================*/

const addTshirtBtn =
    document.getElementById("addTshirtBtn");


if (addTshirtBtn) {

    addTshirtBtn.addEventListener("click", function () {

        /*
            Check size
        */

        if (selectedTshirtSize === "") {

            alert("Please select a T-Shirt size.");

            return;

        }


        const product =
            tshirtOptions[tshirtIndex];


        const quantity = 1;


        /*
            Same color + same size
            = same cart item.

            Different color or size
            = different cart item.
        */

        const cartItemId =
            `${product.id}-${selectedTshirtSize}`;


        const existing =
            cart.find(item =>
                item.cartItemId === cartItemId
            );


        if (existing) {

            existing.quantity += quantity;

        } else {

            cart.push({

                cartItemId: cartItemId,

                id: product.id,

                name: product.name,

                description:
                    "MARIDIAN official T-Shirt.",

                option: product.option,

                color: product.color,

                price: product.price,

                stock: product.stock,

                category: product.category,

                image: product.image,

                size: selectedTshirtSize,

                quantity: quantity

            });

        }


        /*
            Save cart
        */

        localStorage.setItem(
            "cart",
            JSON.stringify(cart)
        );


        updateCartCount();


        alert(
            product.name +
            " - " +
            product.color +
            " - Size " +
            selectedTshirtSize +
            " added to cart!"
        );

    });

}


/*=========================================================
    ADD CAP TO CART
=========================================================*/

const addCapBtn =
    document.getElementById("addCapBtn");


if (addCapBtn) {

    addCapBtn.addEventListener("click", function () {

        const quantity = 1;


        const cartItemId =
            "cap";


        const existing =
            cart.find(item =>
                item.cartItemId === cartItemId
            );


        if (existing) {

            existing.quantity += quantity;

        } else {

            cart.push({

                cartItemId: cartItemId,

                id: capProduct.id,

                name: capProduct.name,

                description:
                    "Limited edition MARIDIAN cap.",

                option: capProduct.option,

                price: capProduct.price,

                stock: capProduct.stock,

                category: capProduct.category,

                image: capProduct.image,

                size: "",

                quantity: quantity

            });

        }


        localStorage.setItem(
            "cart",
            JSON.stringify(cart)
        );


        updateCartCount();


        alert(
            capProduct.name +
            " added to cart!"
        );

    });

}


/*=========================================================
    ADD MERCH PACK TO CART
=========================================================*/

const addPackBtn =
    document.getElementById("addPackBtn");


if (addPackBtn) {

    addPackBtn.addEventListener("click", function () {

        /*
            Check size
        */

        if (selectedPackSize === "") {

            alert(
                "Please select a T-Shirt size for the Merch Pack."
            );

            return;

        }


        const product =
            merchPackOptions[packIndex];


        const quantity = 1;


        /*
            Same pack color + same size
            = same cart item.
        */

        const cartItemId =
            `${product.id}-${selectedPackSize}`;


        const existing =
            cart.find(item =>
                item.cartItemId === cartItemId
            );


        if (existing) {

            existing.quantity += quantity;

        } else {

            cart.push({

                cartItemId: cartItemId,

                id: product.id,

                name: product.name,

                description:
                    "Special MARIDIAN merchandise bundle.",

                option: product.option,

                color: product.color,

                price: product.price,

                stock: product.stock,

                category: product.category,

                image: product.image,

                size: selectedPackSize,

                quantity: quantity

            });

        }


        localStorage.setItem(
            "cart",
            JSON.stringify(cart)
        );


        updateCartCount();


        alert(
            product.name +
            " - " +
            product.color +
            " - Size " +
            selectedPackSize +
            " added to cart!"
        );

    });

}


/*=========================================================
    UPDATE CART COUNT
=========================================================*/

function updateCartCount() {

    let total = 0;


    cart.forEach(item => {

        total +=
            Number(item.quantity) || 0;

    });


    if (cartCount) {

        cartCount.textContent =
            total;

    }

}


/*=========================================================
    INITIAL LOAD
=========================================================*/

updateTshirt();

updatePack();

updateCartCount();