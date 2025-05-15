import React, { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';

// Declare global types for Leaflet
declare global {
  interface Window {
    L: any;
  }
}

export interface MapViewProps {
  style?: any;
  provider?: string;
  initialRegion?: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  region?: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  onRegionChangeComplete?: (region: any) => void;
  showsUserLocation?: boolean;
  showsMyLocationButton?: boolean;
  showsCompass?: boolean;
  showsScale?: boolean;
  mapType?: string;
  userInterfaceStyle?: string;
  children?: React.ReactNode;
  ref?: any;
}

export interface MarkerProps {
  coordinate: {
    latitude: number;
    longitude: number;
  };
  title?: string;
  description?: string;
  onPress?: () => void;
  children?: React.ReactNode;
}

export interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

// Web MapView Component using Leaflet
export const MapView = React.forwardRef<any, MapViewProps>((props, ref) => {
  const {
    style,
    initialRegion,
    region,
    onRegionChangeComplete,
    children,
    showsUserLocation,
    ...otherProps
  } = props;

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const userLocationMarker = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);

  // Load Leaflet library
  useEffect(() => {
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
      document.head.appendChild(link);

      // Load Leaflet JavaScript
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => {
        // Fix default marker icons
        delete window.L.Icon.Default.prototype._getIconUrl;
        window.L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        });
        setIsLoaded(true);
      };
      script.onerror = () => {
        console.error('Failed to load Leaflet');
      };
      document.head.appendChild(script);
    };

    if (typeof document !== 'undefined') {
      loadLeaflet();
    }
  }, []);

  // Initialize map when Leaflet is loaded
  useEffect(() => {
    if (!isLoaded || !mapRef.current || mapInstance.current || typeof window === 'undefined') return;

    const timer = setTimeout(() => {
      try {
        const lat = region?.latitude || initialRegion?.latitude || 40.7128;
        const lng = region?.longitude || initialRegion?.longitude || -74.0060;
        const zoom = 13;

        // Create map with all necessary options
        mapInstance.current = window.L.map(mapRef.current, {
          center: [lat, lng],
          zoom: zoom,
          zoomControl: true,
          scrollWheelZoom: true,
          doubleClickZoom: true,
          touchZoom: true,
          dragging: true,
          boxZoom: true,
          keyboard: true,
          zoomSnap: 1,
          zoomDelta: 1,
          wheelPxPerZoomLevel: 60,
          maxZoom: 19,
          minZoom: 1,
          zoomAnimation: true,
          zoomAnimationThreshold: 4,
          fadeAnimation: true,
          markerZoomAnimation: true,
        });

        // Add tile layer
        const tileLayer = window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
          minZoom: 1,
          tileSize: 256,
          zoomOffset: 0,
        });

        tileLayer.addTo(mapInstance.current);

        // Handle map events
        mapInstance.current.on('load', () => {
          setIsMapReady(true);
        });

        mapInstance.current.whenReady(() => {
          setIsMapReady(true);
          // Force invalidate size after a brief delay
          setTimeout(() => {
            if (mapInstance.current) {
              mapInstance.current.invalidateSize(true);
            }
          }, 100);
        });

        // Add region change handling with debouncing
        let timeout: NodeJS.Timeout;
        const handleRegionChange = () => {
          clearTimeout(timeout);
          timeout = setTimeout(() => {
            if (mapInstance.current && onRegionChangeComplete) {
              try {
                const center = mapInstance.current.getCenter();
                const bounds = mapInstance.current.getBounds();
                const latitudeDelta = bounds.getNorth() - bounds.getSouth();
                const longitudeDelta = bounds.getEast() - bounds.getWest();

                onRegionChangeComplete({
                  latitude: center.lat,
                  longitude: center.lng,
                  latitudeDelta,
                  longitudeDelta,
                });
              } catch (error) {
                console.warn('Error in region change:', error);
              }
            }
          }, 200);
        };

        mapInstance.current.on('moveend', handleRegionChange);
        mapInstance.current.on('zoomend', handleRegionChange);

        // Expose methods to ref
        if (ref) {
          ref.current = {
            mapInstance: mapInstance.current,
            animateToRegion: (region: Region, duration?: number) => {
              if (mapInstance.current && isMapReady) {
                try {
                  const zoom = Math.round(14 - Math.log(region.latitudeDelta * 111) / Math.log(2));
                  const clampedZoom = Math.max(1, Math.min(19, zoom));
                  
                  mapInstance.current.setView(
                    [region.latitude, region.longitude], 
                    clampedZoom,
                    { 
                      animate: true, 
                      duration: (duration || 350) / 1000
                    }
                  );
                } catch (error) {
                  console.warn('Error animating to region:', error);
                }
              }
            },
            addMarker: (coordinate: {latitude: number, longitude: number}, options: any = {}) => {
              if (mapInstance.current && window.L) {
                const marker = window.L.marker([coordinate.latitude, coordinate.longitude], options)
                  .addTo(mapInstance.current);
                markersRef.current.push(marker);
                return marker;
              }
              return null;
            },
            clearMarkers: () => {
              markersRef.current.forEach(marker => {
                if (mapInstance.current) {
                  mapInstance.current.removeLayer(marker);
                }
              });
              markersRef.current = [];
            }
          };
        }

      } catch (error) {
        console.error('Error initializing map:', error);
      }
    }, 250);

    return () => {
      clearTimeout(timer);
      if (mapInstance.current) {
        try {
          mapInstance.current.off();
          mapInstance.current.remove();
        } catch (error) {
          console.warn('Error cleaning up map:', error);
        }
        mapInstance.current = null;
        setIsMapReady(false);
      }
    };
  }, [isLoaded]);

  // Handle user location
  useEffect(() => {
    if (mapInstance.current && isMapReady && showsUserLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          
          if (userLocationMarker.current) {
            mapInstance.current.removeLayer(userLocationMarker.current);
          }
          
          // Create blue dot for user location
          userLocationMarker.current = window.L.circleMarker([latitude, longitude], {
            color: '#1976d2',
            fillColor: '#2196f3',
            fillOpacity: 0.8,
            radius: 8,
            weight: 3
          }).addTo(mapInstance.current);
        },
        (error) => {
          console.warn('Could not get user location:', error);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    }
  }, [isMapReady, showsUserLocation]);

  return (
    <View style={style} {...otherProps}>
      <div
        ref={mapRef}
        style={{
          width: '100%',
          height: '100%',
          minHeight: '300px',
          background: '#e6f3ff',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: style?.borderRadius || 0,
        }}
      />
      {!isMapReady && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            padding: '20px',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: '500',
            color: '#333',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <div
            style={{
              width: '20px',
              height: '20px',
              border: '2px solid #e3f2fd',
              borderTop: '2px solid #1976d2',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}
          />
          Loading map...
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}
      {children}
    </View>
  );
});

// Web Marker Component (placeholder)
export const Marker: React.FC<MarkerProps> = ({ coordinate, title, description, onPress, children }) => {
  return null;
};

// Export other components as placeholders
export const Polyline = View;
export const Circle = View;
export const Polygon = View;
export const Callout = View;

// Export constants
export const PROVIDER_GOOGLE = 'google';
export const PROVIDER_DEFAULT = 'default';

// Default export
export default MapView;