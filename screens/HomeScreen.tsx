import React from 'react';
import { ReceiptScanner } from '../components/receipt/ReceiptScanner';
import { ProcessedReceipt } from '../utils/ocrProcessor';

const HomeScreen: React.FC = () => {
  const handleScanComplete = (receipt: ProcessedReceipt) => {
    // Here you can implement additional logic like:
    // - Saving to database
    // - Updating inventory
    // - Syncing with backend
    console.log('Processed receipt:', receipt);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Smart Home Inventory
            </h1>
            <p className="text-gray-600 mb-6">
              Upload or take a picture of your receipt to automatically categorize your items.
            </p>
            
            <ReceiptScanner onScanComplete={handleScanComplete} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen; 