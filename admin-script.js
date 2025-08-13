// Admin Panel JavaScript
class AdminPanel {
    constructor() {
        this.products = [];
        this.currentEditId = null;
        this.authToken = localStorage.getItem('admin-token');
        
        this.initElements();
        this.bindEvents();
        this.checkAuth();
    }

    initElements() {
        // Modals
        this.loginModal = document.getElementById('loginModal');
        this.productModal = document.getElementById('productModal');
        this.deleteModal = document.getElementById('deleteModal');
        this.profileModal = document.getElementById('profileModal');
        this.adminPanel = document.getElementById('adminPanel');
        this.passwordChangeModal = document.getElementById('passwordChangeModal');
        
        // Forms
        this.loginForm = document.getElementById('loginForm');
        this.productForm = document.getElementById('productForm');
        this.profileForm = document.getElementById('profileForm');
        this.passwordChangeForm = document.getElementById('passwordChangeForm');
        
        // Tables
        this.productsTable = document.getElementById('productsTable');
        this.productsTableBody = document.getElementById('productsTableBody');
        
        // Buttons
        this.logoutBtn = document.getElementById('logoutBtn');
        this.addProductBtn = document.getElementById('addProductBtn');
        this.editProfileBtn = document.getElementById('editProfileBtn');
        this.refreshBtn = document.getElementById('refreshBtn');
        this.closeModalBtn = document.getElementById('closeModalBtn');
        this.closeProfileModalBtn = document.getElementById('closeProfileModalBtn');
        this.cancelBtn = document.getElementById('cancelBtn');
        this.cancelProfileBtn = document.getElementById('cancelProfileBtn');
        this.addDetailBtn = document.getElementById('addDetailBtn');
        this.passwordToggle = document.getElementById('passwordToggle');
        this.changePasswordBtn = document.getElementById('changePasswordBtn');
        this.closePasswordModalBtn = document.getElementById('closePasswordModalBtn');
        this.cancelPasswordBtn = document.getElementById('cancelPasswordModalBtn');
        
        // Other elements
        this.totalProducts = document.getElementById('totalProducts');
        this.modalTitle = document.getElementById('modalTitle');
        this.imagePreview = document.getElementById('imagePreview');
        this.productImage = document.getElementById('productImage');
        this.doctorImagePreview = document.getElementById('doctorImagePreview');
        this.doctorImage = document.getElementById('doctorImage');
        this.detailsContainer = document.getElementById('detailsContainer');
    }

