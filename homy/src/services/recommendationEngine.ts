'use client';

import { Product, ProductCategory } from '../types/product';

// Mock data for testing
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
  },
  {
    id: '2',
    name: 'Eco Clean Kit',
    price: 49.99,
    rating: 4.6,
    reviews: 850,
    description: 'All-natural cleaning products set',
    category: 'cleaning',
    affiliateLink: 'https://amazon.com/eco-clean-kit',
    features: ['Natural Ingredients', 'Multi-surface Use', 'Eco-friendly'],
    imageUrl: '/images/eco-clean.jpg',
    brand: 'EcoLife',
    bestFor: ['Families', 'Allergies', 'Environment Conscious']
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
    // This will be connected to your actual AI service
    // For now, return mock data
    return mockProducts.filter(p => !category || p.category === category)
      .sort((a, b) => {
        // Basic scoring algorithm
        const scoreA = a.rating * (a.reviews / 100) * (1000 / a.price);
        const scoreB = b.rating * (b.reviews / 100) * (1000 / b.price);
        return scoreB - scoreA;
      });
  }

  async getProductComparison(products: Product[]): Promise<{
    pros: string[];
    cons: string[];
    verdict: string;
  }> {
    // Will be connected to AI service
    return {
      pros: ['High value for money', 'Great for pet hair'],
      cons: ['Slightly heavy', 'Loud on high settings'],
      verdict: 'Best overall value in its category'
    };
  }
} 