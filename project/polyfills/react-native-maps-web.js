// Polyfill for react-native-maps on web
const React = require('react');
const { View, Text } = require('react-native-web');

const MapView = React.forwardRef((props, ref) => {
  return React.createElement(View, {
    ...props,
    style: [{ backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' }, props.style],
    ref
  }, React.createElement(Text, null, 'Map not available on web'));
});

const Marker = React.forwardRef((props, ref) => {
  return React.createElement(View, { ref }, props.children);
});

const Polyline = React.forwardRef((props, ref) => {
  return React.createElement(View, { ref });
});

module.exports = {
  default: MapView,
  MapView,
  Marker,
  Polyline,
  Circle: View,
  Polygon: View,
  Callout: View,
  PROVIDER_GOOGLE: 'google',
  PROVIDER_DEFAULT: 'default',
};