    bindEvents() {
        // Login
        this.loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        this.passwordToggle.addEventListener('click', () => this.togglePassword());
        
        // Logout
        this.logoutBtn.addEventListener('click', () => this.handleLogout());
        
        // Product management
        this.addProductBtn.addEventListener('click', () => this.showProductModal());
        this.editProfileBtn.addEventListener('click', () => this.showProfileModal());
        this.refreshBtn.addEventListener('click', () => this.loadProducts());
        this.productForm.addEventListener('submit', (e) => this.handleProductSubmit(e));
        this.profileForm.addEventListener('submit', (e) => this.handleProfileSubmit(e));
        this.passwordChangeForm.addEventListener('submit', (e) => this.handlePasswordChange(e));
        
        // Modal controls
        this.closeModalBtn.addEventListener('click', () => this.hideProductModal());
        this.closeProfileModalBtn.addEventListener('click', () => this.hideProfileModal());
        this.cancelBtn.addEventListener('click', () => this.hideProductModal());
        this.cancelProfileBtn.addEventListener('click', () => this.hideProfileModal());
        
        // Image upload
        this.productImage.addEventListener('change', (e) => this.handleImageUpload(e));
        this.doctorImage.addEventListener('change', (e) => this.handleDoctorImageUpload(e));
        
        // Product details
        this.addDetailBtn.addEventListener('click', () => this.addDetailRow());
        
        // Delete confirmation
        document.getElementById('cancelDeleteBtn').addEventListener('click', () => this.hideDeleteModal());
        document.getElementById('confirmDeleteBtn').addEventListener('click', () => this.confirmDelete());
        
        // Password change
        this.changePasswordBtn.addEventListener('click', () => this.showPasswordChangeModal());
        this.closePasswordModalBtn.addEventListener('click', () => this.hidePasswordChangeModal());
        this.cancelPasswordBtn.addEventListener('click', () => this.hidePasswordChangeModal());
        
        // Close modals on outside click
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.hideAllModals();
            }
        });
    }

    async checkAuth() {
        if (!this.authToken) {
            this.showLoginModal();
            return;
        }
        
        try {
            const response = await fetch('/api/auth/verify', {
                headers: {
                    'Authorization': `Bearer ${this.authToken}`
                }
            });
            
            if (response.ok) {
                this.showAdminPanel();
            } else {
                // Token is invalid, remove it
                localStorage.removeItem('admin-token');
                this.authToken = null;
                this.showLoginModal();
            }
        } catch (error) {
            console.error('Auth verification failed:', error);
            this.showLoginModal();
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        const password = document.getElementById('password').value;
        
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ password })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                this.authToken = data.token;
                localStorage.setItem('admin-token', data.token);
                this.showAdminPanel();
                document.getElementById('password').value = '';
            } else {
                this.showError(data.error || 'Login failed');
                document.getElementById('password').focus();
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showError('Network error. Please try again.');
        }
    }

    async handleLogout() {
        if (this.authToken) {
            try {
                await fetch('/api/auth/logout', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${this.authToken}`
                    }
                });
            } catch (error) {
                console.error('Logout error:', error);
            }
        }
        
        localStorage.removeItem('admin-token');
        this.authToken = null;
        this.showLoginModal();
    }

    togglePassword() {
        const passwordInput = document.getElementById('password');
        const toggleIcon = this.passwordToggle;
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            toggleIcon.classList.remove('fa-eye');
            toggleIcon.classList.add('fa-eye-slash');
        } else {
            passwordInput.type = 'password';
            toggleIcon.classList.remove('fa-eye-slash');
            toggleIcon.classList.add('fa-eye');
        }
    }

    showLoginModal() {
        this.loginModal.classList.add('active');
        this.adminPanel.classList.remove('active');
        document.getElementById('password').focus();
    }

    showAdminPanel() {
        this.loginModal.classList.remove('active');
        this.adminPanel.classList.add('active');
        this.loadProducts();
    }

    async loadProducts() {
        try {
            // Try to fetch from server first
            const response = await fetch('/api/products');
            if (response.ok) {
                this.products = await response.json();
            } else {
                // Fallback to localStorage
                const stored = localStorage.getItem('ayurveda-products');
                this.products = stored ? JSON.parse(stored) : this.getDefaultProducts();
            }
        } catch (error) {
            // Fallback to localStorage
            const stored = localStorage.getItem('ayurveda-products');
            this.products = stored ? JSON.parse(stored) : this.getDefaultProducts();
        }
        
        this.renderProductsTable();
        this.updateStats();
    }

    getDefaultProducts() {
        // Same default products as in main script
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

    renderProductsTable() {
        if (this.products.length === 0) {
            this.productsTableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="empty-products">
                        <i class="fas fa-box-open"></i>
                        <h3>No products found</h3>
                        <p>Start by adding your first product</p>
                    </td>
                </tr>
            `;
            return;
        }

        this.productsTableBody.innerHTML = this.products.map(product => `
            <tr>
                <td>
                    ${product.image ? 
                        `<img src="${product.image}" alt="${product.name}" class="product-image-small">` :
                        `<div class="product-image-placeholder-small">
                            <i class="fas fa-seedling"></i>
                        </div>`
                    }
                </td>
                <td class="product-name-cell">${product.name}</td>
                <td class="product-price-cell">${product.price}</td>
                <td>${product.details?.Category || 'N/A'}</td>
                <td class="product-actions">
                    <button class="btn btn-secondary btn-small" onclick="adminPanel.editProduct(${product.id})">
                        <i class="fas fa-edit"></i>
                        Edit
                    </button>
                    <button class="btn btn-danger btn-small" onclick="adminPanel.deleteProduct(${product.id})">
                        <i class="fas fa-trash"></i>
                        Delete
                    </button>
                </td>
            </tr>
        `).join('');
    }

    updateStats() {
        this.totalProducts.textContent = this.products.length;
    }

    showProductModal(product = null) {
        this.currentEditId = product ? product.id : null;
        this.modalTitle.textContent = product ? 'Edit Product' : 'Add New Product';
        
        if (product) {
            this.populateForm(product);
        } else {
            this.resetForm();
        }
        
        this.productModal.classList.add('active');
    }

    hideProductModal() {
        this.productModal.classList.remove('active');
        this.resetForm();
    }

    populateForm(product) {
        document.getElementById('productName').value = product.name || '';
        document.getElementById('productPrice').value = product.price || '';
        document.getElementById('productDescription').value = product.description || '';
        
        // Populate details
        this.detailsContainer.innerHTML = '';
        if (product.details) {
            Object.entries(product.details).forEach(([key, value]) => {
                this.addDetailRow(key, value);
            });
        }
        if (this.detailsContainer.children.length === 0) {
            this.addDetailRow();
        }
        
        // Handle image
        if (product.image) {
            this.imagePreview.innerHTML = `<img src="${product.image}" alt="Preview">`;
            this.imagePreview.classList.add('has-image');
        }
    }

    resetForm() {
        this.productForm.reset();
        this.currentEditId = null;
        
        // Reset image preview
        this.imagePreview.innerHTML = `
            <i class="fas fa-image"></i>
            <p>Click to upload image or drag and drop</p>
        `;
        this.imagePreview.classList.remove('has-image');
        
        // Reset details
        this.detailsContainer.innerHTML = '';
        this.addDetailRow();
    }

    addDetailRow(key = '', value = '') {
        const detailRow = document.createElement('div');
        detailRow.className = 'detail-row';
        detailRow.innerHTML = `
            <input type="text" placeholder="Detail name (e.g., Quantity)" class="detail-key" value="${key}">
            <input type="text" placeholder="Detail value (e.g., 60 capsules)" class="detail-value" value="${value}">
            <button type="button" class="btn btn-danger btn-small remove-detail">
                <i class="fas fa-trash"></i>
            </button>
        `;
        
        detailRow.querySelector('.remove-detail').addEventListener('click', () => {
            if (this.detailsContainer.children.length > 1) {
                detailRow.remove();
            }
        });
        
        this.detailsContainer.appendChild(detailRow);
    }

    handleImageUpload(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        if (!file.type.startsWith('image/')) {
            this.showError('Please select a valid image file.');
            return;
        }
        
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            this.showError('Image size should be less than 5MB.');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            this.imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
            this.imagePreview.classList.add('has-image');
        };
        reader.readAsDataURL(file);
    }

    async handleProductSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.productForm);
        const product = {
            id: this.currentEditId || Date.now(),
            name: formData.get('name'),
            price: formData.get('price'),
            description: formData.get('description'),
            image: null,
            details: {}
        };
        
        // Handle image
        const imageFile = formData.get('image');
        if (imageFile && imageFile.size > 0) {
            product.image = await this.fileToDataURL(imageFile);
        } else if (this.currentEditId) {
            // Keep existing image if editing
            const existing = this.products.find(p => p.id === this.currentEditId);
            if (existing) {
                product.image = existing.image;
            }
        }
        
        // Handle details
        const detailRows = this.detailsContainer.querySelectorAll('.detail-row');
        detailRows.forEach(row => {
            const key = row.querySelector('.detail-key').value.trim();
            const value = row.querySelector('.detail-value').value.trim();
            if (key && value) {
                product.details[key] = value;
            }
        });
        
        try {
            await this.saveProduct(product);
            this.showSuccess('Product saved successfully!');
            this.hideProductModal();
            this.loadProducts();
            
            // Update main website if it's open
            if (window.opener && window.opener.getProductManager) {
                window.opener.getProductManager().refreshProducts();
            }
        } catch (error) {
            this.showError('Failed to save product. Please try again.');
        }
    }

    async saveProduct(product) {
        try {
            // Try to save to server with authentication
            const response = await this.authenticatedFetch('/api/products', {
                method: this.currentEditId ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(product)
            });
            
            if (!response.ok) {
                throw new Error('Server save failed');
            }
        } catch (error) {
            if (error.message === 'Authentication required') {
                return; // User will be redirected to login
            }
            
            // Fallback to localStorage
            if (this.currentEditId) {
                const index = this.products.findIndex(p => p.id === this.currentEditId);
                if (index !== -1) {
                    this.products[index] = product;
                }
            } else {
                this.products.push(product);
            }
            
            localStorage.setItem('ayurveda-products', JSON.stringify(this.products));
        }
    }

    editProduct(id) {
        const product = this.products.find(p => p.id === id);
        if (product) {
            this.showProductModal(product);
        }
    }

    deleteProduct(id) {
        this.deleteProductId = id;
        this.deleteModal.classList.add('active');
    }

    hideDeleteModal() {
        this.deleteModal.classList.remove('active');
        this.deleteProductId = null;
    }

    async confirmDelete() {
        if (!this.deleteProductId) return;
        
        try {
            // Try to delete from server with authentication
            const response = await this.authenticatedFetch(`/api/products/${this.deleteProductId}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                throw new Error('Server delete failed');
            }
        } catch (error) {
            if (error.message === 'Authentication required') {
                return; // User will be redirected to login
            }
            
            // Fallback to localStorage
            this.products = this.products.filter(p => p.id !== this.deleteProductId);
            localStorage.setItem('ayurveda-products', JSON.stringify(this.products));
        }
        
        this.hideDeleteModal();
        this.loadProducts();
        this.showSuccess('Product deleted successfully!');
        
        // Update main website if it's open
        if (window.opener && window.opener.getProductManager) {
            window.opener.getProductManager().refreshProducts();
        }
    }

    // Profile management methods
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

    showProfileModal() {
        this.loadProfile().then(() => {
            this.populateProfileForm();
            this.profileModal.classList.add('active');
        });
    }

    hideProfileModal() {
        this.profileModal.classList.remove('active');
        this.resetProfileForm();
    }

    populateProfileForm() {
        if (!this.profile) return;
        
        document.getElementById('companyName').value = this.profile.companyName || '';
        document.getElementById('doctorName').value = this.profile.doctorName || '';
        document.getElementById('tagline').value = this.profile.tagline || '';
        document.getElementById('phone').value = this.profile.phone || '';
        document.getElementById('email').value = this.profile.email || '';
        document.getElementById('address').value = this.profile.address || '';
        document.getElementById('aboutParagraph1').value = this.profile.aboutParagraph1 || '';
        document.getElementById('aboutParagraph2').value = this.profile.aboutParagraph2 || '';
        
        // Handle doctor image
        if (this.profile.image) {
            this.doctorImagePreview.innerHTML = `<img src="${this.profile.image}" alt="Doctor">`;
            this.doctorImagePreview.classList.add('has-image');
        }
    }

    resetProfileForm() {
        this.profileForm.reset();
        this.doctorImagePreview.innerHTML = `
            <i class="fas fa-user-md"></i>
            <p>Click to upload doctor photo or drag and drop</p>
        `;
        this.doctorImagePreview.classList.remove('has-image');
    }

    handleDoctorImageUpload(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        if (!file.type.startsWith('image/')) {
            this.showError('Please select a valid image file.');
            return;
        }
        
        if (file.size > 5 * 1024 * 1024) {
            this.showError('Image size should be less than 5MB.');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            this.doctorImagePreview.innerHTML = `<img src="${e.target.result}" alt="Doctor">`;
            this.doctorImagePreview.classList.add('has-image');
        };
        reader.readAsDataURL(file);
    }

    async handleProfileSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.profileForm);
        const profile = {
            companyName: formData.get('companyName'),
            doctorName: formData.get('doctorName'),
            tagline: formData.get('tagline'),
            phone: formData.get('phone'),
            email: formData.get('email'),
            address: formData.get('address'),
            aboutParagraph1: formData.get('aboutParagraph1'),
            aboutParagraph2: formData.get('aboutParagraph2'),
            image: null
        };
        
        // Handle image
        const imageFile = formData.get('image');
        if (imageFile && imageFile.size > 0) {
            profile.image = await this.fileToDataURL(imageFile);
        } else if (this.profile && this.profile.image) {
            profile.image = this.profile.image;
        }
        
        try {
            await this.saveProfile(profile);
            this.showSuccess('Profile updated successfully!');
            this.hideProfileModal();
            
            // Update main website if it's open
            if (window.opener && window.opener.updateProfile) {
                window.opener.updateProfile(profile);
            }
        } catch (error) {
            this.showError('Failed to save profile. Please try again.');
        }
    }

    async saveProfile(profile) {
        try {
            const response = await this.authenticatedFetch('/api/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(profile)
            });
            
            if (!response.ok) {
                throw new Error('Server save failed');
            }
        } catch (error) {
            if (error.message === 'Authentication required') {
                return; // User will be redirected to login
            }
            
            localStorage.setItem('ayurveda-profile', JSON.stringify(profile));
        }
        
        this.profile = profile;
    }

    // Password change methods
    showPasswordChangeModal() {
        this.passwordChangeModal.classList.add('active');
        document.getElementById('currentPassword').focus();
    }

    hidePasswordChangeModal() {
        this.passwordChangeModal.classList.remove('active');
        this.passwordChangeForm.reset();
    }

    async handlePasswordChange(e) {
        e.preventDefault();
        
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        // Validate passwords match
        if (newPassword !== confirmPassword) {
            this.showError('New passwords do not match');
            return;
        }
        
        // Validate password strength
        if (newPassword.length < 8) {
            this.showError('Password must be at least 8 characters long');
            return;
        }
        
        try {
            const response = await this.authenticatedFetch('/api/auth/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    currentPassword,
                    newPassword
                })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                this.showSuccess('Password changed successfully! Please login again.');
                this.hidePasswordChangeModal();
                
                // Auto logout after successful password change
                setTimeout(() => {
                    this.handleLogout();
                }, 2000);
            } else {
                this.showError(data.error || 'Failed to change password');
            }
        } catch (error) {
            if (error.message === 'Authentication required') {
                return; // User will be redirected to login
            }
            
            console.error('Password change error:', error);
            this.showError('Network error. Please try again.');
        }
    }

    // Helper method for authenticated API requests
    async authenticatedFetch(url, options = {}) {
        if (!this.authToken) {
            throw new Error('No authentication token');
        }
        
        const headers = {
            ...options.headers,
            'Authorization': `Bearer ${this.authToken}`
        };
        
        const response = await fetch(url, {
            ...options,
            headers
        });
        
        if (response.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('admin-token');
            this.authToken = null;
            this.showLoginModal();
            throw new Error('Authentication required');
        }
        
        return response;
    }

    hideAllModals() {
        this.productModal.classList.remove('active');
        this.deleteModal.classList.remove('active');
        this.profileModal.classList.remove('active');
        this.passwordChangeModal.classList.remove('active');
    }

    fileToDataURL(file) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(file);
        });
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#28a745' : '#dc3545'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 10px;
            font-weight: 600;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Initialize admin panel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.adminPanel = new AdminPanel();
});
