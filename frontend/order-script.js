document.addEventListener('DOMContentLoaded', () => {
    const items = document.querySelectorAll('.item');
    let totalPrice = 0;
    let order = [];

    items.forEach((item) => {
        const addButton = item.querySelector('.add-btn');
        const subtractButton = item.querySelector('.subtract-btn');
        const quantityInput = item.querySelector('.quantity');
        const totalPriceElement = item.querySelector('.total-price');
        const pricePerItem = parseFloat(item.getAttribute('data-price'));
        const itemName = item.querySelector('h5').textContent;

        // Update total price per item
        function updateItemTotalPrice() {
            let quantity = parseInt(quantityInput.value);
            let itemTotal = pricePerItem * quantity;
            totalPriceElement.textContent = `Total: $${itemTotal.toFixed(2)}`;
        }

        // Update overall total price
        function updateOverallTotalPrice() {
            totalPrice = 0;
            order = [];
            items.forEach((item) => {
                const quantity = parseInt(item.querySelector('.quantity').value);
                const price = parseFloat(item.getAttribute('data-price'));
                const name = item.querySelector('h5').textContent;
                if (quantity > 0) {
                    order.push({ name, quantity, total: quantity * price });
                }
                totalPrice += quantity * price;
            });
            document.getElementById('total-price').textContent = totalPrice.toFixed(2);
        }

        // Add item quantity
        addButton.addEventListener('click', () => {
            let quantity = parseInt(quantityInput.value);
            quantityInput.value = quantity + 1;
            updateItemTotalPrice();
            updateOverallTotalPrice();
        });

        // Subtract item quantity
        subtractButton.addEventListener('click', () => {
            let quantity = parseInt(quantityInput.value);
            if (quantity > 0) {
                quantityInput.value = quantity - 1;
                updateItemTotalPrice();
                updateOverallTotalPrice();
            }
        });
    });

    // Continue Shopping button
    const continueShoppingButton = document.getElementById('continue-shopping-btn');
    continueShoppingButton.addEventListener('click', () => {
        // Store the order data in localStorage
        localStorage.setItem('order', JSON.stringify(order));
        localStorage.setItem('totalPrice', totalPrice.toFixed(2));
        window.location.href = 'checkout.html'; // Navigate to the checkout page
    });
});
