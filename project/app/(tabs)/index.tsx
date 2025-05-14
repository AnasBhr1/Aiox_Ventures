import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Alert, Platform, ActivityIndicator } from 'react-native';
import { MapView, Marker, PROVIDER_GOOGLE, Region } from '../../components/Map';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { StatusBar } from 'expo-status-bar';
import * as Location from 'expo-location';
import { LocationHelper } from '../../utils/LocationHelper';
import { router } from 'expo-router';
import { MapPin, Search, Menu, Moon, Sun, Menu as MenuIcon } from 'lucide-react-native';
import { POI } from '@/types';
import { getNearbyPOIs } from '@/services/poiService';
import POICard from '@/components/POICard';
import * as Haptics from 'expo-haptics';

export default function MapScreen() {
  const { colors, isDark, theme, setTheme } = useTheme();
  const { user } = useAuth();
  const [location, setLocation] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [nearbyPOIs, setNearbyPOIs] = useState<POI[]>([]);
  const [selectedPOI, setSelectedPOI] = useState<POI | null>(null);
  const [region, setRegion] = useState<Region>({
    latitude: 40.7128, // Default to NYC
    longitude: -74.0060,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const cardAnimation = useRef(new Animated.Value(0)).current;
  const mapRef = useRef<MapView>(null);

  // Load location and nearby POIs
  // Load location and nearby POIs
  useEffect(() => {
    (async () => {
      try {
        // Use LocationHelper which handles platform differences
        const location = await LocationHelper.getCurrentLocation();

        if (!location) {
          if (Platform.OS === 'web') {
            // On web, just show default location without error
            setErrorMsg(null);
            setIsLoading(false);
            return;
          } else {
            // On mobile, show permission error only if needed
            setErrorMsg('Permission to access location was denied');
            setIsLoading(false);
            return;
          }
        }

        setLocation(location);

        // Update map region to user's location
        const newRegion = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0122,
          longitudeDelta: 0.0121,
        };
        setRegion(newRegion);

        // Load nearby POIs
        const pois = await getNearbyPOIs(
          location.coords.latitude,
          location.coords.longitude
        );
        setNearbyPOIs(pois);
      } catch (error) {
        console.error('Error getting location or POIs:', error);
        if (Platform.OS !== 'web') {
          setErrorMsg('Could not fetch location data. Please try again.');
        }
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // Handle POI selection
  const handleMarkerPress = (poi: POI) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    setSelectedPOI(poi);

    // Animate card sliding up
    Animated.spring(cardAnimation, {
      toValue: 1,
      useNativeDriver: true,
      tension: 40,
      friction: 8,
    }).start();

    // Animate to the marker position
    mapRef.current?.animateToRegion(
      {
        latitude: poi.latitude,
        longitude: poi.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      350
    );
  };

  // Close POI card
  const closeCard = () => {
    Animated.timing(cardAnimation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setSelectedPOI(null));
  };

  // View POI details
  const viewPOIDetails = (poi: POI) => {
    router.push({
      pathname: '/poi/[id]',
      params: { id: poi.id }
    });
  };

  // Toggle theme
  const toggleTheme = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Card animation styles
  const cardTranslateY = cardAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [300, 0],
  });

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    mapContainer: {
      flex: 1,
    },
    map: {
      width: '100%',
      height: '100%',
    },
    header: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      backgroundColor: 'transparent',
      paddingTop: Platform.OS === 'ios' ? 60 : 40,
      paddingHorizontal: 16,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 10,
    },
    searchBar: {
      flex: 1,
      height: 48,
      backgroundColor: colors.background,
      borderRadius: 24,
      paddingHorizontal: 16,
      flexDirection: 'row',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      marginRight: 12,
    },
    searchText: {
      flex: 1,
      marginLeft: 8,
      color: colors.text,
      fontFamily: 'Inter-Regular',
    },
    iconButton: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.background,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    loadingContainer: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
    },
    cardContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      padding: 16,
      zIndex: 10,
    },
    errorContainer: {
      position: 'absolute',
      top: '50%',
      left: 16,
      right: 16,
      padding: 16,
      backgroundColor: colors.card,
      borderRadius: 12,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      transform: [{ translateY: -50 }],
    },
    errorText: {
      color: colors.error,
      textAlign: 'center',
      marginBottom: 16,
      fontFamily: 'Inter-Regular',
    },
    errorButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor: colors.primary,
      borderRadius: 8,
    },
    errorButtonText: {
      color: 'white',
      fontFamily: 'Inter-Medium',
    },
  });

  // Handle loading and error states
  if (isLoading) {
    return (
      <View style={dynamicStyles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ color: colors.text, marginTop: 16, fontFamily: 'Inter-Regular' }}>
          Loading map...
        </Text>
      </View>
    );
  }

  if (errorMsg && !location) {
    return (
      <View style={dynamicStyles.container}>
        <View style={dynamicStyles.errorContainer}>
          <Text style={dynamicStyles.errorText}>{errorMsg}</Text>
          <TouchableOpacity
            style={dynamicStyles.errorButton}
            onPress={() => router.replace('/')}
          >
            <Text style={dynamicStyles.errorButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={dynamicStyles.container}>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      {/* Map */}
      <View style={dynamicStyles.mapContainer}>
        <MapView
          ref={mapRef}
          style={dynamicStyles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={region}
          region={region}
          onRegionChangeComplete={setRegion}
          showsUserLocation
          showsMyLocationButton={false}
          showsCompass={false}
          showsScale={true}
          mapType="standard"
          userInterfaceStyle={isDark ? 'dark' : 'light'}
        >
          {nearbyPOIs.map((poi) => (
            <Marker
              key={poi.id}
              coordinate={{
                latitude: poi.latitude,
                longitude: poi.longitude,
              }}
              title={poi.name}
              description={poi.shortDescription}
              onPress={() => handleMarkerPress(poi)}
            >
              <View style={styles.markerContainer}>
                <MapPin
                  size={24}
                  color={colors.primary}
                  fill={poi.id === selectedPOI?.id ? colors.primary : 'transparent'}
                  strokeWidth={2}
                />
              </View>
            </Marker>
          ))}
        </MapView>
      </View>

      {/* Header with Search and Menu */}
      <View style={dynamicStyles.header}>
        <TouchableOpacity style={dynamicStyles.searchBar} onPress={() => Alert.alert('Search', 'Search functionality coming soon!')}>
          <Search size={20} color={colors.muted} />
          <Text style={dynamicStyles.searchText}>Search for places...</Text>
        </TouchableOpacity>

        <TouchableOpacity style={dynamicStyles.iconButton} onPress={toggleTheme}>
          {isDark ? (
            <Sun size={24} color={colors.text} />
          ) : (
            <Moon size={24} color={colors.text} />
          )}
        </TouchableOpacity>

        <TouchableOpacity style={dynamicStyles.iconButton} onPress={() => router.push('/(tabs)/profile')}>
          <MenuIcon size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* POI Card */}
      {selectedPOI && (
        <Animated.View
          style={[
            dynamicStyles.cardContainer,
            { transform: [{ translateY: cardTranslateY }] }
          ]}
        >
          <POICard
            poi={selectedPOI}
            onClose={closeCard}
            onViewDetails={() => viewPOIDetails(selectedPOI)}
          />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});