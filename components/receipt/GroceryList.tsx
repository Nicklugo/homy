import React from 'react';
import { ProcessedReceipt } from '../../utils/ocrProcessor';
import { groupItemsByCategory, getUniqueCategories } from '../../utils/ocrProcessor';

interface GroceryListProps {
  receipt: ProcessedReceipt;
}

const GroceryList: React.FC<GroceryListProps> = ({ receipt }) => {
  const categories = getUniqueCategories(receipt.items);
  const groupedItems = groupItemsByCategory(receipt.items);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">Receipt Summary</h3>
        {receipt.date && (
          <p className="text-gray-600 mb-2">Date: {receipt.date}</p>
        )}
        <p className="text-lg font-bold">Total: ${receipt.total.toFixed(2)}</p>
      </div>

      <div className="space-y-6">
        {categories.map((category) => (
          <div key={category} className="border-t pt-4">
            <h4 className="text-lg font-semibold mb-3">{category}</h4>
            <div className="space-y-2">
              {groupedItems[category].map((item, index) => (
                <div
                  key={`${item.name}-${index}`}
                  className="flex justify-between items-center py-2 px-4 bg-gray-50 rounded"
                >
                  <span className="text-gray-800">{item.name}</span>
                  <span className="text-gray-600">${item.price.toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="mt-2 text-right text-gray-600">
              Category Total: $
              {groupedItems[category]
                .reduce((sum, item) => sum + item.price, 0)
                .toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroceryList; 