import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  SafeAreaView,
  Dimensions,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import profileService, { ProfileData } from '../services/profileService';
import { COLORS, SHADOWS, TYPOGRAPHY, SPACING } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import { useStreak } from '../context/StreakContext';
import sessionService from '../services/sessionService';
import { PerformanceMeasureView } from '@shopify/react-native-performance';

const { width, height } = Dimensions.get('window');

interface ProfileScreenProps {
  navigation: any;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const { currentTheme, setTheme, colors } = useTheme();
  
  // Safety check for theme colors
  if (!colors || typeof colors !== 'object' || !colors.primaryBackground || !colors.primaryText) {
    console.warn('⚠️ ProfileScreen: Theme colors not ready, using fallback');
    // Return a minimal loading state
    return (
      <View style={{ flex: 1, backgroundColor: '#000000', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: '#FFFFFF', fontSize: 18 }}>Loading theme...</Text>
      </View>
    );
  }
  const { elapsedSeconds, refreshStreakData, updateCurrentStreak } = useStreak();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<ProfileData>({
    profile_name: 'Your Name',
    longest_streak_seconds: 0,
    consecutive_days: 0,
    total_days_logged_in: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  
  // Star positions for floating particles background
  const [starPositions, setStarPositions] = useState(() => 
    Array.from({ length: 50 }, () => ({
      x: Math.random() * width * 2,
      y: Math.random() * height,
      opacity: Math.random() * 0.8 + 0.1,
      speed: Math.random() * 0.15 + 0.03,
      directionX: (Math.random() - 0.5) * 1.5,
      directionY: (Math.random() - 0.5) * 1.5,
      size: Math.random() * 2.2 + 0.5,
    }))
  );

  // Load profile data on mount
  useEffect(() => {
    loadProfileData();
  }, []);

  // Refresh profile data when streak data changes (but not every second to reduce spam)
  useEffect(() => {
    // Only refresh profile data every 30 seconds to reduce console spam
    if (elapsedSeconds % 30 === 0) {
      loadProfileData();
    }
  }, [elapsedSeconds]);

  // Add focus listener to refresh data when screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadProfileData();
    });

