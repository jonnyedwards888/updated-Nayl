import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { TYPOGRAPHY } from '../constants/theme';

const { width, height } = Dimensions.get('window');

// Color constants
const COLORS = {
  primaryBackground: '#000000',
  secondaryBackground: '#0F172A',
  cardBackground: '#1F2937',
  primaryAccent: '#C1FF72',
  secondaryAccent: '#0A4F6B',
  destructiveAction: '#BA2222',
  primaryText: '#FFFFFF',
  secondaryText: '#A9A9A9',
  mutedText: '#6B7280',
  success: '#10B981',
  warning: '#F59E0B',
  info: '#0EA5E9',
  deepIndigo: '#1E1B4B',
  gold: '#FFD700',
  silver: '#C0C0C0',
  bronze: '#CD7F32',
  purple: '#8B5CF6',
  pink: '#EC4899',
  blue: '#3B82F6',
  green: '#10B981',
};

// Spacing constants
const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

interface AchievementBadgeProps {
  title: string;
  description: string;
  progress: number;
  maxProgress: number;
  gradientColors: readonly [string, string, ...string[]];
  icon: keyof typeof Ionicons.glyphMap | 'custom';
  iconSource?: any;
  isUnlocked: boolean;
}

const AchievementBadge: React.FC<AchievementBadgeProps & { index: number; showUnlockAnimation: boolean }> = ({
  title,
  description,
  progress,
  maxProgress,
  gradientColors,
  icon,
  iconSource,
  isUnlocked,
  index,
  showUnlockAnimation,
}) => {
  const themeResult = useTheme();
  const colors = themeResult?.colors;
  
  if (!colors) return null;

  const styles = createStyles(colors);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // If achievement is locked, show a subtle hint
    if (!isUnlocked) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.achievementBadge,
        isUnlocked && styles.achievementBadgeUnlocked
      ]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <View style={styles.badgeContent}>
        <View style={styles.badgeIconContainer}>
          {isUnlocked ? (
            <>
              {icon === 'custom' && iconSource ? (
                <Image source={iconSource} style={styles.customIcon} />
              ) : (
                <View style={styles.customIcon}>
                  <Ionicons name={icon as keyof typeof Ionicons.glyphMap} size={36} color="#FFFFFF" />
                </View>
              )}
              {/* Unlock animation overlay */}
              {showUnlockAnimation && (
                <View style={styles.unlockAnimation} />
              )}
            </>
          ) : (
            <View style={styles.lockIconContainer}>
              <Ionicons name="lock-closed" size={32} color="rgba(255, 255, 255, 0.4)" />
            </View>
          )}
        </View>
        
        <Text style={[
          styles.badgeTitle,
          isUnlocked && styles.badgeTitleUnlocked
        ]}>
          {title}
        </Text>
        
        <Text style={[
          styles.badgeProgress,
          isUnlocked && styles.badgeProgressUnlocked
        ]}>
          {isUnlocked ? `${progress}/${maxProgress} days` : `${maxProgress} days`}
        </Text>
      </View>
    </TouchableOpacity>
  );
};


const createStyles = (themeColors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeColors.primaryBackground,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  radialGradient: {
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
  },
  star: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // White stars with high opacity
    shadowColor: 'rgba(255, 255, 255, 0.7)', // Matching white shadow color
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xxl,
    paddingBottom: SPACING.lg,
    position: 'relative',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
    position: 'relative',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  screenTitle: {
    fontFamily: 'Inter',
    fontSize: 20,
    fontWeight: '600',
    color: themeColors.primaryText,
    textAlign: 'center',
  },
  progressContainer: {
    marginTop: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: SPACING.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
    shadowColor: COLORS.primaryAccent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 3,
  },
  progressText: {
    ...TYPOGRAPHY.caption,
    color: themeColors.mutedText,
    textAlign: 'center',
    fontSize: 12,
  },
  content: {
    flex: 1,
    paddingTop: SPACING.lg,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.sm,
  },
  achievementBadge: {
    width: (width - SPACING.lg * 2 - SPACING.md * 2) / 3,
    alignItems: 'center',
    marginBottom: SPACING.xl,
    padding: SPACING.md,
    minHeight: 100,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  achievementBadgeUnlocked: {
    // No special styling for unlocked container - let the icon do the work
  },
  badgeContent: {
    alignItems: 'center',
    width: '100%',
  },
  badgeIconContainer: {
    marginBottom: SPACING.md,
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    // Ensure all icons fill the exact same size container
    resizeMode: 'cover',
    backgroundColor: 'transparent',
  },
  lockIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    // Subtle gradient effect
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  unlockAnimation: {
    position: 'absolute',
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: COLORS.primaryAccent,
    opacity: 0.8,
    shadowColor: COLORS.primaryAccent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 8,
  },
  badgeTitle: {
    ...TYPOGRAPHY.bodySmall,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: SPACING.xs,
    fontSize: 12,
    color: COLORS.secondaryText,
    opacity: 0.7,
  },
  badgeTitleUnlocked: {
    color: themeColors.primaryText,
    fontWeight: '700',
    fontSize: 13,
  },
  badgeProgress: {
    ...TYPOGRAPHY.caption,
    textAlign: 'center',
    fontSize: 12,
    color: COLORS.mutedText,
    opacity: 0.6,
  },
  badgeProgressUnlocked: {
    color: themeColors.primaryText,
    fontWeight: '600',
    fontSize: 12,
  },
  bottomSpacing: {
    height: 100,
  },
});

const AchievementsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const [unlockedAchievements, setUnlockedAchievements] = useState(new Set([0, 1]));
  const [showUnlockAnimation, setShowUnlockAnimation] = useState<number | null>(null);
  
  // Star positions for randomized animation
  const [starPositions, setStarPositions] = useState(() => 
    Array.from({ length: 100 }, () => ({
      x: Math.random() * width * 2,
      y: Math.random() * height,
      opacity: Math.random() * 0.9 + 0.15, // Enhanced opacity range: 0.15 to 1.05 for more variation
      speed: Math.random() * 0.15 + 0.03,
      directionX: (Math.random() - 0.5) * 1.5, // Slightly more controlled movement
      directionY: (Math.random() - 0.5) * 1.5, // Slightly more controlled movement
      size: Math.random() * 2.2 + 0.5, // Varied star sizes for depth
    }))
  );

  // Optimized star animation function
  const updateStarPositions = useCallback(() => {
    setStarPositions(prevPositions => 
      prevPositions.map(star => {
        // Calculate new position with random direction
        const newX = star.x + (star.directionX * star.speed);
        const newY = star.y + (star.directionY * star.speed);
        
        // Wrap stars around screen boundaries
        let wrappedX = newX;
        let wrappedY = newY;
        
        if (newX < -50) wrappedX = width + 50;
        if (newX > width + 50) wrappedX = -50;
        if (newY < -50) wrappedY = height + 50;
        if (newY > height + 50) wrappedY = -50;
        
        return {
          ...star,
          x: wrappedX,
          y: wrappedY,
        };
      })
    );
  }, [width, height]);

  // Starfield animation
  useEffect(() => {
    // Randomized starfield animation - optimized for performance
    const starfieldInterval = setInterval(updateStarPositions, 50); // Reduced from 20ms to 50ms for better performance

    return () => {
      clearInterval(starfieldInterval);
    };
  }, [updateStarPositions]);

  // Enhanced safety check for theme colors
  if (!colors || 
      typeof colors !== 'object' || 
      !colors.primaryBackground || 
      !colors.primaryText ||
      !colors.backgroundGradient) {
    console.warn('⚠️ AchievementsScreen: Theme colors not ready, using fallback');
    // Return a minimal loading state
    return (
      <View style={{ 
        flex: 1, 
        backgroundColor: '#000000',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Text style={{ color: '#FFFFFF', fontSize: 18 }}>Loading achievements...</Text>
      </View>
    );
  }

  const unlockAchievement = (index: number) => {
    if (!unlockedAchievements.has(index)) {
      setUnlockedAchievements(prev => new Set([...prev, index]));
      setShowUnlockAnimation(index);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      // Hide animation after 2 seconds
      setTimeout(() => setShowUnlockAnimation(null), 2000);
    }
  };

  // Create styles with validated colors
  const styles = createStyles(colors);

  const achievements = [
    {
      title: "Sprout",
      description: "First day without biting",
      progress: 1,
      maxProgress: 1,
      gradientColors: ['#90EE90', '#32CD32', '#228B22', '#006400'] as const,
      icon: "custom" as const,
      iconSource: require('../../assets/new-icons/Da-Sprout.webp'),
      isUnlocked: unlockedAchievements.has(0),
    },
    {
      title: "Sun-kissed",
      description: "A week of progress",
      progress: 7,
      maxProgress: 7,
      gradientColors: ['#FFD700', '#FFA500', '#FF8C00', '#FF6B35'] as const,
      icon: "custom" as const,
      iconSource: require('../../assets/new-icons/sun-iconn.png'),
      isUnlocked: unlockedAchievements.has(1),
    },
    {
      title: "Deeply Rooted",
      description: "One month milestone",
      progress: 30,
      maxProgress: 30,
      gradientColors: ['#32CD32', '#228B22', '#006400'] as const,
      icon: "custom" as const,
      iconSource: require('../../assets/new-deeply-rooted-icon.webp'),
      isUnlocked: unlockedAchievements.has(2),
    },
    {
      title: "Blossoming",
      description: "Two months of strength",
      progress: 60,
      maxProgress: 60,
      gradientColors: ['#FF69B4', '#DA70D6', '#9370DB'] as const,
      icon: "custom" as const,
      iconSource: require('../../assets/new-icons/blossom-achievement-icon.webp'),
      isUnlocked: unlockedAchievements.has(3),
    },
    {
      title: "The Oak",
      description: "Three months of mastery",
      progress: 90,
      maxProgress: 90,
      gradientColors: ['#8A2BE2', '#4B0082', '#2E0854'] as const,
      icon: "custom" as const,
      iconSource: require('../../assets/new-icons/Da-Oak.webp'),
      isUnlocked: unlockedAchievements.has(4),
    },
    {
      title: "Conqueror",
      description: "Six months of transformation",
      progress: 180,
      maxProgress: 180,
      gradientColors: ['#FFD700', '#FFA500', '#FF4500'] as const,
      icon: "custom" as const,
      iconSource: require('../../assets/new-icons/landmark-icon-fixed.webp'),
      isUnlocked: unlockedAchievements.has(5),
    },
  ];

  const unlockedCount = achievements.filter(a => a.isUnlocked).length;

  return (
    <SafeAreaView style={styles.container}>
      {/* Consistent background gradient */}
                      <LinearGradient
          colors={colors.backgroundGradient}
          style={styles.backgroundGradient}
        />
        
        {/* Subtle starfield effect */}
        <View style={styles.starfield}>
          {starPositions.map((star, index) => (
            <View
              key={index}
              style={[
                styles.star,
                {
                  left: star.x,
                  top: star.y,
                  opacity: star.opacity, // Use full opacity for maximum visibility
                  width: star.size,
                  height: star.size,
                  borderRadius: star.size / 2,
                }
              ]}
            />
          ))}
        </View>
        
        {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Home' as never)}>
            <Ionicons name="chevron-back" size={24} color={COLORS.primaryText} />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={styles.screenTitle}>Achievements</Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${(unlockedCount / achievements.length) * 100}%`,
                  backgroundColor: COLORS.primaryAccent
                }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {unlockedCount}/{achievements.length} achievements earned
          </Text>
          
          {/* Demo unlock button for testing */}
          <TouchableOpacity 
            style={{
              backgroundColor: COLORS.primaryAccent,
              paddingHorizontal: SPACING.md,
              paddingVertical: SPACING.sm,
              borderRadius: 20,
              marginTop: SPACING.md,
              alignSelf: 'center',
              shadowColor: COLORS.primaryAccent,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 4,
            }}
            onPress={() => {
              const nextLockedIndex = achievements.findIndex((_, i) => !unlockedAchievements.has(i));
              if (nextLockedIndex !== -1) {
                unlockAchievement(nextLockedIndex);
              } else {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
              }
            }}
            activeOpacity={0.8}
          >
            <Text style={{
              color: COLORS.primaryBackground,
              fontWeight: '600',
              fontSize: 12,
            }}>
              Unlock Next Achievement
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.achievementsGrid}>
          {achievements.map((achievement, index) => (
            <AchievementBadge
              key={index}
              {...achievement}
              index={index}
              showUnlockAnimation={showUnlockAnimation === index}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};



export default AchievementsScreen;