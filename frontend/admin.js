// Fungsi untuk melakukan login dan mendapatkan Bearer Token
function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const errorMessage = document.getElementById("error-message");

    // Membuat payload untuk login
    const loginData = {
        username: username,
        password: password
    };

    // Melakukan request ke server untuk login
    fetch('http://localhost:3000/menu/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
    })
    .then(response => response.json())
    .then(data => {
        // Periksa apakah login berhasil dan token diberikan
        if (data.token) {
            // Simpan token Bearer di localStorage
            localStorage.setItem('authToken', data.token);

            // Redirect ke halaman dashboard admin
            window.location.href = "admin-v.html";  // Ganti dengan halaman dashboard admin kamu
        } else {
            // Tampilkan error jika token tidak ada
            errorMessage.textContent = "Invalid username or password!";
        }
    })
    .catch(error => {
        // Tangani error jika request gagal
        console.error('Error:', error);
        errorMessage.textContent = "An error occurred. Please try again later.";
    });
}