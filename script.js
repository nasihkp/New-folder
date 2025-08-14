document.addEventListener('DOMContentLoaded', () => {
    // Fetch product data from the external JSON file
    fetch('products.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(productData => {
            const plantsContainer = document.getElementById('plants-container');
            const seedsContainer = document.getElementById('seeds-container');
            const navLinks = document.querySelectorAll('.nav-link');
            const contentSections = document.querySelectorAll('.content-section');
            const modal = document.getElementById('product-modal');
            const closeModalBtn = document.getElementById('close-modal-btn');
            const menuBtn = document.getElementById('menu-btn');
            const navLinksContainer = document.getElementById('nav-links');

            // Function to render product cards
            const renderProducts = (products, container) => {
                container.innerHTML = '';
                products.forEach(product => {
                    const card = document.createElement('div');
                    card.className = 'bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer';
                    card.innerHTML = `
                        <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover rounded-t-lg">
                        <div class="p-4">
                            <h4 class="text-xl font-bold text-green-800">${product.name}</h4>
                            <p class="text-lg text-gray-700 font-medium my-2">${product.price}</p>
                            <p class="text-sm text-gray-500">${product.description.substring(0, 100)}...</p>
                            <button class="mt-4 w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-300">View Details</button>
                        </div>
                    `;
                    card.querySelector('button').addEventListener('click', () => showProductDetails(product));
                    container.appendChild(card);
                });
            };

            // Function to show the product details modal
            const showProductDetails = (product) => {
                document.getElementById('modal-image').src = product.image;
                document.getElementById('modal-name').textContent = product.name;
                document.getElementById('modal-price').textContent = product.price;
                document.getElementById('modal-description').textContent = product.description;
                document.getElementById('modal-care').textContent = `Care Instructions: ${product.care}`;
                modal.classList.remove('hidden');
            };

            // Function to close the modal
            closeModalBtn.addEventListener('click', () => {
                modal.classList.add('hidden');
            });
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.add('hidden');
                }
            });

            // Function to handle navigation
            const navigateToSection = (sectionId) => {
                contentSections.forEach(section => {
                    section.classList.remove('active');
                });
                document.getElementById(sectionId).classList.add('active');

                // Update active link styling
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href').substring(1) === sectionId.replace('-section', '')) {
                        link.classList.add('active');
                    }
                });

                // Hide mobile menu after click
                if (navLinksContainer.classList.contains('flex')) {
                    navLinksContainer.classList.add('hidden');
                    navLinksContainer.classList.remove('flex');
                }
            };

            // Add event listeners for navigation links
            navLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const sectionId = link.getAttribute('href').substring(1) + '-section';
                    navigateToSection(sectionId);
                });
            });

            // Mobile menu toggle
            menuBtn.addEventListener('click', () => {
                navLinksContainer.classList.toggle('hidden');
                navLinksContainer.classList.toggle('flex');
            });

            // Initial rendering of products
            renderProducts(productData.plants, plantsContainer);
            renderProducts(productData.seeds, seedsContainer);
        })
        .catch(error => {
            console.error('Error loading product data:', error);
            // You can add a user-facing error message here if needed
        });
});
