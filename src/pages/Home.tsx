import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useBlendy } from '../context/BlendyContext';
import { useProducts } from '../context/ProductContext';
import { fetchEnamProducts } from '../services/enamApi';
import { fetchFruityviceFruits } from '../services/fruityviceApi';
import SearchBar from '../components/SearchBar';
import CategoryBar from '../components/CategoryBar';
import ProductCard from '../components/ProductCard';
import ProductQuickView from '../components/ProductQuickView';
import { Product } from '../types';

/* ---- Simple in-memory cache so APIs don't re-fetch on every mount ---- */
const apiCache: { enam: Product[] | null; fruits: Product[] | null } = { enam: null, fruits: null };

const PRODUCTS_PER_PAGE = 12;

const Home: React.FC = () => {
  const { t } = useLanguage();
  const { products: localProducts } = useProducts();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('default');
  const [enamProducts, setEnamProducts] = useState<Product[]>([]);
  const [fruitProducts, setFruitProducts] = useState<Product[]>([]);
  const [loadingApi, setLoadingApi] = useState<boolean>(true);
  const [loadingFruits, setLoadingFruits] = useState<boolean>(true);
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [visibleCount, setVisibleCount] = useState(PRODUCTS_PER_PAGE);
  const { toggle, update } = useBlendy();
  const updateTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let mounted = true;

    // Use cached data if available
    if (apiCache.enam) {
      setEnamProducts(apiCache.enam);
      setLoadingApi(false);
    } else {
      setLoadingApi(true);
      fetchEnamProducts()
        .then((apiProducts) => {
          if (mounted) {
            apiCache.enam = apiProducts;
            setEnamProducts(apiProducts);
          }
        })
        .finally(() => { if (mounted) setLoadingApi(false); });
    }

    if (apiCache.fruits) {
      setFruitProducts(apiCache.fruits);
      setLoadingFruits(false);
    } else {
      setLoadingFruits(true);
      fetchFruityviceFruits()
        .then((fruits) => {
          if (mounted) {
            apiCache.fruits = fruits;
            setFruitProducts(fruits);
          }
        })
        .finally(() => { if (mounted) setLoadingFruits(false); });
    }

    return () => { mounted = false; };
  }, []);

  const allProducts = useMemo(() => {
    const local = localProducts.map(p => ({ ...p, source: 'local' }));
    return [...local, ...enamProducts, ...fruitProducts];
  }, [enamProducts, fruitProducts]);

  const filteredProducts = useMemo(() => {
    let filtered = [...allProducts];

    if (sourceFilter === 'local') {
      filtered = filtered.filter(p => p.source === 'local');
    } else if (sourceFilter === 'enam') {
      filtered = filtered.filter(p => p.source === 'eNAM');
    } else if (sourceFilter === 'fruityvice') {
      filtered = filtered.filter(p => p.source === 'Fruityvice');
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
      );
    }

    switch (sortBy) {
      case 'priceLow':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'priceHigh':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.harvestDate).getTime() - new Date(a.harvestDate).getTime());
        break;
      default:
        const categoryOrder: Record<string, number> = { fruits: 1, vegetables: 2, grains: 3, dairy: 4, organic: 5 };
        filtered.sort((a, b) => (categoryOrder[a.category] || 99) - (categoryOrder[b.category] || 99));
    }

    return filtered;
  }, [searchQuery, selectedCategory, sortBy, allProducts, sourceFilter]);

  /* Reset visible count when filters change */
  useEffect(() => {
    setVisibleCount(PRODUCTS_PER_PAGE);
  }, [searchQuery, selectedCategory, sortBy, sourceFilter]);

  /* Debounced blendy update — avoids hammering on every render */
  useEffect(() => {
    if (updateTimer.current) clearTimeout(updateTimer.current);
    updateTimer.current = setTimeout(() => update(), 300);
    return () => { if (updateTimer.current) clearTimeout(updateTimer.current); };
  }, [filteredProducts, update]);

  const visibleProducts = useMemo(
    () => filteredProducts.slice(0, visibleCount),
    [filteredProducts, visibleCount]
  );

  const hasMore = visibleCount < filteredProducts.length;

  const handleLoadMore = useCallback(() => {
    setVisibleCount(prev => prev + PRODUCTS_PER_PAGE);
  }, []);

  const handleQuickView = useCallback((product: Product) => {
    setQuickViewProduct(product);
    setTimeout(() => {
      toggle(`product-${product.id}`);
    }, 50);
  }, [toggle]);

  const handleCloseQuickView = useCallback(() => {
    setQuickViewProduct(null);
  }, []);

  return (
    <div className="home-page">
      <div className="welcome-banner">
        <div className="banner-content">
          <h2>{t('welcomeMsg')}</h2>
          <div className="banner-features">
            <span className="banner-tag">{t('freshProduce')}</span>
            <span className="banner-tag">{t('directFromFarm')}</span>
            <span className="banner-tag">{t('noMiddlemen')}</span>
            <span className="banner-tag">{t('trustedFarmers')}</span>
          </div>
        </div>
      </div>

      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <div className="source-filter-bar">
        <button
          className={`source-btn ${sourceFilter === 'all' ? 'active' : ''}`}
          onClick={() => setSourceFilter('all')}
        >
          All Products
        </button>
        <button
          className={`source-btn ${sourceFilter === 'local' ? 'active' : ''}`}
          onClick={() => setSourceFilter('local')}
        >
          Local Farm
        </button>
        <button
          className={`source-btn ${sourceFilter === 'enam' ? 'active' : ''}`}
          onClick={() => setSourceFilter('enam')}
        >
          eNAM Market {loadingApi && <span className="loading-dot">...</span>}
        </button>
        <button
          className={`source-btn ${sourceFilter === 'fruityvice' ? 'active' : ''}`}
          onClick={() => setSourceFilter('fruityvice')}
        >
          🍎 Fruits Store {loadingFruits && <span className="loading-dot">...</span>}
        </button>
      </div>

      <CategoryBar selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />

      <div className="sort-bar">
        <span className="results-count">
          {filteredProducts.length} {t('items')}
          {enamProducts.length > 0 && sourceFilter !== 'local' && sourceFilter !== 'fruityvice' && (
            <span className="enam-count"> (incl. {enamProducts.length} eNAM)</span>
          )}
          {fruitProducts.length > 0 && sourceFilter !== 'local' && sourceFilter !== 'enam' && (
            <span className="enam-count"> (incl. {fruitProducts.length} Fruits)</span>
          )}
        </span>
        <select
          className="sort-select"
          value={sortBy}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSortBy(e.target.value)}
        >
          <option value="default">{t('sortBy')}</option>
          <option value="priceLow">{t('priceLowHigh')}</option>
          <option value="priceHigh">{t('priceHighLow')}</option>
          <option value="rating">{t('rating')}</option>
          <option value="newest">{t('newest')}</option>
        </select>
      </div>

      <div className="product-grid">
        {visibleProducts.map(product => (
          <ProductCard key={product.id} product={product} onQuickView={handleQuickView} />
        ))}
      </div>

      {hasMore && (
        <div style={{ textAlign: 'center', padding: '16px 0 24px' }}>
          <button
            onClick={handleLoadMore}
            style={{
              padding: '12px 32px',
              border: '1.5px solid #16a34a',
              borderRadius: 12,
              background: '#fff',
              color: '#16a34a',
              fontWeight: 600,
              fontSize: 15,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#16a34a'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#16a34a'; }}
          >
            Load More ({filteredProducts.length - visibleCount} remaining)
          </button>
        </div>
      )}

      {quickViewProduct && (
        <ProductQuickView
          product={quickViewProduct}
          onClose={handleCloseQuickView}
        />
      )}

      {filteredProducts.length === 0 && (
        <div className="empty-state">
          <span className="empty-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </span>
          <p>No products found. Try a different search.</p>
        </div>
      )}
    </div>
  );
};

export default Home;
