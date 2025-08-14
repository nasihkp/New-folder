document.addEventListener('DOMContentLoaded', () => {
    // Select the mobile menu button and the mobile menu container
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    // Add a click event listener to the mobile menu button
    mobileMenuBtn.addEventListener('click', () => {
        // Toggle the 'hidden' class on the mobile menu to show/hide it
        mobileMenu.classList.toggle('hidden');
    });

    // Handle smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            // Get the target element to scroll to
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            // If the element exists, scroll to it smoothly
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }

            // Hide the mobile menu after clicking a link
            if (!mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
            }
        });
    });

    // Dynamic Product Loading Functionality
    const productContainer = document.getElementById('product-container');
    const buyModal = document.getElementById('buy-modal');
    const modalProductName = document.getElementById('modal-product-name');
    const closeModalBtn = document.getElementById('close-modal-btn');

    // Function to fetch products from the JSON file
    async function fetchProducts() {
        try {
            const response = await fetch('products.json'); // Fetch the JSON file
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const products = await response.json(); // Parse the JSON data
            renderProducts(products); // Render the products
        } catch (error) {
            console.error('There was a problem fetching the products:', error);
            productContainer.innerHTML = '<p class="text-center text-red-500">Failed to load products. Please try again later.</p>';
        }
    }

    // Function to render the product cards on the page
    function renderProducts(products) {
        products.forEach(product => {
            // Create the main product card element
            const card = document.createElement('div');
            card.className = 'product-card bg-white rounded-xl shadow-lg overflow-hidden transition-transform transform hover:scale-105';

            // Populate the card with dynamic content using a template literal
            card.innerHTML = `
                <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover">
                <div class="p-6">
                    <h3 class="text-2xl font-bold text-gray-800 mb-2">${product.name}</h3>
                    <p class="text-gray-600 text-sm mb-4">${product.description}</p>
                    <div class="flex items-center justify-between">
                        <span class="text-2xl font-bold text-green-700">$${product.price.toFixed(2)}</span>
                        <button class="buy-btn bg-green-600 text-white py-2 px-6 rounded-full text-lg font-bold hover:bg-green-700 transition duration-300 transform hover:scale-105" data-product-name="${product.name}">Buy Now</button>
                    </div>
                </div>
            `;
            // Append the new card to the product container
            productContainer.appendChild(card);
        });

        // Attach event listeners to the "Buy Now" buttons after they are created
        document.querySelectorAll('.buy-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const productName = event.target.getAttribute('data-product-name');
                showBuyConfirmation(productName);
            });
        });
    }

    // Function to show the modal confirmation
    function showBuyConfirmation(productName) {
      modalProductName.textContent = productName;
      buyModal.classList.remove('hidden');
    }

    // Close modal when the button is clicked
    closeModalBtn.addEventListener('click', () => {
      buyModal.classList.add('hidden');
    });

    // Close modal when clicking outside of it
    buyModal.addEventListener('click', (event) => {
      if (event.target === buyModal) {
        buyModal.classList.add('hidden');
      }
    });

    // Call the function to fetch and render products when the page loads
    fetchProducts();
});
