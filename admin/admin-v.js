let editingIndex = null;

const token = localStorage.getItem('authToken');
if (!token) {
    console.error('Token tidak ditemukan. Tidak dapat mengambil data order.');
} else {
    console.log("Token : ", token.slice(0, 10) + '...');
}

function loadMenuItems() {
    const menuItemsList = document.getElementById('menuItemsList');
    menuItemsList.innerHTML = '';

    // Mengambil elemen loading
    const loadingElement = document.getElementById('loading');

    // Tampilkan animasi loading
    loadingElement.style.display = 'flex';

    // Fetch menu items from the backend
    fetch('https://web-foodscoop-api.vercel.app/menu/products')
        .then(response => response.json())
        .then(data => {
            if (data.message === "Success get all products" && Array.isArray(data.data)) {
                const menuItems = data.data;

                // Define the desired order of categories
                const categoryOrder = ["MAKANAN", "CEMILAN", "MINUMAN"];

                // Sort the menu items by category based on the desired order
                menuItems.sort((a, b) => {
                    return categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category);
                });

                // Render the sorted menu items
                menuItems.forEach(item => {
                    const itemDiv = document.createElement('div');
                    itemDiv.classList.add('item');
                    itemDiv.innerHTML = `
                        <img src="${item.images}" alt="${item.name}">
                        <div class="item-info">
                            <h6>${item.category}</h6>
                            <h5>${item.name}</h5>
                            <p>Harga: Rp${item.price.toLocaleString('id-ID')}</p>
                            <p class="item-description">${item.description}</p>
                        </div>
                        <div class="item-actions">
                            <button class="edit-btn" onclick="editMenuItem('${item._id}')">Edit</button>
                            <button class="delete-btn" onclick="deleteMenuItem('${item._id}')">Delete</button>
                        </div>
                    `;
                    menuItemsList.appendChild(itemDiv);
                });
            } else {
                console.error('Invalid response structure:', data);
            }
        })
        .catch(error => {
            console.error('Error fetching menu items:', error);
        })
        .finally(() => {
            // Sembunyikan animasi loading setelah proses selesai
            loadingElement.style.display = 'none';
        });
}


function scrollToOrderForm() {
    // Simpan status di sessionStorage
    sessionStorage.setItem("scrollToOrderForm", "true");

    // Refresh halaman
    location.reload();
}

// Event listener untuk menangani setelah refresh
document.addEventListener("DOMContentLoaded", () => {
    const shouldScroll = sessionStorage.getItem("scrollToOrderForm");

    if (shouldScroll === "true") {
        // Hapus status agar tidak scroll berulang kali
        sessionStorage.removeItem("scrollToOrderForm");

        // Tunggu sedikit sebelum scroll
        setTimeout(() => {
            const orderForm = document.querySelector(".order-form");
            if (orderForm) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }, 500); // Adjust delay as needed
    }
});

function handleSubmit() {
    if (editingIndex !== null) {
        updateMenuItem(editingIndex);
    } else {
        addMenuItem();
    }
}

async function addMenuItem() {
    const name = document.getElementById('itemName').value;
    const category = document.getElementById('itemCategory').value;
    const price = parseFloat(document.getElementById('itemPrice').value);
    const images = document.getElementById('itemImage').value;
    const description = document.getElementById('itemDescription').value;

    // Ambil token dari localStorage
    const token = localStorage.getItem('authToken');
    if (!token) {
        alert('Anda harus login untuk menambahkan produk.');
        return;
    }

    try {
        // Kirim data ke backend menggunakan method POST
        const response = await fetch('https://web-foodscoop-api.vercel.app/menu/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Tambahkan token di header
            },
            body: JSON.stringify({ name, category, price, images, description })
        });

        // Cek response dari server
        const data = await response.json();

        if (response.ok) {
            alert('produk berhasil ditambahkan!');
            loadMenuItems(); // Perbarui menu setelah item ditambahkan
            resetForm(); // Reset form input
        } else {
            alert('Gagal menambahkan produk. Silakan coba lagi.');
        }
    } catch (error) {
        console.error('Error adding menu item:', error);
        alert('Terjadi kesalahan. Silakan coba lagi.');
    }
}

