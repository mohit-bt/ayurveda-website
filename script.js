// Product management and display functionality
class ProductManager {
    constructor() {
        this.products = [];
        this.productsGrid = document.getElementById('productsGrid');
        this.init();
    }

    async init() {
        await this.loadProducts();
        this.renderProducts();
    }

    async loadProducts() {
        try {
            const response = await fetch('/api/products');
            if (response.ok) {
                this.products = await response.json();
            } else {
                // Fallback to local storage for GitHub Pages
                const stored = localStorage.getItem('ayurveda-products');
                this.products = stored ? JSON.parse(stored) : this.getDefaultProducts();
            }
        } catch (error) {
            console.log('Using local storage fallback');
            // Fallback to local storage
            const stored = localStorage.getItem('ayurveda-products');
            this.products = stored ? JSON.parse(stored) : this.getDefaultProducts();
        }
    }

    getDefaultProducts() {
        // Default products for demo purposes
        return [
            {
                id: 1,
                name: "Ashwagandha Capsules",
                description: "Premium quality Ashwagandha root extract capsules for stress relief and vitality enhancement. Made from organically grown herbs.",
                price: "₹450",
                details: {
                    "Quantity": "60 capsules",
                    "Dosage": "2 capsules daily",
                    "Category": "Stress Relief"
                },
                image: null
            },
            {
                id: 2,
                name: "Triphala Powder",
                description: "Traditional Ayurvedic blend of three fruits for digestive health and detoxification. Pure and natural formulation.",
                price: "₹280",
                details: {
                    "Quantity": "100g powder",
                    "Dosage": "1 tsp twice daily",
                    "Category": "Digestive Health"
                },
                image: null
            },
            {
                id: 3,
                name: "Brahmi Oil",
                description: "Herbal hair oil enriched with Brahmi extract for hair growth and scalp health. Prevents hair fall and promotes thickness.",
                price: "₹320",
                details: {
                    "Quantity": "100ml bottle",
                    "Usage": "Apply 2-3 times weekly",
                    "Category": "Hair Care"
                },
                image: null
            },
            {
                id: 4,
                name: "Turmeric Tablets",
                description: "High-curcumin turmeric tablets with black pepper extract for better absorption. Natural anti-inflammatory support.",
                price: "₹380",
                details: {
                    "Quantity": "90 tablets",
                    "Dosage": "1 tablet daily",
                    "Category": "Immunity"
                },
                image: null
            },
            {
                id: 5,
                name: "Neem Capsules",
                description: "Pure Neem leaf extract capsules for blood purification and skin health. Supports natural detoxification process.",
                price: "₹220",
                details: {
                    "Quantity": "60 capsules",
                    "Dosage": "2 capsules daily",
                    "Category": "Blood Purifier"
                },
                image: null
            },
            {
                id: 6,
                name: "Ayurvedic Tea Blend",
                description: "Aromatic herbal tea blend with tulsi, ginger, and cardamom. Perfect for daily wellness and digestive support.",
                price: "₹180",
                details: {
                    "Quantity": "50g loose tea",
                    "Usage": "1 cup twice daily",
                    "Category": "Wellness Tea"
                },
                image: null
            }
        ];
    }

