import {
    db,
    auth,
    collection,
    getDocs
} from "./firebase.js";


import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";


import {
    deleteDoc,
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";



/* =====================================================
   ELEMENTS
===================================================== */

const ordersTableBody =
    document.getElementById("ordersTableBody");


const totalOrders =
    document.getElementById("totalOrders");


const pendingPayments =
    document.getElementById("pendingPayments");


const confirmedPayments =
    document.getElementById("confirmedPayments");


const pendingCollection =
    document.getElementById("pendingCollection");


const orderDetails =
    document.getElementById("orderDetails");


const exportOrdersBtn =
    document.getElementById("exportOrdersBtn");



/* =====================================================
   STORE ORDERS
===================================================== */

let allOrders = [];



/* =====================================================
   AUTH CHECK
===================================================== */

onAuthStateChanged(auth, (user) => {

    console.log("Current user:", user);


    if (!user) {

        console.log("No user logged in");

        window.location.href =
            "admin-login.html";

        return;

    }


    console.log(
        "Logged in as:",
        user.email
    );


    loadOrders();

});



/* =====================================================
   LOAD ORDERS
===================================================== */

async function loadOrders() {

    try {

        ordersTableBody.innerHTML = `

            <tr>

                <td
                    colspan="10"
                    class="loading">

                    <i class="bi bi-arrow-repeat"></i>

                    Loading orders...

                </td>

            </tr>

        `;


        const querySnapshot =
            await getDocs(
                collection(db, "orders")
            );


        allOrders = [];


        querySnapshot.forEach((document) => {

            allOrders.push({

                id: document.id,

                ...document.data()

            });

        });


        console.log(
            "Orders:",
            allOrders
        );


        updateStatistics();

        displayOrders();

    }
    catch (error) {

        console.error(
            "Error loading orders:",
            error
        );


        ordersTableBody.innerHTML = `

            <tr>

                <td
                    colspan="10"
                    class="empty">

                    <i
                        class="bi bi-exclamation-triangle">
                    </i>

                    Failed to load orders.

                    <br>

                    <small>

                        Check your Firebase configuration
                        and Firestore rules.

                    </small>

                </td>

            </tr>

        `;

    }

}



/* =====================================================
   UPDATE STATISTICS
===================================================== */

function updateStatistics() {

    totalOrders.textContent =
        allOrders.length;


    const pendingPaymentCount =
        allOrders.filter(order =>

            String(
                order.paymentStatus || ""
            ).toLowerCase() === "pending"

        ).length;


    const confirmedPaymentCount =
        allOrders.filter(order => {

            const status =
                String(
                    order.paymentStatus || ""
                ).toLowerCase();


            return (

                status === "confirmed" ||

                status === "paid"

            );

        }).length;


    const pendingCollectionCount =
        allOrders.filter(order =>

            String(
                order.collectionStatus || ""
            ).toLowerCase() === "pending"

        ).length;


    pendingPayments.textContent =
        pendingPaymentCount;


    confirmedPayments.textContent =
        confirmedPaymentCount;


    pendingCollection.textContent =
        pendingCollectionCount;

}



/* =====================================================
   DISPLAY ORDERS
===================================================== */

function displayOrders() {

    ordersTableBody.innerHTML = "";


    if (allOrders.length === 0) {

        ordersTableBody.innerHTML = `

            <tr>

                <td
                    colspan="10"
                    class="orders-empty">

                    <i class="bi bi-bag-x"></i>

                    No orders found.

                    <br>

                    <small>

                        Customer orders will appear here
                        after they successfully place an order.

                    </small>

                </td>

            </tr>

        `;

        return;

    }


    /*

       Sort using the original saved createdAt.

       No new date is created.

    */

    const sortedOrders =
        [...allOrders].sort((a, b) => {

            const dateA =
                getTimestampMilliseconds(
                    a.createdAt
                );


            const dateB =
                getTimestampMilliseconds(
                    b.createdAt
                );


            return dateB - dateA;

        });


    sortedOrders.forEach(
        (order, index) => {

            const row =
                document.createElement("tr");


            const customerName =
                order.customerName ||
                order.customer?.fullName ||
                "-";


            const customerEmail =
                order.customerEmail ||
                order.customer?.email ||
                "-";


            const itemCount =
                order.totalItems ??
                calculateTotalItems(
                    order.items
                );


            const total =
                Number(
                    order.total || 0
                );


            const paymentStatus =
                order.paymentStatus ||
                "Pending";


            const collectionStatus =
                order.collectionStatus ||
                "Pending";


            const savedDate =
                formatDate(
                    order.createdAt
                );


            row.innerHTML = `

                <td>

                    ${index + 1}

                </td>


                <td>

                    <span
                        class="order-number">

                        ${safe(
                            order.orderNumber || "-"
                        )}

                    </span>

                </td>


                <td>

                    <span
                        class="customer-name">

                        ${safe(
                            customerName
                        )}

                    </span>

                </td>


                <td>

                    ${safe(
                        customerEmail
                    )}

                </td>


                <td>

                    <span
                        class="item-count">

                        ${itemCount}

                    </span>

                </td>


                <td>

                    <span
                        class="order-total">

                        Rs.
                        ${total.toLocaleString()}

                    </span>

                </td>


                <td>

                    ${createPaymentSelect(
                        order.id,
                        paymentStatus
                    )}

                </td>


                <td>

                    ${createCollectionSelect(
                        order.id,
                        collectionStatus
                    )}

                </td>


                <td>

                    ${savedDate}

                </td>


                <td>

                    <button
                        class="order-view-btn"
                        onclick="viewOrder(
                            '${order.id}'
                        )">

                        <i
                            class="bi bi-eye-fill">
                        </i>

                        View

                    </button>


                    <button
                        class="order-delete-btn"
                        onclick="deleteOrder(
                            '${order.id}'
                        )">

                        <i
                            class="bi bi-trash-fill">
                        </i>

                        Delete

                    </button>

                </td>

            `;


            ordersTableBody.appendChild(row);

        }
    );

}



/* =====================================================
   PAYMENT STATUS SELECT
===================================================== */

function createPaymentSelect(
    orderId,
    status
) {

    const currentStatus =
        String(
            status || "Pending"
        );


    return `

        <select
            class="status-select"
            onchange="changePaymentStatus(
                '${orderId}',
                this.value
            )">


            <option
                value="Pending"
                ${
                    currentStatus === "Pending"
                    ? "selected"
                    : ""
                }>

                Pending

            </option>


            <option
                value="Confirmed"
                ${
                    currentStatus === "Confirmed"
                    ? "selected"
                    : ""
                }>

                Confirmed

            </option>


        </select>

    `;

}



/* =====================================================
   COLLECTION STATUS SELECT
===================================================== */

function createCollectionSelect(
    orderId,
    status
) {

    const currentStatus =
        String(
            status || "Pending"
        );


    return `

        <select
            class="status-select"
            onchange="changeCollectionStatus(
                '${orderId}',
                this.value
            )">


            <option
                value="Pending"
                ${
                    currentStatus === "Pending"
                    ? "selected"
                    : ""
                }>

                Pending

            </option>


            <option
                value="Collected"
                ${
                    currentStatus === "Collected"
                    ? "selected"
                    : ""
                }>

                Collected

            </option>


        </select>

    `;

}



/* =====================================================
   CHANGE PAYMENT STATUS
===================================================== */

window.changePaymentStatus =
    async function (
        orderId,
        newStatus
    ) {


        const order =
            allOrders.find(
                item =>
                    item.id === orderId
            );


        if (!order) {

            alert(
                "Order not found."
            );

            return;

        }


        const oldStatus =
            order.paymentStatus ||
            "Pending";


        if (
            oldStatus === newStatus
        ) {

            return;

        }


        const confirmed =
            confirm(
                `Change payment status from "${oldStatus}" to "${newStatus}"?`
            );


        if (!confirmed) {

            displayOrders();

            return;

        }


        try {

            await updateDoc(

                doc(
                    db,
                    "orders",
                    orderId
                ),

                {
                    paymentStatus:
                        newStatus
                }

            );


            /*
                Update local data only.

                createdAt is NOT changed.
            */

            order.paymentStatus =
                newStatus;


            updateStatistics();

            displayOrders();


            console.log(
                "Payment status updated:",
                orderId,
                newStatus
            );

        }
        catch (error) {

            console.error(
                "Payment status update failed:",
                error
            );


            alert(
                "Failed to update payment status.\n\n" +
                "Please check your Firestore rules."
            );


            displayOrders();

        }

    };



/* =====================================================
   CHANGE COLLECTION STATUS
===================================================== */

window.changeCollectionStatus =
    async function (
        orderId,
        newStatus
    ) {


        const order =
            allOrders.find(
                item =>
                    item.id === orderId
            );


        if (!order) {

            alert(
                "Order not found."
            );

            return;

        }


        const oldStatus =
            order.collectionStatus ||
            "Pending";


        if (
            oldStatus === newStatus
        ) {

            return;

        }


        const confirmed =
            confirm(
                `Change collection status from "${oldStatus}" to "${newStatus}"?`
            );


        if (!confirmed) {

            displayOrders();

            return;

        }


        try {

            await updateDoc(

                doc(
                    db,
                    "orders",
                    orderId
                ),

                {
                    collectionStatus:
                        newStatus
                }

            );


            /*
                Only collectionStatus changes.

                createdAt remains unchanged.
            */

            order.collectionStatus =
                newStatus;


            updateStatistics();

            displayOrders();


            console.log(
                "Collection status updated:",
                orderId,
                newStatus
            );

        }
        catch (error) {

            console.error(
                "Collection status update failed:",
                error
            );


            alert(
                "Failed to update collection status.\n\n" +
                "Please check your Firestore rules."
            );


            displayOrders();

        }

    };



/* =====================================================
   VIEW ORDER
===================================================== */

window.viewOrder =
    function (orderId) {


        const order =
            allOrders.find(
                item =>
                    item.id === orderId
            );


        if (!order) {

            alert(
                "Order not found."
            );

            return;

        }


        const customer =
            order.customer || {};


        const customerName =
            order.customerName ||
            customer.fullName ||
            "-";


        const customerEmail =
            order.customerEmail ||
            customer.email ||
            "-";


        const customerPhone =
            order.customerPhone ||
            customer.phone ||
            "-";


        const customerBatch =
            order.batch ||
            customer.batch ||
            "-";


        const items =
            Array.isArray(order.items)
                ? order.items
                : [];


        let itemsHTML = "";



        /* =================================================
           ITEMS
        ================================================== */

        if (items.length === 0) {

            itemsHTML = `

                <div class="no-receipt">

                    No items found.

                </div>

            `;

        }
        else {

            items.forEach(
                item => {

                    const itemTotal =
                        Number(
                            item.price || 0
                        ) *
                        Number(
                            item.quantity || 0
                        );


                    let itemInfo = "";


                    if (item.option) {

                        itemInfo +=
                            `${safe(
                                item.option
                            )}`;

                    }


                    if (item.color) {

                        itemInfo +=
                            ` | Color: ${
                                safe(item.color)
                            }`;

                    }


                    if (item.size) {

                        itemInfo +=
                            ` | Size: ${
                                safe(item.size)
                            }`;

                    }


                    itemsHTML += `

                        <div
                            class="order-product">


                            ${
                                item.image
                                ?

                                `
                                <img
                                    src="${safeAttribute(
                                        item.image
                                    )}"
                                    class="order-product-image"
                                    alt="${safeAttribute(
                                        item.name ||
                                        "Product"
                                    )}"
                                    onerror="
                                        this.style.display='none';
                                    "
                                >
                                `

                                :

                                `
                                <div
                                    class="
                                        order-product-image
                                        d-flex
                                        align-items-center
                                        justify-content-center
                                    ">

                                    <i
                                        class="bi bi-image">
                                    </i>

                                </div>
                                `
                            }


                            <div
                                class="order-product-info">


                                <div
                                    class="order-product-name">

                                    ${safe(
                                        item.name ||
                                        "-"
                                    )}

                                </div>


                                <div
                                    class="order-product-option">

                                    ${itemInfo}

                                </div>


                                <div
                                    class="order-product-option">

                                    Quantity:

                                    <strong>

                                        ${
                                            Number(
                                                item.quantity ||
                                                0
                                            )
                                        }

                                    </strong>

                                </div>


                                <div
                                    class="order-product-price">

                                    Rs.

                                    ${
                                        itemTotal.toLocaleString()
                                    }

                                </div>


                            </div>


                        </div>

                    `;

                }
            );

        }



        /* =================================================
           RECEIPT
        ================================================== */

        let receiptHTML = "";


        if (order.paymentSlipURL) {

            receiptHTML = `

                <img
                    src="${safeAttribute(
                        order.paymentSlipURL
                    )}"
                    class="payment-receipt"
                    alt="Payment Receipt"
                >


                <a
                    href="${safeAttribute(
                        order.paymentSlipURL
                    )}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="receipt-link">


                    <i
                        class="bi bi-box-arrow-up-right">
                    </i>


                    Open Receipt in New Tab


                </a>

            `;

        }
        else {

            receiptHTML = `

                <div class="no-receipt">

                    <i class="bi bi-image"></i>

                    Payment receipt not available.

                </div>

            `;

        }



        /* =================================================
           DETAILS
        ================================================== */

        orderDetails.innerHTML = `


            <!-- ORDER INFORMATION -->

            <div
                class="order-detail-section">


                <div
                    class="order-detail-title">

                    <i
                        class="bi bi-receipt">
                    </i>

                    Order Information

                </div>



                <div
                    class="order-detail-grid">


                    <div
                        class="order-detail-item">

                        <span
                            class="order-detail-label">

                            Order Number

                        </span>


                        <span
                            class="order-detail-value">

                            ${safe(
                                order.orderNumber ||
                                "-"
                            )}

                        </span>

                    </div>



                    <div
                        class="order-detail-item">

                        <span
                            class="order-detail-label">

                            Order Date

                        </span>


                        <span
                            class="order-detail-value">

                            ${formatDate(
                                order.createdAt
                            )}

                        </span>

                    </div>



                    <div
                        class="order-detail-item">

                        <span
                            class="order-detail-label">

                            Payment Status

                        </span>


                        <span
                            class="order-detail-value">

                            ${createStatusBadge(
                                order.paymentStatus ||
                                "Pending"
                            )}

                        </span>

                    </div>



                    <div
                        class="order-detail-item">

                        <span
                            class="order-detail-label">

                            Collection Status

                        </span>


                        <span
                            class="order-detail-value">

                            ${createStatusBadge(
                                order.collectionStatus ||
                                "Pending"
                            )}

                        </span>

                    </div>


                </div>


            </div>



            <!-- CUSTOMER -->

            <div
                class="order-detail-section">


                <div
                    class="order-detail-title">

                    <i
                        class="bi bi-person-fill">
                    </i>

                    Customer Information

                </div>



                <div
                    class="order-detail-grid">


                    <div
                        class="order-detail-item">

                        <span
                            class="order-detail-label">

                            Full Name

                        </span>


                        <span
                            class="order-detail-value">

                            ${safe(
                                customerName
                            )}

                        </span>

                    </div>



                    <div
                        class="order-detail-item">

                        <span
                            class="order-detail-label">

                            Email

                        </span>


                        <span
                            class="order-detail-value">

                            ${safe(
                                customerEmail
                            )}

                        </span>

                    </div>



                    <div
                        class="order-detail-item">

                        <span
                            class="order-detail-label">

                            Phone

                        </span>


                        <span
                            class="order-detail-value">

                            ${safe(
                                customerPhone
                            )}

                        </span>

                    </div>



                    <div
                        class="order-detail-item">

                        <span
                            class="order-detail-label">

                            Batch

                        </span>


                        <span
                            class="order-detail-value">

                            ${safe(
                                customerBatch
                            )}

                        </span>

                    </div>


                </div>


            </div>



            <!-- ORDER ITEMS -->

            <div
                class="order-detail-section">


                <div
                    class="order-detail-title">

                    <i
                        class="bi bi-bag-fill">
                    </i>

                    Ordered Items

                </div>


                ${itemsHTML}



                <div
                    class="order-detail-item mt-3">

                    <span
                        class="order-detail-label">

                        Total Items

                    </span>


                    <span
                        class="order-detail-value">

                        ${
                            order.totalItems ??
                            calculateTotalItems(items)
                        }

                    </span>

                </div>



                <div
                    class="order-detail-item">

                    <span
                        class="order-detail-label">

                        Order Total

                    </span>


                    <span
                        class="order-detail-value order-total">

                        Rs.

                        ${
                            Number(
                                order.total || 0
                            ).toLocaleString()
                        }

                    </span>

                </div>


            </div>



            <!-- RECEIPT -->

            <div
                class="order-detail-section">


                <div
                    class="order-detail-title">

                    <i
                        class="bi bi-image">
                    </i>

                    Payment Receipt

                </div>


                ${receiptHTML}


            </div>

        `;



        const modalElement =
            document.getElementById(
                "orderDetailsModal"
            );


        const modal =
            bootstrap.Modal.getOrCreateInstance(
                modalElement
            );


        modal.show();

    };



