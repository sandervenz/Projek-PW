document.addEventListener('DOMContentLoaded', () => {
    const order = JSON.parse(localStorage.getItem('order')) || [];
    const totalPrice = parseFloat(localStorage.getItem('totalPrice')) || 0;

    const orderDetailsContainer = document.getElementById('order-details');
    const totalPriceElement = document.getElementById('total-price');
    const confirmOrderButton = document.getElementById('confirm-order-btn');
    const tableNumberSelect = document.getElementById('table-number');
    const tableError = document.getElementById('table-error');

    const receiptModal = document.getElementById('receipt-modal');
    const closeModalButton = document.getElementById('close-modal-btn');
    const receiptDetails = document.getElementById('receipt-details');
    const receiptTotalPrice = document.getElementById('receipt-total-price');
    const transactionDate = document.getElementById('transaction-date');
    const receiptTableNumber = document.getElementById('receipt-table-number');

    // Display order details
    order.forEach(item => {
        const itemRow = document.createElement('tr');
        itemRow.innerHTML = `
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>$${item.total.toFixed(2)}</td>
        `;
        orderDetailsContainer.appendChild(itemRow);
    });

    totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;

    // Handle "CETAK STRUCT" button click
    confirmOrderButton.addEventListener('click', () => {
        const tableNumber = tableNumberSelect.value;
        if (!tableNumber) {
            tableError.textContent = "Please select a table number.";
            return;
        }

        // Populate receipt modal
        receiptDetails.innerHTML = "";
        order.forEach(item => {
            const receiptRow = document.createElement('tr');
            receiptRow.innerHTML = `
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>$${item.total.toFixed(2)}</td>
            `;
            receiptDetails.appendChild(receiptRow);
        });

        receiptTotalPrice.textContent = `$${totalPrice.toFixed(2)}`;
        receiptTableNumber.textContent = `Table ${tableNumber}`;
        transactionDate.textContent = new Date().toLocaleString();

        // Show the modal
        receiptModal.style.display = "flex";
    });

    // Close modal
    closeModalButton.addEventListener('click', () => {
        receiptModal.style.display = "none";
    });
});
