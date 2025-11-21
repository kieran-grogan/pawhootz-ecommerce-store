
import { Product } from './types';

// GoHighLevel Configuration
export const GHL_CONFIG = {
  API_TOKEN: 'pit-897be4c1-ad11-4cad-be7e-1329b6a0b407',
  LOCATION_ID: 'dSMazNc3NkiqdkOVHX1x',
  BASE_URL: 'https://services.leadconnectorhq.com',
  ENDPOINTS: {
    PRODUCTS: '/products/', // Added trailing slash to help with strict routing
    MEDIA_FILES: '/medias/files'
  },
  VERSION: '2021-07-28',
  PASSWORD_FIELD_ID: '5GaChjjOHZfZe4dvhP7t'
};

// Asset Paths - using direct GHL URLs as requested
export const ASSETS = {
  LOGO_FULL: 'https://storage.googleapis.com/msgsndr/dSMazNc3NkiqdkOVHX1x/media/68e6a1365fd99d18aa08c6d7.png', 
  LOGO_ICON: 'https://storage.googleapis.com/msgsndr/dSMazNc3NkiqdkOVHX1x/media/68e6a136737424ffaa6f2132.png',
  LOGO_TEXT: '/assets/pawhootz-text.png',
  HERO_VIDEO: 'https://storage.googleapis.com/msgsndr/dSMazNc3NkiqdkOVHX1x/media/69209c4a47e103830f61a159.mp4'
};

export const CATEGORY_LABELS: Record<string, string> = {
  'treats-chews': 'Treats & Chews',
  'toys': 'Toys',
  'beds-blankets': 'Beds & Blankets',
  'grooming-tools': 'Grooming Tools',
  'apparel': 'Apparel'
};

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'PawHootz Premium Kibble',
    description: 'High-protein, grain-free formula perfect for active dogs at our resort.',
    price: 49.99,
    category: 'treats-chews',
    image: 'https://picsum.photos/400/400?random=1',
    reviews: [
      { id: 'r1', author: 'Sarah M.', rating: 5, comment: 'My dog loves this food!', date: '2023-10-15' },
      { id: 'r2', author: 'Mike T.', rating: 4, comment: 'Great quality but a bit pricey.', date: '2023-11-02' }
    ]
  },
  {
    id: '2',
    name: 'Tough Tug Rope',
    description: 'Durable cotton blend rope for aggressive chewers.',
    price: 15.50,
    category: 'toys',
    image: 'https://picsum.photos/400/400?random=2',
    reviews: [
      { id: 'r3', author: 'Jenny L.', rating: 5, comment: 'Finally a toy that lasts longer than 5 minutes.', date: '2023-12-01' }
    ]
  },
  {
    id: '3',
    name: 'Calming Lavender Shampoo',
    description: 'The same shampoo we use in our grooming salon. Soothes itchy skin.',
    price: 22.00,
    category: 'grooming-tools',
    image: 'https://picsum.photos/400/400?random=3',
    reviews: [
      { id: 'r4', author: 'Tom H.', rating: 5, comment: 'Smells amazing and helps with dry skin.', date: '2024-01-10' },
      { id: 'r5', author: 'Lisa K.', rating: 5, comment: 'Best shampoo ever!', date: '2024-01-15' }
    ]
  },
  {
    id: '4',
    name: 'Interactive Puzzle Feeder',
    description: 'Keep your pup entertained for hours while stimulating their brain.',
    price: 29.99,
    category: 'toys',
    image: 'https://picsum.photos/400/400?random=4',
    reviews: [
      { id: 'r6', author: 'Alex R.', rating: 4, comment: 'Good concept, but my dog figured it out too fast.', date: '2024-02-20' }
    ]
  },
  {
    id: '5',
    name: 'PawHootz Bandana',
    description: 'Stylish branded bandana to show off your resort swag.',
    price: 12.00,
    category: 'apparel',
    image: 'https://picsum.photos/400/400?random=5',
    reviews: []
  },
  {
    id: '6',
    name: 'Orthopedic Memory Foam Bed',
    description: 'Luxurious comfort for senior dogs or after a long day of play.',
    price: 89.99,
    category: 'beds-blankets',
    image: 'https://picsum.photos/400/400?random=6',
    reviews: [
      { id: 'r7', author: 'Grandma B.', rating: 5, comment: 'My old Golden loves this bed.', date: '2023-09-05' }
    ]
  },
  {
    id: '7',
    name: 'Organic Sweet Potato Chews',
    description: 'All-natural, single ingredient treats grown in the USA.',
    price: 18.50,
    category: 'treats-chews',
    image: 'https://picsum.photos/400/400?random=7',
    reviews: [
      { id: 'r8', author: 'HealthNut99', rating: 3, comment: 'My dog didn\'t like the texture.', date: '2023-10-30' }
    ]
  },
  {
    id: '8',
    name: 'Slicker Brush',
    description: 'Professional grade brush to remove mats and tangles.',
    price: 19.99,
    category: 'grooming-tools',
    image: 'https://picsum.photos/400/400?random=8',
    reviews: [
      { id: 'r9', author: 'GroomerPro', rating: 5, comment: 'Essential tool for doodles.', date: '2024-01-05' }
    ]
  },
  {
    id: '9',
    name: 'Cozy Fleece Blanket',
    description: 'Soft, washable fleece blanket for crates or couches.',
    price: 24.99,
    category: 'beds-blankets',
    image: 'https://picsum.photos/400/400?random=9',
    reviews: []
  },
  {
    id: '10',
    name: 'Raincoat with Reflective Stripe',
    description: 'Keep your pooch dry and visible during evening walks.',
    price: 34.50,
    category: 'apparel',
    image: 'https://picsum.photos/400/400?random=10',
    reviews: [
      { id: 'r10', author: 'Walker', rating: 4, comment: 'Fits well but hood is a bit big.', date: '2023-11-15' }
    ]
  }
];

export const SYSTEM_INSTRUCTION = `
You are "Hootie", the AI Shop Assistant for PawHootz Pet Resort. 
Your goal is to help customers find products from our catalog.
Be friendly, playful, and use dog-related puns occasionally.
You have access to the following product catalog:
${JSON.stringify(MOCK_PRODUCTS.map(p => `${p.name} ($${p.price}) [${p.category}] - ${p.description}`)).replace(/"/g, "'")}

If a user asks about a specific problem (e.g., "my dog smells"), recommend the relevant product (e.g., Calming Lavender Shampoo).
Always be polite.
`;