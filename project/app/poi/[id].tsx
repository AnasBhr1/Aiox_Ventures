import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator, Animated, Platform } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { getPOIById } from '@/services/poiService';
import { toggleFavoritePOI, isFavoritePOI } from '@/services/favoriteService';
import { POI } from '@/types';
import { ArrowLeft, MapPin, Bookmark, Play, Pause, BookmarkCheck } from 'lucide-react-native';
import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';

export default function POIDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors, isDark } = useTheme();
  const [poi, setPoi] = useState<POI | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(100); // Mock duration in seconds
  
  // For animation
  const scrollY = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadPOIData();
    
    // Cleanup on unmount
    return () => {
      if (isPlaying) {
        Speech.stop();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [id]);

  async function loadPOIData() {
    if (!id) return;
    
    try {
      setIsLoading(true);
      // Fetch POI data
      const poiData = await getPOIById(id);
      setPoi(poiData);
      
      // Check if it's a favorite
      const favoriteStatus = await isFavoritePOI(id);
      setIsFavorite(favoriteStatus);
    } catch (err) {
      console.error('Failed to load POI:', err);
      setError('Failed to load information. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  const handleFavoriteToggle = async () => {
    if (!poi) return;
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    try {
      const newStatus = await toggleFavoritePOI(poi.id);
      setIsFavorite(newStatus);
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    }
  };

  const startAudioPlayback = () => {
    if (!poi) return;
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    setIsPlaying(true);
    setCurrentTime(0);
    
    // Start the mock audio timer
    timerRef.current = setInterval(() => {
      setCurrentTime(prev => {
        if (prev >= totalDuration) {
          stopAudioPlayback();
          return 0;
        }
        return prev + 1;
      });
    }, 1000);
    
    // Use Speech API to read the content
    Speech.speak(poi.description, {
      language: 'en',
      pitch: 1.0,
      rate: 0.9,
      onDone: stopAudioPlayback,
      onError: () => {
        stopAudioPlayback();
        setError('Failed to play audio. Please try again.');
      },
    });
  };

  const stopAudioPlayback = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    setIsPlaying(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    Speech.stop();
  };

  // Animation values for the header
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  
  const imageScale = scrollY.interpolate({
    inputRange: [-100, 0, 100],
    outputRange: [1.2, 1, 0.8],
    extrapolate: 'clamp',
  });
  
  const imageOpacity = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [1, 0.3],
    extrapolate: 'clamp',
  });

  // Format seconds to MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 60,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      zIndex: 100,
      backgroundColor: colors.background,
    },
    headerTitle: {
      color: colors.text,
      fontSize: 18,
      fontWeight: '600',
      fontFamily: 'Poppins-SemiBold',
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.background + '80',
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 5,
    },
    favoriteButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.background + '80',
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 5,
    },
    imageContainer: {
      height: 300,
      overflow: 'hidden',
    },
    image: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.3)',
    },
    floatingButtons: {
      position: 'absolute',
      top: 40,
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      zIndex: 1,
    },
    content: {
      padding: 20,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 8,
      fontFamily: 'Poppins-Bold',
    },
    location: {
      fontSize: 16,
      color: colors.muted,
      marginBottom: 16,
      flexDirection: 'row',
      alignItems: 'center',
      fontFamily: 'Inter-Regular',
    },
    locationText: {
      marginLeft: 6,
      fontSize: 16,
      color: colors.muted,
      fontFamily: 'Inter-Regular',
    },
    description: {
      fontSize: 16,
      lineHeight: 24,
      color: colors.text,
      marginBottom: 24,
      fontFamily: 'Inter-Regular',
    },
    audioPlayer: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginTop: 8,
      marginBottom: 24,
    },
    audioTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 16,
      fontFamily: 'Inter-SemiBold',
    },
    playerControls: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    playButton: {
      width: 54,
      height: 54,
      borderRadius: 27,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    progressContainer: {
      flex: 1,
    },
    timeText: {
      fontSize: 14,
      color: colors.muted,
      marginBottom: 8,
      fontFamily: 'Inter-Regular',
    },
    progressBar: {
      height: 4,
      backgroundColor: colors.border,
      borderRadius: 2,
    },
    progress: {
      height: '100%',
      backgroundColor: colors.primary,
      borderRadius: 2,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    errorContainer: {
      padding: 20,
      alignItems: 'center',
    },
    errorText: {
      color: colors.error,
      textAlign: 'center',
      marginBottom: 16,
      fontFamily: 'Inter-Regular',
    },
    retryButton: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      backgroundColor: colors.primary,
      borderRadius: 8,
    },
    retryButtonText: {
      color: 'white',
      fontWeight: '600',
      fontFamily: 'Inter-SemiBold',
    },
  });

  if (isLoading) {
    return (
      <View style={dynamicStyles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ color: colors.text, marginTop: 16, fontFamily: 'Inter-Regular' }}>
          Loading place details...
        </Text>
      </View>
    );
  }

  if (error || !poi) {
    return (
      <View style={dynamicStyles.errorContainer}>
        <Text style={dynamicStyles.errorText}>{error || 'Place not found'}</Text>
        <TouchableOpacity 
          style={dynamicStyles.retryButton}
          onPress={loadPOIData}
        >
          <Text style={dynamicStyles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={dynamicStyles.container}>
      {/* Animated header */}
      <Animated.View style={[
        dynamicStyles.header,
        { opacity: headerOpacity }
      ]}>
        <TouchableOpacity 
          style={dynamicStyles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={dynamicStyles.headerTitle} numberOfLines={1}>{poi.name}</Text>
        <TouchableOpacity 
          style={dynamicStyles.favoriteButton}
          onPress={handleFavoriteToggle}
        >
          {isFavorite ? (
            <BookmarkCheck size={24} color={colors.primary} />
          ) : (
            <Bookmark size={24} color={colors.text} />
          )}
        </TouchableOpacity>
      </Animated.View>
      
      <Animated.ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {/* Hero image with parallax effect */}
        <Animated.View 
          style={[
            dynamicStyles.imageContainer,
            { 
              transform: [{ scale: imageScale }],
              opacity: imageOpacity,
            }
          ]}
        >
          <Image
            source={{ uri: poi.imageUrl }}
            style={dynamicStyles.image}
          />
          <View style={dynamicStyles.overlay} />
          
          {/* Floating buttons on image */}
          <View style={dynamicStyles.floatingButtons}>
            <TouchableOpacity 
              style={dynamicStyles.backButton}
              onPress={() => router.back()}
            >
              <ArrowLeft size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={dynamicStyles.favoriteButton}
              onPress={handleFavoriteToggle}
            >
              {isFavorite ? (
                <BookmarkCheck size={24} color="white" fill={colors.primary} />
              ) : (
                <Bookmark size={24} color="white" />
              )}
            </TouchableOpacity>
          </View>
        </Animated.View>
        
        {/* Content */}
        <View style={dynamicStyles.content}>
          <Text style={dynamicStyles.title}>{poi.name}</Text>
          <View style={dynamicStyles.location}>
            <MapPin size={16} color={colors.muted} />
            <Text style={dynamicStyles.locationText}>{poi.location}</Text>
          </View>
          
          <Text style={dynamicStyles.description}>{poi.description}</Text>
          
          {/* Audio player */}
          <View style={dynamicStyles.audioPlayer}>
            <Text style={dynamicStyles.audioTitle}>Audio Guide</Text>
            <View style={dynamicStyles.playerControls}>
              <TouchableOpacity 
                style={dynamicStyles.playButton}
                onPress={isPlaying ? stopAudioPlayback : startAudioPlayback}
              >
                {isPlaying ? (
                  <Pause size={24} color="white" />
                ) : (
                  <Play size={24} color="white" />
                )}
              </TouchableOpacity>
              <View style={dynamicStyles.progressContainer}>
                <Text style={dynamicStyles.timeText}>
                  {formatTime(currentTime)} / {formatTime(totalDuration)}
                </Text>
                <View style={dynamicStyles.progressBar}>
                  <View 
                    style={[
                      dynamicStyles.progress, 
                      { width: `${(currentTime / totalDuration) * 100}%` }
                    ]} 
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
      </Animated.ScrollView>
    </View>
  );
}