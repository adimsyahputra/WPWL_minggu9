import React, { useState, useEffect } from 'react';
import styles from './DataFetcher.module.css';

const DataFetcher = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resourceType, setResourceType] = useState('posts');
  const [limit, setLimit] = useState(10);

  // API endpoints untuk berbagai resource types
  const API_ENDPOINTS = {
    posts: 'https://jsonplaceholder.typicode.com/posts',
    comments: 'https://jsonplaceholder.typicode.com/comments',
    albums: 'https://jsonplaceholder.typicode.com/albums',
    photos: 'https://jsonplaceholder.typicode.com/photos',
    todos: 'https://jsonplaceholder.typicode.com/todos',
    users: 'https://jsonplaceholder.typicode.com/users',
  };

  // Fetch data dengan useEffect
  useEffect(() => {
    // Abort controller untuk cancel request jika komponen unmount
    const abortController = new AbortController();
    const signal = abortController.signal;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Simulate network delay untuk demonstrasi loading
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const response = await fetch(
          `${API_ENDPOINTS[resourceType]}?_limit=${limit}`,
          { signal }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message);
          console.error('Fetch error:', err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Cleanup function untuk abort request
    return () => {
      abortController.abort();
    };
  }, [resourceType, limit]); // Dependencies: run ketika resourceType atau limit berubah

  // Handle retry fetch
  const handleRetry = () => {
    setError(null);

    // Trigger useEffect dengan mengubah state
    setResourceType((prev) => prev);
  };

  // Handle resource type change
  const handleResourceChange = (e) => {
    setResourceType(e.target.value);
    setData(null); // Clear data saat resource berubah
  };

  // Handle limit change
  const handleLimitChange = (e) => {
    setLimit(parseInt(e.target.value));
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        Data Fetcher dengan useEffect
      </h1>

      {/* Controls */}
      <div className={styles.controls}>
        <select
          value={resourceType}
          onChange={handleResourceChange}
          className={styles.select}
          disabled={loading}
        >
          <option value="posts">Posts</option>
          <option value="comments">Comments</option>
          <option value="albums">Albums</option>
          <option value="photos">Photos</option>
          <option value="todos">Todos</option>
          <option value="users">Users</option>
        </select>

        <select
          value={limit}
          onChange={handleLimitChange}
          className={styles.select}
          disabled={loading}
        >
          <option value="5">5 Items</option>
          <option value="10">10 Items</option>
          <option value="20">20 Items</option>
          <option value="50">50 Items</option>
        </select>

        <button
          onClick={handleRetry}
          className={styles.button}
          disabled={loading}
        >
          ↻ Refresh Data
        </button>
      </div>

      {/* API Info */}
      <div className={styles.apiInfo}>
        <h3>📡 API Endpoint:</h3>

        <code className={styles.apiUrl}>
          {API_ENDPOINTS[resourceType]}?_limit={limit}
        </code>

        <p>
          Data akan di-fetch otomatis ketika resource type atau limit berubah
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className={styles.loadingState}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading {resourceType} data...</p>
          <p>⏳ Fetching from JSONPlaceholder API</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className={styles.errorState}>
          <h3>❌ Error Loading Data</h3>
          <p>{error}</p>

          <button
            onClick={handleRetry}
            className={styles.retryButton}
          >
            Try Again
          </button>
        </div>
      )}

      {/* Data Stats */}
      {data && !loading && (
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>{data.length}</div>
            <div className={styles.statLabel}>Items Loaded</div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statNumber}>{resourceType}</div>
            <div className={styles.statLabel}>Resource Type</div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statNumber}>{limit}</div>
            <div className={styles.statLabel}>Items Limit</div>
          </div>
        </div>
      )}

      {/* Data akan ditampilkan di Acara 2 */}
      {data && !loading && (
        <div>
          <h2>Data List</h2>

          <p>
            Data berhasil di-load! Lihat console untuk detail data.
          </p>

          <pre
            style={{
              background: '#f8f9fa',
              padding: '1rem',
              borderRadius: '8px',
              overflowX: 'auto',
              fontSize: '0.9rem',
            }}
          >
            {JSON.stringify(data.slice(0, 2), null, 2)}...
          </pre>

          <p>Total items: {data.length}</p>
        </div>
      )}

      {/* Debug Info */}
      <div
        style={{
          marginTop: '2rem',
          padding: '1rem',
          background: '#f8f9fa',
          borderRadius: '8px',
          fontSize: '0.9rem',
        }}
      >
        <h4>🔄 useEffect Debug Info:</h4>

        <p>
          <strong>Dependencies:</strong> [resourceType, limit]
        </p>

        <p>
          <strong>Resource Type:</strong> {resourceType}
        </p>

        <p>
          <strong>Limit:</strong> {limit}
        </p>

        <p>
          <strong>Data Count:</strong> {data ? data.length : 0}
        </p>

        <p>
          <strong>Loading:</strong> {loading ? 'Yes' : 'No'}
        </p>

        <p>
          <strong>Error:</strong> {error ? 'Yes' : 'No'}
        </p>
      </div>
    </div>
  );
};

export default DataFetcher;