/* =====================================================
   DELETE ORDER
===================================================== */

window.deleteOrder =
    async function (orderId) {


        const order =
            allOrders.find(
                item =>
                    item.id === orderId
            );


        if (!order) {

            alert(
                "Order not found."
            );

            return;

        }


        const orderNumber =
            order.orderNumber ||
            "this order";


        const confirmed =
            confirm(
                `Are you sure you want to delete order ${orderNumber}?\n\nThis action cannot be undone.`
            );


        if (!confirmed) {

            return;

        }


        try {

            await deleteDoc(

                doc(
                    db,
                    "orders",
                    orderId
                )

            );


            alert(
                `Order ${orderNumber} deleted successfully.`
            );


            await loadOrders();

        }
        catch (error) {

            console.error(
                "Error deleting order:",
                error
            );


            alert(
                "Failed to delete the order.\n\n" +
                "Please check your Firestore rules."
            );

        }

    };



/* =====================================================
   STATUS BADGE
===================================================== */

function createStatusBadge(status) {

    const text =
        status || "Pending";


    const lowerStatus =
        text.toLowerCase();


    let className =
        "status-pending";


    if (
        lowerStatus === "confirmed" ||
        lowerStatus === "paid"
    ) {

        className =
            "status-confirmed";

    }


    if (
        lowerStatus === "collected" ||
        lowerStatus === "completed"
    ) {

        className =
            "status-collected";

    }


    return `

        <span
            class="status-badge ${className}">

            ${safe(text)}

        </span>

    `;

}