    renderProducts() {
        if (!this.productsGrid) return;

        if (this.products.length === 0) {
            this.productsGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-leaf"></i>
                    <h3>No products available</h3>
                    <p>Products will appear here once they are added.</p>
                </div>
            `;
            return;
        }

        this.productsGrid.innerHTML = this.products.map(product => 
            this.createProductCard(product)
        ).join('');

        // Add click events to product cards
        this.addProductClickEvents();

        // Add intersection observer for animation
        this.observeProductCards();
    }

    createProductCard(product) {
        const detailsHtml = product.details ? 
            Object.entries(product.details).map(([key, value]) => `
                <div class="product-detail-item">
                    <span class="product-detail-label">${key}:</span>
                    <span class="product-detail-value">${value}</span>
                </div>
            `).join('') : '';

        return `
            <div class="product-card" data-product-id="${product.id}">
                <div class="product-image">
                    ${product.image ? 
                        `<img src="${product.image}" alt="${product.name}" loading="lazy">` :
                        `<div class="product-image-placeholder">
                            <i class="fas fa-seedling"></i>
                        </div>`
                    }
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    ${detailsHtml ? `
                        <div class="product-details">
                            ${detailsHtml}
                        </div>
                    ` : ''}
                    <div class="product-price">${product.price}</div>
                </div>
            </div>
        `;
    }

    observeProductCards() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '0';
                    entry.target.style.transform = 'translateY(30px)';
                    
                    setTimeout(() => {
                        entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, 100);
                    
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.product-card').forEach(card => {
            observer.observe(card);
        });
    }

    addProductClickEvents() {
        document.querySelectorAll('.product-card').forEach(card => {
            card.style.cursor = 'pointer';
            card.addEventListener('click', () => {
                const productId = parseInt(card.dataset.productId);
                const product = this.products.find(p => p.id === productId);
                if (product && window.productModal) {
                    window.productModal.showModal(product);
                }
            });
        });
    }

    // Method to refresh products (used by admin panel)
    async refreshProducts() {
        await this.loadProducts();
        this.renderProducts();
    }
}

// Profile management for main website
class ProfileManager {
    constructor() {
        this.profile = null;
        this.init();
    }

    async init() {
        await this.loadProfile();
        this.updateWebsiteContent();
    }

    async loadProfile() {
        try {
            const response = await fetch('/api/profile');
            if (response.ok) {
                this.profile = await response.json();
            } else {
                const stored = localStorage.getItem('ayurveda-profile');
                this.profile = stored ? JSON.parse(stored) : this.getDefaultProfile();
            }
        } catch (error) {
            const stored = localStorage.getItem('ayurveda-profile');
            this.profile = stored ? JSON.parse(stored) : this.getDefaultProfile();
        }
    }

    getDefaultProfile() {
        return {
            companyName: "Natural Health Clinic",
            doctorName: "Dr. Ayurveda",
            tagline: "Natural Health Solutions",
            phone: "+91 9876543210",
            email: "doctor@ayurveda.com",
            address: "123 Wellness Street, Nature City, NC 12345",
            aboutParagraph1: "With over 15 years of experience in Ayurvedic medicine, Dr. Ayurveda is dedicated to bringing you the finest natural health products. Our mission is to promote holistic wellness through time-tested Ayurvedic principles and authentic herbal formulations.",
            aboutParagraph2: "Each product in our catalog has been carefully selected and prepared following traditional Ayurvedic methods, ensuring the highest quality and effectiveness for your health journey.",
            image: null
        };
    }

    updateWebsiteContent() {
        if (!this.profile) return;

        // Update header with company name
        const logoH1 = document.querySelector('.logo h1');
        if (logoH1) logoH1.textContent = this.profile.companyName || 'Natural Health Clinic';

        const tagline = document.querySelector('.tagline');
        if (tagline) tagline.textContent = this.profile.tagline;

        // Update contact info with clickable links
        const contactItems = document.querySelectorAll('.contact-item');
        if (contactItems[0]) {
            const phone = this.profile.phone || '+91 9876543210';
            const cleanPhone = phone.replace(/[^\d+]/g, '');
            contactItems[0].href = `tel:${cleanPhone}`;
            contactItems[0].querySelector('span').textContent = phone;
        }
        if (contactItems[1]) {
            const email = this.profile.email || 'doctor@ayurveda.com';
            contactItems[1].href = `mailto:${email}`;
            contactItems[1].querySelector('span').textContent = email;
        }
        if (contactItems[2]) {
            const address = this.profile.address || '123 Wellness Street, Nature City, NC 12345';
            contactItems[2].href = `https://maps.google.com/?q=${encodeURIComponent(address)}`;
            contactItems[2].querySelector('span').textContent = address;
        }

        // Update footer contact links
        const footerContactLinks = document.querySelectorAll('.footer-contact-link');
        if (footerContactLinks[0]) {
            const phone = this.profile.phone || '+91 9876543210';
            const cleanPhone = phone.replace(/[^\d+]/g, '');
            footerContactLinks[0].href = `tel:${cleanPhone}`;
            footerContactLinks[0].querySelector('p').textContent = `📞 ${phone}`;
        }
        if (footerContactLinks[1]) {
            const email = this.profile.email || 'doctor@ayurveda.com';
            footerContactLinks[1].href = `mailto:${email}`;
            footerContactLinks[1].querySelector('p').textContent = `✉️ ${email}`;
        }

        // Update about section with doctor name and content
        const aboutTitle = document.querySelector('.about h2');
        if (aboutTitle) aboutTitle.textContent = `About ${this.profile.doctorName || 'Dr. Ayurveda'}`;
        
        const doctorNameElement = document.querySelector('.doctor-name');
        if (doctorNameElement) doctorNameElement.textContent = this.profile.doctorName || 'Dr. Ayurveda';

        const aboutTextPs = document.querySelectorAll('.about-text p');
        if (aboutTextPs[0]) aboutTextPs[0].textContent = this.profile.aboutParagraph1;
        if (aboutTextPs[1] && this.profile.aboutParagraph2) {
            aboutTextPs[1].textContent = this.profile.aboutParagraph2;
        }

        // Update doctor image
        const doctorPlaceholder = document.querySelector('.doctor-placeholder');
        if (doctorPlaceholder && this.profile.image) {
            doctorPlaceholder.innerHTML = `<img src="${this.profile.image}" alt="${this.profile.doctorName}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
        }

        // Update footer with company name
        const footerLogo = document.querySelector('.footer-section .logo span');
        if (footerLogo) footerLogo.textContent = this.profile.companyName || 'Natural Health Clinic';
    }

    // Method to refresh profile (called from admin panel)
    async refreshProfile() {
        await this.loadProfile();
        this.updateWebsiteContent();
    }
}

// Product Modal Management
class ProductModal {
    constructor() {
        this.modal = document.getElementById('productDetailsModal');
        this.modalImage = document.getElementById('modalProductImage');
        this.modalImagePlaceholder = document.getElementById('modalProductImagePlaceholder');
        this.modalName = document.getElementById('modalProductName');
        this.modalDescription = document.getElementById('modalProductDescription');
        this.modalDetails = document.getElementById('modalProductDetails');
        this.modalPrice = document.getElementById('modalProductPrice');
        this.contactBtn = document.getElementById('contactForPurchase');
        this.closeBtn = document.getElementById('closeProductModal');
        
        this.initEvents();
    }

    initEvents() {
        // Close modal when clicking the close button
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => {
                this.hideModal();
            });
        }

        // Close modal when clicking outside
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.hideModal();
            }
        });

        // Contact button functionality
        this.contactBtn.addEventListener('click', () => {
            const profile = window.profileManager?.profile;
            const phone = profile?.phone || '+91 9876543210';
            // Remove any non-numeric characters except +
            const cleanPhone = phone.replace(/[^\d+]/g, '');
            window.open(`tel:${cleanPhone}`, '_self');
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.hideModal();
            }
        });
    }

    showModal(product) {
        if (!product) return;

        // Update modal content
        this.modalName.textContent = product.name;
        this.modalDescription.textContent = product.description;
        this.modalPrice.textContent = product.price;

        // Handle image
        if (product.image) {
            this.modalImage.src = product.image;
            this.modalImage.alt = product.name;
            this.modalImage.style.display = 'block';
            this.modalImagePlaceholder.style.display = 'none';
        } else {
            this.modalImage.style.display = 'none';
            this.modalImagePlaceholder.style.display = 'flex';
        }

        // Handle details
        if (product.details && Object.keys(product.details).length > 0) {
            this.modalDetails.innerHTML = Object.entries(product.details).map(([key, value]) => `
                <div class="product-detail-item">
                    <span class="product-detail-label">${key}:</span>
                    <span class="product-detail-value">${value}</span>
                </div>
            `).join('');
            this.modalDetails.style.display = 'block';
        } else {
            this.modalDetails.style.display = 'none';
        }

        // Show modal
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }

    hideModal() {
        this.modal.classList.remove('active');
        document.body.style.overflow = 'auto'; // Restore scrolling
    }
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Header scroll effect
function initHeaderEffects() {
    const header = document.querySelector('.header');
    let lastScrollTop = 0;

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        }
        
        lastScrollTop = scrollTop;
    });
}

// Loading animation
function showLoading() {
    const productsGrid = document.getElementById('productsGrid');
    if (productsGrid) {
        productsGrid.innerHTML = `
            <div class="loading">
                <i class="fas fa-spinner"></i>
                <p>Loading products...</p>
            </div>
        `;
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Show loading initially
    showLoading();
    
    // Initialize profile manager
    window.profileManager = new ProfileManager();
    
    // Initialize product manager
    window.productManager = new ProductManager();
    
    // Initialize product modal
    window.productModal = new ProductModal();
    
    // Initialize other features
    initSmoothScrolling();
    initHeaderEffects();
    
    // Add some interactive effects
    initInteractiveEffects();
});

// Interactive effects for better user experience
function initInteractiveEffects() {
    // Animate hero text on load
    setTimeout(() => {
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.opacity = '0';
            heroContent.style.transform = 'translateY(30px)';
            heroContent.style.transition = 'opacity 1s ease, transform 1s ease';
            
            setTimeout(() => {
                heroContent.style.opacity = '1';
                heroContent.style.transform = 'translateY(0)';
            }, 100);
        }
    }, 500);

    // Add hover effect to contact items
    document.querySelectorAll('.contact-item').forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'scale(1.05)';
            item.style.transition = 'transform 0.2s ease';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'scale(1)';
        });
    });

    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const hero = document.querySelector('.hero');
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        if (hero) {
            hero.style.transform = `translateY(${rate}px)`;
        }
    });
}

// Utility functions for admin panel communication
function getProductManager() {
    return window.productManager;
}

function updateProfile(profile) {
    if (window.profileManager) {
        window.profileManager.profile = profile;
        window.profileManager.updateWebsiteContent();
    }
}

// Export for use in admin panel
window.getProductManager = getProductManager;
window.updateProfile = updateProfile;
