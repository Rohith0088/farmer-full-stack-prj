import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import type { StripeCardElementChangeEvent } from '@stripe/stripe-js';

const UPI_QR_API = 'http://localhost:5000/generate-qr';
const STRIPE_API = 'http://localhost:5000/create-payment-intent';

const stripePromise = loadStripe(
  process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_XXXXXXXXXXXXXXXXXXXXXXXX'
);

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      fontFamily: '"Segoe UI", system-ui, -apple-system, sans-serif',
      color: '#2d5016',
      '::placeholder': { color: '#8faa7b' },
      iconColor: '#4CAF50',
    },
    invalid: {
      color: '#e74c3c',
      iconColor: '#e74c3c',
    },
  },
  hidePostalCode: true,
};

interface FormData {
  name: string;
  phone: string;
  address: string;
  paymentMethod: string;
  upiId: string;
  paymentStatus?: string;
  stripePaymentId?: string;
}

const CheckoutForm: React.FC = () => {
  const { t } = useLanguage();
  const { cartItems, getCartTotal, placeOrder } = useCart();
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    address: '',
    paymentMethod: 'cod',
    upiId: 'yadarohit1235@okicici',
  });

  const [qrImage, setQrImage] = useState<string>('');
  const [qrLoading, setQrLoading] = useState<boolean>(false);
  const [qrError, setQrError] = useState<string>('');
  const [paymentVerified, setPaymentVerified] = useState<boolean>(false);

  const [stripeLoading, setStripeLoading] = useState<boolean>(false);
  const [stripeError, setStripeError] = useState<string>('');
  const [stripeSuccess, setStripeSuccess] = useState<boolean>(false);
  const [cardComplete, setCardComplete] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'paymentMethod' && value !== 'upi') {
      setQrImage('');
      setQrError('');
      setPaymentVerified(false);
    }
    if (name === 'paymentMethod' && value !== 'card') {
      setStripeError('');
      setStripeSuccess(false);
      setStripeLoading(false);
    }
  };

  const generateUpiQR = useCallback(async (): Promise<void> => {
    if (!formData.upiId.trim()) {
      setQrError('Please enter your UPI ID');
      return;
    }

    setQrLoading(true);
    setQrError('');
    setQrImage('');
    setPaymentVerified(false);

    try {
      const response = await fetch(UPI_QR_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          upiId: formData.upiId.trim(),
          name: formData.name || 'AgriTech Customer',
          amount: getCartTotal(),
        }),
      });

      if (!response.ok) {
        throw new Error('Server error');
      }

      const data = await response.json();
      setQrImage(data.qrImage);
    } catch (error) {
      console.error('QR generation failed:', error);
      setQrError('Could not generate QR. Make sure the server is running on port 5000.');
    } finally {
      setQrLoading(false);
    }
  }, [formData.upiId, formData.name, getCartTotal]);

  useEffect(() => {
    if (formData.paymentMethod !== 'upi' || !formData.upiId.trim()) return;

    const timer = setTimeout(() => {
      if (formData.upiId.includes('@')) {
        generateUpiQR();
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [formData.upiId, formData.paymentMethod, generateUpiQR]);

  const handleStripePayment = async (): Promise<void> => {
    if (!stripe || !elements) {
      setStripeError('Stripe is not loaded yet. Please wait...');
      return;
    }

    if (!formData.name || !formData.phone || !formData.address) {
      alert('Please fill all delivery details first');
      return;
    }

    setStripeLoading(true);
    setStripeError('');
    setStripeSuccess(false);

    try {
      const response = await fetch(STRIPE_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: getCartTotal(),
          currency: 'inr',
          customerName: formData.name,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Payment creation failed');
      }

      const { clientSecret } = await response.json();

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        setStripeError('Card element not found');
        return;
      }

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: formData.name,
            phone: formData.phone,
          },
        },
      });

      if (error) {
        setStripeError(error.message || 'Payment failed');
      } else if (paymentIntent?.status === 'succeeded') {
        setStripeSuccess(true);
        setPaymentVerified(true);

        setTimeout(() => {
          const order = placeOrder({
            ...formData,
            paymentStatus: 'paid',
            paymentMethod: 'card',
            stripePaymentId: paymentIntent.id,
          });
          navigate(`/order-success/${order.id}`);
        }, 1500);
      }
    } catch (error: unknown) {
      console.error('Stripe payment error:', error);
      setStripeError((error as Error).message || 'Payment failed. Please try again.');
    } finally {
      setStripeLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address) {
      alert('Please fill all fields');
      return;
    }
    if (formData.paymentMethod === 'upi' && !formData.upiId.trim()) {
      alert('Please enter your UPI ID');
      return;
    }
    if (formData.paymentMethod === 'card') {
      handleStripePayment();
      return;
    }
    const order = placeOrder({
      ...formData,
      paymentStatus: formData.paymentMethod === 'upi' && paymentVerified ? 'paid' :
                     formData.paymentMethod === 'cod' ? 'pending' : 'pending',
    });
    navigate(`/order-success/${order.id}`);
  };

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="checkout-page">
      <form onSubmit={handleSubmit} className="checkout-form">
        <div className="form-section">
          <h2 className="section-title">{t('deliveryAddress')}</h2>
          <div className="form-group">
            <label>{t('name')}</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
              placeholder={t('name')}
              required
            />
          </div>
          <div className="form-group">
            <label>{t('phoneNumber')}</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="form-input"
              placeholder="+91 XXXXX XXXXX"
              required
            />
          </div>
          <div className="form-group">
            <label>{t('address')}</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="form-input form-textarea"
              placeholder={t('deliveryAddress')}
              rows={3}
              required
            />
          </div>
        </div>

        <div className="form-section">
          <h2 className="section-title">{t('paymentMethod')}</h2>
          <div className="payment-options">
            <label className={`payment-option ${formData.paymentMethod === 'cod' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                checked={formData.paymentMethod === 'cod'}
                onChange={handleChange}
              />
              <span className="payment-icon">₹</span>
              <span>{t('cod')}</span>
            </label>
            <label className={`payment-option ${formData.paymentMethod === 'upi' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="paymentMethod"
                value="upi"
                checked={formData.paymentMethod === 'upi'}
                onChange={handleChange}
              />
              <span className="payment-icon">UPI</span>
              <span>{t('upi')}</span>
            </label>
            <label className={`payment-option ${formData.paymentMethod === 'card' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                checked={formData.paymentMethod === 'card'}
                onChange={handleChange}
              />
              <span className="payment-icon">Card</span>
              <span>Credit/Debit Card</span>
            </label>
          </div>

          {formData.paymentMethod === 'card' && (
            <div className="stripe-payment-section">
              <div className="stripe-card-container">
                <div className="stripe-card-header">
                  <div className="stripe-card-icons">
                    <span className="card-brand visa">VISA</span>
                    <span className="card-brand mastercard">MC</span>
                    <span className="card-brand rupay">RuPay</span>
                  </div>
                  <span className="stripe-secure-badge">Secured by Stripe</span>
                </div>

                <div className="stripe-card-element-wrapper">
                  <label className="stripe-label">Card Details</label>
                  <div className="stripe-card-element">
                    <CardElement
                      options={CARD_ELEMENT_OPTIONS}
                      onChange={(e: StripeCardElementChangeEvent) => {
                        setCardComplete(e.complete);
                        if (e.error) {
                          setStripeError(e.error.message);
                        } else {
                          setStripeError('');
                        }
                      }}
                    />
                  </div>
                </div>

                {stripeError && (
                  <div className="stripe-error">
                    {stripeError}
                  </div>
                )}

                {stripeSuccess && (
                  <div className="stripe-success">
                    Payment Successful! Redirecting to order confirmation...
                  </div>
                )}

                <div className="stripe-amount-display">
                  <span>Total Amount</span>
                  <strong>₹{getCartTotal()}</strong>
                </div>

                <button
                  type="button"
                  className={`stripe-pay-btn ${stripeLoading ? 'loading' : ''} ${stripeSuccess ? 'success' : ''}`}
                  onClick={handleStripePayment}
                  disabled={stripeLoading || stripeSuccess || !cardComplete || !stripe}
                >
                  {stripeLoading ? (
                    <><span className="stripe-spinner"></span> Processing...</>
                  ) : stripeSuccess ? (
                    'Payment Complete'
                  ) : (
                    <>Pay ₹{getCartTotal()} Now</>
                  )}
                </button>

                <p className="stripe-disclaimer">
                  Your card details are encrypted and processed securely by Stripe. We never store your card information.
                </p>
              </div>
            </div>
          )}

          {formData.paymentMethod === 'upi' && (
            <div className="upi-payment-section">
              <div className="form-group">
                <label>Merchant UPI ID</label>
                <div className="upi-input-row">
                  <input
                    type="text"
                    name="upiId"
                    value={formData.upiId}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="yadarohit1235@okicici"
                    readOnly
                  />
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={generateUpiQR}
                    disabled={qrLoading}
                  >
                    {qrLoading ? '...' : ''} Generate QR
                  </button>
                </div>
              </div>

              {qrError && (
                <div className="upi-error">
                  {qrError}
                </div>
              )}

              {qrImage && (
                <div className="upi-qr-display">
                  <div className="upi-qr-card">
                    <div className="upi-qr-header">
                      <span className="upi-qr-icon">AT</span>
                      <div>
                        <h3>AgriTech Marketplace</h3>
                        <p>Scan to Pay via UPI</p>
                      </div>
                    </div>

                    <div className="upi-qr-image-wrapper">
                      <img src={qrImage} alt="UPI QR Code" className="upi-qr-image" />
                    </div>

                    <div className="upi-qr-amount">
                      <span>Amount</span>
                      <strong>₹{getCartTotal()}</strong>
                    </div>

                    <div className="upi-qr-upiid">
                      <span>Pay to:</span>
                      <strong>{formData.upiId}</strong>
                    </div>

                    <div className="upi-qr-apps">
                      <span>Pay using any UPI app</span>
                      <div className="upi-app-icons">
                        <span title="Google Pay">G</span>
                        <span title="PhonePe">P</span>
                        <span title="Paytm">P</span>
                        <span title="BHIM">B</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className={`upi-verify-btn ${paymentVerified ? 'verified' : ''}`}
                      onClick={() => setPaymentVerified(true)}
                    >
                      {paymentVerified ? 'Payment Verified' : 'I have completed the payment'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="form-section">
          <h2 className="section-title">{t('productDetails')}</h2>
          <div className="checkout-items">
            {cartItems.map(item => (
              <div key={item.id} className="checkout-item">
                <span>{item.name}</span>
                <span>{item.qty} × ₹{item.price}</span>
                <span className="checkout-item-total">₹{item.qty * item.price}</span>
              </div>
            ))}
          </div>
          <div className="checkout-total">
            <span>{t('totalAmount')}</span>
            <span className="checkout-total-value">₹{getCartTotal()}</span>
          </div>
        </div>

        <button type="submit" className="btn-success btn-large btn-full">
          {t('placeOrder')} — ₹{getCartTotal()}
        </button>
      </form>
    </div>
  );
};

const Checkout: React.FC = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};

export default Checkout;
