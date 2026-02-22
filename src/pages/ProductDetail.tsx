import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { getProductById, getFarmerById, getReviewsByProduct, getProductsByFarmer } from '../data/mockData';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const product = getProductById(id ?? '');
  const farmer = product ? getFarmerById(product.farmerId) : null;
  const reviews = product ? getReviewsByProduct(product.id) : [];
  const otherProducts = farmer ? getProductsByFarmer(farmer.id).filter(p => p.id !== product!.id) : [];
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [qty, setQty] = useState<number>(1);
  const [showReviewForm, setShowReviewForm] = useState<boolean>(false);

  if (!product || !farmer) {
    return (
      <div className="empty-state">
        <span className="empty-icon">—</span>
        <p>Product not found</p>
      </div>
    );
  }

  const getFreshnessInfo = (): { text: string; color: string } => {
    switch (product.freshness) {
      case 'fresh': return { text: t('freshToday'), color: '#059669' };
      case '1day': return { text: t('oneDayOld'), color: '#d97706' };
      case '2days': return { text: t('twoDaysOld'), color: '#ea580c' };
      default: return { text: t('freshToday'), color: '#059669' };
    }
  };

  const freshness = getFreshnessInfo();

  const getMethodEmoji = (): string => {
    switch (product.farmingMethod) {
      case 'Organic': return 'Organic';
      case 'Natural': return 'Natural';
      case 'Chemical': return 'Chemical';
      default: return 'Standard';
    }
  };

  return (
    <div className="product-detail-page">
      <div className="image-gallery">
        <div className="main-image-container">
          <img
            src={product.images[selectedImage] || product.image}
            alt={product.name}
            className="main-image"
            onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x400?text=Product'; }}
          />
          <span className="detail-freshness-badge" style={{ backgroundColor: freshness.color }}>
            {freshness.text}
          </span>
        </div>
        {product.images.length > 1 && (
          <div className="thumbnail-row">
            {product.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`${product.name} ${idx + 1}`}
                className={`thumbnail ${selectedImage === idx ? 'active' : ''}`}
                onClick={() => setSelectedImage(idx)}
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100x80?text=Product'; }}
              />
            ))}
          </div>
        )}
      </div>

      <div className="detail-info">
        <h1 className="detail-name">{product.name}</h1>
        <div className="detail-price-row">
          <span className="detail-price">₹{product.price}/{product.unit}</span>
          <span className="detail-stock">{product.availableQty} {product.unit} {t('available')}</span>
        </div>
        <div className="detail-rating">
          {'★'.repeat(Math.floor(product.rating))} {product.rating} ({product.reviewCount} {t('reviews')})
        </div>
        <p className="detail-description">{product.description}</p>

        <div className="detail-meta">
          <div className="meta-item">
            <span className="meta-icon">—</span>
            <span className="meta-label">{t('harvestDate')}</span>
            <span className="meta-value">{product.harvestDate}</span>
          </div>
          <div className="meta-item">
            <span className="meta-icon">{getMethodEmoji()}</span>
            <span className="meta-label">{t('farmingMethod')}</span>
            <span className="meta-value">{product.farmingMethod}</span>
          </div>
        </div>

        <div className="qty-selector">
          <button className="qty-btn" onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
          <span className="qty-value">{qty} {product.unit}</span>
          <button className="qty-btn" onClick={() => setQty(Math.min(product.availableQty, qty + 1))}>+</button>
          <span className="qty-total">= ₹{product.price * qty}</span>
        </div>

        <div className="detail-actions">
          <button className="btn-primary btn-large" onClick={() => addToCart(product, qty)}>
            {t('addToCart')}
          </button>
          <button className="btn-success btn-large" onClick={() => {
            addToCart(product, qty);
            navigate('/cart');
          }}>
            {t('buyNow')}
          </button>
        </div>
      </div>

      <div className="farmer-panel" onClick={() => navigate(`/farmer/${farmer.id}`)}>
        <h2 className="section-title">{t('farmerProfile')}</h2>
        <div className="farmer-card-detail">
          <img
            src={farmer.photo}
            alt={farmer.name}
            className="farmer-photo-large"
            onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80x80?text=Farmer'; }}
          />
          <div className="farmer-details">
            <h3>{farmer.name}</h3>
            <p>{farmer.village}</p>
            <p>{farmer.rating} • {farmer.totalOrders} {t('orders')}</p>
            <p>{farmer.farmingMethod} {t('farmingMethod')}</p>
          </div>
        </div>
        <div className="farmer-contact-row">
          <button className="btn-call" onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            window.open(`tel:${farmer.phone}`);
          }}>
            {t('callFarmer')}
          </button>
          <button className="btn-whatsapp" onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            window.open(`https://wa.me/${farmer.whatsapp}?text=Hi, I'm interested in your ${product.name}`, '_blank');
          }}>
            {t('whatsappChat')}
          </button>
        </div>
      </div>

      {farmer.farmPhotos.length > 0 && (
        <div className="farm-photos-section">
          <h2 className="section-title">{t('farmPhotos')}</h2>
          <div className="farm-photos-row">
            {farmer.farmPhotos.map((photo, idx) => (
              <img
                key={idx}
                src={photo}
                alt={`Farm ${idx + 1}`}
                className="farm-photo"
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200x150?text=Farm'; }}
              />
            ))}
          </div>
        </div>
      )}

      <div className="future-harvest-section">
        <h2 className="section-title">{t('futureHarvest')}</h2>
        <div className="harvest-list">
          {farmer.futureHarvests.map((h, idx) => (
            <div key={idx} className="harvest-item">
              <span className="harvest-crop">{h.crop}</span>
              <span className="harvest-date">{h.date}</span>
            </div>
          ))}
        </div>
      </div>

      {otherProducts.length > 0 && (
        <div className="other-products-section">
          <h2 className="section-title">{t('otherCrops')}</h2>
          <div className="other-products-row">
            {otherProducts.map(p => (
              <div key={p.id} className="mini-product-card" onClick={() => navigate(`/product/${p.id}`)}>
                <img src={p.image} alt={p.name} className="mini-product-image"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/120x90?text=Product'; }} />
                <span className="mini-product-name">{p.name}</span>
                <span className="mini-product-price">₹{p.price}/{p.unit}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="reviews-section">
        <h2 className="section-title">{t('reviews')}</h2>
        {reviews.length > 0 ? (
          <div className="reviews-list">
            {reviews.map(review => (
              <div key={review.id} className="review-card">
                <div className="review-header">
                  <span className="review-user">{review.userName}</span>
                  <span className="review-rating">{'★'.repeat(review.rating)}</span>
                </div>
                <p className="review-text">{review.text}</p>
                <span className="review-date">{review.date}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-reviews">No reviews yet. Be the first to review!</p>
        )}
        <button className="btn-secondary" onClick={() => setShowReviewForm(!showReviewForm)}>
          {t('writeReview')}
        </button>
        {showReviewForm && (
          <div className="review-form">
            <div className="star-selector">
              {[1, 2, 3, 4, 5].map(star => (
                <span key={star} className="star-btn">★</span>
              ))}
            </div>
            <textarea className="review-input" placeholder={t('writeReview')} rows={3} />
            <button className="btn-primary">{t('submitReview')}</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
