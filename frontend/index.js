document.addEventListener("DOMContentLoaded", function () {
    const contactForm = document.getElementById("contactform");

    contactForm.addEventListener("submit", async function (event) {
        // Prevent default form submission
        event.preventDefault();

        // Ambil nilai dari input dan textarea
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const message = document.getElementById("message").value;

        // Data yang akan dikirim ke backend
        const feedbackData = { name, email, message };

        try {
            // Kirim POST request ke backend
            const response = await fetch("https://web-foodscoop-api.vercel.app/menu/feedback", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(feedbackData),
            });

            if (!response.ok) {
                throw new Error("Failed to send feedback");
            }

            const result = await response.json();
            alert(result.message);

            // Reset form setelah berhasil
            contactForm.reset();
        } catch (error) {
            console.error("Error submitting feedback:", error);
            alert("Failed to send feedback. Please try again later.");
        }
    });
});
