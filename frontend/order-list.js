document.addEventListener("DOMContentLoaded", function () {
    const orderTableBody = document.getElementById('order-list-details');
    const orderSummary = document.getElementById('order-summary');
    const orderTotalPriceElement = document.getElementById('order-total-price');
    const orderTableNumber = document.getElementById('order-table-number');
    const orderEmail = document.getElementById('order-email');
    const orderPhoneNumber = document.getElementById('order-phone-number');
    const orderStatusElement = document.getElementById('order-status');
    const orderListContainer = document.querySelector('#order-list tbody'); // Mengambil tbody untuk daftar order

    // Fungsi untuk menampilkan item dalam tabel (detail order)
    function displayOrderItems(items) {
        // Kosongkan tabel order item sebelumnya
        orderTableBody.innerHTML = '';

        items.forEach(item => {
            const row = document.createElement('tr');
            
            // Kolom untuk nama item
            const nameCell = document.createElement('td');
            nameCell.textContent = item.name;
            row.appendChild(nameCell);

            // Kolom untuk kuantitas
            const quantityCell = document.createElement('td');
            quantityCell.textContent = item.quantity;
            row.appendChild(quantityCell);

            // Kolom untuk total harga item
            const totalCell = document.createElement('td');
            totalCell.textContent = `$${(item.quantity * item.price).toFixed(2)}`; // Tambahkan tanda $
            row.appendChild(totalCell);

            orderTableBody.appendChild(row);
        });
    }

    // Fungsi untuk menampilkan informasi order
    function displayOrderDetails(order) {
        orderEmail.textContent = order.email || "N/A";
        orderPhoneNumber.textContent = order.telp || "N/A";
        orderTableNumber.textContent = order.table || "N/A";
        orderStatusElement.value = order.status || "pending";
        orderTotalPriceElement.textContent = `${order.grandTotal.toFixed(2)}`; // Tambahkan tanda $
    }

    // Mengambil data order dari API
    fetch('http://localhost:3000/menu/orders')
        .then(response => response.json())
        .then(data => {
            // Memeriksa apakah data dan data.data ada
            if (data && data.data && Array.isArray(data.data) && data.data.length > 0) {
                const orders = data.data; // Semua order yang diterima

                // Menampilkan daftar order pada kolom kiri
                orders.forEach(order => {
                    const orderRow = document.createElement('tr');
                    orderRow.classList.add('order-item'); // Tambahkan kelas untuk klik event
                    
                    // Menampilkan informasi order sesuai urutan tabel baru
                    orderRow.innerHTML = `
                        <td>${order.table}</td>
                        <td>${order.email}</td>
                        <td>$${order.grandTotal.toFixed(2)}</td> <!-- Tambahkan tanda $ -->
                        <td>${order.status || "Pending"}</td>
                        <td>
                            <button class="view-details-btn" data-id="${order._id}">View Details</button>
                        </td>
                    `;

                    // Menambahkan row ke dalam daftar order
                    orderListContainer.appendChild(orderRow);
                });

                // Menambahkan event listener untuk setiap tombol "View Details"
                document.querySelectorAll('.view-details-btn').forEach(button => {
                    button.addEventListener('click', function (e) {
                        const orderId = e.target.getAttribute('data-id');
                        const selectedOrder = orders.find(order => order._id === orderId);

                        if (selectedOrder) {
                            // Tampilkan informasi dan item pesanan dari order yang dipilih
                            displayOrderDetails(selectedOrder);
                            displayOrderItems(selectedOrder.orderItems);
                        }
                    });
                });
            } else {
                console.error('Data tidak ditemukan atau struktur respons tidak valid');
            }
        })
        .catch(error => {
            console.error('Error fetching orders:', error);
        });
});
