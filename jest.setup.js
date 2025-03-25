require('@testing-library/jest-dom');
import '@testing-library/jest-native/extend-expect';

// Mock react-native components
jest.mock('react-native', () => {
  const React = require('react');
  return {
    Platform: {
      OS: 'ios',
      select: jest.fn(obj => obj.ios),
    },
    View: ({ children, style, ...props }) => React.createElement('View', { ...props, style }, children),
    Text: ({ children, style, ...props }) => React.createElement('Text', { ...props, style }, children),
    TouchableOpacity: ({ children, onPress, style, ...props }) => React.createElement('TouchableOpacity', { ...props, style, onClick: onPress }, children),
    Image: ({ source, style, ...props }) => React.createElement('Image', { ...props, style, src: source?.uri || source }, null),
    ActivityIndicator: ({ size, color, ...props }) => React.createElement('ActivityIndicator', { ...props, size, color }, null),
  };
});

// Mock SpeechRecognition
class MockSpeechRecognition {
  start() {}
  stop() {}
}

global.SpeechRecognition = MockSpeechRecognition;
global.webkitSpeechRecognition = MockSpeechRecognition;

// Mock expo-image-picker
jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: jest.fn(),
  launchCameraAsync: jest.fn(),
  requestCameraPermissionsAsync: jest.fn(),
  MediaTypeOptions: {
    Images: 'Images',
  },
}));

// Mock ActivityIndicator animation
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Silence the warning: Animated: `useNativeDriver` is not supported
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper', () => ({
  shouldUseNativeDriver: () => false,
}));

// Mock console.error to avoid noise in tests
const originalConsoleError = console.error;
console.error = (...args) => {
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('Please update the following components:') ||
      args[0].includes('React does not recognize the') ||
      args[0].includes('Warning:'))
  ) {
    return;
  }
  originalConsoleError(...args);
}; 