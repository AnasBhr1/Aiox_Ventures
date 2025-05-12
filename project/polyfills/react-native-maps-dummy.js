const React = require('react');
const { View } = require('react-native');

// Dummy exports for react-native-maps
module.exports = {
  default: View,
  MapView: View,
  Marker: View,
  Polyline: View,
  Polygon: View,
  Circle: View,
  Callout: View,
  PROVIDER_GOOGLE: 'google',
  PROVIDER_DEFAULT: 'default'
};