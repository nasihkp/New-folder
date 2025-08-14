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
            const navLinksDesktop = document.querySelectorAll('.nav-link');
            const navLinksMobile = document.querySelectorAll('#nav-links-mobile .nav-link');
            const contentSections = document.querySelectorAll('.content-section');
            const modal = document.getElementById('product-modal');
            const modalContent = modal.querySelector('div');
            const closeModalBtn = document.getElementById('close-modal-btn');
            const menuBtn = document.getElementById('menu-btn');
            const navLinksMobileContainer = document.getElementById('nav-links-mobile');

            // Function to render product cards
            const renderProducts = (products, container) => {
                container.innerHTML = '';
                products.forEach(product => {
                    const card = document.createElement('div');
                    card.className = 'product-card bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transform hover:scale-105';
                    card.innerHTML = `
                        <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover">
                        <div class="p-5 flex flex-col justify-between">
                            <div>
                                <h4 class="text-xl font-bold text-green-800 mb-1">${product.name}</h4>
                                <p class="text-lg text-gray-700 font-medium mb-3">${product.price}</p>
                                <p class="text-sm text-gray-500 mb-4">${product.description.substring(0, 100)}...</p>
                            </div>
                            <button class="buy-button mt-auto w-full bg-green-500 text-white py-2 px-4 rounded-lg shadow hover:bg-green-600 transition duration-300 transform hover:scale-105">View Details</button>
                        </div>
                    `;
                    card.querySelector('.buy-button').addEventListener('click', () => showProductDetails(product));
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
                setTimeout(() => {
                    modal.classList.add('opacity-100');
                    modalContent.classList.add('scale-100', 'opacity-100');
                }, 10);
            };

            // Function to close the modal
            const closeModal = () => {
                modal.classList.remove('opacity-100');
                modalContent.classList.remove('scale-100', 'opacity-100');
                setTimeout(() => {
                    modal.classList.add('hidden');
                }, 300);
            };

            closeModalBtn.addEventListener('click', closeModal);
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closeModal();
                }
            });

            // Function to handle navigation
            const navigateToSection = (sectionId) => {
                contentSections.forEach(section => {
                    section.classList.remove('active');
                });
                document.getElementById(sectionId).classList.add('active');

                // Update active link styling for both desktop and mobile
                [...navLinksDesktop, ...navLinksMobile].forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href').substring(1) + '-section' === sectionId) {
                        link.classList.add('active');
                    }
                });

                // Hide mobile menu after click
                if (!navLinksMobileContainer.classList.contains('hidden')) {
                    navLinksMobileContainer.classList.add('hidden');
                }
            };
            
            // Add event listeners for all navigation links
            [...navLinksDesktop, ...navLinksMobile].forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const sectionId = link.getAttribute('href').substring(1) + '-section';
                    navigateToSection(sectionId);
                });
            });

            // Mobile menu toggle
            menuBtn.addEventListener('click', () => {
                navLinksMobileContainer.classList.toggle('hidden');
            });

            // Set initial active section (e.g., home)
            navigateToSection('home-section');

            // Initial rendering of products
            renderProducts(productData.plants, plantsContainer);
            renderProducts(productData.seeds, seedsContainer);
        })
        .catch(error => {
            console.error('Error loading product data:', error);
            const productsSection = document.getElementById('products-section');
            productsSection.innerHTML = '<p class="text-center text-red-500 text-lg">Failed to load products. Please try again later.</p>';
        });
});
