/*=========================================================
    GLOBAL VILLAGE 5.0 SHOP
=========================================================*/

/*=========================================================
    PRODUCTS
=========================================================*/

const products = [

    {

        id:1,

        name:"Official T-Shirt",

        description:"MARIDIAN official T-Shirt.",

        price:2500,

        stock:50,

        category:"Clothing",

        image:"../imagess/tee.jpg",

        hasSize:true

    },

    {

        id:2,

        name:"Event Cap",

        description:"Limited edition MARIDIAN cap.",

        price:1200,

        stock:40,

        category:"Clothing",

        image:"../imagess/cap.jpg",
        hasSize:false

    },

   
    {

        id:3,

        name:"Tote Bag",

        description:"Eco-friendly tote bag.",

        price:1800,

        stock:25,

        category:"Accessories",

        image:"../imagess/tote bag.jpg",
         hasSize:false

    },

    {
    id:4,

    name:"Official Pen",

    description:"Premium MARIDIAN branded pen for everyday use.",

    price:350,

    stock:100,

    category:"Stationery",

    image:"../imagess/pen.jpg",

    hasSize:false

},

{
    id:5,

    name:"Official Key Tag",

    description:"Exclusive MARIDIAN acrylic key tag.",

    price:450,

    stock:80,

    category:"Accessories",

    image:"../imagess/key tag.jpg",

    hasSize:false

},

{
    id:6,

    name:"Nail Art Stickers",

    description:"Limited edition MARIDIAN themed nail art stickers.",

    price:500,

    stock:60,

    category:"Accessories",

    image:"../imagess/nail art.jpg",

    hasSize:false

},

{
    id:7,

    name:"Official Notebook",

    description:"Premium MARIDIAN notebook with custom cover design.",

    price:850,

    stock:70,

    category:"Stationery",

    image:"../imagess/note.jpg",

    hasSize:false

},

{
    id:8,

    name:"MARIDIAN Merch Pack",

    description:"Special bundle including T-Shirt, Cap, Notebook, Pen and Key Tag.",

    price:4900,

    stock:20,

    category:"Bundle",

    image:"../imagess/merch pack.jpg",

    hasSize:true

},

];


/*=========================================================
    HTML ELEMENTS
=========================================================*/

const productContainer=document.getElementById("productContainer");

const searchBox=document.getElementById("searchBox");

const categoryFilter=document.getElementById("categoryFilter");

const cartCount=document.getElementById("cartCount");



/*=========================================================
    LOAD CART
=========================================================*/

let cart = JSON.parse(localStorage.getItem("cart")) || [];

updateCartCount();


/*=========================================================
    DISPLAY PRODUCTS
=========================================================*/

function displayProducts(productList){

    productContainer.innerHTML="";

    productList.forEach(product=>{

        productContainer.innerHTML+=`

        <div class="col-lg-3 col-md-6">

            <div class="product-card">

                <img
                    src="${product.image}"
                    class="product-image"
                    alt="${product.name}">

                <div class="product-body">

                    <span class="badge bg-warning text-dark mb-2">

                        ${product.category}

                    </span>

                    <h4 class="product-title">

                        ${product.name}

                    </h4>

                    <p class="product-description">

                        ${product.description}

                    </p>

                    <div class="product-price">

                        Rs. ${product.price.toLocaleString()}

                    </div>

                    <div class="stock">

                        ${product.stock} In Stock

                    </div>
                    ${product.hasSize ? `

<select
    class="form-select mt-3"
    id="size-${product.id}">

    <option value="">Select Size</option>

    <option value="XS">XS</option>

    <option value="S">S</option>

    <option value="M">M</option>

    <option value="L">L</option>

    <option value="XL">XL</option>

    <option value="XXL">XXL</option>

</select>

` : ""}

                    <div class="text-warning mt-3">

                        ★★★★★

                    </div>

                    <div class="quantity-box">

                        <button
                            class="qty-btn"
                            onclick="changeQty(${product.id},-1)">

                            -

                        </button>

                        <div
                            class="qty"
                            id="qty-${product.id}">

                            1

                        </div>

                        <button
                            class="qty-btn"
                            onclick="changeQty(${product.id},1)">

                            +

                        </button>

                    </div>

                    <button
                        class="cart-btn"
                        onclick="addToCart(${product.id})">

                        <i class="bi bi-cart-plus"></i>

                        Add To Cart

                    </button>

                </div>

            </div>

        </div>

        `;

    });

}


/*=========================================================
    QUANTITY
=========================================================*/

window.changeQty=function(id,change){

    const qty=document.getElementById(`qty-${id}`);

    let value=parseInt(qty.textContent);

    value+=change;

    if(value<1){

        value=1;

    }

    qty.textContent=value;

}


/*=========================================================
    ADD TO CART
=========================================================*/

window.addToCart = function(id){

    const product = products.find(item => item.id === id);

    const quantity = parseInt(
        document.getElementById(`qty-${id}`).textContent
    );

    let size = "";

    if(product.hasSize){

        size = document.getElementById(`size-${id}`).value;

        if(size === ""){

            alert("Please select a T-Shirt size.");

            return;

        }

    }

    const existing = cart.find(item =>
        item.id === id &&
        item.size === size
    );

    if(existing){

        existing.quantity += quantity;

    }else{

        cart.push({

            ...product,

            quantity,

            size

        });

    }

    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartCount();

    alert(product.name + " added to cart!");

}

/*=========================================================
    SEARCH
=========================================================*/

searchBox.addEventListener("input",function(){

    const keyword=this.value.toLowerCase();

    const filtered=products.filter(product=>

        product.name.toLowerCase().includes(keyword)

    );

    displayProducts(filtered);

});


/*=========================================================
    CATEGORY FILTER
=========================================================*/

categoryFilter.addEventListener("change",function(){

    const category=this.value;

    if(category==="all"){

        displayProducts(products);

        return;

    }

    const filtered=products.filter(product=>

        product.category===category

    );

    displayProducts(filtered);

});

/*=========================================================
    UPDATE CART COUNT
=========================================================*/

function updateCartCount(){

    let total = 0;

    cart.forEach(item=>{

        total += item.quantity;

    });

    cartCount.textContent = total;

}

/*=========================================================
    PAGE LOAD
=========================================================*/

displayProducts(products);
updateCartCount();
