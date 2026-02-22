import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';

const Cart: React.FC = () => {
  const { t } = useLanguage();
  const { cartItems, updateQty, removeFromCart, getCartTotal, getCartCount } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-icon">—</span>
        <h2>{t('emptyCart')}</h2>
        <button className="btn-primary btn-large" onClick={() => navigate('/')}>
          {t('startShopping')}
        </button>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-header-info">
        <span>{getCartCount()} {t('items')}</span>
      </div>

      <div className="cart-items">
        {cartItems.map(item => (
          <div key={item.id} className="cart-item">
            <img
              src={item.image}
              alt={item.name}
              className="cart-item-image"
              onClick={() => navigate(`/product/${item.id}`)}
              onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80x80?text=Product'; }}
            />
            <div className="cart-item-info">
              <h3 className="cart-item-name">{item.name}</h3>
              <p className="cart-item-price">₹{item.price}/{item.unit}</p>
              <div className="cart-qty-control">
                <button className="qty-btn-sm" onClick={() => updateQty(item.id, item.qty - 1)}>−</button>
                <span className="cart-qty">{item.qty}</span>
                <button className="qty-btn-sm" onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
              </div>
            </div>
            <div className="cart-item-right">
              <span className="cart-item-total">₹{item.price * item.qty}</span>
              <button className="cart-remove-btn" onClick={() => removeFromCart(item.id)}>
                {t('removeFromCart')}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <div className="cart-total-row">
          <span className="cart-total-label">{t('totalAmount')}</span>
          <span className="cart-total-value">₹{getCartTotal()}</span>
        </div>
        <button className="btn-success btn-large btn-full" onClick={() => navigate('/checkout')}>
          {t('checkout')} — ₹{getCartTotal()}
        </button>
      </div>
    </div>
  );
};

export default Cart;
