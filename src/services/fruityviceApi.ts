/**
 * Fruityvice API Integration
 * Source: https://www.fruityvice.com/api/fruit/all
 * Free, public fruit data API with nutritional information
 */

import { Product } from '../types';

const FRUITYVICE_API_URL = 'https://www.fruityvice.com/api/fruit/all';

/* ------------------------------------------------------------------ */
/*  Fruit → high-quality image mapping (Unsplash)                     */
/* ------------------------------------------------------------------ */
const fruitImages: Record<string, { main: string; extra?: string }> = {
  apple:        { main: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=300&fit=crop', extra: 'https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?w=600&h=400&fit=crop' },
  apricot:      { main: 'https://images.unsplash.com/photo-1592681814168-6df0fa93161b?w=400&h=300&fit=crop' },
  avocado:      { main: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400&h=300&fit=crop' },
  banana:       { main: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=300&fit=crop', extra: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=600&h=400&fit=crop' },
  blackberry:   { main: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&h=300&fit=crop' },
  blueberry:    { main: 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=400&h=300&fit=crop' },
  cherry:       { main: 'https://images.unsplash.com/photo-1528821128474-27f963b062bf?w=400&h=300&fit=crop' },
  coconut:      { main: 'https://images.unsplash.com/photo-1580984969071-a8da8df82a36?w=400&h=300&fit=crop' },
  cranberry:    { main: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&h=300&fit=crop' },
  dragonfruit:  { main: 'https://images.unsplash.com/photo-1527325678964-54b9a6b3b100?w=400&h=300&fit=crop' },
  durian:       { main: 'https://images.unsplash.com/photo-1588714477688-cf28a50e94f7?w=400&h=300&fit=crop' },
  fig:          { main: 'https://images.unsplash.com/photo-1601379329542-31a1e66cdbe2?w=400&h=300&fit=crop' },
  gooseberry:   { main: 'https://images.unsplash.com/photo-1425934398893-310a009a77f9?w=400&h=300&fit=crop' },
  grape:        { main: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=400&h=300&fit=crop' },
  grapes:       { main: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=400&h=300&fit=crop' },
  greenapple:   { main: 'https://images.unsplash.com/photo-1584306670957-acf935f5033c?w=400&h=300&fit=crop' },
  guava:        { main: 'https://images.unsplash.com/photo-1536511132770-e5058c7e8c46?w=400&h=300&fit=crop' },
  jackfruit:    { main: 'https://images.unsplash.com/photo-1598983263932-e44c8b9e117d?w=400&h=300&fit=crop' },
  kiwi:         { main: 'https://images.unsplash.com/photo-1585059895524-72359e06133a?w=400&h=300&fit=crop' },
  lemon:        { main: 'https://images.unsplash.com/photo-1590502593747-42a996133562?w=400&h=300&fit=crop' },
  lime:         { main: 'https://images.unsplash.com/photo-1590502593747-42a996133562?w=400&h=300&fit=crop' },
  lychee:       { main: 'https://images.unsplash.com/photo-1629828874514-c1e5103f8358?w=400&h=300&fit=crop' },
  mango:        { main: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&h=300&fit=crop', extra: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=600&h=400&fit=crop' },
  melon:        { main: 'https://images.unsplash.com/photo-1571575173700-afb9492e6a50?w=400&h=300&fit=crop' },
  orange:       { main: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=400&h=300&fit=crop' },
  papaya:       { main: 'https://images.unsplash.com/photo-1517282009859-f000ec3b26fe?w=400&h=300&fit=crop' },
  passionfruit: { main: 'https://images.unsplash.com/photo-1604495772376-9657f0035eb5?w=400&h=300&fit=crop' },
  peach:        { main: 'https://images.unsplash.com/photo-1595124216650-1dead4736a87?w=400&h=300&fit=crop' },
  pear:         { main: 'https://images.unsplash.com/photo-1514756331096-242fdeb70d4a?w=400&h=300&fit=crop' },
  persimmon:    { main: 'https://images.unsplash.com/photo-1598025362874-49e4e4146a84?w=400&h=300&fit=crop' },
  pineapple:    { main: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=400&h=300&fit=crop' },
  plum:         { main: 'https://images.unsplash.com/photo-1502464328471-0ff0228de923?w=400&h=300&fit=crop' },
  pomegranate:  { main: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&h=300&fit=crop' },
  raspberry:    { main: 'https://images.unsplash.com/photo-1577069861033-55d04cec4ef5?w=400&h=300&fit=crop' },
  strawberry:   { main: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&h=300&fit=crop', extra: 'https://images.unsplash.com/photo-1518635017498-87f514b751ba?w=600&h=400&fit=crop' },
  tangerine:    { main: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=400&h=300&fit=crop' },
  tomato:       { main: 'https://images.unsplash.com/photo-1546470427-0d4db154ceb8?w=400&h=300&fit=crop' },
  watermelon:   { main: 'https://images.unsplash.com/photo-1589984662646-e7b2e4962f18?w=400&h=300&fit=crop', extra: 'https://images.unsplash.com/photo-1563114773-84221bd62daa?w=600&h=400&fit=crop' },
};

const defaultFruitImage = 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400&h=300&fit=crop';

/* ------------------------------------------------------------------ */
/*  Fruit → emoji mapping                                             */
/* ------------------------------------------------------------------ */
const fruitEmoji: Record<string, string> = {
  apple: '🍎', apricot: '🍑', avocado: '🥑', banana: '🍌',
  blackberry: '🫐', blueberry: '🫐', cherry: '🍒', coconut: '🥥',
  cranberry: '🍒', dragonfruit: '🐉', durian: '🍈', fig: '🍐',
  gooseberry: '🍇', grape: '🍇', grapes: '🍇', greenapple: '🍏',
  guava: '🍐', jackfruit: '🍈', kiwi: '🥝', lemon: '🍋',
  lime: '🍋', lychee: '🍒', mango: '🥭', melon: '🍈',
  orange: '🍊', papaya: '🍈', passionfruit: '🍈', peach: '🍑',
  pear: '🍐', persimmon: '🍊', pineapple: '🍍', plum: '🍑',
  pomegranate: '🍎', raspberry: '🍓', strawberry: '🍓',
  tangerine: '🍊', tomato: '🍅', watermelon: '🍉',
};

/* ------------------------------------------------------------------ */
/*  Price generation (INR, based on nutritional density)              */
/* ------------------------------------------------------------------ */
function generatePrice(name: string, calories: number): number {
  // Base price by rarity / typical Indian market pricing
  const premiumFruits: Record<string, number> = {
    avocado: 250, dragonfruit: 300, blueberry: 400, raspberry: 350,
    cherry: 320, kiwi: 180, strawberry: 200, fig: 280, durian: 500,
    passionfruit: 350, persimmon: 220, cranberry: 380, lychee: 160,
    jackfruit: 60, plum: 150,
  };
  const lower = name.toLowerCase();
  if (premiumFruits[lower]) return premiumFruits[lower];

  // Price tied loosely to calories (denser = slightly more)
  if (calories > 100) return Math.round(80 + Math.random() * 40);
  if (calories > 60)  return Math.round(50 + Math.random() * 40);
  return Math.round(30 + Math.random() * 40);
}

/* ------------------------------------------------------------------ */
/*  Fruityvice API types                                              */
/* ------------------------------------------------------------------ */
interface FruityviceNutrition {
  calories: number;
  fat: number;
  sugar: number;
  carbohydrates: number;
  protein: number;
}

interface FruityviceFruit {
  name: string;
  id: number;
  family: string;
  order: string;
  genus: string;
  nutritions: FruityviceNutrition;
}

/* ------------------------------------------------------------------ */
/*  Transform API fruit → Product                                     */
/* ------------------------------------------------------------------ */
function transformFruit(fruit: FruityviceFruit): Product {
  const lower = fruit.name.toLowerCase().replace(/\s+/g, '');
  const imgData = fruitImages[lower] || { main: defaultFruitImage };
  const emoji = fruitEmoji[lower] || '🍎';
  const price = generatePrice(fruit.name, fruit.nutritions.calories);
  const { calories, fat, sugar, carbohydrates, protein } = fruit.nutritions;

  return {
    id: `fruit-${fruit.id}`,
    name: fruit.name,
    emoji,
    category: 'fruits',
    image: imgData.main,
    images: imgData.extra ? [imgData.main, imgData.extra] : [imgData.main],
    farmerId: 'f1',
    price,
    unit: 'kg',
    availableQty: Math.floor(Math.random() * 80) + 20,
    freshness: 'fresh',
    harvestDate: new Date().toISOString().split('T')[0],
    farmingMethod: 'Natural',
    description: `Fresh ${fruit.name} (${fruit.family} family). Per 100g — ${calories} cal, ${protein}g protein, ${carbohydrates}g carbs, ${sugar}g sugar, ${fat}g fat. Sourced via Fruityvice.`,
    rating: Number((4 + Math.random() * 0.9).toFixed(1)),
    reviewCount: Math.floor(Math.random() * 60) + 10,
    source: 'Fruityvice',
  };
}

/* ------------------------------------------------------------------ */
/*  Fetch all fruits                                                  */
/* ------------------------------------------------------------------ */
export async function fetchFruityviceFruits(): Promise<Product[]> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(FRUITYVICE_API_URL, {
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      console.warn('Fruityvice API returned status:', response.status);
      return [];
    }

    const data: FruityviceFruit[] = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      console.warn('Fruityvice API returned no data');
      return [];
    }

    // Limit to 25 fruits to avoid rendering too many cards at once
    return data.slice(0, 25).map(transformFruit);
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.warn('Fruityvice API request timed out');
    } else {
      console.warn('Fruityvice API fetch failed:', error instanceof Error ? error.message : error);
    }
    return [];
  }
}

export { FRUITYVICE_API_URL };
