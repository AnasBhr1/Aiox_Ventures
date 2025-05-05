import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Animated, Platform } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Mic, MicOff, Play, Pause, Navigation } from 'lucide-react-native';
import * as Speech from 'expo-speech';
import { router } from 'expo-router';
import { processVoiceCommand } from '@/services/voiceService';
import { POI } from '@/types';
import * as Haptics from 'expo-haptics';

export default function VoiceControlScreen() {
  const { colors, isDark } = useTheme();
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [responseText, setResponseText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nearbyPOI, setNearbyPOI] = useState<POI | null>(null);
  
  // Animation for microphone pulse
  const pulseAnim = React.useRef(new Animated.Value(1)).current;
  
  // Start the pulse animation when listening
  useEffect(() => {
    if (isListening) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isListening]);

  // Mock voice recognition by using a timeout
  const startListening = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    setIsListening(true);
    setTranscript('');
    setResponseText('');
    setError(null);
    
    // Simulated voice recognition (would use actual API in production)
    setTimeout(() => {
      const mockCommands = [
        "Tell me about nearby museums",
        "What's the history of this place?",
        "Find me the nearest restaurant",
        "Where am I right now?",
        "Take me to Empire State Building"
      ];
      
      const randomCommand = mockCommands[Math.floor(Math.random() * mockCommands.length)];
      setTranscript(randomCommand);
      
      processCommand(randomCommand);
      setIsListening(false);
    }, 3000);
  };

  const stopListening = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    setIsListening(false);
  };

  const processCommand = async (command: string) => {
    setIsLoading(true);
    
    try {
      const response = await processVoiceCommand(command);
      setResponseText(response.response);
      
      if (response.poi) {
        setNearbyPOI(response.poi);
      }
      
    } catch (err) {
      console.error('Voice command processing failed:', err);
      setError('Sorry, I couldn\'t process that request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const speakResponse = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    if (responseText) {
      setIsSpeaking(true);
      
      Speech.speak(responseText, {
        language: 'en',
        pitch: 1.0,
        rate: 0.9,
        onDone: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      });
    }
  };

  const stopSpeaking = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    Speech.stop();
    setIsSpeaking(false);
  };

  const navigateToPOI = () => {
    if (nearbyPOI) {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
      
      router.push({
        pathname: '/poi/[id]',
        params: { id: nearbyPOI.id }
      });
    }
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      flex: 1,
      padding: 20,
      paddingTop: 40,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 16,
      textAlign: 'center',
      fontFamily: 'Poppins-Bold',
    },
    subtitle: {
      fontSize: 16,
      color: colors.muted,
      marginBottom: 32,
      textAlign: 'center',
      paddingHorizontal: 20,
      fontFamily: 'Inter-Regular',
    },
    micContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 40,
    },
    micButton: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: isListening ? colors.error : colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 5,
    },
    micRing: {
      position: 'absolute',
      width: 100,
      height: 100,
      borderRadius: 50,
      borderWidth: 1,
      borderColor: isListening ? colors.error : 'transparent',
      opacity: 0.7,
    },
    transcriptContainer: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 20,
      minHeight: 80,
      justifyContent: 'center',
    },
    transcriptTitle: {
      fontSize: 14,
      color: colors.muted,
      marginBottom: 8,
      fontFamily: 'Inter-Regular',
    },
    transcriptText: {
      fontSize: 18,
      color: colors.text,
      fontFamily: isListening ? 'Inter-Medium' : 'Inter-Regular',
    },
    responseContainer: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 20,
      minHeight: 120,
    },
    responseTitle: {
      fontSize: 14,
      color: colors.muted,
      marginBottom: 8,
      fontFamily: 'Inter-Regular',
    },
    responseText: {
      fontSize: 16,
      color: colors.text,
      lineHeight: 24,
      fontFamily: 'Inter-Regular',
    },
    audioControls: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 16,
    },
    audioButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primary,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 8,
      marginHorizontal: 8,
    },
    audioButtonText: {
      color: 'white',
      marginLeft: 8,
      fontWeight: '600',
      fontFamily: 'Inter-SemiBold',
    },
    loadingContainer: {
      marginTop: 20,
      alignItems: 'center',
    },
    errorText: {
      color: colors.error,
      marginTop: 12,
      textAlign: 'center',
      fontFamily: 'Inter-Regular',
    },
    poiCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginTop: 24,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
      elevation: 2,
    },
    poiInfo: {
      flex: 1,
    },
    poiTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 4,
      fontFamily: 'Inter-SemiBold',
    },
    poiDistance: {
      fontSize: 14,
      color: colors.muted,
      fontFamily: 'Inter-Regular',
    },
    navButton: {
      backgroundColor: colors.accent,
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 12,
    },
    statusText: {
      color: colors.muted,
      textAlign: 'center',
      marginTop: 8,
      fontFamily: 'Inter-Regular',
    },
  });

  return (
    <ScrollView style={dynamicStyles.container}>
      <View style={dynamicStyles.content}>
        <Text style={dynamicStyles.title}>Voice Assistant</Text>
        <Text style={dynamicStyles.subtitle}>
          Ask about nearby cultural attractions, historical facts, or directions to places
        </Text>

        <View style={dynamicStyles.micContainer}>
          <Animated.View 
            style={[
              dynamicStyles.micRing, 
              { transform: [{ scale: pulseAnim }] }
            ]} 
          />
          <TouchableOpacity 
            style={dynamicStyles.micButton}
            onPress={isListening ? stopListening : startListening}
            accessibilityLabel={isListening ? "Stop listening" : "Start listening"}
          >
            {isListening ? (
              <MicOff size={32} color="white" />
            ) : (
              <Mic size={32} color="white" />
            )}
          </TouchableOpacity>
          <Text style={dynamicStyles.statusText}>
            {isListening ? 'Listening...' : 'Tap to speak'}
          </Text>
        </View>

        <View style={dynamicStyles.transcriptContainer}>
          <Text style={dynamicStyles.transcriptTitle}>You said:</Text>
          <Text style={dynamicStyles.transcriptText}>
            {isListening ? 'Listening...' : transcript || 'Say something...'}
          </Text>
        </View>

        <View style={dynamicStyles.responseContainer}>
          <Text style={dynamicStyles.responseTitle}>Response:</Text>
          {isLoading ? (
            <View style={dynamicStyles.loadingContainer}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={{ color: colors.muted, marginTop: 8, fontFamily: 'Inter-Regular' }}>
                Processing your request...
              </Text>
            </View>
          ) : (
            <Text style={dynamicStyles.responseText}>
              {responseText || 'No response yet'}
            </Text>
          )}
          
          {responseText && (
            <View style={dynamicStyles.audioControls}>
              {isSpeaking ? (
                <TouchableOpacity 
                  style={dynamicStyles.audioButton}
                  onPress={stopSpeaking}
                >
                  <Pause size={18} color="white" />
                  <Text style={dynamicStyles.audioButtonText}>Stop</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity 
                  style={dynamicStyles.audioButton}
                  onPress={speakResponse}
                >
                  <Play size={18} color="white" />
                  <Text style={dynamicStyles.audioButtonText}>Listen</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        {error && <Text style={dynamicStyles.errorText}>{error}</Text>}

        {nearbyPOI && (
          <TouchableOpacity 
            style={dynamicStyles.poiCard}
            onPress={navigateToPOI}
          >
            <View style={dynamicStyles.poiInfo}>
              <Text style={dynamicStyles.poiTitle}>{nearbyPOI.name}</Text>
              <Text style={dynamicStyles.poiDistance}>{nearbyPOI.location}</Text>
            </View>
            <TouchableOpacity style={dynamicStyles.navButton} onPress={navigateToPOI}>
              <Navigation size={20} color="white" />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}