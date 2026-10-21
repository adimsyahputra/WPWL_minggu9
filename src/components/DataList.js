import React, { useMemo, useState, useEffect } from 'react';
import styles from './DataList.module.css';

const DataList = ({ data, resourceType, loading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('id');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortBy, resourceType]);

  const filteredAndSortedData = useMemo(() => {
    if (!data) return [];

    let filteredData = data;
    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase();
      filteredData = filteredData.filter((item) =>
        Object.values(item).some((value) =>
          value !== null &&
          value !== undefined &&
          String(value).toLowerCase().includes(query)
        )
      );
    }

    return [...filteredData].sort((a, b) => {
      if (sortBy === 'id') return (a.id ?? 0) - (b.id ?? 0);
      if (sortBy === 'title' && a.title && b.title) return a.title.localeCompare(b.title);
      if (sortBy === 'name' && a.name && b.name) return a.name.localeCompare(b.name);
      return 0;
    });
  }, [data, searchTerm, sortBy]);

  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);
  const safePage = Math.min(currentPage, Math.max(totalPages, 1));
  const startIndex = (safePage - 1) * itemsPerPage;
  const currentData = filteredAndSortedData.slice(startIndex, startIndex + itemsPerPage);

  const renderCardContent = (item) => {
    switch (resourceType) {
      case 'posts':
        return (
          <>
            <div className={styles.cardHeader}>
              <div className={styles.cardId}>{item.id}</div>
              <h3 className={styles.cardTitle}>{item.title}</h3>
            </div>
            <p className={styles.cardBody}>{item.body}</p>
            <div className={styles.cardFooter}>
              <span>User ID: {item.userId}</span>
              <span className={styles.userBadge}>Post</span>
            </div>
          </>
        );
      case 'comments':
        return (
          <>
            <div className={styles.cardHeader}>
              <div className={styles.cardId}>{item.id}</div>
              <h3 className={styles.cardTitle}>{item.name}</h3>
              <p className={styles.cardEmail}>{item.email}</p>
            </div>
            <p className={styles.cardBody}>{item.body}</p>
            <div className={styles.cardFooter}>
              <span>Post ID: {item.postId}</span>
              <span className={styles.userBadge}>Comment</span>
            </div>
          </>
        );
      case 'users':
        return (
          <>
            <div className={styles.cardHeader}>
              <div className={styles.cardId}>{item.id}</div>
              <h3 className={styles.cardTitle}>{item.name}</h3>
              <p className={styles.cardEmail}>{item.email}</p>
            </div>
            <p className={styles.cardBody}>
              📞 {item.phone}<br />
              🌐 {item.website}<br />
              🏢 {item.company?.name}
            </p>
            <div className={styles.cardFooter}>
              <span>{item.address?.city}</span>
              <span className={styles.userBadge}>User</span>
            </div>
          </>
        );
      default:
        return (
          <>
            <div className={styles.cardHeader}>
              <div className={styles.cardId}>{item.id}</div>
              <h3 className={styles.cardTitle}>{item.title || item.name || `Item ${item.id}`}</h3>
            </div>
            <p className={styles.cardBody}>
              {JSON.stringify(item, null, 2).slice(0, 150)}...
            </p>
            <div className={styles.cardFooter}>
              <span>ID: {item.id}</span>
              <span className={styles.userBadge}>{resourceType}</span>
            </div>
          </>
        );
    }
  };

  if (loading) return null;

  if (!data || filteredAndSortedData.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyStateIcon}>📭</div>
        <h3>Tidak ada data</h3>
        <p>Coba kata kunci lain atau pilih jenis data yang berbeda.</p>
      </div>
    );
  }

  return (
    <div className={styles.listContainer}>
      <div className={styles.listHeader}>
        <h2 className={styles.listTitle}>📊 {filteredAndSortedData.length} {resourceType} ditemukan</h2>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder={`Cari ${resourceType}...`}
            aria-label={`Cari ${resourceType}`}
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className={styles.searchInput}
          />
          <select
            aria-label="Urutkan data"
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            className={styles.filterSelect}
          >
            <option value="id">Urutkan berdasarkan ID</option>
            <option value="title">Urutkan berdasarkan judul</option>
            <option value="name">Urutkan berdasarkan nama</option>
          </select>
        </div>
      </div>

      <div className={styles.dataGrid}>
        {currentData.map((item) => (
          <article key={`${resourceType}-${item.id}`} className={styles.dataCard}>
            {renderCardContent(item)}
          </article>
        ))}
      </div>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            disabled={safePage === 1}
            className={styles.paginationButton}
            type="button"
          >
            ← Sebelumnya
          </button>
          <span className={styles.paginationInfo}>Halaman {safePage} dari {totalPages}</span>
          <button
            onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
            disabled={safePage === totalPages}
            className={styles.paginationButton}
            type="button"
          >
            Berikutnya →
          </button>
        </div>
      )}
    </div>
  );
};

export default DataList;
