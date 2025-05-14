const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync({
    ...env,
    babel: {
      dangerouslyDisableDefaultPlugins: ['expo/babel-plugin-react-native-web'],
    },
  }, argv);

  // Completely replace problematic modules
  config.resolve.alias = {
    ...config.resolve.alias,
    'react-native-maps': path.resolve(__dirname, 'polyfills/react-native-maps-web.js'),
    'expo-location': path.resolve(__dirname, 'polyfills/expo-location-web.js'),
    'react-native/Libraries/Utilities/codegenNativeCommands': path.resolve(__dirname, 'polyfills/empty.js'),
  };

  // Ignore these modules completely
  config.resolve.fallback = {
    ...config.resolve.fallback,
    'react-native/Libraries/Utilities/codegenNativeCommands': false,
  };

  return config;
};