import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { getFavoritePOIs, toggleFavoritePOI } from '@/services/favoriteService';
import { router } from 'expo-router';
import { BookmarkMinus, MapPin } from 'lucide-react-native';
import { POI } from '@/types';
import * as Haptics from 'expo-haptics';

export default function FavoritesScreen() {
  const { colors, isDark } = useTheme();
  const [favorites, setFavorites] = useState<POI[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadFavorites();
  }, []);

  async function loadFavorites() {
    try {
      setIsLoading(true);
      const favoritePOIs = await getFavoritePOIs();
      setFavorites(favoritePOIs);
    } catch (err) {
      console.error('Failed to load favorites:', err);
      setError('Failed to load your favorite places. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  const handleRemoveFavorite = async (poi: POI) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    try {
      await toggleFavoritePOI(poi.id);
      // Remove from local state
      setFavorites(favorites.filter(item => item.id !== poi.id));
    } catch (err) {
      console.error('Failed to remove favorite:', err);
      setError('Failed to remove this place from favorites.');
    }
  };

  const navigateToPOI = (poi: POI) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    router.push({
      pathname: '/poi/[id]',
      params: { id: poi.id }
    });
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    listContainer: {
      padding: 16,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 24,
    },
    emptyText: {
      fontSize: 18,
      color: colors.text,
      textAlign: 'center',
      marginTop: 16,
      fontFamily: 'Inter-Medium',
    },
    emptySubtext: {
      fontSize: 14,
      color: colors.muted,
      textAlign: 'center',
      marginTop: 8,
      fontFamily: 'Inter-Regular',
    },
    errorText: {
      color: colors.error,
      textAlign: 'center',
      marginTop: 8,
      fontFamily: 'Inter-Regular',
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 12,
      marginBottom: 16,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.3 : 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    cardImage: {
      width: '100%',
      height: 120,
    },
    cardContent: {
      padding: 16,
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 4,
      color: colors.text,
      fontFamily: 'Poppins-SemiBold',
    },
    locationRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    locationText: {
      fontSize: 14,
      color: colors.muted,
      marginLeft: 4,
      fontFamily: 'Inter-Regular',
    },
    cardDescription: {
      fontSize: 14,
      color: colors.text,
      marginBottom: 16,
      fontFamily: 'Inter-Regular',
    },
    cardActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    viewButton: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      backgroundColor: colors.primary,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
    viewButtonText: {
      color: 'white',
      fontWeight: '600',
      fontSize: 14,
      fontFamily: 'Inter-SemiBold',
    },
    removeButton: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.error,
    },
    removeButtonText: {
      color: colors.error,
      fontWeight: '600',
      fontSize: 14,
      fontFamily: 'Inter-SemiBold',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  if (isLoading) {
    return (
      <View style={dynamicStyles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={dynamicStyles.emptyContainer}>
        <Text style={dynamicStyles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={[dynamicStyles.viewButton, { marginTop: 16 }]}
          onPress={loadFavorites}
        >
          <Text style={dynamicStyles.viewButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (favorites.length === 0) {
    return (
      <View style={dynamicStyles.emptyContainer}>
        <BookmarkMinus size={48} color={colors.muted} />
        <Text style={dynamicStyles.emptyText}>No Favorites Yet</Text>
        <Text style={dynamicStyles.emptySubtext}>
          Explore the map and bookmark interesting places to see them here
        </Text>
        <TouchableOpacity 
          style={[dynamicStyles.viewButton, { marginTop: 24 }]}
          onPress={() => router.push('/(tabs)')}
        >
          <Text style={dynamicStyles.viewButtonText}>Explore Map</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={dynamicStyles.container}>
      <FlatList
        data={favorites}
        contentContainerStyle={dynamicStyles.listContainer}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={dynamicStyles.card}
            onPress={() => navigateToPOI(item)}
            activeOpacity={0.8}
          >
            <Image
              source={{ uri: item.imageUrl }}
              style={dynamicStyles.cardImage}
            />
            <View style={dynamicStyles.cardContent}>
              <Text style={dynamicStyles.cardTitle}>{item.name}</Text>
              <View style={dynamicStyles.locationRow}>
                <MapPin size={14} color={colors.muted} />
                <Text style={dynamicStyles.locationText}>{item.location}</Text>
              </View>
              <Text 
                style={dynamicStyles.cardDescription}
                numberOfLines={2}
              >
                {item.shortDescription}
              </Text>
              <View style={dynamicStyles.cardActions}>
                <TouchableOpacity 
                  style={dynamicStyles.viewButton}
                  onPress={() => navigateToPOI(item)}
                >
                  <Text style={dynamicStyles.viewButtonText}>View Details</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={dynamicStyles.removeButton}
                  onPress={() => handleRemoveFavorite(item)}
                >
                  <Text style={dynamicStyles.removeButtonText}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}