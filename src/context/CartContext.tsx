import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product, CartItem, Order, DeliveryInfo } from '../types';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, qty?: number) => void;
  removeFromCart: (productId: number | string) => void;
  updateQty: (productId: number | string, qty: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  orders: Order[];
  placeOrder: (deliveryInfo: DeliveryInfo) => Order;
  favoriteFarmers: string[];
  toggleFavoriteFarmer: (farmerId: string) => void;
  isFarmerFavorite: (farmerId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [favoriteFarmers, setFavoriteFarmers] = useState<string[]>([]);

  const addToCart = (product: Product, qty: number = 1): void => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, qty: item.qty + qty }
            : item
        );
      }
      return [...prev, { ...product, qty }];
    });
  };

  const removeFromCart = (productId: number | string): void => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const updateQty = (productId: number | string, qty: number): void => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, qty } : item
      )
    );
  };

  const clearCart = (): void => setCartItems([]);

  const getCartTotal = (): number =>
    cartItems.reduce((total, item) => total + item.price * item.qty, 0);

  const getCartCount = (): number =>
    cartItems.reduce((count, item) => count + item.qty, 0);

  const placeOrder = (deliveryInfo: DeliveryInfo): Order => {
    const order: Order = {
      id: `ORD-${Date.now()}`,
      items: [...cartItems],
      total: getCartTotal(),
      date: new Date().toISOString(),
      status: 'confirmed',
      paymentStatus: deliveryInfo.paymentMethod === 'cod' ? 'pending' : 'paid',
      deliveryAddress: deliveryInfo.address,
      paymentMethod: deliveryInfo.paymentMethod,
      customerName: deliveryInfo.name,
      customerPhone: deliveryInfo.phone,
    };
    setOrders(prev => [order, ...prev]);
    clearCart();
    return order;
  };

  const toggleFavoriteFarmer = (farmerId: string): void => {
    setFavoriteFarmers(prev =>
      prev.includes(farmerId)
        ? prev.filter(id => id !== farmerId)
        : [...prev, farmerId]
    );
  };

  const isFarmerFavorite = (farmerId: string): boolean => favoriteFarmers.includes(farmerId);

  return (
    <CartContext.Provider value={{
      cartItems, addToCart, removeFromCart, updateQty, clearCart,
      getCartTotal, getCartCount,
      orders, placeOrder,
      favoriteFarmers, toggleFavoriteFarmer, isFarmerFavorite
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};

export default CartContext;
