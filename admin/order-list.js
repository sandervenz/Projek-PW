document.addEventListener("DOMContentLoaded", function () {
    const orderTableBody = document.getElementById('order-list-details');
    const orderSummary = document.getElementById('order-summary');
    const orderTotalPriceElement = document.getElementById('order-total-price');
    const orderTableNumber = document.getElementById('order-table-number');
    const orderEmail = document.getElementById('order-email');
    const orderPhoneNumber = document.getElementById('order-phone-number');
    const orderStatusElement = document.getElementById('order-status');
    const orderListContainer = document.querySelector('#order-list tbody');
    let currentOrderId = null; // Menyimpan ID order yang sedang ditampilkan

    // Fungsi untuk menampilkan item dalam tabel (detail order)
    function displayOrderItems(items) {
        orderTableBody.innerHTML = '';
        items.forEach(item => {
            const row = document.createElement('tr');
            const nameCell = document.createElement('td');
            nameCell.textContent = item.name;
            row.appendChild(nameCell);

            const quantityCell = document.createElement('td');
            quantityCell.textContent = item.quantity;
            row.appendChild(quantityCell);

            const totalCell = document.createElement('td');
            totalCell.textContent = `$${(item.quantity * item.price).toFixed(2)}`;
            row.appendChild(totalCell);

            orderTableBody.appendChild(row);
        });
    }

    // Fungsi untuk menampilkan informasi order
    function displayOrderDetails(order) {
        currentOrderId = order._id; // Simpan ID order saat ini
        orderEmail.textContent = order.email || "N/A";
        orderPhoneNumber.textContent = order.telp || "N/A";
        orderTableNumber.textContent = order.table || "N/A";
        orderStatusElement.value = order.status || "pending";
        orderTotalPriceElement.textContent = `${order.grandTotal.toFixed(2)}`;
    }

    const token = localStorage.getItem('authToken'); // Ambil token dari localStorage
        if (!token) {
            console.error('Token tidak ditemukan. Tidak dapat mengupdate status order.');
            return;
        } else {
            console.log("Token : ", token);
        }

    // Fungsi untuk mengubah status order
    function updateOrderStatus(orderId, newStatus) {
        fetch(`https://web-foodscoop-api.vercel.app/menu/orders/${orderId}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status: newStatus })
        })
        .then(async response => {
            if (!response.ok) { // Jika status HTTP bukan 2xx
                const errorData = await response.json();
                throw new Error(errorData.message || 'Something went wrong');
            }
            return response.json(); // Parse respons jika sukses
        })
        .then(data => {
            console.log('Response Data:', data);
            alert('Status order berhasil diperbarui!');
            // Refresh halaman setelah alert
            window.location.reload();
        })
        .catch(error => {
            console.error('Terjadi kesalahan:', error.message);
            alert(`Gagal memperbarui status order: ${error.message}`);
        });
        
        
    }

    // Event listener untuk mengubah status order
    orderStatusElement.addEventListener('change', function () {
        if (currentOrderId) {
            const newStatus = orderStatusElement.value;
            updateOrderStatus(currentOrderId, newStatus);
        }
    });

    // Mengambil data order dari API
    fetch('https://web-foodscoop-api.vercel.app/menu/orders', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    })
        .then(response => response.json())
        .then(data => {
            if (data && data.data && Array.isArray(data.data) && data.data.length > 0) {
                let orders = data.data;
    
                // Urutkan orders berdasarkan createdAt dari yang terbaru ke yang terlama
                orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
                // Tampilkan orders di daftar
                orders.forEach(order => {
                    const orderRow = document.createElement('tr');
                    orderRow.classList.add('order-item');
                    orderRow.innerHTML = `
                        <td>${order.table}</td>
                        <td>${order.email}</td>
                        <td>$${order.grandTotal.toFixed(2)}</td>
                        <td>${order.status || "Pending"}</td>
                        <td>
                            <button class="view-details-btn" data-id="${order._id}">View Details</button>
                        </td>
                    `;
    
                    orderListContainer.appendChild(orderRow);
                });
    
                // Tambahkan event listener untuk setiap tombol "View Details"
                document.querySelectorAll('.view-details-btn').forEach(button => {
                    button.addEventListener('click', function (e) {
                        const orderId = e.target.getAttribute('data-id');
                        const selectedOrder = orders.find(order => order._id === orderId);
    
                        if (selectedOrder) {
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
