const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const multer = require('multer');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files
app.use(express.static(__dirname));

// Health check endpoint for deployment services
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Configure multer for image uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'uploads'))
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: function (req, file, cb) {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

// Ensure uploads directory exists
async function ensureUploadsDir() {
    try {
        await fs.access(path.join(__dirname, 'uploads'));
    } catch {
        await fs.mkdir(path.join(__dirname, 'uploads'), { recursive: true });
    }
}

// Data file path
const dataFilePath = path.join(__dirname, 'products.json');

// Default products data
const defaultProducts = [
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

// Initialize products data file
async function initializeData() {
    try {
        await fs.access(dataFilePath);
    } catch {
        await fs.writeFile(dataFilePath, JSON.stringify(defaultProducts, null, 2));
        console.log('Created default products.json file');
    }
}

// Read products from file
async function readProducts() {
    try {
        const data = await fs.readFile(dataFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading products:', error);
        return defaultProducts;
    }
}

// Write products to file
async function writeProducts(products) {
    try {
        await fs.writeFile(dataFilePath, JSON.stringify(products, null, 2));
    } catch (error) {
        console.error('Error writing products:', error);
        throw error;
    }
}

// Profile data management
const profileFilePath = path.join(__dirname, 'profile.json');

// Default profile data
const defaultProfile = {
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

// Initialize profile data file
async function initializeProfileData() {
    try {
        await fs.access(profileFilePath);
    } catch {
        await fs.writeFile(profileFilePath, JSON.stringify(defaultProfile, null, 2));
        console.log('Created default profile.json file');
    }
}

// Read profile from file
async function readProfile() {
    try {
        const data = await fs.readFile(profileFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading profile:', error);
        return defaultProfile;
    }
}

// Write profile to file
async function writeProfile(profile) {
    try {
        await fs.writeFile(profileFilePath, JSON.stringify(profile, null, 2));
    } catch (error) {
        console.error('Error writing profile:', error);
        throw error;
    }
}

// Routes

// Serve main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve admin page
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// Get all products
app.get('/api/products', async (req, res) => {
    try {
        const products = await readProducts();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// Get single product
app.get('/api/products/:id', async (req, res) => {
    try {
        const products = await readProducts();
        const product = products.find(p => p.id == req.params.id);
        
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch product' });
    }
});

// Add new product
app.post('/api/products', async (req, res) => {
    try {
        const products = await readProducts();
        const newProduct = {
            id: Date.now(),
            ...req.body
        };
        
        products.push(newProduct);
        await writeProducts(products);
        
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create product' });
    }
});

// Update product
app.put('/api/products', async (req, res) => {
    try {
        const products = await readProducts();
        const productIndex = products.findIndex(p => p.id == req.body.id);
        
        if (productIndex === -1) {
            return res.status(404).json({ error: 'Product not found' });
        }
        
        products[productIndex] = req.body;
        await writeProducts(products);
        
        res.json(req.body);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update product' });
    }
});

// Delete product
app.delete('/api/products/:id', async (req, res) => {
    try {
        const products = await readProducts();
        const filteredProducts = products.filter(p => p.id != req.params.id);
        
        if (filteredProducts.length === products.length) {
            return res.status(404).json({ error: 'Product not found' });
        }
        
        await writeProducts(filteredProducts);
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete product' });
    }
});

// Upload image endpoint
app.post('/api/upload', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image uploaded' });
        }
        
        const imageUrl = `/uploads/${req.file.filename}`;
        res.json({ imageUrl });
    } catch (error) {
        res.status(500).json({ error: 'Failed to upload image' });
    }
});

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Profile API Routes

// Get profile
app.get('/api/profile', async (req, res) => {
    try {
        const profile = await readProfile();
        res.json(profile);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});

// Update profile
app.put('/api/profile', async (req, res) => {
    try {
        await writeProfile(req.body);
        res.json(req.body);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

// Error handling middleware
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'File size too large' });
        }
    }
    
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Start server
async function startServer() {
    try {
        await ensureUploadsDir();
        await initializeData();
        await initializeProfileData();
        
        app.listen(PORT, () => {
            console.log(`
🌿 Ayurveda Website Server Running!
┌─────────────────────────────────────┐
│  Server: http://localhost:${PORT}    │
│  Website: http://localhost:${PORT}   │
│  Admin: http://localhost:${PORT}/admin │
└─────────────────────────────────────┘

Default admin password: admin123
            `);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();
