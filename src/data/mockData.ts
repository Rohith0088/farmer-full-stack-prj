import { Farmer, Product, Category, Review } from '../types';

export const farmers: Farmer[] = [
  {
    id: 'f1',
    name: 'Ramesh Kumar',
    photo: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=200&h=200&fit=crop',
    village: 'Anantapur, Andhra Pradesh',
    phone: '+91 62811 68943',
    whatsapp: '+916281168943',
    rating: 4.8,
    totalOrders: 156,
    farmPhotos: [
      'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&h=300&fit=crop',
    ],
    futureHarvests: [
      { crop: 'Tomatoes 🍅', date: '2026-03-15' },
      { crop: 'Watermelon 🍉', date: '2026-04-01' },
      { crop: 'Mangoes 🥭', date: '2026-05-10' },
    ],
    farmingMethod: 'Organic',
    joinedDate: '2024-06-15',
    bio: 'Third generation farmer from Anantapur. Specializing in organic vegetables and seasonal fruits.',
  },
  {
    id: 'f2',
    name: 'Lakshmi Devi',
    photo: 'https://images.unsplash.com/photo-1594608661623-aa0bd3a69799?w=200&h=200&fit=crop',
    village: 'Warangal, Telangana',
    phone: '+91 62811 68943',
    whatsapp: '+916281168943',
    rating: 4.9,
    totalOrders: 203,
    farmPhotos: [
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400&h=300&fit=crop',
    ],
    futureHarvests: [
      { crop: 'Brinjal 🍆', date: '2026-03-20' },
      { crop: 'Okra', date: '2026-04-05' },
      { crop: 'Turmeric', date: '2026-05-01' },
    ],
    farmingMethod: 'Natural',
    joinedDate: '2024-03-10',
    bio: 'Woman farmer pioneering natural farming in Telangana. Known for fresh leafy vegetables.',
  },
  {
    id: 'f3',
    name: 'Suresh Patel',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    village: 'Nashik, Maharashtra',
    phone: '+91 62811 68943',
    whatsapp: '+916281168943',
    rating: 4.7,
    totalOrders: 89,
    farmPhotos: [
      'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=300&fit=crop',
    ],
    futureHarvests: [
      { crop: 'Grapes 🍇', date: '2026-03-10' },
      { crop: 'Onions 🧅', date: '2026-04-15' },
    ],
    farmingMethod: 'Organic',
    joinedDate: '2025-01-20',
    bio: 'Nashik grape farmer with 15 acres of organic vineyard. Premium quality Thompson seedless grapes.',
  },
  {
    id: 'f4',
    name: 'Gowri Shankar',
    photo: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=200&h=200&fit=crop',
    village: 'Madurai, Tamil Nadu',
    phone: '+91 62811 68943',
    whatsapp: '+916281168943',
    rating: 4.6,
    totalOrders: 124,
    farmPhotos: [
      'https://images.unsplash.com/photo-1595855759920-86582396756a?w=400&h=300&fit=crop',
    ],
    futureHarvests: [
      { crop: 'Banana 🍌', date: '2026-03-25' },
      { crop: 'Coconut 🥥', date: '2026-04-20' },
    ],
    farmingMethod: 'Natural',
    joinedDate: '2024-09-05',
    bio: 'Traditional Tamil farmer specializing in bananas and coconuts. Chemical-free farming for 10 years.',
  },
  {
    id: 'f5',
    name: 'Manjunath Reddy',
    photo: 'https://images.unsplash.com/photo-1566753323558-f4e0952af115?w=200&h=200&fit=crop',
    village: 'Raichur, Karnataka',
    phone: '+91 62811 68943',
    whatsapp: '+916281168943',
    rating: 4.5,
    totalOrders: 67,
    farmPhotos: [
      'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400&h=300&fit=crop',
    ],
    futureHarvests: [
      { crop: 'Rice 🌾', date: '2026-04-01' },
      { crop: 'Jowar', date: '2026-05-15' },
    ],
    farmingMethod: 'Chemical',
    joinedDate: '2025-04-12',
    bio: 'Large-scale grain farmer from Karnataka. Reliable supplier of rice and millets.',
  },
  {
    id: 'f6',
    name: 'Priya Sharma',
    photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop',
    village: 'Jaipur, Rajasthan',
    phone: '+91 62811 68943',
    whatsapp: '+916281168943',
    rating: 4.9,
    totalOrders: 312,
    farmPhotos: [
      'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=400&h=300&fit=crop',
    ],
    futureHarvests: [
      { crop: 'Cow Milk 🥛', date: 'Daily' },
      { crop: 'Paneer', date: 'On Order' },
      { crop: 'Ghee', date: '2026-03-05' },
    ],
    farmingMethod: 'Organic',
    joinedDate: '2023-11-01',
    bio: 'Organic dairy farmer with 20 indigenous cows. Fresh A2 milk, paneer, and ghee delivered daily.',
  },
];

export const products: Product[] = [
  // FRUITS
  {
    id: 1, name: 'Alphonso Mango', emoji: '🥭', category: 'fruits',
    image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1553279768-865429fa0078?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=600&h=400&fit=crop',
    ],
    farmerId: 'f1', price: 120, unit: 'kg', availableQty: 50,
    freshness: 'fresh', harvestDate: '2026-02-19',
    farmingMethod: 'Organic', description: 'Premium Alphonso mangoes, naturally ripened on the tree. Sweet aroma and rich golden pulp.',
    rating: 4.9, reviewCount: 45,
  },
  {
    id: 2, name: 'Banana (Robusta)', emoji: '🍌', category: 'fruits',
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&h=400&fit=crop',
    ],
    farmerId: 'f4', price: 40, unit: 'dozen', availableQty: 200,
    freshness: 'fresh', harvestDate: '2026-02-20',
    farmingMethod: 'Natural', description: 'Fresh Robusta bananas straight from the plantation. Perfect ripeness.',
    rating: 4.7, reviewCount: 82,
  },
  {
    id: 3, name: 'Watermelon', emoji: '🍉', category: 'fruits',
    image: 'https://images.unsplash.com/photo-1589984662646-e7b2e4962f18?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1589984662646-e7b2e4962f18?w=600&h=400&fit=crop',
    ],
    farmerId: 'f1', price: 25, unit: 'kg', availableQty: 100,
    freshness: '1day', harvestDate: '2026-02-19',
    farmingMethod: 'Organic', description: 'Juicy and sweet summer watermelons. Bright red flesh with minimal seeds.',
    rating: 4.5, reviewCount: 33,
  },
  {
    id: 4, name: 'Grapes (Thompson)', emoji: '🍇', category: 'fruits',
    image: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=600&h=400&fit=crop',
    ],
    farmerId: 'f3', price: 80, unit: 'kg', availableQty: 30,
    freshness: 'fresh', harvestDate: '2026-02-20',
    farmingMethod: 'Organic', description: 'Premium Thompson seedless grapes from Nashik. Sweet and crunchy.',
    rating: 4.8, reviewCount: 67,
  },
  {
    id: 5, name: 'Pomegranate', emoji: '🍎', category: 'fruits',
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&h=400&fit=crop',
    ],
    farmerId: 'f3', price: 150, unit: 'kg', availableQty: 25,
    freshness: 'fresh', harvestDate: '2026-02-20',
    farmingMethod: 'Organic', description: 'Ruby red Bhagwa pomegranates. Juicy arils with deep color.',
    rating: 4.6, reviewCount: 29,
  },
  // VEGETABLES
  {
    id: 6, name: 'Tomato (Desi)', emoji: '🍅', category: 'vegetables',
    image: 'https://images.unsplash.com/photo-1546470427-0d4db154ceb8?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1546470427-0d4db154ceb8?w=600&h=400&fit=crop',
    ],
    farmerId: 'f1', price: 30, unit: 'kg', availableQty: 80,
    freshness: 'fresh', harvestDate: '2026-02-20',
    farmingMethod: 'Organic', description: 'Farm-fresh desi tomatoes. Perfect for curry and chutney.',
    rating: 4.7, reviewCount: 91,
  },
  {
    id: 7, name: 'Brinjal (Purple)', emoji: '🍆', category: 'vegetables',
    image: 'https://images.unsplash.com/photo-1615484477778-ca3b77940c25?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1615484477778-ca3b77940c25?w=600&h=400&fit=crop',
    ],
    farmerId: 'f2', price: 35, unit: 'kg', availableQty: 40,
    freshness: 'fresh', harvestDate: '2026-02-20',
    farmingMethod: 'Natural', description: 'Fresh purple brinjal, tender and perfect for bhartha.',
    rating: 4.4, reviewCount: 38,
  },
  {
    id: 8, name: 'Green Chilli', emoji: '🌶️', category: 'vegetables',
    image: 'https://images.unsplash.com/photo-1583119022894-919a68a3d0e3?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1583119022894-919a68a3d0e3?w=600&h=400&fit=crop',
    ],
    farmerId: 'f2', price: 50, unit: 'kg', availableQty: 30,
    freshness: 'fresh', harvestDate: '2026-02-20',
    farmingMethod: 'Natural', description: 'Spicy green chillies. Adds perfect heat to any dish.',
    rating: 4.3, reviewCount: 22,
  },
  {
    id: 9, name: 'Onion (Red)', emoji: '🧅', category: 'vegetables',
    image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&h=400&fit=crop',
    ],
    farmerId: 'f3', price: 28, unit: 'kg', availableQty: 200,
    freshness: '1day', harvestDate: '2026-02-19',
    farmingMethod: 'Chemical', description: 'Nashik red onions. Pungent flavor, essential for Indian cooking.',
    rating: 4.5, reviewCount: 110,
  },
  {
    id: 10, name: 'Potato (Fresh)', emoji: '🥔', category: 'vegetables',
    image: 'https://images.unsplash.com/photo-1508313880080-c8bef3302c11?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1508313880080-c8bef3302c11?w=600&h=400&fit=crop',
    ],
    farmerId: 'f5', price: 22, unit: 'kg', availableQty: 300,
    freshness: '2days', harvestDate: '2026-02-18',
    farmingMethod: 'Chemical', description: 'Fresh potatoes, good for all types of cooking.',
    rating: 4.2, reviewCount: 75,
  },
  {
    id: 11, name: 'Spinach (Palak)', emoji: '🥬', category: 'vegetables',
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&h=400&fit=crop',
    ],
    farmerId: 'f2', price: 20, unit: 'bunch', availableQty: 60,
    freshness: 'fresh', harvestDate: '2026-02-20',
    farmingMethod: 'Natural', description: 'Fresh leafy spinach. Rich in iron and vitamins.',
    rating: 4.6, reviewCount: 44,
  },
  {
    id: 12, name: 'Carrot (Red)', emoji: '🥕', category: 'vegetables',
    image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=600&h=400&fit=crop',
    ],
    farmerId: 'f1', price: 35, unit: 'kg', availableQty: 45,
    freshness: 'fresh', harvestDate: '2026-02-20',
    farmingMethod: 'Organic', description: 'Crunchy red carrots. Sweet and perfect for salad or juice.',
    rating: 4.5, reviewCount: 36,
  },
  // GRAINS
  {
    id: 13, name: 'Basmati Rice', emoji: '🌾', category: 'grains',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=400&fit=crop',
    ],
    farmerId: 'f5', price: 85, unit: 'kg', availableQty: 500,
    freshness: '2days', harvestDate: '2026-02-18',
    farmingMethod: 'Chemical', description: 'Long-grain Basmati rice. Aromatic and fluffy when cooked.',
    rating: 4.8, reviewCount: 152,
  },
  {
    id: 14, name: 'Wheat (Lokwan)', emoji: '🌾', category: 'grains',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&h=400&fit=crop',
    ],
    farmerId: 'f5', price: 35, unit: 'kg', availableQty: 1000,
    freshness: '2days', harvestDate: '2026-02-18',
    farmingMethod: 'Chemical', description: 'Premium Lokwan wheat. Perfect for making soft rotis.',
    rating: 4.6, reviewCount: 88,
  },
  {
    id: 15, name: 'Jowar (Sorghum)', emoji: '🌾', category: 'grains',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=400&fit=crop',
    ],
    farmerId: 'f5', price: 40, unit: 'kg', availableQty: 300,
    freshness: '2days', harvestDate: '2026-02-18',
    farmingMethod: 'Natural', description: 'Nutritious jowar millet. Great for bhakri and porridge.',
    rating: 4.4, reviewCount: 42,
  },
  // DAIRY
  {
    id: 16, name: 'Fresh Cow Milk (A2)', emoji: '🥛', category: 'dairy',
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600&h=400&fit=crop',
    ],
    farmerId: 'f6', price: 70, unit: 'litre', availableQty: 50,
    freshness: 'fresh', harvestDate: '2026-02-20',
    farmingMethod: 'Organic', description: 'Pure A2 cow milk from indigenous Gir cows. Unprocessed and farm-fresh.',
    rating: 4.9, reviewCount: 210,
  },
  {
    id: 17, name: 'Fresh Paneer', emoji: '🧀', category: 'dairy',
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&h=400&fit=crop',
    ],
    farmerId: 'f6', price: 320, unit: 'kg', availableQty: 15,
    freshness: 'fresh', harvestDate: '2026-02-20',
    farmingMethod: 'Organic', description: 'Handmade fresh paneer from A2 milk. Soft and creamy texture.',
    rating: 4.8, reviewCount: 96,
  },
  {
    id: 18, name: 'Desi Ghee', emoji: '🧈', category: 'dairy',
    image: 'https://images.unsplash.com/photo-1600398142498-9e4be9a37b33?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1600398142498-9e4be9a37b33?w=600&h=400&fit=crop',
    ],
    farmerId: 'f6', price: 650, unit: 'kg', availableQty: 20,
    freshness: '1day', harvestDate: '2026-02-19',
    farmingMethod: 'Organic', description: 'Traditional bilona method desi ghee. Rich aroma and golden color.',
    rating: 4.9, reviewCount: 178,
  },
  // ORGANIC
  {
    id: 19, name: 'Organic Turmeric', emoji: '🌿', category: 'organic',
    image: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=600&h=400&fit=crop',
    ],
    farmerId: 'f2', price: 180, unit: 'kg', availableQty: 25,
    freshness: '2days', harvestDate: '2026-02-18',
    farmingMethod: 'Organic', description: 'Pure organic turmeric with high curcumin content. Direct from farm.',
    rating: 4.7, reviewCount: 63,
  },
  {
    id: 20, name: 'Organic Honey', emoji: '🍯', category: 'organic',
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&h=400&fit=crop',
    ],
    farmerId: 'f1', price: 450, unit: 'kg', availableQty: 10,
    freshness: '1day', harvestDate: '2026-02-19',
    farmingMethod: 'Organic', description: 'Raw unprocessed forest honey. Collected from wild bee colonies near the farm.',
    rating: 4.8, reviewCount: 54,
  },
  {
    id: 21, name: 'Moringa Powder', emoji: '🌿', category: 'organic',
    image: 'https://images.unsplash.com/photo-1611241893603-3c359704e0ee?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1611241893603-3c359704e0ee?w=600&h=400&fit=crop',
    ],
    farmerId: 'f4', price: 250, unit: 'kg', availableQty: 15,
    freshness: '2days', harvestDate: '2026-02-18',
    farmingMethod: 'Natural', description: 'Dried moringa leaf powder. Superfood rich in vitamins and minerals.',
    rating: 4.5, reviewCount: 31,
  },
  {
    id: 22, name: 'Coconut (Fresh)', emoji: '🥥', category: 'fruits',
    image: 'https://images.unsplash.com/photo-1550828520-4cb496926fc9?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1550828520-4cb496926fc9?w=600&h=400&fit=crop',
    ],
    farmerId: 'f4', price: 30, unit: 'piece', availableQty: 150,
    freshness: 'fresh', harvestDate: '2026-02-20',
    farmingMethod: 'Natural', description: 'Fresh tender coconuts from our farm. Sweet water and soft malai inside.',
    rating: 4.6, reviewCount: 88,
  },
  // MORE FRUITS
  {
    id: 23, name: 'Papaya', emoji: '🍈', category: 'fruits',
    image: 'https://images.unsplash.com/photo-1517282009859-f000ec3b26fe?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1517282009859-f000ec3b26fe?w=600&h=400&fit=crop',
    ],
    farmerId: 'f4', price: 35, unit: 'kg', availableQty: 60,
    freshness: 'fresh', harvestDate: '2026-02-20',
    farmingMethod: 'Natural', description: 'Sweet ripe papaya from Tamil Nadu farms. Rich in vitamins and great for digestion.',
    rating: 4.5, reviewCount: 42,
  },
  {
    id: 24, name: 'Orange (Nagpur)', emoji: '🍊', category: 'fruits',
    image: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1547514701-42782101795e?w=600&h=400&fit=crop',
    ],
    farmerId: 'f3', price: 60, unit: 'kg', availableQty: 80,
    freshness: 'fresh', harvestDate: '2026-02-20',
    farmingMethod: 'Organic', description: 'Famous Nagpur oranges. Juicy, sweet and packed with Vitamin C.',
    rating: 4.7, reviewCount: 58,
  },
  {
    id: 25, name: 'Pineapple', emoji: '🍍', category: 'fruits',
    image: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=600&h=400&fit=crop',
    ],
    farmerId: 'f4', price: 40, unit: 'piece', availableQty: 70,
    freshness: 'fresh', harvestDate: '2026-02-20',
    farmingMethod: 'Natural', description: 'Sweet tropical pineapple. Perfectly ripe with golden flesh.',
    rating: 4.6, reviewCount: 35,
  },
  {
    id: 26, name: 'Apple (Shimla)', emoji: '🍎', category: 'fruits',
    image: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=600&h=400&fit=crop',
    ],
    farmerId: 'f3', price: 150, unit: 'kg', availableQty: 40,
    freshness: '1day', harvestDate: '2026-02-19',
    farmingMethod: 'Organic', description: 'Premium Shimla apples. Crisp, juicy and naturally sweet.',
    rating: 4.8, reviewCount: 72,
  },
  {
    id: 27, name: 'Lemon (Nimbu)', emoji: '🍋', category: 'fruits',
    image: 'https://images.unsplash.com/photo-1590502593747-42a996133562?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1590502593747-42a996133562?w=600&h=400&fit=crop',
    ],
    farmerId: 'f1', price: 80, unit: 'kg', availableQty: 50,
    freshness: 'fresh', harvestDate: '2026-02-20',
    farmingMethod: 'Organic', description: 'Fresh green lemons from Andhra Pradesh. Tangy and aromatic.',
    rating: 4.4, reviewCount: 55,
  },
  {
    id: 28, name: 'Guava (Amrud)', emoji: '🍏', category: 'fruits',
    image: 'https://images.unsplash.com/photo-1536511132770-e5058c7e8c46?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1536511132770-e5058c7e8c46?w=600&h=400&fit=crop',
    ],
    farmerId: 'f2', price: 50, unit: 'kg', availableQty: 45,
    freshness: 'fresh', harvestDate: '2026-02-20',
    farmingMethod: 'Natural', description: 'Crunchy white-fleshed guava. Rich in Vitamin C and dietary fiber.',
    rating: 4.5, reviewCount: 38,
  },
  // MORE VEGETABLES
  {
    id: 29, name: 'Cauliflower (Gobi)', emoji: '🥦', category: 'vegetables',
    image: 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=600&h=400&fit=crop',
    ],
    farmerId: 'f2', price: 30, unit: 'piece', availableQty: 100,
    freshness: 'fresh', harvestDate: '2026-02-20',
    farmingMethod: 'Natural', description: 'Fresh white cauliflower. Tight florets, perfect for gobi dishes.',
    rating: 4.5, reviewCount: 48,
  },
  {
    id: 30, name: 'Capsicum (Bell Pepper)', emoji: '🫑', category: 'vegetables',
    image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=600&h=400&fit=crop',
    ],
    farmerId: 'f1', price: 60, unit: 'kg', availableQty: 35,
    freshness: 'fresh', harvestDate: '2026-02-20',
    farmingMethod: 'Organic', description: 'Colorful bell peppers. Crunchy and sweet, great for stir-fry and salads.',
    rating: 4.4, reviewCount: 29,
  },
  {
    id: 31, name: 'Cucumber (Kheera)', emoji: '🥒', category: 'vegetables',
    image: 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=600&h=400&fit=crop',
    ],
    farmerId: 'f5', price: 20, unit: 'kg', availableQty: 90,
    freshness: 'fresh', harvestDate: '2026-02-20',
    farmingMethod: 'Natural', description: 'Cool and crunchy cucumbers. Perfect for salads and raita.',
    rating: 4.3, reviewCount: 33,
  },
  {
    id: 32, name: 'Pumpkin (Kaddu)', emoji: '🎃', category: 'vegetables',
    image: 'https://images.unsplash.com/photo-1570586437263-ab629fccc818?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1570586437263-ab629fccc818?w=600&h=400&fit=crop',
    ],
    farmerId: 'f4', price: 25, unit: 'kg', availableQty: 60,
    freshness: '1day', harvestDate: '2026-02-19',
    farmingMethod: 'Natural', description: 'Sweet orange pumpkin. Great for sabzi, halwa and soups.',
    rating: 4.4, reviewCount: 27,
  },
  {
    id: 33, name: 'Cabbage (Patta Gobi)', emoji: '🥬', category: 'vegetables',
    image: 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=600&h=400&fit=crop',
    ],
    farmerId: 'f5', price: 18, unit: 'kg', availableQty: 80,
    freshness: 'fresh', harvestDate: '2026-02-20',
    farmingMethod: 'Chemical', description: 'Fresh green cabbage. Crunchy leaves, ideal for salads and stir-fry.',
    rating: 4.3, reviewCount: 31,
  },
];

