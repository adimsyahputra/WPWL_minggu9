const API_BASE = 'http://localhost:5000/api';

// Generic API request function
export const apiRequest = async (endpoint, options = {}) => {
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || `HTTP error! status: ${response.status}`);
        }

        return data;
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
};

// Product API functions
export const productAPI = {
    // Get all products
    getProducts: () => apiRequest('/products'),

    // Get single product
    getProduct: (id) => apiRequest(`/products/${id}`),

    // Create new product
    createProduct: (productData) =>
        apiRequest('/products', {
            method: 'POST',
            body: JSON.stringify(productData)
        }),

    // Update product
    updateProduct: (id, productData) =>
        apiRequest(`/products/${id}`, {
            method: 'PUT',
            body: JSON.stringify(productData)
        }),

    // Delete product
    deleteProduct: (id) =>
        apiRequest(`/products/${id}`, {
            method: 'DELETE'
        })
};