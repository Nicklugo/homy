import React from 'react';

const ReactNative = {
  Platform: {
    OS: 'ios',
    select: jest.fn(),
  },
  View: ({ children, style, ...props }: any) => React.createElement('View', { style, ...props }, children),
  Text: ({ children, style, ...props }: any) => React.createElement('Text', { style, ...props }, children),
  TouchableOpacity: ({ children, onPress, style, ...props }: any) => React.createElement('TouchableOpacity', { onPress, style, ...props }, children),
  Image: ({ source, style, ...props }: any) => React.createElement('Image', { source, style, ...props }),
  ActivityIndicator: ({ size, color, ...props }: any) => React.createElement('ActivityIndicator', { size, color, ...props }),
};

module.exports = ReactNative; 