export const categories: Category[] = [
  { id: 'fruits', emoji: '🍎', color: '#FF6B6B' },
  { id: 'vegetables', emoji: '🥦', color: '#51CF66' },
  { id: 'grains', emoji: '🌾', color: '#FFD43B' },
  { id: 'dairy', emoji: '🥛', color: '#74C0FC' },
  { id: 'organic', emoji: '🌿', color: '#69DB7C' },
];

export const reviews: Review[] = [
  { id: 1, productId: 1, userName: 'Anita S.', rating: 5, text: 'Best mangoes I ever tasted! So fresh and sweet.', date: '2026-02-15' },
  { id: 2, productId: 1, userName: 'Rajesh K.', rating: 5, text: 'Directly from farm, no chemical ripening. Loved it!', date: '2026-02-14' },
  { id: 3, productId: 6, userName: 'Meena P.', rating: 4, text: 'Fresh tomatoes, good quality. Will reorder.', date: '2026-02-18' },
  { id: 4, productId: 16, userName: 'Sunil R.', rating: 5, text: 'Pure A2 milk, my children love it. Thank you Priya ji!', date: '2026-02-19' },
  { id: 5, productId: 4, userName: 'Kavitha M.', rating: 5, text: 'Nashik grapes are the best. Sweet and seedless.', date: '2026-02-17' },
  { id: 6, productId: 13, userName: 'Amit B.', rating: 4, text: 'Good quality Basmati. Fragrant and long grains.', date: '2026-02-16' },
  { id: 7, productId: 18, userName: 'Deepa V.', rating: 5, text: 'Authentic bilona ghee. Amazing aroma!', date: '2026-02-15' },
  { id: 8, productId: 7, userName: 'Shankar N.', rating: 4, text: 'Very fresh brinjal. Made tasty bhartha.', date: '2026-02-19' },
];

export const getFarmerById = (id: string): Farmer | undefined => farmers.find(f => f.id === id);
export const getProductById = (id: string | number): Product | undefined => products.find(p => p.id === Number(id));
export const getProductsByFarmer = (farmerId: string): Product[] => products.filter(p => p.farmerId === farmerId);
export const getProductsByCategory = (category: string): Product[] => products.filter(p => p.category === category);
export const getReviewsByProduct = (productId: number | string): Review[] => reviews.filter(r => r.productId === Number(productId));
