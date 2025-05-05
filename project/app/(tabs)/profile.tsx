import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Switch, ScrollView, Alert } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { LogOut, Moon, Sun, Volume2, Bell, HelpCircle, Shield, ChevronRight } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export default function ProfileScreen() {
  const { colors, isDark, theme, setTheme } = useTheme();
  const { user, signOut } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [offlineMode, setOfflineMode] = useState(false);
  const [autoPlayAudio, setAutoPlayAudio] = useState(true);

  const handleToggleTheme = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleLogout = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Log Out", 
          onPress: () => signOut(),
          style: "destructive"
        }
      ]
    );
  };

  const toggleSetting = (setting: string, value: boolean) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    switch(setting) {
      case 'notifications':
        setNotificationsEnabled(value);
        break;
      case 'offline':
        setOfflineMode(value);
        break;
      case 'autoplay':
        setAutoPlayAudio(value);
        break;
    }
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      padding: 20,
      paddingTop: 40,
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    avatarContainer: {
      marginBottom: 16,
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      borderWidth: 3,
      borderColor: colors.primary,
    },
    name: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
      marginTop: 12,
      fontFamily: 'Poppins-Bold',
    },
    email: {
      fontSize: 16,
      color: colors.muted,
      marginTop: 4,
      fontFamily: 'Inter-Regular',
    },
    section: {
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    sectionTitle: {
      fontSize: 18,
      color: colors.text,
      marginBottom: 12,
      fontWeight: '600',
      fontFamily: 'Poppins-SemiBold',
    },
    settingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 12,
    },
    settingText: {
      fontSize: 16,
      color: colors.text,
      flex: 1,
      marginLeft: 12,
      fontFamily: 'Inter-Regular',
    },
    iconContainer: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.card,
      justifyContent: 'center',
      alignItems: 'center',
    },
    rowLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    button: {
      marginHorizontal: 20,
      marginVertical: 24,
      padding: 16,
      backgroundColor: colors.error,
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '600',
      marginLeft: 8,
      fontFamily: 'Inter-SemiBold',
    },
    versionText: {
      textAlign: 'center',
      marginTop: 24,
      marginBottom: 40,
      fontSize: 14,
      color: colors.muted,
      fontFamily: 'Inter-Regular',
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 12,
    },
    menuItemText: {
      fontSize: 16,
      color: colors.text,
      marginLeft: 12,
      fontFamily: 'Inter-Regular',
    },
  });

  return (
    <ScrollView 
      style={dynamicStyles.container}
      contentContainerStyle={{ paddingBottom: 16 }}
    >
      <View style={dynamicStyles.header}>
        <View style={dynamicStyles.avatarContainer}>
          <Image
            source={{ uri: user?.avatar || 'https://i.pravatar.cc/150?u=default' }}
            style={dynamicStyles.avatar}
          />
        </View>
        <Text style={dynamicStyles.name}>{user?.name || 'Guest User'}</Text>
        <Text style={dynamicStyles.email}>{user?.email || 'guest@example.com'}</Text>
      </View>

      <View style={dynamicStyles.section}>
        <Text style={dynamicStyles.sectionTitle}>App Settings</Text>
        
        <View style={dynamicStyles.settingRow}>
          <View style={dynamicStyles.rowLeft}>
            <View style={[dynamicStyles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
              {isDark ? (
                <Moon size={18} color={colors.primary} />
              ) : (
                <Sun size={18} color={colors.primary} />
              )}
            </View>
            <Text style={dynamicStyles.settingText}>Dark Mode</Text>
          </View>
          <Switch
            trackColor={{ false: "#767577", true: colors.primary }}
            thumbColor={"#ffffff"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={handleToggleTheme}
            value={isDark}
          />
        </View>
        
        <View style={dynamicStyles.settingRow}>
          <View style={dynamicStyles.rowLeft}>
            <View style={[dynamicStyles.iconContainer, { backgroundColor: colors.secondary + '20' }]}>
              <Bell size={18} color={colors.secondary} />
            </View>
            <Text style={dynamicStyles.settingText}>Notifications</Text>
          </View>
          <Switch
            trackColor={{ false: "#767577", true: colors.primary }}
            thumbColor={"#ffffff"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={(value) => toggleSetting('notifications', value)}
            value={notificationsEnabled}
          />
        </View>
        
        <View style={dynamicStyles.settingRow}>
          <View style={dynamicStyles.rowLeft}>
            <View style={[dynamicStyles.iconContainer, { backgroundColor: colors.accent + '20' }]}>
              <Volume2 size={18} color={colors.accent} />
            </View>
            <Text style={dynamicStyles.settingText}>Auto-play Audio</Text>
          </View>
          <Switch
            trackColor={{ false: "#767577", true: colors.primary }}
            thumbColor={"#ffffff"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={(value) => toggleSetting('autoplay', value)}
            value={autoPlayAudio}
          />
        </View>
      </View>

      <View style={dynamicStyles.section}>
        <Text style={dynamicStyles.sectionTitle}>Account</Text>
        
        <TouchableOpacity style={dynamicStyles.menuItem}>
          <View style={dynamicStyles.rowLeft}>
            <View style={[dynamicStyles.iconContainer, { backgroundColor: colors.success + '20' }]}>
              <Shield size={18} color={colors.success} />
            </View>
            <Text style={dynamicStyles.menuItemText}>Privacy Settings</Text>
          </View>
          <ChevronRight size={18} color={colors.muted} />
        </TouchableOpacity>
        
        <TouchableOpacity style={dynamicStyles.menuItem}>
          <View style={dynamicStyles.rowLeft}>
            <View style={[dynamicStyles.iconContainer, { backgroundColor: colors.warning + '20' }]}>
              <HelpCircle size={18} color={colors.warning} />
            </View>
            <Text style={dynamicStyles.menuItemText}>Help & Support</Text>
          </View>
          <ChevronRight size={18} color={colors.muted} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={dynamicStyles.button} onPress={handleLogout}>
        <LogOut size={20} color="white" />
        <Text style={dynamicStyles.buttonText}>Log Out</Text>
      </TouchableOpacity>

      <Text style={dynamicStyles.versionText}>
        Version 1.0.0
      </Text>
    </ScrollView>
  );
}