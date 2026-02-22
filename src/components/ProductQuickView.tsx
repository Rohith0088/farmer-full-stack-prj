import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { useBlendy } from '../context/BlendyContext';
import { getFarmerById } from '../data/mockData';
import { Product } from '../types';

interface ProductQuickViewProps {
  product: Product | null;
  onClose: () => void;
}

const ProductQuickView: React.FC<ProductQuickViewProps> = ({ product, onClose }) => {
  const { t } = useLanguage();
  const { addToCart } = useCart();
  const { untoggle } = useBlendy();
  const navigate = useNavigate();

  if (!product) return null;

  const farmer = getFarmerById(product.farmerId);
  const blendyId = `product-${product.id}`;

  const getFreshnessInfo = (): { text: string; color: string } => {
    switch (product.freshness) {
      case 'fresh': return { text: t('freshToday'), color: '#059669' };
      case '1day': return { text: t('oneDayOld'), color: '#d97706' };
      case '2days': return { text: t('twoDaysOld'), color: '#ea580c' };
      default: return { text: t('freshToday'), color: '#059669' };
    }
  };

  const freshness = getFreshnessInfo();

  const handleClose = (): void => {
    untoggle(blendyId, () => {
      onClose();
    });
  };

  const handleViewFull = (): void => {
    handleClose();
    setTimeout(() => {
      navigate(`/product/${product.id}`);
    }, 100);
  };

  const handleAddToCart = (e: React.MouseEvent): void => {
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <div className="quickview-overlay" onClick={handleClose}>
      <div
        className="quickview-modal"
        data-blendy-to={blendyId}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        <div className="quickview-inner">
          <button className="quickview-close" onClick={handleClose}>✕</button>

          <div className="quickview-image-section">
            <img
              src={product.image}
              alt={product.name}
              className="quickview-image"
              onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Product'; }}
            />
            <span className="quickview-freshness" style={{ backgroundColor: freshness.color }}>
              <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#fff', marginRight: 4, verticalAlign: 'middle' }}></span> {freshness.text}
            </span>
            {product.source === 'eNAM' && (
              <span className="quickview-enam-badge">eNAM</span>
            )}
          </div>

          <div className="quickview-info">
            <h2 className="quickview-name">{product.name}</h2>

            <div className="quickview-price-row">
              <span className="quickview-price">₹{product.price}{t('perKg')}</span>
              <span className="quickview-stock">{product.availableQty} {product.unit} {t('available')}</span>
            </div>

            <div className="quickview-rating">
              <span style={{ color: '#d97706' }}>{'★'.repeat(Math.floor(product.rating))}</span> {product.rating}
            </div>

            <p className="quickview-description">{product.description}</p>

            {farmer && (
              <div className="quickview-farmer" onClick={() => { handleClose(); setTimeout(() => navigate(`/farmer/${farmer.id}`), 100); }}>
                <img
                  src={farmer.photo}
                  alt={farmer.name}
                  className="quickview-farmer-photo"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/44x44?text=F'; }}
                />
                <div>
                  <strong>{farmer.name}</strong>
                  <span><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{verticalAlign: 'middle', marginRight: 2}}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>{farmer.village?.split(',')[0]}</span>
                </div>
              </div>
            )}

            <div className="quickview-actions">
              <button className="btn-primary quickview-cart-btn" onClick={handleAddToCart}>
                {t('addToCart')}
              </button>
              <button className="btn-success quickview-detail-btn" onClick={handleViewFull}>
                {t('productDetails')}
              </button>
            </div>

            {farmer && (
              <button
                className="quickview-whatsapp"
                onClick={() => {
                  window.open(`https://wa.me/${farmer.whatsapp}?text=Hi, I'm interested in your ${product.name}`, '_blank');
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{verticalAlign: 'middle', marginRight: 4}}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> {t('whatsappChat')} with {farmer.name}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductQuickView;
