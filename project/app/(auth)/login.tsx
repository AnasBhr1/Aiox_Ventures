import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Eye, EyeOff } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export default function LoginScreen() {
  const [email, setEmail] = useState('demo@example.com');
  const [password, setPassword] = useState('password');
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, isLoading, error } = useAuth();
  const { colors, isDark } = useTheme();

  const togglePasswordVisibility = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    try {
      await signIn(email, password);
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    input: {
      height: 50,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      paddingHorizontal: 16,
      marginVertical: 8,
      color: colors.text,
      backgroundColor: isDark ? colors.card : colors.background,
      fontFamily: 'Inter-Regular',
    },
    inputFocused: {
      borderColor: colors.primary,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 8,
      fontFamily: 'Poppins-Bold',
    },
    subtitle: {
      fontSize: 16,
      color: colors.muted,
      marginBottom: 24,
      fontFamily: 'Inter-Regular',
    },
    button: {
      backgroundColor: colors.primary,
      borderRadius: 8,
      height: 54,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 16,
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '600',
      fontFamily: 'Inter-SemiBold',
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 24,
    },
    footerText: {
      color: colors.muted,
      fontFamily: 'Inter-Regular',
    },
    link: {
      color: colors.primary,
      fontWeight: '600',
      marginLeft: 4,
      fontFamily: 'Inter-SemiBold',
    },
    errorText: {
      color: colors.error,
      marginTop: 8,
      fontFamily: 'Inter-Regular',
    },
    logoContainer: {
      alignItems: 'center',
      marginBottom: 32,
    },
    logo: {
      width: 120,
      height: 120,
      resizeMode: 'contain',
    },
    passwordContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      position: 'relative',
    },
    passwordInput: {
      flex: 1,
    },
    passwordToggle: {
      position: 'absolute',
      right: 16,
      padding: 8,
    },
  });

  return (
    <KeyboardAvoidingView
      style={dynamicStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <View style={dynamicStyles.logoContainer}>
            <Image
              source={{ uri: 'https://i.imgur.com/JZUZxJr.png' }}
              style={dynamicStyles.logo}
            />
          </View>

          <Text style={dynamicStyles.title}>Welcome Back</Text>
          <Text style={dynamicStyles.subtitle}>Sign in to continue your cultural journey</Text>

          <TextInput
            style={dynamicStyles.input}
            placeholder="Email"
            placeholderTextColor={colors.muted}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <View style={dynamicStyles.passwordContainer}>
            <TextInput
              style={[dynamicStyles.input, dynamicStyles.passwordInput]}
              placeholder="Password"
              placeholderTextColor={colors.muted}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity 
              style={dynamicStyles.passwordToggle}
              onPress={togglePasswordVisibility}
              accessibilityLabel={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff size={20} color={colors.muted} />
              ) : (
                <Eye size={20} color={colors.muted} />
              )}
            </TouchableOpacity>
          </View>

          {error && <Text style={dynamicStyles.errorText}>{error}</Text>}

          <TouchableOpacity 
            style={dynamicStyles.button} 
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={dynamicStyles.buttonText}>Sign In</Text>
            )}
          </TouchableOpacity>

          <View style={dynamicStyles.footer}>
            <Text style={dynamicStyles.footerText}>Don't have an account?</Text>
            <Link href="/(auth)/signup" asChild>
              <TouchableOpacity>
                <Text style={dynamicStyles.link}>Sign Up</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
});