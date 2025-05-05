import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Theme types
type ThemeMode = 'light' | 'dark' | 'system';

// Theme context type
interface ThemeContextType {
  theme: ThemeMode;
  isDark: boolean;
  setTheme: (theme: ThemeMode) => void;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    card: string;
    text: string;
    border: string;
    notification: string;
    success: string;
    warning: string;
    error: string;
    muted: string;
  };
}

// Create context
const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  isDark: false,
  setTheme: () => {},
  colors: {
    primary: '#3174F0',
    secondary: '#20B2AA',
    accent: '#FF7F50',
    background: '#FFFFFF',
    card: '#F9F9F9',
    text: '#1A1A1A',
    border: '#E1E1E1',
    notification: '#FF3B30',
    success: '#34C759',
    warning: '#FFCC00',
    error: '#FF3B30',
    muted: '#8E8E93',
  },
});

// Storage helper
const themeStorage = {
  getItem: async (key: string): Promise<string | null> => {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    }
    return SecureStore.getItemAsync(key);
  },
  setItem: async (key: string, value: string): Promise<void> => {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
      return;
    }
    return SecureStore.setItemAsync(key, value);
  },
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [theme, setThemeState] = useState<ThemeMode>('system');
  
  // Load saved theme preference
  useEffect(() => {
    async function loadTheme() {
      try {
        const savedTheme = await themeStorage.getItem('themeMode');
        if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system')) {
          setThemeState(savedTheme as ThemeMode);
        }
      } catch (e) {
        console.error('Failed to load theme', e);
      }
    }
    
    loadTheme();
  }, []);
  
  // Determine if dark mode is active
  const isDark = 
    theme === 'dark' || (theme === 'system' && systemColorScheme === 'dark');
  
  // Set theme and save preference
  const setTheme = async (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    try {
      await themeStorage.setItem('themeMode', newTheme);
    } catch (e) {
      console.error('Failed to save theme', e);
    }
  };

  // Color palette based on theme
  const colors = {
    primary: '#3174F0',
    secondary: '#20B2AA',
    accent: '#FF7F50',
    background: isDark ? '#121212' : '#FFFFFF',
    card: isDark ? '#1E1E1E' : '#F9F9F9',
    text: isDark ? '#F5F5F5' : '#1A1A1A',
    border: isDark ? '#2C2C2C' : '#E1E1E1',
    notification: isDark ? '#FF453A' : '#FF3B30',
    success: isDark ? '#30D158' : '#34C759',
    warning: isDark ? '#FFD60A' : '#FFCC00',
    error: isDark ? '#FF453A' : '#FF3B30',
    muted: isDark ? '#8E8E93' : '#8E8E93',
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark, setTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext);