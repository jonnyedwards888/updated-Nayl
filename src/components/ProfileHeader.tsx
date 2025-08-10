import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useThemeGuaranteed } from '../context/ThemeContext';
import profileService from '../services/profileService';
import BrandLogo from './BrandLogo';

interface ProfileHeaderProps {
  size?: 'small' | 'medium' | 'large';
  onPress?: () => void;
  navigation?: any;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ 
  size = 'medium',
  onPress,
  navigation
}) => {
  const themeResult = useThemeGuaranteed();
  const colors = themeResult?.colors;
  
  // Enhanced safety check for theme colors
  if (!colors || 
      typeof colors !== 'object' || 
      !colors.primaryBackground || 
      !colors.primaryText ||
      !colors.primaryAccent) {
    console.warn('⚠️ ProfileHeader: Theme colors not ready, using fallback');
    // Return a minimal loading state
    return (
      <View style={{ 
        height: 120, 
        backgroundColor: '#2A2A2A', 
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Text style={{ color: '#FFFFFF', fontSize: 16 }}>Loading profile...</Text>
      </View>
    );
  }

  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProfilePicture = async () => {
      try {
        const profileData = await profileService.getProfileData();
        console.log('ProfileHeader: Loaded profile data:', {
          profile_picture_url: profileData.profile_picture_url,
          profile_name: profileData.profile_name
        });
        setProfilePictureUrl(profileData.profile_picture_url || null);
      } catch (error) {
        console.error('Error loading profile picture:', error);
        setProfilePictureUrl(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfilePicture();
  }, []);

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { width: 32, height: 32, borderRadius: 16 };
      case 'large':
        return { width: 48, height: 48, borderRadius: 24 };
      default: // medium
        return { width: 40, height: 40, borderRadius: 20 };
    }
  };

  const sizeStyles = getSizeStyles();

  if (isLoading) {
    // Show a placeholder while loading
    return (
      <View style={[styles.container, sizeStyles]}>
        <View style={[styles.placeholder, { backgroundColor: colors.primaryAccent }]} />
      </View>
    );
  }

  if (profilePictureUrl) {
    // Show user's profile picture
    return (
      <TouchableOpacity 
        style={[styles.container, sizeStyles]} 
        onPress={onPress || (() => navigation?.navigate('Profile'))}
        activeOpacity={0.8}
      >
        <Image 
          source={{ uri: profilePictureUrl }} 
          style={[styles.profileImage, sizeStyles]}
          resizeMode="cover"
        />
      </TouchableOpacity>
    );
  }

  // Fall back to basic logo
  return (
    <TouchableOpacity 
      style={[styles.container, sizeStyles]} 
      onPress={onPress || (() => navigation?.navigate('Profile'))}
      activeOpacity={0.8}
    >
      <BrandLogo size={size} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImage: {
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  placeholder: {
    width: '100%',
    height: '100%',
    borderRadius: 999,
    opacity: 0.3,
  },

});

export default ProfileHeader;
