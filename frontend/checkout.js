document.addEventListener('DOMContentLoaded', () => {
    // Ambil data pesanan dari localStorage
    const order = JSON.parse(localStorage.getItem('order')) || [];
    let totalPrice = 0;

    // Hitung total harga dari semua item pesanan
    order.forEach(item => {
        const price = item.price || 0; // Pastikan price memiliki nilai default
        const total = item.total || (item.quantity * price); // Hitung ulang total jika perlu
        totalPrice += total; // Tambahkan ke total harga keseluruhan
    });

    // Ambil elemen-elemen untuk menampilkan data
    const orderDetailsElement = document.getElementById('order-details');
    const totalPriceElement = document.getElementById('total-price');

    // Tampilkan data pesanan di tabel
    order.forEach(item => {
        const price = item.price || 0; // Pastikan price memiliki nilai default
        const total = item.total || (item.quantity * price); // Hitung ulang total jika perlu

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name || 'Unknown Item'}</td>
            <td>${item.quantity || 0}</td>
            <td>${price > 0 ? `$${price.toFixed(2)}` : 'N/A'}</td>
            <td>${total > 0 ? `$${total.toFixed(2)}` : 'N/A'}</td>
        `;
        orderDetailsElement.appendChild(row);
    });

    // Tampilkan total harga di bawah tabel
    totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;

    // Validasi form
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone-number');
    const tableNumberSelect = document.getElementById('table-number');
    const confirmOrderButton = document.getElementById('confirm-order-btn');

    const emailErrorElement = document.getElementById('email-error');
    const phoneErrorElement = document.getElementById('phone-error');
    const tableErrorElement = document.getElementById('table-error');

    const receiptModal = document.getElementById('receipt-modal');
    const transactionDate = document.getElementById('transaction-date');
    const receiptTableNumber = document.getElementById('receipt-table-number');
    const receiptEmail = document.getElementById('receipt-email');
    const receiptPhoneNumber = document.getElementById('receipt-phone-number');
    const receiptDetails = document.getElementById('receipt-details');
    const receiptTotalPrice = document.getElementById('receipt-total-price');

    const orderCompletedModal = document.getElementById('order-completed-modal');

    // Event Klik Tombol CETAK STRUCT
    confirmOrderButton.addEventListener('click', (event) => {
        event.preventDefault();

        // Validasi nomor meja
        if (!tableNumberSelect.value) {
            tableErrorElement.textContent = 'Silakan pilih nomor meja.';
            return;
        } else {
            tableErrorElement.textContent = '';
        }

        // Validasi email
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (emailInput.value && !emailPattern.test(emailInput.value)) {
            emailErrorElement.textContent = 'Masukkan alamat email yang valid.';
            return;
        } else {
            emailErrorElement.textContent = '';
        }

        // Validasi nomor telepon
        const phonePattern = /^(?:\+?\d{1,3})?[\s.-]?\(?\d{2,4}\)?[\s.-]?\d{2,4}[\s.-]?\d{2,4}$/;
        if (phoneInput.value && !phonePattern.test(phoneInput.value)) {
            phoneErrorElement.textContent = 'Masukkan nomor telepon yang valid.';
            return;
        } else {
            phoneErrorElement.textContent = '';
        }

        // Menyimpan data ke localStorage
        const orderData = {
            orderDetails: order,
            tableNumber: tableNumberSelect.value,
            email: emailInput.value,
            phoneNumber: phoneInput.value,
            totalPrice: totalPrice
        };

        localStorage.setItem('orderData', JSON.stringify(orderData));

        // Tampilkan modal struk dengan rincian pesanan
        receiptModal.style.display = 'block';

        const now = new Date();
        transactionDate.textContent = now.toLocaleString();
        receiptTableNumber.textContent = tableNumberSelect.value;
        receiptEmail.textContent = emailInput.value;
        receiptPhoneNumber.textContent = phoneInput.value;
        receiptTotalPrice.textContent = `$${totalPrice.toFixed(2)}`;

        // Tampilkan rincian pesanan di dalam modal struk
        receiptDetails.innerHTML = '';
        order.forEach(item => {
            const price = item.price || 0; // Pastikan price memiliki nilai default
            const total = item.total || (item.quantity * price); // Hitung ulang total jika perlu

            const itemRow = document.createElement('tr');
            itemRow.innerHTML = `
                <td>${item.name || 'Unknown Item'}</td>
                <td>${item.quantity || 0}</td>
                <td>${price > 0 ? `$${price.toFixed(2)}` : 'N/A'}</td>
                <td>${total > 0 ? `$${total.toFixed(2)}` : 'N/A'}</td>
            `;
            receiptDetails.appendChild(itemRow);
        });

        // Simpan data struk ke LocalStorage
        const receiptData = {
            transactionDate: now.toLocaleString(),
            tableNumber: tableNumberSelect.value,
            email: emailInput.value,
            phoneNumber: phoneInput.value,
            orderDetails: order,
            totalPrice: totalPrice
        };
        localStorage.setItem('receiptData', JSON.stringify(receiptData));

        // After confirming, show the "Order Completed" modal
        setTimeout(() => {
            // Close receipt modal
            receiptModal.style.display = 'none';

            // Show order completed modal
            orderCompletedModal.style.display = 'block';
        }, 1000);
    });

    // Tutup modal jika tombol tutup diklik
    document.getElementById('close-modal-btn').addEventListener('click', () => {
        receiptModal.style.display = 'none';
    });

    // Tutup modal jika tombol close pada order completed diklik
    document.getElementById('close-order-completed-btn').addEventListener('click', () => {
        orderCompletedModal.style.display = 'none';
    });

    // Redirect back to checkout page after order completed
    document.getElementById('back-to-home-btn').addEventListener('click', () => {
        window.location.href = 'checkout.html';
    });
});
