const express = require('express');
const { pool } = require('../config/database');
const router = express.Router();

// GET all products
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.execute(
            'SELECT * FROM products ORDER BY created_at DESC'
        );

        res.json({
            success: true,
            data: rows,
            total: rows.length
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch products'
        });
    }
});

// GET single product
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await pool.execute(
            'SELECT * FROM products WHERE id = ?',
            [req.params.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Product not found'
            });
        }

        res.json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch product'
        });
    }
});

// POST create new product
router.post('/', async (req, res) => {
    try {
        const { name, price, category, stock, description } = req.body;

        // Validation
        if (!name || !price || !category) {
            return res.status(400).json({
                success: false,
                error: 'Name, price, and category are required'
            });
        }

        if (price <= 0) {
            return res.status(400).json({
                success: false,
                error: 'Price must be greater than 0'
            });
        }

        const [result] = await pool.execute(
            `INSERT INTO products (name, price, category, stock, description)
            VALUES (?, ?, ?, ?, ?)`,
            [name, parseFloat(price), category, parseInt(stock) || 0, description || '']
        );

        // Get the newly created product
        const [newProduct] = await pool.execute(
            'SELECT * FROM products WHERE id = ?',
            [result.insertId]
        );

        res.status(201).json({
            success: true,
            data: newProduct[0],
            message: 'Product created successfully'
        });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create product'
        });
    }
});

// PUT update product
router.put('/:id', async (req, res) => {
    try {
        const { name, price, category, stock, description } = req.body;
        const productId = req.params.id;

        // Check if product exists
        const [existing] = await pool.execute(
            'SELECT * FROM products WHERE id = ?',
            [productId]
        );

        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Product not found'
            });
        }

        // Validation
        if (price && price <= 0) {
            return res.status(400).json({
                success: false,
                error: 'Price must be greater than 0'
            });
        }

        await pool.execute(
            `UPDATE products
            SET name = ?, price = ?, category = ?, stock = ?,
            description = ?
            WHERE id = ?`,
            [
                name || existing[0].name,
                price ? parseFloat(price) : existing[0].price,
                category || existing[0].category,
                stock ? parseInt(stock) : existing[0].stock,
                description || existing[0].description,
                productId
            ]
        );

        // Get updated product
        const [updated] = await pool.execute(
            'SELECT * FROM products WHERE id = ?',
            [productId]
        );

        res.json({
            success: true,
            data: updated[0],
            message: 'Product updated successfully'
        });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update product'
        });
    }
});

// DELETE product
router.delete('/:id', async (req, res) => {
    try {
        const productId = req.params.id;

        // Check if product exists
        const [existing] = await pool.execute(
            'SELECT * FROM products WHERE id = ?',
            [productId]
        );

        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Product not found'
            });
        }

        await pool.execute(
            'DELETE FROM products WHERE id = ?',
            [productId]
        );

        res.json({
            success: true,
            data: existing[0],
            message: 'Product deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete product'
        });
    }
});

module.exports = router;