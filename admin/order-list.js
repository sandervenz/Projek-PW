document.addEventListener("DOMContentLoaded", function () {
    const orderTableBody = document.getElementById('order-list-details');
    const orderTotalPriceElement = document.getElementById('order-total-price');
    const orderName = document.getElementById('order-nama');
    const orderDate = document.getElementById('order-tgl');
    const orderUpdate = document.getElementById('order-update');
    const orderTableNumber = document.getElementById('order-table-number');
    const orderEmail = document.getElementById('order-email');
    const orderPhoneNumber = document.getElementById('order-phone-number');
    const orderStatusElement = document.getElementById('order-status');
    const orderListContainer = document.querySelector('#order-list tbody');
    const filterSelect = document.getElementById('filter-tanggal');
    let currentOrderId = null; // Menyimpan ID order yang sedang ditampilkan
    let allOrders = []; // Menyimpan semua data order

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
            totalCell.textContent = `Rp${(item.quantity * item.price).toLocaleString('id-ID')}`;
            row.appendChild(totalCell);

            orderTableBody.appendChild(row);
        });
    }

    // Fungsi untuk memformat tanggal
    function formatDate(isoString) {
        const date = new Date(isoString);

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Bulan dimulai dari 0
        const year = date.getFullYear();

        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${day}/${month}/${year} ${hours}:${minutes}`;
    }

    // Fungsi untuk menampilkan informasi order
    function displayOrderDetails(order) {
        const formattedDate = formatDate(order.createdAt);
        const UpdatedDate = formatDate(order.updatedAt);
        currentOrderId = order._id; // Simpan ID order saat ini
        orderName.textContent = order.username || "N/A";
        orderDate.textContent = formattedDate || "N/A";
        orderUpdate.textContent = UpdatedDate || "N/A";
        orderEmail.textContent = order.email || "N/A";
        orderPhoneNumber.textContent = order.telp || "N/A";
        orderTableNumber.textContent = order.table || "N/A";
        orderStatusElement.value = order.status || "pending";
        orderTotalPriceElement.textContent = `${order.grandTotal.toLocaleString('id-ID')}`;
    }

    // Fungsi untuk memfilter tanggal
    function filterOrdersByDate() {
        const filterValue = filterSelect.value;
        const now = new Date();

        let filteredOrders = allOrders.filter(order => {
            const orderDate = new Date(order.createdAt);
            if (filterValue === 'today') {
                return orderDate.toDateString() === now.toDateString();
            } else if (filterValue === 'this-week') {
                const startOfWeek = new Date(now);
                startOfWeek.setDate(now.getDate() - now.getDay()); // Hari pertama minggu ini
                return orderDate >= startOfWeek && orderDate <= now;
            } else if (filterValue === 'this-month') {
                return (
                    orderDate.getFullYear() === now.getFullYear() &&
                    orderDate.getMonth() === now.getMonth()
                );
            }
            return true; // Jika filter adalah 'all', tampilkan semua
        });

        displayOrders(filteredOrders);
    }

    // Fungsi untuk menampilkan daftar order di tabel
    function displayOrders(orders) {
        orderListContainer.innerHTML = '';
        orders.forEach(order => {
            const formattedDate = formatDate(order.createdAt);
            const orderRow = document.createElement('tr');
            orderRow.classList.add('order-item');
            orderRow.innerHTML = `
                <td>${order.table}</td>
                <td>${order.username}</td>
                <td>${formattedDate}</td>
                <td>Rp${order.grandTotal.toLocaleString('id-ID')}</td>
                <td>${order.status || "Pending"}</td>
                <td>
                    <button class="view-details-btn" data-id="${order._id}" title="View">
                        <i class="fa-solid fa-eye"></i>
                    </button>
                </td>
            `;

            orderListContainer.appendChild(orderRow);
        });

        // Tambahkan event listener untuk tombol "View Details"
        document.querySelectorAll('.view-details-btn, .view-details-btn i').forEach(button => {
            button.addEventListener('click', function (e) {
                const buttonElement = e.target.closest('.view-details-btn');
                if (!buttonElement) return;
                const orderId = buttonElement.getAttribute('data-id');
                const selectedOrder = allOrders.find(order => order._id === orderId);

                if (selectedOrder) {
                    displayOrderDetails(selectedOrder);
                    displayOrderItems(selectedOrder.orderItems);
                }
            });
        });
    }

    const token = localStorage.getItem('authToken');
    if (!token) {
        console.error('Token tidak ditemukan. Tidak dapat mengambil data order.');
        return;
    } else {
        console.log("Token : ", token);
    }

    // Mengambil elemen loading
    const loadingElement = document.getElementById('loading');

    // Tampilkan animasi loading
    loadingElement.style.display = 'flex';

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
            if (data && data.data && Array.isArray(data.data)) {
                allOrders = data.data;
                allOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                displayOrders(allOrders);
            } else {
                console.error('Data tidak ditemukan atau struktur respons tidak valid');
            }
        })
        .catch(error => {
            console.error('Error fetching orders:', error);
        })
        .finally(() => {
            // Sembunyikan animasi loading setelah proses selesai
            loadingElement.style.display = 'none';
        });


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
            alert(`Gagal memperbarui status order: ${error.message}`);
        })
    }
    

    // Event listener untuk mengubah status order
    orderStatusElement.addEventListener('change', function () {
        if (currentOrderId) {
            const newStatus = orderStatusElement.value;
            updateOrderStatus(currentOrderId, newStatus);
        }
    });

    // Event listener untuk perubahan filter
    filterSelect.addEventListener('change', filterOrdersByDate);

    document.getElementById('signOutBtn').addEventListener('click', function () {
        localStorage.removeItem('authToken');
        window.location.href = 'index.html';
    });
});
