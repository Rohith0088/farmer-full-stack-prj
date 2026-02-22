// Shared TypeScript types for the AgriTech Marketplace

export interface FutureHarvest {
  crop: string;
  date: string;
}

export interface Farmer {
  id: string;
  name: string;
  photo: string;
  village: string;
  phone: string;
  whatsapp: string;
  rating: number;
  totalOrders: number;
  farmPhotos: string[];
  futureHarvests: FutureHarvest[];
  farmingMethod: string;
  joinedDate: string;
  bio: string;
}

export interface Product {
  id: number | string;
  name: string;
  emoji: string;
  category: string;
  image: string;
  images: string[];
  farmerId: string;
  price: number;
  unit: string;
  availableQty: number;
  freshness: string;
  harvestDate: string;
  farmingMethod: string;
  description: string;
  rating: number;
  reviewCount: number;
  source?: string;
  market?: string;
  state?: string;
}

export interface CartItem extends Product {
  qty: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  date: string;
  status: string;
  paymentStatus: string;
  deliveryAddress: string;
  paymentMethod: string;
  customerName: string;
  customerPhone: string;
}

export interface Category {
  id: string;
  emoji: string;
  color: string;
}

export interface Review {
  id: number;
  productId: number;
  userName: string;
  rating: number;
  text: string;
  date: string;
}

export interface DeliveryInfo {
  name: string;
  phone: string;
  address: string;
  paymentMethod: string;
  upiId?: string;
  paymentStatus?: string;
  stripePaymentId?: string;
}

export type LanguageCode = 'en' | 'hi' | 'te' | 'ta' | 'kn' | 'ml' | 'mr' | 'bn' | 'gu' | 'pa';

export type TranslationKey = string;

export interface Translations {
  [lang: string]: {
    [key: string]: string;
  };
}

export interface LanguageNames {
  [code: string]: string;
}
