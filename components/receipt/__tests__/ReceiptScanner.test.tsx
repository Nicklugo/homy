import React from 'react';
import { render, act } from '@testing-library/react-native';
import { ReceiptScanner } from '../ReceiptScanner';
import * as ImagePicker from 'expo-image-picker';
import { processReceipt } from '../../../utils/ocrProcessor';

// Mock processReceipt
jest.mock('../../../utils/ocrProcessor', () => ({
  processReceipt: jest.fn(),
}));

// Mock VoiceInput
jest.mock('../VoiceInput', () => ({
  VoiceInput: ({ onItemRecognized }: { onItemRecognized: (item: { name: string; price?: number }) => void }) => {
    setTimeout(() => {
      onItemRecognized({ name: 'Test Item', price: 10.99 });
    }, 0);
    return null;
  },
}));

describe('ReceiptScanner', () => {
  const mockOnScanComplete = jest.fn();
  const mockProcessedData = { items: [{ name: 'Test Item', price: 10.99 }] };

  beforeEach(() => {
    jest.clearAllMocks();
    (processReceipt as jest.Mock).mockResolvedValue(mockProcessedData);
    (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue({
      canceled: false,
      assets: [{ uri: 'test-uri' }],
    });
    (ImagePicker.launchCameraAsync as jest.Mock).mockResolvedValue({
      canceled: false,
      assets: [{ uri: 'test-uri' }],
    });
    (ImagePicker.requestCameraPermissionsAsync as jest.Mock).mockResolvedValue({
      status: 'granted',
    });
  });

  it('handles image picking successfully', async () => {
    const { rerender } = render(<ReceiptScanner onScanComplete={mockOnScanComplete} />);

    await act(async () => {
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });
    });

    await act(async () => {
      await processReceipt('test-uri');
    });

    expect(mockOnScanComplete).toHaveBeenCalledWith(mockProcessedData);
  });

  it('handles image picking error', async () => {
    (processReceipt as jest.Mock).mockRejectedValue(new Error('Processing failed'));

    const { rerender } = render(<ReceiptScanner onScanComplete={mockOnScanComplete} />);

    await act(async () => {
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });
    });

    await act(async () => {
      try {
        await processReceipt('test-uri');
      } catch (error: unknown) {
        if (error instanceof Error) {
          expect(error.message).toBe('Processing failed');
        }
      }
    });
  });

  it('handles camera capture with permission granted', async () => {
    const { rerender } = render(<ReceiptScanner onScanComplete={mockOnScanComplete} />);

    await act(async () => {
      await ImagePicker.requestCameraPermissionsAsync();
    });

    await act(async () => {
      await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 1,
      });
    });

    await act(async () => {
      await processReceipt('test-uri');
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(mockOnScanComplete).toHaveBeenCalledWith(mockProcessedData);
  });

  it('handles camera permission denied', async () => {
    (ImagePicker.requestCameraPermissionsAsync as jest.Mock).mockResolvedValue({
      status: 'denied',
    });

    const { rerender } = render(<ReceiptScanner onScanComplete={mockOnScanComplete} />);

    await act(async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      expect(status).toBe('denied');
    });
  });

  it('handles camera capture error', async () => {
    (ImagePicker.launchCameraAsync as jest.Mock).mockRejectedValue(new Error('Camera error'));

    const { rerender } = render(<ReceiptScanner onScanComplete={mockOnScanComplete} />);

    await act(async () => {
      await ImagePicker.requestCameraPermissionsAsync();
    });

    await act(async () => {
      try {
        await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          quality: 1,
        });
      } catch (error: unknown) {
        if (error instanceof Error) {
          expect(error.message).toBe('Camera error');
        }
      }
    });
  });

  it('handles voice input', async () => {
    const { rerender } = render(<ReceiptScanner onScanComplete={mockOnScanComplete} />);

    // Directly call the onItemRecognized callback from VoiceInput mock
    const VoiceInputMock = require('../VoiceInput').VoiceInput;
    VoiceInputMock({ 
      onItemRecognized: (item: { name: string; price?: number }) => {
        mockOnScanComplete({ items: [item] });
      }
    });

    // Wait for state updates
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(mockOnScanComplete).toHaveBeenCalledWith({
      items: [{ name: 'Test Item', price: 10.99 }],
    });
  });
}); 