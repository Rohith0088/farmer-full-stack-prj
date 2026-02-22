import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { getFarmerById } from '../data/mockData';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = React.memo(({ product, onQuickView }) => {
  const { t } = useLanguage();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const farmer = getFarmerById(product.farmerId);

  const getFreshnessLabel = (): { text: string; color: string } => {
    switch (product.freshness) {
      case 'fresh': return { text: t('freshToday'), color: '#059669' };
      case '1day': return { text: t('oneDayOld'), color: '#d97706' };
      case '2days': return { text: t('twoDaysOld'), color: '#ea580c' };
      default: return { text: t('freshToday'), color: '#059669' };
    }
  };

  const freshness = getFreshnessLabel();

  const handleCardClick = (): void => {
    if (onQuickView) {
      onQuickView(product);
    } else {
      navigate(`/product/${product.id}`);
    }
  };

  return (
    <div className="product-card" onClick={handleCardClick} data-blendy-from={`product-${product.id}`}>
      <div className="product-card-inner">
       <div className="product-image-container">
        <img
          src={product.image}
          alt={product.name}
          className="product-image"
          loading="lazy"
          onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Product'; }}
        />
        <span className="product-emoji">{product.emoji}</span>
        <span className="freshness-badge" style={{ backgroundColor: freshness.color }}>
          <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#fff', marginRight: 4, verticalAlign: 'middle' }}></span> {freshness.text}
        </span>
        {product.source === 'eNAM' && (
          <span className="source-badge enam-badge">eNAM</span>
        )}
        {product.source === 'Fruityvice' && (
          <span className="source-badge fruit-badge">🍎 Fruit Store</span>
        )}
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <div className="farmer-info-mini">
          <span className="farmer-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></span>
          <span>{farmer?.name}</span>
          <span className="dot">·</span>
          <span className="village-text"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{verticalAlign: 'middle', marginRight: 2}}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>{farmer?.village?.split(',')[0]}</span>
        </div>
        <div className="product-price-row">
          <span className="product-price">₹{product.price}{t('perKg')}</span>
          <span className="product-stock">{product.availableQty} {product.unit} {t('available')}</span>
        </div>
        <div className="product-rating">
          <span style={{ color: '#d97706' }}>{'★'.repeat(Math.floor(product.rating))}</span> {product.rating}
        </div>
        <div className="product-actions">
          <button
            className="btn-buy"
            onClick={(e: React.MouseEvent) => { e.stopPropagation(); addToCart(product); }}
          >
            {t('addToCart')}
          </button>
          <button
            className="btn-chat"
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              window.open(`https://wa.me/${farmer?.whatsapp}?text=Hi, I'm interested in your ${product.name}`, '_blank');
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          </button>
        </div>
      </div>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';
export default ProductCard;
