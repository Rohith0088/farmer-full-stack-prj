import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { getFarmerById, getProductsByFarmer } from '../data/mockData';

const Favorites: React.FC = () => {
  const { t } = useLanguage();
  const { favoriteFarmers, toggleFavoriteFarmer } = useCart();
  const navigate = useNavigate();

  if (favoriteFarmers.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-icon">♥</span>
        <h2>No favorite farmers yet</h2>
        <p>Save farmers you trust to buy from them again!</p>
        <button className="btn-primary btn-large" onClick={() => navigate('/')}>
          {t('startShopping')}
        </button>
      </div>
    );
  }

  return (
    <div className="favorites-page">
      <div className="favorites-list">
        {favoriteFarmers.map(farmerId => {
          const farmer = getFarmerById(farmerId);
          if (!farmer) return null;
          const products = getProductsByFarmer(farmer.id);
          return (
            <div key={farmer.id} className="favorite-farmer-card">
              <div className="fav-farmer-header" onClick={() => navigate(`/farmer/${farmer.id}`)}>
                <img src={farmer.photo} alt={farmer.name} className="fav-farmer-photo"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/60x60?text=Farmer'; }} />
                <div className="fav-farmer-info">
                  <h3>{farmer.name}</h3>
                  <p>{farmer.village}</p>
                  <p>{farmer.rating} • {farmer.farmingMethod}</p>
                </div>
                <button className="btn-unfav" onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  toggleFavoriteFarmer(farmer.id);
                }}>
                  ♥
                </button>
              </div>
              <div className="fav-farmer-products">
                {products.slice(0, 3).map(p => (
                  <div key={p.id} className="fav-product-mini" onClick={() => navigate(`/product/${p.id}`)}>
                    <span>{p.name}</span>
                    <span>₹{p.price}/{p.unit}</span>
                  </div>
                ))}
              </div>
              <div className="fav-farmer-actions">
                <button className="btn-whatsapp" onClick={() =>
                  window.open(`https://wa.me/${farmer.whatsapp}`, '_blank')
                }>
                  {t('whatsappChat')}
                </button>
                <button className="btn-call" onClick={() => window.open(`tel:${farmer.phone}`)}>
                  {t('callFarmer')}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Favorites;
