import { useState, useEffect } from 'react';
import { productAPI } from '../services/api';

export const useProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch all products
    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await productAPI.getProducts();
            setProducts(response.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Create new product
    const createProduct = async (productData) => {
        try {
            setLoading(true);

            const response = await productAPI.createProduct(productData);
            setProducts(prev => [response.data, ...prev]);

            return response;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Update product
    const updateProduct = async (id, productData) => {
        try {
            setLoading(true);

            const response = await productAPI.updateProduct(id, productData);

            setProducts(prev => prev.map(product =>
                product.id === parseInt(id) ? response.data : product
            ));

            return response;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Delete product
    const deleteProduct = async (id) => {
        try {
            setLoading(true);

            const response = await productAPI.deleteProduct(id);

            setProducts(prev => prev.filter(product =>
                product.id !== parseInt(id)
            ));

            return response;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Fetch products on component mount
    useEffect(() => {
        fetchProducts();
    }, []);

    return {
        products,
        loading,
        error,
        fetchProducts,
        createProduct,
        updateProduct,
        deleteProduct
    };
};