import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { getFarmerById, getProductsByFarmer } from '../data/mockData';

const FarmerProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const { toggleFavoriteFarmer, isFarmerFavorite } = useCart();
  const navigate = useNavigate();

  const farmer = getFarmerById(id as string);
  const farmerProducts = farmer ? getProductsByFarmer(farmer.id) : [];

  if (!farmer) {
    return (
      <div className="empty-state">
        <span className="empty-icon">—</span>
        <p>Farmer not found</p>
      </div>
    );
  }

  const qrUrl = `${window.location.origin}/farmer/${farmer.id}`;
  const isFav = isFarmerFavorite(farmer.id);

  return (
    <div className="farmer-profile-page">
      <div className="farmer-hero">
        <img
          src={farmer.photo}
          alt={farmer.name}
          className="farmer-hero-photo"
          onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/120x120?text=Farmer'; }}
        />
        <h1 className="farmer-hero-name">{farmer.name}</h1>
        <p className="farmer-hero-village">{farmer.village}</p>
        <div className="farmer-hero-stats">
          <div className="stat-item">
            <span className="stat-value">{farmer.rating}</span>
            <span className="stat-label">{t('rating')}</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{farmer.totalOrders}</span>
            <span className="stat-label">{t('totalOrders')}</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{farmer.farmingMethod}</span>
            <span className="stat-label">{t('farmingMethod')}</span>
          </div>
        </div>
        <p className="farmer-bio">{farmer.bio}</p>
        <button
          className={`btn-favorite ${isFav ? 'favorited' : ''}`}
          onClick={() => toggleFavoriteFarmer(farmer.id)}
        >
          {isFav ? '♥' : '♡'} {t('saveFarmer')}
        </button>
      </div>

      <div className="contact-section">
        <h2 className="section-title">{t('contact')}</h2>
        <div className="contact-buttons">
          <button className="btn-call-large" onClick={() => window.open(`tel:${farmer.phone}`)}>
            {t('callFarmer')}
            <span className="contact-number">{farmer.phone}</span>
          </button>
          <button className="btn-whatsapp-large" onClick={() =>
            window.open(`https://wa.me/${farmer.whatsapp}`, '_blank')
          }>
            {t('whatsappChat')}
          </button>
        </div>
      </div>

      <div className="qr-section">
        <h2 className="section-title">{t('farmerQRCode')}</h2>
        <div className="qr-container">
          <QRCodeSVG
            value={qrUrl}
            size={200}
            bgColor="#ffffff"
            fgColor="#2d5016"
            level="H"
            includeMargin={true}
          />
          <p className="qr-instruction">{t('scanToConnect')}</p>
          <p className="qr-url">{qrUrl}</p>
        </div>
      </div>

      {farmer.farmPhotos.length > 0 && (
        <div className="farm-photos-section">
          <h2 className="section-title">{t('farmPhotos')}</h2>
          <div className="farm-photos-grid">
            {farmer.farmPhotos.map((photo, idx) => (
              <img
                key={idx}
                src={photo}
                alt={`Farm ${idx + 1}`}
                className="farm-photo-large"
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Farm'; }}
              />
            ))}
          </div>
        </div>
      )}

      <div className="future-harvest-section">
        <h2 className="section-title">{t('futureHarvest')}</h2>
        <div className="harvest-list">
          {farmer.futureHarvests.map((h, idx) => (
            <div key={idx} className="harvest-item-large">
              <span className="harvest-crop-large">{h.crop}</span>
              <span className="harvest-date-large">{h.date}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="farmer-products-section">
        <h2 className="section-title">{t('otherCrops')}</h2>
        <div className="farmer-products-grid">
          {farmerProducts.map(p => (
            <div key={p.id} className="farmer-product-card" onClick={() => navigate(`/product/${p.id}`)}>
              <img src={p.image} alt={p.name} className="fp-image"
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/160x120?text=Product'; }} />
              <div className="fp-info">
                <span className="fp-name">{p.name}</span>
                <span className="fp-price">₹{p.price}/{p.unit}</span>
                <span className="fp-stock">{p.availableQty} {t('available')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="buy-again-section">
        <button className="btn-buy-again" onClick={() => navigate('/')}>
          {t('buyAgain')}
        </button>
      </div>
    </div>
  );
};

export default FarmerProfile;
