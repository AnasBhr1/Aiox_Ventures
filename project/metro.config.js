const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add alias to replace react-native-maps with react-native-web-maps on web
config.resolver.alias = {
  ...config.resolver.alias,
  'react-native-maps': 'react-native-web-maps',
};

// Add platform-specific resolver
config.resolver.platforms = ['native', 'web', 'android', 'ios'];

// Handle the codegenNativeCommands issue specifically
const { resolver } = config;
const originalResolve = resolver.resolve;

resolver.resolve = function (request, ...args) {
  // Block the problematic import on web
  if (request.moduleName === 'react-native/Libraries/Utilities/codegenNativeCommands' && 
      process.env.EXPO_PUBLIC_PLATFORM === 'web') {
    // Return a mock module
    return {
      type: 'sourceFile',
      filePath: require.resolve('./polyfills/codegenNativeCommands.js'),
    };
  }
  return originalResolve.call(this, request, ...args);
};

module.exports = config;