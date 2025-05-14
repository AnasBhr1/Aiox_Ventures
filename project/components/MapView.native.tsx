import React from 'react';
import { View, Text, ViewStyle } from 'react-native';

interface MapViewProps {
  style?: ViewStyle;
  children?: React.ReactNode;
  [key: string]: any;
}

export const MapView: React.FC<MapViewProps> = ({ children, style, ...props }) => (
  <View style={[{ backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' }, style]}>
    <Text>Map view not available on web</Text>
    {children}
  </View>
);

export const Marker = View;
export const Polyline = View;
export const Circle = View;
export const Polygon = View;
export const Callout = View;

export default MapView;