import { createWorker } from 'tesseract.js';

// Define categories and their keywords
const categories = {
  Produce: ['apple', 'banana', 'tomato', 'lettuce', 'carrot', 'onion', 'potato', 'fruit', 'vegetable'],
  Dairy: ['milk', 'cheese', 'yogurt', 'cream', 'butter', 'egg'],
  Meat: ['chicken', 'beef', 'pork', 'fish', 'turkey', 'meat'],
  Cleaning: ['soap', 'detergent', 'cleaner', 'wipes', 'bleach', 'sponge'],
  Pantry: ['bread', 'rice', 'pasta', 'cereal', 'flour', 'sugar', 'oil'],
  Other: []
};

export interface ProcessedReceipt {
  items: Array<{
    name: string;
    price?: number;
    category?: string;
  }>;
  total?: number;
  date?: string;
}

// Function to extract price from a line of text
const extractPrice = (text: string): number | null => {
  const priceRegex = /\$?\d+\.\d{2}/;
  const match = text.match(priceRegex);
  if (match) {
    return parseFloat(match[0].replace('$', ''));
  }
  return null;
};

// Function to determine category based on item name
const determineCategory = (itemName: string): string => {
  const lowercaseName = itemName.toLowerCase();
  
  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(keyword => lowercaseName.includes(keyword))) {
      return category;
    }
  }
  
  return 'Other';
};

// Function to extract date from receipt text
const extractDate = (text: string): string | undefined => {
  const dateRegex = /\d{1,2}[-/]\d{1,2}[-/]\d{2,4}/;
  const match = text.match(dateRegex);
  return match ? match[0] : undefined;
};

// Main function to process receipt image
export async function processReceipt(input: string | File | Blob): Promise<ProcessedReceipt> {
  try {
    const worker = await createWorker('eng');

    // Handle different input types
    let imageSource: string;
    if (typeof input === 'string') {
      imageSource = input;
    } else {
      imageSource = URL.createObjectURL(input);
    }

    const { data: { text } } = await worker.recognize(imageSource);
    await worker.terminate();

    // Clean up object URL if created
    if (typeof input !== 'string') {
      URL.revokeObjectURL(imageSource);
    }

    // Process the extracted text
    const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
    const items: ProcessedReceipt['items'] = [];
    let total: number | undefined;
    let date: string | undefined;

    // Regular expressions for matching
    const priceRegex = /\$?\s*(\d+\.?\d*)/;
    const dateRegex = /(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})/;
    const totalRegex = /total:?\s*\$?\s*(\d+\.?\d*)/i;

    for (const line of lines) {
      // Extract date if found
      const dateMatch = line.match(dateRegex);
      if (dateMatch && !date) {
        date = dateMatch[1];
        continue;
      }

      // Extract total if found
      const totalMatch = line.match(totalRegex);
      if (totalMatch) {
        total = parseFloat(totalMatch[1]);
        continue;
      }

      // Extract price and item name
      const priceMatch = line.match(priceRegex);
      if (priceMatch) {
        const price = parseFloat(priceMatch[1]);
        const name = line.replace(priceRegex, '').trim();
        
        if (name) {
          // Determine category based on keywords
          let category: string | undefined;
          for (const [cat, keywords] of Object.entries(categories)) {
            if (keywords.some(keyword => name.toLowerCase().includes(keyword))) {
              category = cat;
              break;
            }
          }

          items.push({ name, price, category });
        }
      }
    }

    return {
      items,
      total,
      date,
    };
  } catch (error) {
    console.error('Error processing receipt:', error);
    throw new Error('Failed to process receipt');
  }
}

// Function to get unique categories from processed items
export const getUniqueCategories = (items: ProcessedReceipt['items']): string[] => {
  return Array.from(new Set(
    items
      .map(item => item.category)
      .filter((category): category is string => category !== undefined)
  ));
};

// Function to group items by category
export const groupItemsByCategory = (items: ProcessedReceipt['items']): Record<string, ProcessedReceipt['items']> => {
  return items.reduce((acc, item) => {
    if (item.category) {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
    }
    return acc;
  }, {} as Record<string, ProcessedReceipt['items']>);
}; 