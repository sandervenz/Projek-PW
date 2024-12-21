async function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const errorMessage = document.getElementById("error-message");
    const loadingOverlay = document.getElementById("loadingOverlay");

    try {
        // Tampilkan animasi loading
        loadingOverlay.classList.add('visible');

        // Kirim POST request ke server untuk login
        const response = await fetch('https://web-foodscoop-api.vercel.app/menu/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        // Cek status response
        const data = await response.json();

        if (response.ok) {
            // Simpan token di localStorage
            localStorage.setItem('authToken', data.data);

            // Redirect ke halaman admin atau dashboard
            window.location.href = "order-list.html";
        } else {
            // Tampilkan pesan error jika login gagal
            errorMessage.textContent = 'Login gagal!';
        }
    } catch (error) {
        // Tangani error jika request gagal
        errorMessage.textContent = 'Terjadi kesalahan. Silakan coba lagi.';
    } finally {
        // Sembunyikan animasi loading
        loadingOverlay.classList.remove('visible');
    }
}
