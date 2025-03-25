// Mock react-native Platform
const mockPlatform = { OS: 'ios' };
jest.mock('react-native', () => ({
  Platform: mockPlatform
}));

import { SpeechRecognizer, createSpokenItem } from '../speechRecognition';

// Mock SpeechRecognition types
interface MockSpeechRecognitionEvent {
  results: {
    length: number;
    [index: number]: {
      [index: number]: {
        transcript: string;
        confidence: number;
      };
    };
  };
}

interface MockSpeechRecognitionErrorEvent {
  error: string;
  message: string;
}

describe('SpeechRecognizer', () => {
  let speechRecognizer: SpeechRecognizer;

  beforeEach(() => {
    // Reset window.SpeechRecognition before each test
    delete (window as any).SpeechRecognition;
    delete (window as any).webkitSpeechRecognition;
    speechRecognizer = new SpeechRecognizer();
  });

  describe('isSupported', () => {
    it('should return false on mobile', () => {
      // Set Platform.OS to 'ios'
      mockPlatform.OS = 'ios';
      speechRecognizer = new SpeechRecognizer();

      expect(speechRecognizer.isSupported()).toBe(false);
    });

    it('should check for browser support on web', () => {
      // Set Platform.OS to 'web'
      mockPlatform.OS = 'web';
      
      // Mock window.SpeechRecognition
      const mockSpeechRecognition = jest.fn();
      Object.defineProperty(window, 'SpeechRecognition', {
        value: mockSpeechRecognition,
        writable: true,
        configurable: true
      });

      speechRecognizer = new SpeechRecognizer();
      expect(speechRecognizer.isSupported()).toBe(true);
    });

    it('should return false when SpeechRecognition is not available in browser', () => {
      // Set Platform.OS to 'web'
      mockPlatform.OS = 'web';
      speechRecognizer = new SpeechRecognizer();

      expect(speechRecognizer.isSupported()).toBe(false);
    });
  });

  describe('start', () => {
    it('should start recognition on web', async () => {
      // Set Platform.OS to 'web'
      mockPlatform.OS = 'web';

      // Mock SpeechRecognition
      const mockStart = jest.fn();
      class MockSpeechRecognition {
        continuous = false;
        interimResults = false;
        onresult: ((event: MockSpeechRecognitionEvent) => void) | null = null;
        onerror: ((event: MockSpeechRecognitionErrorEvent) => void) | null = null;
        start = mockStart;
        stop = () => {};
      }

      Object.defineProperty(window, 'SpeechRecognition', {
        value: MockSpeechRecognition,
        writable: true,
        configurable: true
      });

      speechRecognizer = new SpeechRecognizer();
      await speechRecognizer.start(
        () => {},
        () => {}
      );

      expect(mockStart).toHaveBeenCalled();
    });

    it('should handle recognition results', async () => {
      // Set Platform.OS to 'web'
      mockPlatform.OS = 'web';

      // Mock SpeechRecognition
      class MockSpeechRecognition {
        continuous = false;
        interimResults = false;
        onresult: ((event: MockSpeechRecognitionEvent) => void) | null = null;
        onerror: ((event: MockSpeechRecognitionErrorEvent) => void) | null = null;
        start() {
          // Simulate a recognition result
          setTimeout(() => {
            if (this.onresult) {
              this.onresult({
                results: {
                  length: 1,
                  0: {
                    0: {
                      transcript: 'test transcript',
                      confidence: 0.9
                    }
                  }
                }
              });
            }
          }, 0);
        }
        stop = () => {};
      }

      Object.defineProperty(window, 'SpeechRecognition', {
        value: MockSpeechRecognition,
        writable: true,
        configurable: true
      });

      speechRecognizer = new SpeechRecognizer();
      const onResult = jest.fn();
      await speechRecognizer.start(onResult, () => {});

      // Wait for the simulated result
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(onResult).toHaveBeenCalledWith({
        text: 'test transcript',
        confidence: 0.9
      });
    });

    it('should handle recognition errors', async () => {
      // Set Platform.OS to 'web'
      mockPlatform.OS = 'web';

      // Mock SpeechRecognition
      class MockSpeechRecognition {
        continuous = false;
        interimResults = false;
        onresult: ((event: MockSpeechRecognitionEvent) => void) | null = null;
        onerror: ((event: MockSpeechRecognitionErrorEvent) => void) | null = null;
        start() {
          // Simulate an error
          setTimeout(() => {
            if (this.onerror) {
              this.onerror({
                error: 'not-allowed',
                message: 'Permission denied'
              });
            }
          }, 0);
        }
        stop = () => {};
      }

      Object.defineProperty(window, 'SpeechRecognition', {
        value: MockSpeechRecognition,
        writable: true,
        configurable: true
      });

      speechRecognizer = new SpeechRecognizer();
      const onError = jest.fn();
      await speechRecognizer.start(() => {}, onError);

      // Wait for the simulated error
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(onError).toHaveBeenCalledWith('not-allowed');
    });

    it('should handle start errors when recognition is not supported', async () => {
      // Set Platform.OS to 'web'
      mockPlatform.OS = 'web';
      
      // Mock window without SpeechRecognition
      delete (window as any).SpeechRecognition;
      delete (window as any).webkitSpeechRecognition;

      // Create a new instance after removing SpeechRecognition
      speechRecognizer = new SpeechRecognizer();
      const onError = jest.fn();
      await speechRecognizer.start(() => {}, onError);

      expect(onError).toHaveBeenCalledWith('Failed to start speech recognition');
    });

    it('should handle start errors when recognition fails to start', async () => {
      // Set Platform.OS to 'web'
      mockPlatform.OS = 'web';

      // Mock SpeechRecognition with failing start
      class MockSpeechRecognition {
        continuous = false;
        interimResults = false;
        onresult: ((event: MockSpeechRecognitionEvent) => void) | null = null;
        onerror: ((event: MockSpeechRecognitionErrorEvent) => void) | null = null;
        start() {
          throw new Error('Failed to start');
        }
        stop = () => {};
      }

      Object.defineProperty(window, 'SpeechRecognition', {
        value: MockSpeechRecognition,
        writable: true,
        configurable: true
      });

      speechRecognizer = new SpeechRecognizer();
      const onError = jest.fn();
      await speechRecognizer.start(() => {}, onError);

      expect(onError).toHaveBeenCalledWith('Failed to start speech recognition');
    });

    it('should handle mobile platform gracefully', async () => {
      // Set Platform.OS to 'ios'
      mockPlatform.OS = 'ios';
      speechRecognizer = new SpeechRecognizer();

      const onError = jest.fn();
      await speechRecognizer.start(() => {}, onError);

      expect(onError).toHaveBeenCalledWith(
        'Speech recognition is not available on mobile. Please use the image upload feature instead.'
      );
    });
  });

  describe('stop', () => {
    it('should stop recognition on web', async () => {
      // Set Platform.OS to 'web'
      mockPlatform.OS = 'web';

      // Mock SpeechRecognition
      const mockStop = jest.fn();
      class MockSpeechRecognition {
        continuous = false;
        interimResults = false;
        onresult: ((event: MockSpeechRecognitionEvent) => void) | null = null;
        onerror: ((event: MockSpeechRecognitionErrorEvent) => void) | null = null;
        start = () => {};
        stop = mockStop;
      }

      Object.defineProperty(window, 'SpeechRecognition', {
        value: MockSpeechRecognition,
        writable: true,
        configurable: true
      });

      speechRecognizer = new SpeechRecognizer();
      await speechRecognizer.start(() => {}, () => {});
      await speechRecognizer.stop();

      expect(mockStop).toHaveBeenCalled();
    });

    it('should handle stop when not listening', async () => {
      // Set Platform.OS to 'web'
      mockPlatform.OS = 'web';

      // Mock SpeechRecognition
      const mockStop = jest.fn();
      class MockSpeechRecognition {
        continuous = false;
        interimResults = false;
        onresult: ((event: MockSpeechRecognitionEvent) => void) | null = null;
        onerror: ((event: MockSpeechRecognitionErrorEvent) => void) | null = null;
        start = () => {};
        stop = mockStop;
      }

      Object.defineProperty(window, 'SpeechRecognition', {
        value: MockSpeechRecognition,
        writable: true,
        configurable: true
      });

      speechRecognizer = new SpeechRecognizer();
      await speechRecognizer.stop();

      expect(mockStop).not.toHaveBeenCalled();
    });

    it('should handle stop errors gracefully', async () => {
      // Set Platform.OS to 'web'
      mockPlatform.OS = 'web';

      // Mock SpeechRecognition with failing stop
      class MockSpeechRecognition {
        continuous = false;
        interimResults = false;
        onresult: ((event: MockSpeechRecognitionEvent) => void) | null = null;
        onerror: ((event: MockSpeechRecognitionErrorEvent) => void) | null = null;
        start = () => {};
        stop() {
          throw new Error('Failed to stop');
        }
      }

      Object.defineProperty(window, 'SpeechRecognition', {
        value: MockSpeechRecognition,
        writable: true,
        configurable: true
      });

      // Mock console.error to verify it's called
      const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

      speechRecognizer = new SpeechRecognizer();
      await speechRecognizer.start(() => {}, () => {});
      await speechRecognizer.stop();

      expect(mockConsoleError).toHaveBeenCalledWith('Error stopping speech recognition:', expect.any(Error));
      mockConsoleError.mockRestore();
    });
  });
});

describe('createSpokenItem', () => {
  it('should extract price from text', () => {
    expect(createSpokenItem('milk $3.99')).toEqual({ name: 'milk', price: 3.99 });
  });

  it('should handle text without price', () => {
    expect(createSpokenItem('apple')).toEqual({ name: 'apple' });
  });

  it('should clean up currency words', () => {
    expect(createSpokenItem('bread 5 dollars')).toEqual({ name: 'bread', price: 5 });
  });

  it('should handle decimal prices', () => {
    expect(createSpokenItem('coffee 2.50')).toEqual({ name: 'coffee', price: 2.50 });
  });

  it('should handle prices without dollar sign', () => {
    expect(createSpokenItem('eggs 4')).toEqual({ name: 'eggs', price: 4 });
  });

  it('should handle multiple prices and take the first one', () => {
    expect(createSpokenItem('milk $3.99 or $4.99')).toEqual({ name: 'milk or', price: 3.99 });
  });

  it('should handle text with multiple currency words', () => {
    expect(createSpokenItem('coffee 5 dollars and 50 cents')).toEqual({ name: 'coffee', price: 5.50 });
  });
}); 