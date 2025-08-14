// --- Data (JSON) for products ---
const storeData = {
    products: [
        { id: 1, name: "Rose Bush", description: "A beautiful red rose bush, perfect for any garden.", price: 25.00, imageUrl: "https://placehold.co/600x400/8BC34A/ffffff?text=Rose+Bush", type: "plant" },
        { id: 2, name: "Sunflower Seeds", description: "Grow your own giant sunflowers with these premium seeds.", price: 3.50, imageUrl: "https://placehold.co/600x400/4CAF50/ffffff?text=Sunflower+Seeds", type: "seed" },
        { id: 3, name: "Succulent Collection", description: "A beautiful assortment of easy-to-care-for succulents.", price: 30.00, imageUrl: "https://placehold.co/600x400/6A89CC/ffffff?text=Succulent+Collection", type: "plant" },
        { id: 4, name: "Tomato Seeds", description: "Heirloom tomato seeds for a bountiful harvest.", price: 4.00, imageUrl: "https://placehold.co/600x400/D4E157/ffffff?text=Tomato+Seeds", type: "seed" },
        { id: 5, name: "Lavender Plant", description: "A fragrant lavender plant to attract pollinators.", price: 15.00, imageUrl: "https://placehold.co/600x400/9575CD/ffffff?text=Lavender+Plant", type: "plant" },
        { id: 6, name: "Herb Garden Kit", description: "A starter kit with basil, mint, and rosemary seeds.", price: 20.00, imageUrl: "https://placehold.co/600x400/A1887F/ffffff?text=Herb+Garden+Kit", type: "seed" },
    ]
};

let cart = []; // The cart array to hold products and quantities

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Element Selection ---
    const productsContainer = document.getElementById('products-container');
    const navLinks = document.getElementById('nav-links');
    const menuToggle = document.getElementById('menu-toggle');
    const cartLink = document.getElementById('cart-link');
    const cartModal = document.getElementById('cart-modal');
    const closeCartBtn = document.getElementById('close-cart');
    const cartCountSpan = document.getElementById('cart-count');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartTotalDiv = document.getElementById('cart-total');
    const orderButton = document.getElementById('order-button');
    const userDetailsModal = document.getElementById('user-details-modal');
    const closeDetailsModalBtn = document.getElementById('close-details-modal');
    const orderForm = document.getElementById('order-form');

    // --- Function to render products ---
    const renderProducts = () => {
        productsContainer.innerHTML = ''; // Clear previous content
        storeData.products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');
            productCard.innerHTML = `
                <img src="${product.imageUrl}" alt="${product.name}">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <p><strong>$${product.price.toFixed(2)}</strong></p>
                    <button class="buy-button" data-id="${product.id}">Add to Cart</button>
                </div>
            `;
            productsContainer.appendChild(productCard);
        });

        // Attach event listeners to all new "Add to Cart" buttons
        document.querySelectorAll('.buy-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = parseInt(e.target.dataset.id);
                const productToAdd = storeData.products.find(p => p.id === productId);
                addToCart(productToAdd);
            });
        });
    };

    // --- Cart functionality ---
    const updateCartCount = () => {
        const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
        cartCountSpan.textContent = totalItems;
    };

    const addToCart = (product) => {
        const existingItem = cart.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        updateCartCount();
        alert(`${product.name} added to cart! Total items: ${cart.reduce((acc, item) => acc + item.quantity, 0)}`);
    };

    const renderCart = () => {
        cartItemsContainer.innerHTML = '';
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
            cartTotalDiv.textContent = `$0.00`;
            return;
        }

        let total = 0;
        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item');
            const subtotal = item.price * item.quantity;
            total += subtotal;

            itemElement.innerHTML = `
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
                </div>
                <div class="cart-item-controls">
                    <span>$${subtotal.toFixed(2)}</span>
                </div>
            `;
            cartItemsContainer.appendChild(itemElement);
        });

        cartTotalDiv.textContent = `Total: $${total.toFixed(2)}`;
    };
    
    // --- Event Listeners ---
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });

    cartLink.addEventListener('click', (e) => {
        e.preventDefault();
        cartModal.style.display = 'flex';
        renderCart();
    });

    closeCartBtn.addEventListener('click', () => {
        cartModal.style.display = 'none';
    });
    
    closeDetailsModalBtn.addEventListener('click', () => {
        userDetailsModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
        }
        if (e.target === userDetailsModal) {
            userDetailsModal.style.display = 'none';
        }
    });

    orderButton.addEventListener('click', () => {
        if (cart.length > 0) {
            cartModal.style.display = 'none';
            userDetailsModal.style.display = 'flex';
        } else {
            alert('Your cart is empty. Please add items before ordering.');
        }
    });
    
    orderForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const userName = document.getElementById('user-name').value;
        const userEmail = document.getElementById('user-email').value;
        const userAddress = document.getElementById('user-address').value;
        
        try {
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userName,
                    userEmail,
                    userAddress,
                    cart,
                }),
            });

            if (response.ok) {
                alert('Order placed successfully! An email has been sent with the details.');
            } else {
                throw new Error('Failed to send order email.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('There was an error placing your order. Please try again.');
        }

        // Clear the cart and reset the form
        cart = [];
        updateCartCount();
        orderForm.reset();
        userDetailsModal.style.display = 'none';
    });

    // --- Initial render of content on page load ---
    renderProducts();
    updateCartCount(); // Initialize cart count
});
