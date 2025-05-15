import React, { useEffect, useRef, useState } from 'react';
import { View, Platform } from 'react-native';

interface WebMapProps {
  style?: any;
  initialRegion?: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  markers?: Array<{
    id: string;
    latitude: number;
    longitude: number;
    title: string;
    description?: string;
  }>;
  onMarkerPress?: (markerId: string) => void;
  showsUserLocation?: boolean;
}

declare global {
  interface Window {
    L: any;
  }
}

const WebMap: React.FC<WebMapProps> = ({
  style,
  initialRegion,
  markers = [],
  onMarkerPress,
  showsUserLocation = false
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load Leaflet
  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const loadLeaflet = () => {
      // Check if Leaflet is already loaded
      if (window.L) {
        setIsLoaded(true);
        return;
      }

      // Load Leaflet CSS
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
      link.crossOrigin = '';
      document.head.appendChild(link);

      // Load Leaflet JavaScript
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
      script.crossOrigin = '';
      script.onload = () => {
        setIsLoaded(true);
      };
      document.head.appendChild(script);
    };

    loadLeaflet();
  }, []);

  // Initialize map
  useEffect(() => {
    if (!isLoaded || !mapRef.current || Platform.OS !== 'web') return;

    const lat = initialRegion?.latitude || 40.7128;
    const lng = initialRegion?.longitude || -74.0060;

    // Create map
    mapInstance.current = window.L.map(mapRef.current).setView([lat, lng], 13);

    // Add OpenStreetMap tiles
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapInstance.current);

    // Cleanup function
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [isLoaded, initialRegion]);

  // Add markers
  useEffect(() => {
    if (!mapInstance.current || Platform.OS !== 'web') return;

    // Remove old markers
    markersRef.current.forEach(marker => {
      mapInstance.current.removeLayer(marker);
    });
    markersRef.current = [];

    // Add new markers
    markers.forEach(markerData => {
      const marker = window.L.marker([markerData.latitude, markerData.longitude])
        .addTo(mapInstance.current)
        .bindPopup(`<strong>${markerData.title}</strong><br>${markerData.description || ''}`);

      // Handle marker click
      if (onMarkerPress) {
        marker.on('click', () => {
          onMarkerPress(markerData.id);
        });
      }

      markersRef.current.push(marker);
    });
  }, [markers, onMarkerPress]);

  // For native platforms, return null
  if (Platform.OS !== 'web') {
    return null;
  }

  return (
    <View style={style}>
      <div
        ref={mapRef}
        style={{
          width: '100%',
          height: '100%',
          minHeight: '300px',
          backgroundColor: '#f0f0f0'
        }}
      />
    </View>
  );
};

export default WebMap;