// Mock expo-location for web to prevent location access
module.exports = {
  getForegroundPermissionsAsync: () => Promise.resolve({ status: 'denied' }),
  requestForegroundPermissionsAsync: () => Promise.resolve({ status: 'denied' }),
  getCurrentPositionAsync: () => Promise.reject(new Error('Location not available on web')),
  watchPositionAsync: () => Promise.reject(new Error('Location not available on web')),
  Accuracy: {
    Lowest: 1,
    Low: 2,
    Balanced: 3,
    High: 4,
    Highest: 5,
    BestForNavigation: 6,
  },
  LocationObject: {},
  LocationPermissionResponse: {},
};