async function updateMenuItem() {
    // Ambil data dari form
    const name = document.getElementById('itemName').value;
    const category = document.getElementById('itemCategory').value;
    const price = parseFloat(document.getElementById('itemPrice').value);
    const images = document.getElementById('itemImage').value;
    const description = document.getElementById('itemDescription').value;

    // Ambil token untuk autentikasi
    const token = localStorage.getItem('authToken');
    if (!token) {
        alert('Anda harus login untuk memperbarui produk.');
        return;
    }

    try {
        // Kirim permintaan PUT untuk memperbarui item menu
        const response = await fetch(`https://web-foodscoop-api.vercel.app/menu/products/${editingIndex}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Token untuk autentikasi
            },
            body: JSON.stringify({ name, category, price, images, description }) // Data yang akan diupdate
        });

        const data = await response.json();

        if (response.ok) {
            alert('Produk berhasil diperbarui!');
            loadMenuItems(); // Perbarui tampilan menu setelah item diperbarui
            resetForm(); // Reset form input setelah update
        } else {
            alert('Gagal memperbarui produk. Silakan coba lagi.');
        }
    } catch (error) {
        console.error('Error updating menu item:', error);
        alert('Terjadi kesalahan saat memperbarui produk. Silakan coba lagi.');
    }
}

async function deleteMenuItem(itemId) {
    // Ambil token dari localStorage
    const token = localStorage.getItem('authToken');
    if (!token) {
        alert('Anda harus login untuk menghapus produk.');
        return;
    }

    try {
        // Kirim permintaan DELETE ke backend
        const response = await fetch(`https://web-foodscoop-api.vercel.app/menu/products/${itemId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}` // Tambahkan token di header
            }
        });

        // Cek respons dari server
        const data = await response.json();

        if (response.ok) {
            alert('Produk berhasil dihapus!');
            loadMenuItems(); // Perbarui daftar menu setelah item dihapus
        } else {
            alert(data.message || 'Gagal menghapus produk. Silakan coba lagi.');
        }
    } catch (error) {
        console.error('Error deleting menu item:', error);
        alert('Terjadi kesalahan. Silakan coba lagi.');
    }
}

function editMenuItem(itemId) {
    // Pindah ke bagian paling atas halaman
    window.scrollTo({ top: 0, behavior: 'smooth' });

    console.log("Edit produk dengan ID:", itemId); // Debugging untuk memastikan ID benar

    // Ambil data menu berdasarkan ID
    fetch(`https://web-foodscoop-api.vercel.app/menu/products/${itemId}`)
        .then(response => response.json())
        .then(responseData => {
            console.log('Response data received:', responseData); // Debugging untuk melihat data yang diterima

            if (responseData.message === "Success get one product" && responseData.data) {
                const data = responseData.data; // Ambil detail item menu dari properti `data`

                // Isi form dengan data dari backend
                document.getElementById('itemName').value = data.name || ""; 
                document.getElementById('itemCategory').value = data.category || ""; 
                document.getElementById('itemPrice').value = data.price || ""; 
                document.getElementById('itemImage').value = data.images || ""; 
                document.getElementById('itemDescription').value = data.description || ""; 

                // Ubah tombol submit menjadi "Update Item"
                document.getElementById('submitButton').innerText = 'Perbarui';

                // Set `editingIndex` ke ID item yang sedang diedit
                editingIndex = itemId;
            } else {
                console.error('Data menu tidak ditemukan atau struktur data tidak sesuai.');
                alert('Menu item tidak ditemukan!');
            }
        })
        .catch(error => {
            console.error('Error fetching menu item:', error);
            alert('Terjadi kesalahan saat mengambil data. Silakan coba lagi.');
        });
}


function resetForm() {
    editingIndex = null;
    document.getElementById('menuItemForm').reset();
    document.getElementById('submitButton').innerText = 'Tambahkan';
}

document.getElementById('signOutBtn').addEventListener('click', function () {
    // Hapus token dari localStorage
    localStorage.removeItem('authToken');
    // Arahkan ke halaman index.html
    window.location.href = 'index.html';
});

// Initialize and load menu items from backend
loadMenuItems();
