// Function to generate the invoice
function generateInvoice() {
    const tableNumber = document.getElementById("table-number").value;
    if (!tableNumber) {
        alert("Please enter your table number.");
        return;
    }

    // Get current date and time
    const date = new Date();
    const formattedDate = date.toLocaleDateString();
    const formattedTime = date.toLocaleTimeString();

    // Update the invoice details
    document.getElementById("invoice-table-number").textContent = tableNumber;
    document.getElementById("invoice-date").textContent = formattedDate;
    document.getElementById("invoice-time").textContent = formattedTime;

    // Display the ordered items
    const invoiceItemsList = document.getElementById("invoice-items");
    invoiceItemsList.innerHTML = ""; // Clear any previous items
    orderedItems.forEach(item => {
        const listItem = document.createElement("li");
        listItem.textContent = `${item.name} - $${item.price.toFixed(2)}`;
        invoiceItemsList.appendChild(listItem);
    });

    // Display the total amount
    document.getElementById("invoice-total-amount").textContent = totalPrice.toFixed(2);

    // Hide the order summary and show the invoice section
    document.getElementById("order-summary").style.display = "none";
    document.getElementById("payment-section").style.display = "none";
    document.getElementById("invoice-section").style.display = "block";
}

// Function to print the invoice
function printInvoice() {
    const invoiceSection = document.getElementById("invoice-section");
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write('<html><head><title>Invoice</title></head><body>');
    printWindow.document.write(invoiceSection.innerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
}
