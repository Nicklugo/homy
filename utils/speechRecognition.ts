/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

import { Platform } from 'react-native';

interface SpeechRecognitionResult {
  text: string;
  confidence: number;
}

interface SpeechRecognitionEvent {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
        confidence: number;
      };
    };
    length: number;
  };
}

interface SpeechRecognitionErrorEvent {
  error: string;
  message: string;
}

interface SpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  start: () => void;
  stop: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: {
      new(): SpeechRecognition;
    };
    webkitSpeechRecognition: {
      new(): SpeechRecognition;
    };
  }
}

export class SpeechRecognizer {
  private isListening: boolean = false;
  private recognition: SpeechRecognition | null = null;

  constructor() {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const SpeechRecognitionConstructor = (window.SpeechRecognition || window.webkitSpeechRecognition) as { new(): SpeechRecognition } | undefined;
      
      if (SpeechRecognitionConstructor) {
        this.recognition = new SpeechRecognitionConstructor();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
      }
    }
  }

  async start(onResult: (result: SpeechRecognitionResult) => void, onError: (error: string) => void): Promise<void> {
    if (this.isListening) {
      return;
    }

    this.isListening = true;

    try {
      if (Platform.OS === 'web') {
        if (!this.recognition) {
          throw new Error('Speech recognition is not supported in this browser');
        }

        this.recognition.onresult = (event: SpeechRecognitionEvent) => {
          const last = event.results.length - 1;
          const result = {
            text: event.results[last][0].transcript,
            confidence: event.results[last][0].confidence
          };
          onResult(result);
        };

        this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
          onError(event.error);
        };

        this.recognition.start();
      } else {
        // For mobile, we'll show an error message
        this.isListening = false;
        onError('Speech recognition is not available on mobile. Please use the image upload feature instead.');
      }
    } catch (error) {
      this.isListening = false;
      onError('Failed to start speech recognition');
      console.error('Speech recognition error:', error);
    }
  }

  async stop(): Promise<void> {
    if (!this.isListening) {
      return;
    }

    try {
      if (Platform.OS === 'web' && this.recognition) {
        this.recognition.stop();
      }
    } catch (error) {
      console.error('Error stopping speech recognition:', error);
    } finally {
      this.isListening = false;
    }
  }

  isSupported(): boolean {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
    }
    return false; // Not supported on mobile
  }
}

// Helper function to create spoken item from speech input
export const createSpokenItem = (text: string): { name: string; price?: number } => {
  // Handle dollars and cents format first
  const dollarsAndCentsMatch = text.match(/(\d+)\s*dollars?\s+(?:and\s+)?(\d+)\s*cents?/);
  if (dollarsAndCentsMatch) {
    const dollars = parseInt(dollarsAndCentsMatch[1], 10);
    const cents = parseInt(dollarsAndCentsMatch[2], 10);
    return {
      name: text
        .replace(/\d+\s*dollars?\s+(?:and\s+)?\d+\s*cents?/g, '')
        .replace(/\s+/g, ' ')
        .trim(),
      price: dollars + (cents / 100)
    };
  }

  // Try to extract price if mentioned in speech
  const priceMatch = text.match(/\$?\s*(\d+(?:\.\d*)?)/);
  const price = priceMatch ? parseFloat(priceMatch[1]) : undefined;

  // Clean up the item name
  const name = text
    .replace(/\$\s*\d+(?:\.\d*)?/g, '') // Remove dollar amounts with decimal
    .replace(/\d+(?:\.\d*)?\s*dollars?/g, '') // Remove dollar amounts with word
    .replace(/\d+(?:\.\d*)?\s*cents?/g, '') // Remove cent amounts
    .replace(/\d+(?:\.\d*)?/g, '') // Remove remaining numbers
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim();

  return { name, price };
}; 