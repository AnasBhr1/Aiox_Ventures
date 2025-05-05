import AsyncStorage from '@react-native-async-storage/async-storage';
import { POI } from '@/types';
import { getPOIById } from './poiService';

const FAVORITES_KEY = 'user_favorites';

// Get all favorite POIs
export async function getFavoritePOIs(): Promise<POI[]> {
  try {
    // Get favorite IDs from storage
    const favoritesJson = await AsyncStorage.getItem(FAVORITES_KEY);
    const favoriteIds: string[] = favoritesJson ? JSON.parse(favoritesJson) : [];
    
    if (favoriteIds.length === 0) {
      return [];
    }
    
    // Fetch the actual POI data for each ID
    const poiPromises = favoriteIds.map(id => getPOIById(id));
    return Promise.all(poiPromises);
  } catch (error) {
    console.error('Error getting favorites:', error);
    return [];
  }
}

// Check if a POI is a favorite
export async function isFavoritePOI(id: string): Promise<boolean> {
  try {
    const favoritesJson = await AsyncStorage.getItem(FAVORITES_KEY);
    const favorites: string[] = favoritesJson ? JSON.parse(favoritesJson) : [];
    return favorites.includes(id);
  } catch (error) {
    console.error('Error checking favorite status:', error);
    return false;
  }
}

// Toggle favorite status for a POI
export async function toggleFavoritePOI(id: string): Promise<boolean> {
  try {
    const favoritesJson = await AsyncStorage.getItem(FAVORITES_KEY);
    let favorites: string[] = favoritesJson ? JSON.parse(favoritesJson) : [];
    
    const isFavorite = favorites.includes(id);
    
    if (isFavorite) {
      // Remove from favorites
      favorites = favorites.filter(favId => favId !== id);
    } else {
      // Add to favorites
      favorites.push(id);
    }
    
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    return !isFavorite;
  } catch (error) {
    console.error('Error toggling favorite:', error);
    throw error;
  }
}

// Clear all favorites
export async function clearAllFavorites(): Promise<void> {
  try {
    await AsyncStorage.removeItem(FAVORITES_KEY);
  } catch (error) {
    console.error('Error clearing favorites:', error);
    throw error;
  }
}