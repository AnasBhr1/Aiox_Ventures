import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { MapPin, X, ChevronRight } from 'lucide-react-native';
import { POI } from '@/types';

interface POICardProps {
  poi: POI;
  onClose: () => void;
  onViewDetails: () => void;
}

export default function POICard({ poi, onClose, onViewDetails }: POICardProps) {
  const { colors, isDark } = useTheme();

  const dynamicStyles = StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      borderRadius: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
      overflow: 'hidden',
    },
    imageContainer: {
      height: 160,
      width: '100%',
      position: 'relative',
    },
    image: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    closeButton: {
      position: 'absolute',
      right: 12,
      top: 12,
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: 'rgba(0,0,0,0.6)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1,
    },
    content: {
      padding: 16,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 8,
      fontFamily: 'Poppins-Bold',
    },
    location: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    locationText: {
      fontSize: 14,
      color: colors.muted,
      marginLeft: 6,
      fontFamily: 'Inter-Regular',
    },
    description: {
      fontSize: 14,
      lineHeight: 20,
      color: colors.text,
      marginBottom: 16,
      fontFamily: 'Inter-Regular',
    },
    button: {
      backgroundColor: colors.primary,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '600',
      marginRight: 4,
      fontFamily: 'Inter-SemiBold',
    },
  });

  return (
    <View style={dynamicStyles.card}>
      <View style={dynamicStyles.imageContainer}>
        <Image
          source={{ uri: poi.imageUrl }}
          style={dynamicStyles.image}
        />
        <TouchableOpacity
          style={dynamicStyles.closeButton}
          onPress={onClose}
          accessibilityLabel="Close card"
        >
          <X size={18} color="white" />
        </TouchableOpacity>
      </View>
      
      <View style={dynamicStyles.content}>
        <Text style={dynamicStyles.title}>{poi.name}</Text>
        
        <View style={dynamicStyles.location}>
          <MapPin size={16} color={colors.muted} />
          <Text style={dynamicStyles.locationText}>{poi.location}</Text>
        </View>
        
        <Text 
          style={dynamicStyles.description}
          numberOfLines={3}
        >
          {poi.shortDescription}
        </Text>
        
        <TouchableOpacity 
          style={dynamicStyles.button}
          onPress={onViewDetails}
        >
          <Text style={dynamicStyles.buttonText}>View Details</Text>
          <ChevronRight size={18} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}