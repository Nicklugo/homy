import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { processReceipt, ProcessedReceipt } from '../../utils/ocrProcessor';
import { VoiceInput } from './VoiceInput';

interface ReceiptScannerProps {
  onScanComplete: (data: ProcessedReceipt) => void;
}

export const ReceiptScanner: React.FC<ReceiptScannerProps> = ({ onScanComplete }) => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<ProcessedReceipt['items']>([]);

  const handleImagePick = useCallback(async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
        setLoading(true);
        setError(null);

        const processedData = await processReceipt(result.assets[0].uri);
        onScanComplete(processedData);
      }
    } catch (err) {
      setError('Failed to process image');
      console.error('Image processing error:', err);
    } finally {
      setLoading(false);
    }
  }, [onScanComplete]);

  const handleCameraCapture = useCallback(async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        setError('Camera permission is required');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
        setLoading(true);
        setError(null);

        const processedData = await processReceipt(result.assets[0].uri);
        onScanComplete(processedData);
      }
    } catch (err) {
      setError('Failed to capture image');
      console.error('Camera capture error:', err);
    } finally {
      setLoading(false);
    }
  }, [onScanComplete]);

  const handleVoiceInput = useCallback((item: { name: string; price?: number }) => {
    setItems(prevItems => {
      const newItems = [...prevItems, item];
      onScanComplete({ items: newItems });
      return newItems;
    });
  }, [onScanComplete]);

  const handleVoiceError = useCallback((error: string) => {
    setError(error);
  }, []);

  return (
    <View style={{ padding: 16 }}>
      {error && (
        <View style={{ backgroundColor: '#FEE2E2', padding: 16, borderRadius: 8, marginBottom: 16 }}>
          <Text style={{ color: '#DC2626' }}>{error}</Text>
        </View>
      )}

      <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 16 }}>
        <TouchableOpacity
          testID="choose-image-button"
          onPress={handleImagePick}
          style={{
            backgroundColor: '#3B82F6',
            padding: 12,
            borderRadius: 8,
            flex: 1,
            marginRight: 8,
          }}
        >
          <Text style={{ color: 'white', textAlign: 'center' }}>Choose Image</Text>
        </TouchableOpacity>

        {Platform.OS !== 'web' && (
          <TouchableOpacity
            testID="take-photo-button"
            onPress={handleCameraCapture}
            style={{
              backgroundColor: '#3B82F6',
              padding: 12,
              borderRadius: 8,
              flex: 1,
              marginLeft: 8,
            }}
          >
            <Text style={{ color: 'white', textAlign: 'center' }}>Take Photo</Text>
          </TouchableOpacity>
        )}
      </View>

      <VoiceInput
        onItemRecognized={handleVoiceInput}
        onError={handleVoiceError}
      />

      {loading && (
        <View style={{ alignItems: 'center', marginTop: 16 }}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={{ marginTop: 8, color: '#4B5563' }}>Processing receipt...</Text>
        </View>
      )}

      {image && !loading && (
        <Image
          source={{ uri: image }}
          style={{ width: '100%', height: 200, resizeMode: 'contain', marginTop: 16 }}
          alt="Scanned receipt preview"
        />
      )}

      {items.length > 0 && (
        <View style={{ marginTop: 16 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 8 }}>Voice Input Items:</Text>
          {items.map((item, index) => (
            <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
              <Text>{item.name}</Text>
              {item.price && <Text>${item.price.toFixed(2)}</Text>}
            </View>
          ))}
        </View>
      )}
    </View>
  );
}; 