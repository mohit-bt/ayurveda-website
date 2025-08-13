# Dr. Ayurveda - Product Catalog Website

A beautiful, responsive website for an Ayurvedic doctor's product catalog with admin management functionality. Built with HTML, CSS, JavaScript, and optional Node.js backend.

## 🌿 Features

### User Features
- **Beautiful Ayurvedic Design**: Nature-inspired color scheme with earth tones
- **Responsive Layout**: Works perfectly on mobile, tablet, and desktop
- **Product Catalog**: Clean grid layout showcasing products with images, descriptions, and details
- **About Section**: Information about the doctor and practice
- **Contact Information**: Prominently displayed contact details
- **Smooth Animations**: Hover effects and scroll animations for better UX
- **Accessibility**: Proper contrast ratios and keyboard navigation support

### Admin Features
- **Password Protection**: Secure admin panel (default: `admin123`)
- **Product Management**: Add, edit, and delete products
- **Profile Management**: Edit doctor's information, photo, tagline, and about section
- **Image Upload**: Support for product and doctor images with preview
- **Product Details**: Customizable key-value pairs for product specifications
- **Real-time Updates**: Changes reflect immediately on the main website
- **Responsive Admin Panel**: Mobile-friendly administration interface

## 🚀 Quick Start

### Option 1: Static Hosting (GitHub Pages)

1. **Upload Files**: Upload all files to your GitHub repository
2. **Enable GitHub Pages**: Go to repository settings → Pages → Select source
3. **Visit Website**: Your site will be available at `https://username.github.io/repository-name`
4. **Access Admin**: Visit `https://username.github.io/repository-name/admin.html`

The website uses localStorage to store product data when no backend is available.

### Option 2: Node.js Server

1. **Install Node.js**: Download and install Node.js from [nodejs.org](https://nodejs.org)

2. **Install Dependencies**:
   ```bash
   cd /home/mohit/Desktop/website
   npm install
   ```

3. **Start Server**:
   ```bash
   npm start
   ```

4. **Access Website**:
   - Main Website: http://localhost:3000
   - Admin Panel: http://localhost:3000/admin

## 📁 Project Structure

```
website/
├── index.html              # Main website page
├── admin.html              # Admin panel page
├── styles.css              # Main website styles
├── admin-styles.css        # Admin panel styles
├── script.js               # Main website JavaScript
├── admin-script.js         # Admin panel JavaScript
├── server.js               # Node.js server (optional)
├── package.json            # Node.js dependencies
├── products.json           # Product data (created automatically)
├── profile.json            # Doctor profile data (created automatically)
├── uploads/                # Image uploads directory
└── README.md              # This file
```

## 🎨 Customization

### Colors and Theme
Edit the CSS variables in `styles.css`:
```css
:root {
    --primary-green: #2d5016;
    --secondary-green: #6b8e23;
    --light-green: #9ccc65;
    --cream: #f5f5dc;
    --brown: #8b4513;
    --gold: #daa520;
}
```

### Doctor Information
Update the header section in `index.html`:
```html
<div class="contact-info">
    <div class="contact-item">
        <i class="fas fa-phone"></i>
        <span>Your Phone Number</span>
    </div>
    <div class="contact-item">
        <i class="fas fa-envelope"></i>
        <span>your-email@domain.com</span>
    </div>
    <div class="contact-item">
        <i class="fas fa-map-marker-alt"></i>
        <span>Your Address</span>
    </div>
</div>
```

### Admin Password
For security, change the default password in `admin-script.js`:
```javascript
this.adminPassword = 'your-secure-password';
```

## 📱 Responsive Breakpoints

- **Desktop**: 1200px and above
- **Tablet**: 768px - 1199px
- **Mobile**: Below 768px

## 🔧 API Endpoints (Node.js Server)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create new product
- `PUT /api/products` - Update product
- `DELETE /api/products/:id` - Delete product

### Profile
- `GET /api/profile` - Get doctor profile
- `PUT /api/profile` - Update doctor profile

### Upload
- `POST /api/upload` - Upload image

## 🛡️ Security Notes

1. **Change Default Password**: Always change the default admin password
2. **HTTPS**: Use HTTPS in production
3. **File Validation**: Image uploads are validated for type and size
4. **Input Sanitization**: Validate all user inputs

## 📋 Browser Support

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## 🎯 Default Products

The website comes with 6 sample Ayurvedic products:
1. Ashwagandha Capsules
2. Triphala Powder
3. Brahmi Oil
4. Turmeric Tablets
5. Neem Capsules
6. Ayurvedic Tea Blend

## 🚀 Deployment Options

### GitHub Pages
1. Push code to GitHub repository
2. Enable Pages in repository settings
3. Choose source branch
4. Access via provided URL

### Netlify
1. Connect GitHub repository
2. Set build command: (leave empty)
3. Set publish directory: `/`
4. Deploy

### Node.js Hosting (Heroku, Railway, etc.)
1. Add start script to package.json
2. Set PORT environment variable
3. Deploy with git push

## 🎨 Font Usage

- **Headings**: Libre Baskerville (serif)
- **Body Text**: Merriweather (serif)
- **Icons**: Font Awesome 6.0

## 📞 Support

For customization help or issues:
1. Check the console for JavaScript errors
2. Verify all file paths are correct
3. Ensure proper folder structure
4. Test on different browsers

## 📄 License

This project is open source and available under the MIT License.

---

**Enjoy your new Ayurvedic website! 🌿**
