import React from 'react';
import './ProductList.css';

const ProductList = ({
    products,
    loading,
    error,
    onRefresh,
    onEdit,
    onDelete
}) => {
    if (loading && products.length === 0) {
        return (
            <div className="loading">
                <div className="spinner"></div>
                <p>Loading products from MySQL database...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error">
                <p>❌ Error: {error}</p>
                <button onClick={onRefresh} className="retry-btn">
                    🔄 Retry
                </button>
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="empty-state">
                <p>📦 No products found in database</p>
                <p>Add your first product using the form!</p>
            </div>
        );
    }

    return (
        <div className="product-list">
            <div className="list-header">
                <h3> Products ({products.length})</h3>
                <button onClick={onRefresh} className="refresh-btn">
                    🔄 Refresh
                </button>
            </div>

            <div className="products-grid">
                {products.map(product => (
                    <div key={product.id} className="product-card">
                        <div className="card-header">
                            <span className="product-id">#{product.id}</span>
                            <span className="product-category">{product.category}</span>
                        </div>

                        <h4 className="product-name">{product.name}</h4>

                        <div className="product-details">
                            <p className="product-price">
                                Rp {product.price.toLocaleString()}
                            </p>

                            <p className="product-stock">
                                Stock: <span className={product.stock === 0 ? 'out-of-stock' : 'in-stock'}>
                                    {product.stock}
                                </span>
                            </p>

                            {product.description && (
                                <p className="product-description">{product.description}</p>
                            )}
                        </div>

                        <div className="card-footer">
                            <span className="created-at">
                                Added: {new Date(product.created_at).toLocaleDateString()}
                            </span>
                        </div>

                        <div className="card-actions">
                            <button
                                onClick={() => onEdit(product)}
                                className="edit-btn"
                                title="Edit product"
                            >
                                ✏ Edit
                            </button>

                            <button
                                onClick={() => onDelete(product.id)}
                                className="delete-btn"
                                title="Delete product"
                                disabled={loading}
                            >
                                🗑 Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductList;