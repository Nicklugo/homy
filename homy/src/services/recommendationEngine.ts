'use client';

import { Product, ProductCategory } from '../types/product';

// Simple mock data
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Smart Vacuum Pro',
    price: 299.99,
    rating: 4.8,
    reviews: 1250,
    description: 'Advanced robot vacuum with AI navigation',
    category: 'vacuum',
    affiliateLink: 'https://amazon.com/smart-vacuum-pro',
    features: ['AI Navigation', 'Pet Hair Detection', 'App Control'],
    imageUrl: '/images/vacuum-pro.jpg',
    brand: 'SmartHome',
    bestFor: ['Pet Owners', 'Large Homes', 'Hardwood Floors']
  }
];

export class RecommendationEngine {
  async getRecommendations(
    userProfile: {
      homeSize: number;
      floorTypes: string[];
      hasPets: boolean;
      cleaningFrequency: string;
    },
    category?: ProductCategory
  ): Promise<Product[]> {
    return mockProducts;
  }

  async getProductComparison(products: Product[]): Promise<{
    pros: string[];
    cons: string[];
    verdict: string;
  }> {
    return {
      pros: ['High value for money'],
      cons: ['Slightly heavy'],
      verdict: 'Best overall value'
    };
  }
} 