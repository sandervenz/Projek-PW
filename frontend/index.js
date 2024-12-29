document.addEventListener("DOMContentLoaded", function () {
    const contactForm = document.getElementById("contactform");
    const loader = document.getElementById("loader"); // Loader element
    const orderCompletedModal = document.getElementById("order-completed-modal"); // Modal element
    const closeOrderCompletedBtn = document.getElementById("close-order-completed-btn"); // Close button for modal
    const backToHomeBtn = document.getElementById("back-to-home-btn"); // Back to home button

    // Tutup modal ketika tombol close diklik
    closeOrderCompletedBtn.addEventListener("click", () => {
        orderCompletedModal.style.display = "none";
    });

    // Redirect ke halaman beranda
    backToHomeBtn.addEventListener("click", () => {
        window.location.href = "index.html";
    });

    contactForm.addEventListener("submit", async function (event) {
        // Prevent default form submission
        event.preventDefault();

        // Ambil nilai dari input dan textarea
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const message = document.getElementById("message").value;

        // Data yang akan dikirim ke backend
        const feedbackData = { name, email, message };

        // Tampilkan loader
        loader.classList.add("visible");

        try {
            // Kirim POST request ke backend
            const response = await fetch("https://web-foodscoop-api.vercel.app/menu/feedback", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(feedbackData),
            });

            // Hide loader setelah respons diterima
            loader.classList.remove("visible");

            if (!response.ok) {
                throw new Error("Failed to send feedback");
            }

            const result = await response.json();

            // Tampilkan modal pop-up
            orderCompletedModal.style.display = "block";

            // Reset form setelah berhasil
            contactForm.reset();
        } catch (error) {
            console.error("Error submitting feedback:", error);

            // Hide loader jika terjadi error
            loader.classList.remove("visible");

            alert("Gagal mengirim pesan. Coba lagi nanti.");
        }
    });
});