/* =====================================================
   CALCULATE TOTAL ITEMS
===================================================== */

function calculateTotalItems(items) {

    if (!Array.isArray(items)) {

        return 0;

    }


    return items.reduce(
        (total, item) => {

            return total +
                Number(
                    item.quantity || 0
                );

        },
        0
    );

}



/* =====================================================
   GET TIMESTAMP MILLISECONDS
===================================================== */

function getTimestampMilliseconds(
    timestamp
) {

    if (!timestamp) {

        return 0;

    }


    if (
        typeof timestamp.toMillis ===
        "function"
    ) {

        return timestamp.toMillis();

    }


    if (
        timestamp.seconds !== undefined
    ) {

        return (
            Number(timestamp.seconds) *
            1000
        );

    }


    if (
        timestamp instanceof Date
    ) {

        return timestamp.getTime();

    }


    return 0;

}



/* =====================================================
   FORMAT DATE
===================================================== */

function formatDate(timestamp) {

    const milliseconds =
        getTimestampMilliseconds(
            timestamp
        );


    if (!milliseconds) {

        return "-";

    }


    const date =
        new Date(milliseconds);


    return date.toLocaleString(
        "en-LK",
        {
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit"
        }
    );

}



/* =====================================================
   SAFE TEXT
===================================================== */

