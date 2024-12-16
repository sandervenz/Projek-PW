// Function to load the menu items from the backend
async function loadMenu() {
    try {
        const response = await fetch('https://web-foodscoop-api.vercel.app/menu/products'); // Fetching data from backend
        const data = await response.json(); // Parse the JSON response

        if (response.ok && data && data.data) {
            const menuItems = data.data; // Assuming the API returns an array of products in data.data
            const menuWrap = document.getElementById('menu-items');
            menuWrap.innerHTML = ''; // Clear existing content

            // Loop through the menu items and display them dynamically
            menuItems.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.classList.add('item');
                itemElement.dataset.id = item.id;
                itemElement.dataset.price = item.price;

                itemElement.innerHTML = `
                    <img src="${item.images || 'default-image.jpg'}" alt="${item.name}">
                    <h6>${item.category}</h6>
                    <h5>${item.name}</h5>
                    <p>${item.description}</p>
                    <p><strong>Rp ${(item.price)/1000}k</strong></p>
                    <div class="order-controls">
                        <button class="subtract-btn">-</button>
                        <input type="text" class="quantity" value="0" readonly>
                        <button class="add-btn">+</button>
                    </div>
                `;

                menuWrap.appendChild(itemElement);
            });

            // Call the function to attach event listeners to dynamically added items
            attachEventListeners();
        } else {
            console.error('Failed to fetch menu:', data.message || 'No data returned');
        }
    } catch (error) {
        console.error('Error fetching menu:', error);
    }
}

// Function to attach event listeners to dynamically added items
function attachEventListeners() {
    const items = document.querySelectorAll('.item');
    let totalPrice = 0;
    let order = [];

    items.forEach((item) => {
        const addButton = item.querySelector('.add-btn');
        const subtractButton = item.querySelector('.subtract-btn');
        const quantityInput = item.querySelector('.quantity');
 
        // Update total price per item
        function updateItemTotalPrice() {}

        // Update overall total price
        function updateOverallTotalPrice() {
            totalPrice = 0;
            order = [];
            items.forEach((item) => {
                const quantity = parseInt(item.querySelector('.quantity').value);
                const price = parseFloat(item.getAttribute('data-price'));
                const name = item.querySelector('h5').textContent;
                if (quantity > 0) {
                    order.push({ name, quantity, price, total: quantity * price });
                }
                totalPrice += quantity * price;
            });
            document.getElementById('total-price').textContent = totalPrice/1000;
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
    if (continueShoppingButton) {
        continueShoppingButton.addEventListener('click', () => {
            // Store the order data in localStorage
            localStorage.setItem('order', JSON.stringify(order));
            localStorage.setItem('totalPrice', totalPrice.toFixed(2));
            console.log('Order saved to localStorage:', order); // Debugging
            window.location.href = 'checkout.html'; // Navigate to the checkout page
        });
    }
}

// Call loadMenu when the page loads
window.onload = loadMenu;