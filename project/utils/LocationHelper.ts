import { Platform } from 'react-native';

// Conditionally import expo-location only on native platforms
let Location: any = null;
if (Platform.OS !== 'web') {
  Location = require('expo-location');
}

export class LocationHelper {
  static async requestLocationPermission(): Promise<boolean> {
    if (Platform.OS === 'web') {
      // Never request location on web
      return false;
    }

    if (!Location) {
      return false;
    }

    try {
      const { status: existingStatus } = await Location.getForegroundPermissionsAsync();
      
      if (existingStatus !== 'granted') {
        const { status } = await Location.requestForegroundPermissionsAsync();
        return status === 'granted';
      }
      
      return true;
    } catch (error) {
      console.error('Error requesting location permission:', error);
      return false;
    }
  }

  static async getCurrentLocation(): Promise<any | null> {
    if (Platform.OS === 'web' || !Location) {
      return null;
    }

    try {
      const hasPermission = await this.requestLocationPermission();
      
      if (!hasPermission) {
        return null;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        maximumAge: 10000,
        timeout: 15000,
      });
      
      return location;
    } catch (error) {
      console.error('Error getting current location:', error);
      return null;
    }
  }
}