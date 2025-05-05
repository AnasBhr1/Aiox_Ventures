import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import { Link, router } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export default function SignupScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { colors, isDark } = useTheme();

  const togglePasswordVisibility = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setShowPassword(!showPassword);
  };

  const handleSignup = async () => {
    // Basic validation
    if (!name || !email || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    setIsLoading(true);
    setError(null);

    try {
      // This would be a real API call in a production app
      // await api.auth.register({ name, email, password });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success message
      Alert.alert(
        "Account Created!",
        "Your account has been created successfully. Please log in.",
        [{ text: "OK", onPress: () => router.replace('/(auth)/login') }]
      );
    } catch (err) {
      setError('Failed to create account. Please try again.');
      console.error('Signup failed:', err);
    } finally {
      setIsLoading(false);
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
    backButton: {
      padding: 8,
      marginBottom: 16,
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
          <TouchableOpacity 
            style={dynamicStyles.backButton} 
            onPress={() => router.back()}
            accessibilityLabel="Go back"
          >
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>

          <View style={dynamicStyles.logoContainer}>
            <Image
              source={{ uri: 'https://i.imgur.com/JZUZxJr.png' }}
              style={dynamicStyles.logo}
            />
          </View>

          <Text style={dynamicStyles.title}>Create Account</Text>
          <Text style={dynamicStyles.subtitle}>Sign up to start exploring cultures</Text>

          <TextInput
            style={dynamicStyles.input}
            placeholder="Full Name"
            placeholderTextColor={colors.muted}
            value={name}
            onChangeText={setName}
          />

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

          <TextInput
            style={dynamicStyles.input}
            placeholder="Confirm Password"
            placeholderTextColor={colors.muted}
            secureTextEntry={!showPassword}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          {error && <Text style={dynamicStyles.errorText}>{error}</Text>}

          <TouchableOpacity 
            style={dynamicStyles.button} 
            onPress={handleSignup}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={dynamicStyles.buttonText}>Sign Up</Text>
            )}
          </TouchableOpacity>

          <View style={dynamicStyles.footer}>
            <Text style={dynamicStyles.footerText}>Already have an account?</Text>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity>
                <Text style={dynamicStyles.link}>Sign In</Text>
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