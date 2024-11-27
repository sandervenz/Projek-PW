document.addEventListener('DOMContentLoaded', () => {
    // Fetch menu products
    fetch('http://localhost:3000/menu/products')
        .then(response => response.json())
        .then(products => {
            console.log('Menu Products:', products);
            // Setelah produk berhasil diambil, kita bisa menampilkan data produk di UI atau melanjutkan logika lainnya

            // Ambil data pesanan dari localStorage
            const order = JSON.parse(localStorage.getItem('order')) || [];
            let totalPrice = 0;

            // Hitung total harga dari semua item pesanan
            order.forEach(item => {
                const price = item.price || 0;
                const total = item.total || (item.quantity * price);
                totalPrice += total;
            });

            // Ambil elemen-elemen untuk menampilkan data
            const orderDetailsElement = document.getElementById('order-details');
            const totalPriceElement = document.getElementById('total-price');

            // Tampilkan data pesanan di tabel
            order.forEach(item => {
                const price = item.price || 0;
                const total = item.total || (item.quantity * price);

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

            // Event Klik Tombol CONFIRM ORDER
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
                    const price = item.price || 0;
                    const total = item.total || (item.quantity * price);

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
            });

            // Event Klik Tombol CONFIRM di Modal Struk
            document.getElementById('confirm-receipt-btn').addEventListener('click', () => {
                // Data order yang akan dikirim ke server
                const orderData = {
                    grandTotal: totalPrice,
                    orderItems: order.map(item => ({
                        productId: item.productId,  // Pastikan 'productId' ada di setiap item
                        name: item.name,
                        quantity: item.quantity,
                        price: item.price,
                        total: item.total || (item.quantity * item.price) // Hitung total jika belum ada
                    })),
                    email: emailInput.value,
                    telp: phoneInput.value,
                    table: tableNumberSelect.value,
                    status: 'pending', // Status pesanan sementara
                };

                // POST order ke server
                fetch('http://localhost:3000/menu/orders', { 
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(orderData)
                })
                .then(response => response.json())
                .then(data => {
                    console.log('Pesanan berhasil:', data);
                    // Tampilkan modal order completed atau redirect ke halaman lain
                    orderCompletedModal.style.display = 'block';
                })
                .catch(error => {
                    console.error('Error:', error);
                });
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
        })
        .catch(error => {
            console.error('Error fetching menu products:', error);
        });
});
