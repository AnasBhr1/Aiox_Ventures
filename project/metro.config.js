const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Override the resolver completely
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];
config.resolver.platforms = ['native', 'web', 'android', 'ios'];

// Create a custom resolver
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === 'web') {
    // Block react-native-maps entirely on web
    if (moduleName === 'react-native-maps') {
      return {
        filePath: path.resolve(__dirname, 'polyfills/react-native-maps-web.js'),
        type: 'sourceFile',
      };
    }
    
    // Block any native-only modules
    if (moduleName.includes('codegenNativeCommands') || 
        moduleName.includes('Libraries/Utilities/codegenNativeCommands')) {
      return {
        filePath: path.resolve(__dirname, 'polyfills/empty.js'),
        type: 'sourceFile',
      };
    }
    
    // Block expo-location on web to prevent auto-imports
    if (moduleName === 'expo-location') {
      return {
        filePath: path.resolve(__dirname, 'polyfills/expo-location-web.js'),
        type: 'sourceFile',
      };
    }
  }
  
  // Fall back to default resolver
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;