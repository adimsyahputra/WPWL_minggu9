const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { testConnection } = require('./config/database');
const productRoutes = require('./routes/product');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test database connection
testConnection();

// Routes
app.use('/api/products', productRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        error: 'Internal server error'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📋 API Endpoints:`);
    console.log(` GET /api/health`);
    console.log(` GET /api/products`);
    console.log(` GET /api/products/:id`);
    console.log(` POST /api/products`);
    console.log(` PUT /api/products/:id`);
    console.log(` DELETE /api/products/:id`);
});