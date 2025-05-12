import React, { useEffect, useState } from 'react';
import { Platform, View, Text } from 'react-native';

interface MapWrapperProps {
  onMapReady?: () => void;
  children?: React.ReactNode;
  [key: string]: any;
}

const MapWrapper: React.FC<MapWrapperProps> = ({ children, ...props }) => {
  const [MapComponent, setMapComponent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (Platform.OS === 'web') {
      // For web, just set a placeholder
      setMapComponent(() => View);
      setIsLoading(false);
    } else {
      // For native platforms, dynamically import react-native-maps
      import('react-native-maps')
        .then((module) => {
          setMapComponent(() => module.default);
          setIsLoading(false);
        })
        .catch((error) => {
          console.warn('Failed to load maps:', error);
          setMapComponent(() => View);
          setIsLoading(false);
        });
    }
  }, []);

  if (isLoading || !MapComponent) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading map...</Text>
      </View>
    );
  }

  if (Platform.OS === 'web') {
    return (
      <View {...props} style={[{ backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' }, props.style]}>
        <Text>Map view not available on web</Text>
        {children}
      </View>
    );
  }

  return <MapComponent {...props}>{children}</MapComponent>;
};

export default MapWrapper;