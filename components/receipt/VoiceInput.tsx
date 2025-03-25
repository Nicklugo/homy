import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Platform, StyleSheet } from 'react-native';
import { SpeechRecognizer, createSpokenItem } from '../../utils/speechRecognition';

interface VoiceInputProps {
  onItemRecognized: (item: { name: string; price?: number }) => void;
  onError: (error: string) => void;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({ onItemRecognized, onError }) => {
  const [isListening, setIsListening] = useState(false);
  const [speechRecognizer] = useState(() => new SpeechRecognizer());
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    setIsSupported(speechRecognizer.isSupported());
  }, [speechRecognizer]);

  const handleStartListening = useCallback(async () => {
    try {
      await speechRecognizer.start(
        (result) => {
          const item = createSpokenItem(result.text);
          onItemRecognized(item);
        }
      );
      setIsListening(true);
    } catch (err) {
      setIsListening(false);
      onError(err instanceof Error ? err.message : 'Failed to start voice recognition');
    }
  }, [speechRecognizer, onItemRecognized, onError]);

  const handleStopListening = useCallback(async () => {
    try {
      await speechRecognizer.stop();
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Failed to stop voice recognition');
    } finally {
      setIsListening(false);
    }
  }, [speechRecognizer, onError]);

  if (!isSupported) {
    if (Platform.OS === 'web') {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Voice recognition is not supported in this browser.
            Please try using a modern browser like Chrome.
          </Text>
        </View>
      );
    }
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Voice recognition is not available on mobile.
          Please use the image upload feature instead.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={isListening ? handleStopListening : handleStartListening}
        style={[styles.button, isListening ? styles.buttonStop : styles.buttonStart]}
      >
        {isListening ? (
          <View style={styles.buttonContent}>
            <ActivityIndicator color="white" />
            <Text style={styles.buttonText}>Stop Listening</Text>
          </View>
        ) : (
          <Text style={styles.buttonText}>Start Voice Input</Text>
        )}
      </TouchableOpacity>
      {isListening && (
        <Text style={styles.helpText}>
          Speak your item (e.g., &quot;Milk $3.99&quot;)
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  errorContainer: {
    padding: 16,
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#DC2626',
    textAlign: 'center',
  },
  button: {
    padding: 16,
    borderRadius: 9999,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonStart: {
    backgroundColor: '#3B82F6',
  },
  buttonStop: {
    backgroundColor: '#EF4444',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: '500',
  },
  helpText: {
    marginTop: 16,
    color: '#4B5563',
  },
}); 