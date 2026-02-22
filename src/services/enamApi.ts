/**
 * eNAM (National Agriculture Market) API Integration
 * Source: UMANG Platform - Government of India
 * Endpoint: https://apigw.umangapp.in/umang/apisetu/dept/enamapi/ws1/getProductsNew
 */

import { Product } from '../types';

const ENAM_API_URL = 'https://apigw.umangapp.in/umang/apisetu/dept/enamapi/ws1/getProductsNew';

// Category mapping from eNAM commodity names to our app categories
const categoryMap: Record<string, string> = {
  'mango': 'fruits', 'banana': 'fruits', 'apple': 'fruits', 'grapes': 'fruits',
  'watermelon': 'fruits', 'pomegranate': 'fruits', 'papaya': 'fruits', 'guava': 'fruits',
  'orange': 'fruits', 'lemon': 'fruits', 'coconut': 'fruits', 'pineapple': 'fruits',
  'tomato': 'vegetables', 'onion': 'vegetables', 'potato': 'vegetables', 'brinjal': 'vegetables',
  'cauliflower': 'vegetables', 'cabbage': 'vegetables', 'carrot': 'vegetables',
  'green chilli': 'vegetables', 'capsicum': 'vegetables', 'ladyfinger': 'vegetables',
  'okra': 'vegetables', 'drumstick': 'vegetables', 'bitter gourd': 'vegetables',
  'bottle gourd': 'vegetables', 'spinach': 'vegetables', 'coriander': 'vegetables',
  'beans': 'vegetables', 'peas': 'vegetables', 'cucumber': 'vegetables',
  'rice': 'grains', 'wheat': 'grains', 'jowar': 'grains', 'bajra': 'grains',
  'maize': 'grains', 'ragi': 'grains', 'paddy': 'grains', 'barley': 'grains',
  'turmeric': 'organic', 'ginger': 'organic', 'honey': 'organic',
  'milk': 'dairy', 'ghee': 'dairy', 'curd': 'dairy', 'paneer': 'dairy',
};

// Emoji mapping
const emojiMap: Record<string, string> = {
  'fruits': '🍎', 'vegetables': '🥦', 'grains': '🌾', 'dairy': '🥛', 'organic': '🌿',
  'mango': '🥭', 'banana': '🍌', 'apple': '🍎', 'grapes': '🍇', 'watermelon': '🍉',
  'pomegranate': '🍎', 'papaya': '🍈', 'guava': '🍐', 'orange': '🍊', 'lemon': '🍋',
  'coconut': '🥥', 'pineapple': '🍍', 'tomato': '🍅', 'onion': '🧅', 'potato': '🥔',
  'brinjal': '🍆', 'cauliflower': '🥦', 'cabbage': '🥬', 'carrot': '🥕',
  'green chilli': '🌶️', 'capsicum': '🫑', 'rice': '🍚', 'wheat': '🌾',
  'turmeric': '🟡', 'ginger': '🫚', 'honey': '🍯', 'milk': '🥛', 'ghee': '🧈',
};

// Placeholder images by category
const placeholderImages: Record<string, string> = {
  fruits: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400&h=300&fit=crop',
  vegetables: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop',
  grains: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop',
  dairy: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=300&fit=crop',
  organic: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop',
};

interface EnamApiItem {
  commodity?: string;
  productName?: string;
  product_name?: string;
  min_price?: string;
  minPrice?: string;
  max_price?: string;
  maxPrice?: string;
  modal_price?: string;
  modalPrice?: string;
  unit?: string;
  market?: string;
  apmc?: string;
  state?: string;
}

/**
 * Detect category from product/commodity name
 */
function detectCategory(name: string): string {
  const lower = (name || '').toLowerCase();
  for (const [keyword, cat] of Object.entries(categoryMap)) {
    if (lower.includes(keyword)) return cat;
  }
  return 'vegetables'; // default
}

/**
 * Detect emoji from product name
 */
function detectEmoji(name: string): string {
  const lower = (name || '').toLowerCase();
  for (const [keyword, emoji] of Object.entries(emojiMap)) {
    if (lower.includes(keyword)) return emoji;
  }
  const category = detectCategory(name);
  return emojiMap[category] || '🌱';
}

/**
 * Transform eNAM API response items into our app's product format
 */
function transformEnamProduct(item: EnamApiItem, index: number): Product {
  const name = item.commodity || item.productName || item.product_name || 'Farm Product';
  const category = detectCategory(name);
  const emoji = detectEmoji(name);

  const minPrice = parseFloat(item.min_price || item.minPrice || item.modal_price || '0');
  const maxPrice = parseFloat(item.max_price || item.maxPrice || item.modal_price || '0');
  const modalPrice = parseFloat(item.modal_price || item.modalPrice || String((minPrice + maxPrice) / 2) || '50');
  const pricePerKg = Math.round(modalPrice > 1000 ? modalPrice / 100 : modalPrice); // Convert quintal to kg if needed

  return {
    id: `enam-${index + 1}`,
    name: name.charAt(0).toUpperCase() + name.slice(1),
    emoji,
    category,
    image: placeholderImages[category] || placeholderImages.vegetables,
    images: [placeholderImages[category] || placeholderImages.vegetables],
    farmerId: 'f1', // Assign to default local farmer
    price: pricePerKg || 50,
    unit: item.unit || 'kg',
    availableQty: Math.floor(Math.random() * 80) + 20,
    freshness: 'fresh',
    harvestDate: new Date().toISOString().split('T')[0],
    farmingMethod: 'Traditional',
    description: `${name} sourced via eNAM (National Agriculture Market). Market: ${item.market || item.apmc || 'India'}. State: ${item.state || 'India'}. Current modal price: ₹${modalPrice}/quintal.`,
    rating: Number((4 + Math.random() * 0.9).toFixed(1)),
    reviewCount: Math.floor(Math.random() * 40) + 5,
    source: 'eNAM', // Mark as API-sourced
    market: item.market || item.apmc || '',
    state: item.state || '',
  };
}

/**
 * Fetch products from eNAM API
 * Returns an array of products in our app format, or empty array on failure
 */
export async function fetchEnamProducts(): Promise<Product[]> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000); // 5s timeout

    const response = await fetch(ENAM_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        tkn: '',
        trkr: Date.now().toString(),
        lang: 'en',
        lat: '',
        lon: '',
        lac: '',
        did: 'agritech-marketplace',
        usag: 'agritech',
        apitrkr: Date.now().toString(),
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      console.warn('eNAM API returned status:', response.status);
      return [];
    }

    const data = await response.json();

    // Try to extract products from various possible response shapes
    const items: EnamApiItem[] = data.products || data.data || data.result || data.records || data.commodities || [];

    if (!Array.isArray(items) || items.length === 0) {
      console.warn('eNAM API returned no product data. Response keys:', Object.keys(data));
      return [];
    }

    return items.slice(0, 30).map((item, idx) => transformEnamProduct(item, idx));
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.warn('eNAM API request timed out');
    } else {
      console.warn('eNAM API fetch failed:', error instanceof Error ? error.message : error);
    }
    return [];
  }
}

export { ENAM_API_URL };
