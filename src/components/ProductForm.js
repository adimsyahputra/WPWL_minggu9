import React, { useState } from 'react';
import './ProductForm.css';

const ProductForm = ({
    onSubmit,
    loading,
    initialData,
    buttonText = "Add Product"
}) => {
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        price: initialData?.price || '',
        category: initialData?.category || '',
        stock: initialData?.stock || '',
        description: initialData?.description || ''
    });

    const [errors, setErrors] = useState({});

    const categories = ['Electronics', 'Fashion', 'Home', 'Sports', 'Books', 'Other'];

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Product name is required';
        }

        if (!formData.price || formData.price <= 0) {
            newErrors.price = 'Valid price is required';
        }

        if (!formData.category) {
            newErrors.category = 'Category is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            await onSubmit({
                name: formData.name.trim(),
                price: parseFloat(formData.price),
                category: formData.category,
                stock: parseInt(formData.stock) || 0,
                description: formData.description.trim()
            });

            // Reset form if not editing
            if (!initialData) {
                setFormData({
                    name: '',
                    price: '',
                    category: '',
                    stock: '',
                    description: ''
                });
            }

            setErrors({});
        } catch (error) {
            // Error handled in parent
        }
    };

    return (
        <div className="product-form">
            <h3>{initialData ? '✏ Edit Product' : '➕ Add New Product'}</h3>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Product Name *</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter product name"
                        className={errors.name ? 'error' : ''}
                        disabled={loading}
                    />
                    {errors.name && <span className="error-text">{errors.name}</span>}
                </div>

                <div className="form-group">
                    <label>Price (IDR) *</label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="Enter price"
                        min="1"
                        step="0.01"
                        className={errors.price ? 'error' : ''}
                        disabled={loading}
                    />
                    {errors.price && <span className="error-text">{errors.price}</span>}
                </div>

                <div className="form-group">
                    <label>Category *</label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className={errors.category ? 'error' : ''}
                        disabled={loading}
                    >
                        <option value="">Select category</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                    {errors.category && <span className="error-text">{errors.category}</span>}
                </div>

                <div className="form-group">
                    <label>Stock Quantity</label>
                    <input
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={handleChange}
                        placeholder="Enter stock quantity"
                        min="0"
                        disabled={loading}
                    />
                </div>

                <div className="form-group">
                    <label>Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Enter product description"
                        rows="3"
                        disabled={loading}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="submit-btn"
                >
                    {loading ? 'Processing...' : buttonText}
                </button>
            </form>
        </div>
    );
};

export default ProductForm;