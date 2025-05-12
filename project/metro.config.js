const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Configure resolver
config.resolver.platforms = ['native', 'web', 'android', 'ios'];

// Add custom resolver to handle react-native-maps
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

// Custom resolver to exclude react-native-maps on web
const originalResolver = config.resolver.resolve;
config.resolver.resolve = (request, ...args) => {
  if (request.name === 'react-native-maps' && process.env.EXPO_PUBLIC_PLATFORM === 'web') {
    // Return a dummy module for web
    return require.resolve('./polyfills/react-native-maps-dummy.js');
  }
  return originalResolver(request, ...args);
};

module.exports = config;