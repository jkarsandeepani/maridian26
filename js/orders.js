/*=========================================================
    IMPORT FIREBASE
=========================================================*/

import { db } from "./firebase.js";

import {

    collection,
    onSnapshot,

    doc,

    deleteDoc

    

} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";


/*=========================================================
    HTML ELEMENTS
=========================================================*/

const ordersTable =
    document.getElementById("ordersTable");

const noOrders =
    document.getElementById("noOrders");


/*=========================================================
    STORE ORDERS
=========================================================*/

let orders = [];


/*=========================================================
    LOAD ORDERS
=========================================================*/

function loadOrders(){

    onSnapshot(

        collection(db,"orders"),

        (snapshot)=>{

            ordersTable.innerHTML = "";

            orders = [];

            let totalOrdersCount = 0;

            if(snapshot.empty){

                noOrders.classList.remove("d-none");

                document.getElementById("totalOrders").textContent = 0;

                return;

            }

            noOrders.classList.add("d-none");

            snapshot.forEach((doc,index)=>{

                totalOrdersCount++;

                const data = doc.data();

                orders.push({

                    id: doc.id,

                    ...data

                });

                ordersTable.innerHTML += `

                <tr>

                    <td>${index + 1}</td>

                    <td>${data.orderNumber}</td>

                    <td>${data.customerName}</td>

                    <td>Rs. ${Number(data.total).toLocaleString()}</td>

                    <td>

                        <button
                            class="btn btn-primary btn-sm"
                            onclick="window.open('${data.paymentSlipURL}','_blank')">

                            <i class="bi bi-eye-fill"></i>

                            View Slip

                        </button>

                    </td>

                    <td>

                        <button
                            class="btn btn-warning btn-sm"
                            onclick="viewOrder('${doc.id}')">

                            <i class="bi bi-card-list"></i>

                            Details

                        </button>

                        <button
                            class="btn btn-danger btn-sm mt-1"
                            onclick="deleteOrder('${doc.id}')">

                            <i class="bi bi-trash-fill"></i>

                            Delete

                        </button>

                    </td>

                </tr>

                `;

            });

            document.getElementById("totalOrders").textContent = totalOrdersCount;

        }

    );

}

/*=========================================================
    PAGE LOAD
=========================================================*/

loadOrders();

/*=========================================================
    VIEW ORDER DETAILS
=========================================================*/

window.viewOrder = function(id){

    const order = orders.find(item => item.id === id);

    if(!order){

        alert("Order not found.");

        return;

    }

    let products = "";

    order.items.forEach(item=>{

          products += `

<tr>

    <td>

        ${item.name}

        ${item.size ? `<br><small><strong>Size:</strong> ${item.size}</small>` : ""}

    </td>

    <td>${item.quantity}</td>

    <td>Rs. ${Number(item.price).toLocaleString()}</td>

</tr>

`;

    });

    document.getElementById("orderDetails").innerHTML = `

        <div class="row">

            <div class="col-md-6">

                <h5 class="mb-3">Customer Information</h5>

                <p><strong>Name :</strong> ${order.customerName}</p>

                <p><strong>Email :</strong> ${order.customerEmail}</p>

                <p><strong>Phone :</strong> ${order.customerPhone}</p>

                <p><strong>Batch :</strong> ${order.batch}</p>

                <p><strong>Notes :</strong> ${order.notes || "No Notes"}</p>

            </div>

            <div class="col-md-6">

                <h5 class="mb-3">Order Information</h5>

                <p><strong>Order No :</strong> ${order.orderNumber}</p>

                <p><strong>Total :</strong> Rs. ${Number(order.total).toLocaleString()}</p>

                <a

                    href="${order.paymentSlipURL}"

                    target="_blank"

                    class="btn btn-primary">

                    <i class="bi bi-image-fill"></i>

                    View Payment Receipt

                </a>

            </div>

        </div>

        <hr>

        <h5 class="mb-3">

            Ordered Products

        </h5>

        <table class="table table-dark">

            <thead>

                <tr>

                    <th>Product</th>

                    <th>Qty</th>

                    <th>Price</th>

                </tr>

            </thead>

            <tbody>

                ${products}

            </tbody>

        </table>

    `;

    const modal = new bootstrap.Modal(

        document.getElementById("orderModal")

    );

    modal.show();

};

/*=========================================================
    DELETE ORDER
=========================================================*/

window.deleteOrder = async function(id){

    const confirmDelete = confirm(

        "Are you sure you want to delete this order?"

    );

    if(!confirmDelete){

        return;

    }

    try{

        await deleteDoc(

            doc(db,"orders",id)

        );

        alert("Order deleted successfully!");

    }

    catch(error){

        console.error(error);

        alert("Failed to delete order.");

    }

};

/*=========================================================
    SEARCH ORDERS
=========================================================*/

const searchOrder = document.getElementById("searchOrder");

searchOrder.addEventListener("input", function () {

    const keyword = this.value.toLowerCase().trim();

    const rows = ordersTable.querySelectorAll("tr");

    rows.forEach((row) => {

        const rowText = row.textContent.toLowerCase();

        if (rowText.includes(keyword)) {

            row.style.display = "";

        }

        else {

            row.style.display = "none";

        }

    });

});

/*=========================================================
    EXPORT ORDERS TO EXCEL
=========================================================*/

document.getElementById("exportOrders").addEventListener("click", function () {

    if (orders.length === 0) {

        alert("No orders available!");

        return;

    }

    const excelData = orders.map((order, index) => ({

        "Order No": index + 1,

        "Order Number": order.orderNumber,

        "Customer Name": order.customerName,

        "Email": order.customerEmail,

        "Phone": order.customerPhone,

        "Batch": order.batch,

        "Total (Rs.)": order.total,

       
         "Products": order.items
    .map(item =>
        `${item.name}${item.size ? ` (${item.size})` : ""} x${item.quantity}`
    )
    .join(", "),

        "Payment Receipt": order.paymentSlipURL,

        "Order Date": order.createdAt
            ? order.createdAt.toDate().toLocaleString()
            : "-"

    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(

        workbook,

        worksheet,

        "Orders"

    );

    XLSX.writeFile(

        workbook,

        "MARIDIAN26_Orders.xlsx"

    );

});