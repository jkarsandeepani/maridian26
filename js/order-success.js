const orderNumber = localStorage.getItem("orderNumber");

document.getElementById("orderNumber").textContent =
orderNumber || "N/A";