import React from 'react';
import { View, Text, ViewProps } from 'react-native';
import { LocationHelper } from '../../utils/LocationHelper';

export interface MapViewProps extends ViewProps {
  region?: any;
  onRegionChange?: (region: any) => void;
  children?: React.ReactNode;
}

export interface MarkerProps extends ViewProps {
  coordinate?: { latitude: number; longitude: number };
  title?: string;
  description?: string;
  children?: React.ReactNode;
}

export const MapView: React.FC<MapViewProps> = ({ children, style, ...props }) => (
  <View 
    {...props} 
    style={[
      { 
        backgroundColor: '#f0f0f0', 
        justifyContent: 'center', 
        alignItems: 'center',
        minHeight: 300 
      }, 
      style
    ]}
  >
    <Text style={{ color: '#666' }}>Map not available on web</Text>
    {children}
  </View>
);

export const Marker: React.FC<MarkerProps> = ({ children, ...props }) => (
  <View {...props}>{children}</View>
);

export const Polyline = View;
export const Circle = View;
export const Polygon = View;
export const Callout = View;