function safe(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "-";

    }


    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}



/* =====================================================
   SAFE ATTRIBUTE
===================================================== */

function safeAttribute(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}



/* =====================================================
   EXPORT ORDERS TO EXCEL
===================================================== */

exportOrdersBtn.addEventListener(
    "click",
    exportOrdersToExcel
);


function exportOrdersToExcel() {

    if (allOrders.length === 0) {

        alert(
            "There are no orders to export."
        );

        return;

    }


    if (
        typeof XLSX === "undefined"
    ) {

        alert(
            "Excel export library could not be loaded."
        );

        return;

    }


    try {

        exportOrdersBtn.disabled =
            true;


        exportOrdersBtn.innerHTML = `

            <i
                class="bi bi-arrow-repeat">
            </i>

            Preparing...

        `;



        /* =================================================
           ORDERS SHEET
        ================================================== */

        const ordersData =
            allOrders.map(
                order => {


                    const customer =
                        order.customer || {};


                    const customerName =
                        order.customerName ||
                        customer.fullName ||
                        "";


                    const customerEmail =
                        order.customerEmail ||
                        customer.email ||
                        "";


                    const customerPhone =
                        order.customerPhone ||
                        customer.phone ||
                        "";


                    const batch =
                        order.batch ||
                        customer.batch ||
                        "";


                    const totalItems =
                        order.totalItems ??
                        calculateTotalItems(
                            order.items
                        );


                    return {

                        "Order Number":
                            order.orderNumber ||
                            "",


                        "Customer Name":
                            customerName,


                        "Email":
                            customerEmail,


                        "Phone":
                            customerPhone,


                        "Batch":
                            batch,


                        "Total Items":
                            totalItems,


                        "Total Amount":
                            Number(
                                order.total || 0
                            ),


                        "Payment Status":
                            order.paymentStatus ||
                            "Pending",


                        "Collection Status":
                            order.collectionStatus ||
                            "Pending",


                        "Order Date":
                            formatDateForExcel(
                                order.createdAt
                            ),


                        "Payment Receipt URL":
                            order.paymentSlipURL ||
                            ""

                    };

                }
            );



        /* =================================================
           ORDER ITEMS SHEET
        ================================================== */

        const itemsData = [];


        allOrders.forEach(
            order => {


                const items =
                    Array.isArray(
                        order.items
                    )
                    ?
                    order.items
                    :
                    [];


                items.forEach(
                    item => {


                        const quantity =
                            Number(
                                item.quantity ||
                                0
                            );


                        const price =
                            Number(
                                item.price ||
                                0
                            );


                        itemsData.push({

                            "Order Number":
                                order.orderNumber ||
                                "",


                            "Product":
                                item.name ||
                                "",


                            "Option":
                                item.option ||
                                "",


                            "Color":
                                item.color ||
                                "",


                            "Size":
                                item.size ||
                                "",


                            "Quantity":
                                quantity,


                            "Unit Price":
                                price,


                            "Item Total":
                                price *
                                quantity

                        });

                    }
                );

            }
        );



        /* =================================================
           CREATE WORKBOOK
        ================================================== */

        const workbook =
            XLSX.utils.book_new();



        /* =================================================
           ORDERS WORKSHEET
        ================================================== */

        const ordersWorksheet =
            XLSX.utils.json_to_sheet(
                ordersData
            );


        XLSX.utils.book_append_sheet(
            workbook,
            ordersWorksheet,
            "Orders"
        );



        /* =================================================
           ITEMS WORKSHEET
        ================================================== */

        const itemsWorksheet =
            XLSX.utils.json_to_sheet(
                itemsData
            );


        XLSX.utils.book_append_sheet(
            workbook,
            itemsWorksheet,
            "Order Items"
        );



        /* =================================================
           COLUMN WIDTHS
        ================================================== */

        ordersWorksheet["!cols"] = [

            { wch: 18 },

            { wch: 25 },

            { wch: 32 },

            { wch: 16 },

            { wch: 12 },

            { wch: 12 },

            { wch: 15 },

            { wch: 18 },

            { wch: 18 },

            { wch: 25 },

            { wch: 60 }

        ];


        itemsWorksheet["!cols"] = [

            { wch: 18 },

            { wch: 25 },

            { wch: 25 },

            { wch: 12 },

            { wch: 10 },

            { wch: 12 },

            { wch: 15 },

            { wch: 15 }

        ];



        /* =================================================
           DOWNLOAD
        ================================================== */

        const now =
            new Date();


        const date =
            now.toISOString()
                .split("T")[0];


        const fileName =
            `MARIDIAN-26-Orders-${date}.xlsx`;


        XLSX.writeFile(
            workbook,
            fileName
        );


        alert(
            "Orders exported successfully."
        );

    }
    catch (error) {

        console.error(
            "Excel export error:",
            error
        );


        alert(
            "Failed to export orders."
        );

    }
    finally {

        exportOrdersBtn.disabled =
            false;


        exportOrdersBtn.innerHTML = `

            <i
                class="bi bi-file-earmark-excel-fill">
            </i>

            Export Excel

        `;

    }

}



/* =====================================================
   EXCEL DATE FORMAT
===================================================== */

function formatDateForExcel(
    timestamp
) {

    const milliseconds =
        getTimestampMilliseconds(
            timestamp
        );


    if (!milliseconds) {

        return "";

    }


    const date =
        new Date(milliseconds);


    return date.toLocaleString(
        "en-LK",
        {
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        }
    );

}