    return unsubscribe;
  }, [navigation]);

  // Animated starfield effect
  useEffect(() => {
    const starfieldInterval = setInterval(() => {
      setStarPositions(prevPositions =>
        prevPositions.map(star => {
          const newX = star.x + (star.directionX * star.speed);
          const newY = star.y + (star.directionY * star.speed);

          // Wrap stars around screen boundaries
          return {
            ...star,
            x: newX > width * 2 ? -width : newX < -width ? width * 2 : newX,
            y: newY > height ? -50 : newY < -50 ? height : newY,
          };
        })
      );
    }, 50);

    return () => clearInterval(starfieldInterval);
  }, []);

  const loadProfileData = async () => {
    try {
      // Refresh streak data first to ensure it's up-to-date
      await refreshStreakData();
      
      const data = await profileService.getProfileData();
      // Reduced logging to prevent terminal spam
      // console.log('Profile data loaded:', data);
      // console.log('Longest streak seconds:', data.longest_streak_seconds);
      // console.log('Formatted longest streak:', formatTime(data.longest_streak_seconds));
      
      setProfileData(data);
      if (data.profile_picture_url) {
        setProfileImage(data.profile_picture_url);
      }
    } catch (error) {
      console.error('Error loading profile data:', error);
    }
  };

  const formatTime = (totalSeconds: number) => {
    if (totalSeconds <= 0) {
      return '0m';
    }
    
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    
    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m`;
    } else {
      return `${totalSeconds}s`;
    }
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant permission to access your photo library.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        await handleImageUpload(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant permission to access your camera.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        await handleImageUpload(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const handleImageUpload = async (imageUri: string) => {
    try {
      setIsLoading(true);
      console.log('Starting image upload process...');
      
      // Add timeout protection
      const uploadPromise = profileService.uploadProfilePicture(imageUri);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Upload timeout')), 30000)
      );
      
      const uploadedUrl = await Promise.race([uploadPromise, timeoutPromise]) as string;
      console.log('Upload completed, updating database...');
      
      // Update database
      await profileService.updateProfilePicture(uploadedUrl);
      
      // Update local state
      setProfileImage(uploadedUrl);
      
      Alert.alert('Success', 'Profile picture updated successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      Alert.alert('Upload Failed', `Failed to upload image: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const showImagePickerOptions = () => {
    Alert.alert(
      'Choose Profile Picture',
      'How would you like to add a profile picture?',
      [
        {
          text: 'Take Photo',
          onPress: takePhoto,
        },
        {
          text: 'Choose from Library',
          onPress: pickImage,
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const cancelUpload = () => {
    setIsLoading(false);
    Alert.alert('Upload Cancelled', 'The upload has been cancelled.');
  };

  const handleEditName = () => {
    Alert.prompt(
      'Edit Profile Name',
      'Enter your name:',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Save',
          onPress: async (name) => {
            if (name && name.trim()) {
              try {
                await profileService.updateProfileName(name.trim());
                setProfileData(prev => ({ ...prev, profile_name: name.trim() }));
              } catch (error) {
                console.error('Error updating profile name:', error);
                Alert.alert('Error', 'Failed to update profile name. Please try again.');
              }
            }
          },
        },
      ],
      'plain-text',
      profileData.profile_name === 'Your Name' ? '' : profileData.profile_name
    );
  };

  return (
    <PerformanceMeasureView screenName="ProfileScreen">
      <SafeAreaView style={styles.container}>
                  {/* Premium Background with Gradient */}
          <LinearGradient
            colors={colors.backgroundGradient}
            style={styles.backgroundContainer}
          />

        {/* Floating Particles Background */}
        <View style={styles.starfield}>
          {starPositions.map((star, index) => (
            <View
              key={`star-${index}`}
              style={[
                styles.star,
                {
                  left: star.x,
                  top: star.y,
                  opacity: star.opacity,
                  width: star.size,
                  height: star.size,
                  borderRadius: star.size / 2,
                },
              ]}
            />
          ))}
        </View>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.primaryText} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Main Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Profile Picture Section */}
          <View style={styles.profileSection}>
            <TouchableOpacity
              style={styles.profileImageContainer}
              onPress={showImagePickerOptions}
              disabled={isLoading}
            >
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.profileImage} />
              ) : (
                <View style={styles.profileImagePlaceholder}>
                  <Ionicons name="person" size={48} color={COLORS.secondaryText} />
                </View>
              )}
              <View style={styles.editIconContainer}>
                <Ionicons name="camera" size={16} color={COLORS.primaryText} />
              </View>
              {isLoading && (
                <View style={styles.loadingOverlay}>
                  <Ionicons name="cloud-upload" size={24} color={COLORS.primaryText} />
                  <TouchableOpacity 
                    style={styles.cancelButton}
                    onPress={cancelUpload}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity onPress={handleEditName} style={styles.profileNameContainer}>
              <Text style={styles.profileName}>{profileData.profile_name}</Text>
              <Ionicons name="create-outline" size={16} color={COLORS.secondaryText} style={styles.editIcon} />
            </TouchableOpacity>
            <Text style={styles.profileSubtitle}>
              {isLoading ? 'Uploading...' : 'Tap name to edit, picture to change'}
            </Text>
          </View>

          {/* Longest Streak Card */}
          <View style={styles.streakCard}>
            <LinearGradient
              colors={[
                'rgba(242, 0, 255, 0.6)',      // Premium gold
                'rgba(115, 22, 104, 0.5)',       // Rich orange       // Vibrant red-orange
                'rgba(220, 20, 60, 0.5)'        // Crimson
              ]}
              style={styles.streakCardGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 2 }}
            >
              <View style={styles.streakCardContent}>
                <View style={styles.trophyContainer}>
                  <Image 
                    source={require('../../assets/trophy-icon.png')} 
                    style={{ width: 48, height: 48 }}
                    resizeMode="contain"
                  />
                </View>
                <View style={styles.streakCardText}>
                  <Text style={styles.streakCardTitle}>Longest Streak</Text>
                  <Text style={styles.streakCardValue}>
                    {formatTime(profileData.longest_streak_seconds)}
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* Stats Cards */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Ionicons name="calendar" size={24} color={COLORS.primaryAccent} />
              <Text style={styles.statValue}>{profileData.consecutive_days}</Text>
              <Text style={styles.statLabel}>Consecutive Days</Text>
            </View>
            
            <View style={styles.statCard}>
              <Ionicons name="time" size={24} color={COLORS.primaryAccent} />
              <Text style={styles.statValue}>{profileData.total_days_logged_in}</Text>
              <Text style={styles.statLabel}>Total Days</Text>
            </View>
          </View>

                   {/* Reasons for Changing Card */}
           <View style={styles.reasonsCard}>
             <LinearGradient
               colors={['rgba(138, 43, 226, 0.15)', 'rgba(75, 0, 130, 0.1)']}
               style={styles.reasonsCardGradient}
             >
               <TouchableOpacity 
                 style={styles.reasonsCardContent}
                 onPress={() => navigation.navigate('Reasons')}
               >
                 <View style={styles.reasonsIconContainer}>
                   <Ionicons name="heart" size={32} color="#8A2BE2" />
                 </View>
                 <View style={styles.reasonsCardText}>
                   <Text style={styles.reasonsCardTitle}>Reasons for Changing</Text>
                   <Text style={styles.reasonsCardSubtitle}>
                     Add your personal reasons for stopping nail biting
                   </Text>
                 </View>
                 <Ionicons name="chevron-forward" size={24} color={COLORS.secondaryText} />
               </TouchableOpacity>
             </LinearGradient>
           </View>

           {/* Profile Options */}
           <View style={styles.optionsSection}>
            <TouchableOpacity style={styles.optionItem} onPress={() => navigation.navigate('Journal')}>
              <View style={styles.optionIconContainer}>
                <Ionicons name="book-outline" size={20} color={COLORS.primaryText} />
              </View>
              <Text style={styles.optionText}>Journal</Text>
              <Ionicons name="chevron-forward" size={20} color={COLORS.secondaryText} />
            </TouchableOpacity>

             <TouchableOpacity style={styles.optionItem}>
               <View style={styles.optionIconContainer}>
                 <Ionicons name="settings-outline" size={20} color={COLORS.primaryText} />
               </View>
               <Text style={styles.optionText}>Settings</Text>
               <Ionicons name="chevron-forward" size={20} color={COLORS.secondaryText} />
             </TouchableOpacity>

             <TouchableOpacity style={styles.optionItem}>
               <View style={styles.optionIconContainer}>
                 <Ionicons name="notifications-outline" size={20} color={COLORS.primaryText} />
               </View>
               <Text style={styles.optionText}>Notifications</Text>
               <Ionicons name="chevron-forward" size={20} color={COLORS.secondaryText} />
             </TouchableOpacity>

             <TouchableOpacity style={styles.optionItem}>
               <View style={styles.optionIconContainer}>
                 <Ionicons name="shield-outline" size={20} color={COLORS.primaryText} />
               </View>
               <Text style={styles.optionText}>Privacy</Text>
               <Ionicons name="chevron-forward" size={20} color={COLORS.secondaryText} />
             </TouchableOpacity>

             <TouchableOpacity style={styles.optionItem}>
               <View style={styles.optionIconContainer}>
                 <Ionicons name="help-circle-outline" size={20} color={COLORS.primaryText} />
               </View>
               <Text style={styles.optionText}>Help & Support</Text>
               <Ionicons name="chevron-forward" size={20} color={COLORS.secondaryText} />
             </TouchableOpacity>
           </View>

           {/* Theme Switcher Section */}
           <View style={styles.themeSection}>
             <Text style={styles.sectionTitle}>Appearance</Text>
             
             <View style={styles.themeOptions}>
               <TouchableOpacity 
                 style={[
                   styles.themeOption, 
                   currentTheme === 'midnight' && styles.themeOptionActive
                 ]}
                 onPress={() => setTheme('midnight')}
               >
                 <View style={styles.themeOptionContent}>
                   <View style={[styles.themePreview, { backgroundColor: '#020408' }]} />
                   <View style={styles.themeOptionText}>
                     <Text style={styles.themeOptionTitle}>Midnight</Text>
                     <Text style={styles.themeOptionDescription}>Premium dark depth</Text>
                   </View>
                 </View>
                 {currentTheme === 'midnight' && (
                   <Ionicons name="checkmark-circle" size={24} color="#C1FF72" />
                 )}
               </TouchableOpacity>

               <TouchableOpacity 
                 style={[
                   styles.themeOption, 
                   currentTheme === 'ocean' && styles.themeOptionActive
                 ]}
                 onPress={() => setTheme('ocean')}
               >
                 <View style={styles.themeOptionContent}>
                   <View style={[styles.themePreview, { backgroundColor: '#16213E' }]} />
                   <View style={styles.themeOptionText}>
                     <Text style={styles.themeOptionTitle}>Ocean</Text>
                     <Text style={styles.themeOptionDescription}>Deep blue waves</Text>
                   </View>
                 </View>
                 {currentTheme === 'ocean' && (
                   <Ionicons name="checkmark-circle" size={24} color="#C1FF72" />
                 )}
               </TouchableOpacity>

               <TouchableOpacity
                 style={[
                   styles.themeOption,
                   currentTheme === 'twilight' && styles.themeOptionActive
                 ]}
                 onPress={() => setTheme('twilight')}
               >
                 <View style={styles.themeOptionContent}>
                   <View style={[styles.themePreview, { backgroundColor: '#0A0A1A' }]} />
                   <View style={styles.themeOptionText}>
                     <Text style={styles.themeOptionTitle}>Twilight</Text>
                     <Text style={styles.themeOptionDescription}>Subtle dark blue</Text>
                   </View>
                 </View>
                 {currentTheme === 'twilight' && (
                   <Ionicons name="checkmark-circle" size={24} color="#C1FF72" />
                 )}
               </TouchableOpacity>
             </View>
           </View>
        </ScrollView>
      </SafeAreaView>
    </PerformanceMeasureView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryBackground,
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  starfield: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  star: {
    position: 'absolute',
    backgroundColor: 'rgba(76, 175, 80, 0.4)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.card,
  },
  headerTitle: {
    ...TYPOGRAPHY.headingLarge,
    color: COLORS.primaryText,
    fontWeight: '700',
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    zIndex: 10,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: SPACING.lg,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  profileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primaryAccent,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: COLORS.primaryBackground,
    ...SHADOWS.card,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    marginTop: SPACING.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: SPACING.sm,
  },
  cancelButtonText: {
    color: COLORS.primaryText,
    fontSize: 14,
    fontWeight: '500',
  },
  profileName: {
    ...TYPOGRAPHY.headingMedium,
    color: COLORS.primaryText,
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  profileNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xs,
  },
  editIcon: {
    marginLeft: SPACING.xs,
  },
  profileSubtitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.secondaryText,
    textAlign: 'center',
    marginBottom: SPACING.sm,
    opacity: 0.7,
    fontSize: 12,
  },
  streakCard: {
    marginBottom: SPACING.lg,
    borderRadius: SPACING.lg,
    overflow: 'hidden',
    ...SHADOWS.card,
  },
  streakCardGradient: {
    padding: SPACING.lg,
  },
  streakCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trophyContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  streakCardText: {
    flex: 1,
  },
          streakCardTitle: {
          ...TYPOGRAPHY.bodyMedium,
          color: COLORS.primaryText,
          fontWeight: '900',
          marginBottom: SPACING.xs,
        },
  streakCardValue: {
    ...TYPOGRAPHY.headingMedium,
    color: '#FFD700',
    fontWeight: '700',
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: SPACING.xl,
    gap: SPACING.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: SPACING.md,
    padding: SPACING.lg,
    alignItems: 'center',
    ...SHADOWS.card,
  },
  statValue: {
    ...TYPOGRAPHY.headingSmall,
    color: COLORS.primaryText,
    fontWeight: '700',
    marginVertical: SPACING.xs,
  },
  statLabel: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.secondaryText,
    textAlign: 'center',
  },
  optionsSection: {
    marginTop: SPACING.xl,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: SPACING.md,
    marginBottom: SPACING.sm,
    ...SHADOWS.card,
  },
  optionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  optionText: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.primaryText,
    fontWeight: '500',
    flex: 1,
  },
  reasonsCard: {
    marginBottom: SPACING.lg,
    borderRadius: SPACING.lg,
    overflow: 'hidden',
    ...SHADOWS.card,
  },
  reasonsCardGradient: {
    padding: SPACING.lg,
  },
  reasonsCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reasonsIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(138, 43, 226, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  reasonsCardText: {
    flex: 1,
  },
  reasonsCardTitle: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.primaryText,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  reasonsCardSubtitle: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.secondaryText,
  },
  themeSection: {
    marginTop: SPACING.xl,
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    ...TYPOGRAPHY.headingMedium,
    color: COLORS.primaryText,
    fontWeight: '600',
    marginBottom: SPACING.md,
  },
  themeOptions: {
    gap: SPACING.md,
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  themeOptionActive: {
    borderColor: COLORS.primaryAccent,
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
  },
  themeOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  themePreview: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: SPACING.md,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  themeOptionText: {
    flex: 1,
  },
  themeOptionTitle: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.primaryText,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  themeOptionDescription: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.secondaryText,
    fontSize: 12,
  },
});

export default ProfileScreen;
