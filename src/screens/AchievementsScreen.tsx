import React, { useState, useEffect, useRef } from 'react';
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

const AchievementBadge: React.FC<AchievementBadgeProps> = ({
  title,
  description,
  progress,
  maxProgress,
  gradientColors,
  icon,
  iconSource,
  isUnlocked,
}) => {
  // Animation values
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const swayAnim = useRef(new Animated.Value(0)).current;
  const unlockAnim = useRef(new Animated.Value(0)).current;

  // Start idle animations when unlocked
  useEffect(() => {
    if (isUnlocked) {
      // Gentle pulsing glow animation
      const glowAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 4000,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 4000,
            useNativeDriver: true,
          }),
        ])
      );

      // Sway animation for leaf icons
      if (icon === 'leaf') {
        const swayAnimation = Animated.loop(
          Animated.sequence([
            Animated.timing(swayAnim, {
              toValue: 1,
              duration: 3000,
              useNativeDriver: true,
            }),
            Animated.timing(swayAnim, {
              toValue: -1,
              duration: 3000,
              useNativeDriver: true,
            }),
          ])
        );
        swayAnimation.start();
      }

      glowAnimation.start();
    }
  }, [isUnlocked, icon]);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    if (isUnlocked) {
      // Celebration animation on press
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  // Interpolated values for animations
  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.2, 0.5],
  });

  const swayRotation = swayAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-5deg', '5deg'],
  });

  return (
    <TouchableOpacity 
      style={[
        styles.achievementBadge,
        isUnlocked && styles.achievementBadgeUnlocked
      ]} 
      onPress={handlePress}
    >
      <View style={styles.badgeContent}>
        {/* Icon Container */}
        <View style={styles.badgeIconContainer}>
          {isUnlocked ? (
            icon === 'custom' ? (
              /* Custom icon without container */
              <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <Image 
                  source={iconSource} 
                  style={styles.customIcon}
                  resizeMode="cover"
                />
              </Animated.View>
            ) : (
              /* Vibrant badge-like icon for unlocked state with animations */
              <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <LinearGradient
                  colors={gradientColors}
                  style={styles.badgeIcon}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  {/* Glow effect */}
                  <Animated.View 
                    style={[
                      styles.badgeGlow,
                      { opacity: glowOpacity }
                    ]} 
                  />
                  
                  {/* Icon with sway animation for leaf */}
                  <Animated.View style={icon === 'leaf' ? { transform: [{ rotate: swayRotation }] } : {}}>
                    <Ionicons 
                      name={icon} 
                      size={36} 
                      color={COLORS.primaryText} 
                    />
                  </Animated.View>
                </LinearGradient>
              </Animated.View>
            )
          ) : (
            /* Subtle frosted glass container for locked state */
            <View style={styles.lockIconContainer}>
              <Ionicons 
                name="lock-closed" 
                size={28} 
                color="rgba(255, 255, 255, 0.7)" 
              />
            </View>
          )}
        </View>
        
        {/* Title */}
        <Text 
          style={[
            styles.badgeTitle, 
            isUnlocked && styles.badgeTitleUnlocked
          ]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {title}
        </Text>
        
        {/* Progress */}
        <Text 
          style={[
            styles.badgeProgress, 
            isUnlocked && styles.badgeProgressUnlocked
          ]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {isUnlocked ? 'Unlocked!' : `${progress}/${maxProgress} days`}
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
    backgroundColor: themeColors.primaryText,
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
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: SPACING.xs,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
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
  },
  badgeIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  customIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  lockIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    // Subtle gradient effect
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  badgeGlow: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primaryAccent,
    top: -8,
    left: -8,
    zIndex: -1,
  },
  badgeGlint: {
    position: 'absolute',
    width: 4,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 2,
    top: 12,
    left: 30,
    transform: [{ rotate: '45deg' }],
  },
  badgeTitle: {
    ...TYPOGRAPHY.bodySmall,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: SPACING.xs,
    fontSize: 12,
    color: COLORS.secondaryText,
  },
  badgeTitleUnlocked: {
    color: COLORS.primaryAccent,
    fontWeight: '700',
    fontSize: 13,
  },
  badgeProgress: {
    ...TYPOGRAPHY.caption,
    textAlign: 'center',
    fontSize: 12,
    color: COLORS.mutedText,
  },
  badgeProgressUnlocked: {
    color: COLORS.primaryAccent,
    fontWeight: '600',
    fontSize: 12,
  },
  bottomSpacing: {
    height: 100,
  },
});

const AchievementsScreen: React.FC = () => {
  const navigation = useNavigation();
  const themeResult = useTheme();
  const colors = themeResult?.colors;
  
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

  const [unlockedAchievements, setUnlockedAchievements] = useState<Set<number>>(new Set([0, 1, 2]));

  // Create styles with validated colors
  const styles = createStyles(colors);

  const achievements = [
    {
      title: "First Leaf",
      description: "First day without biting",
      progress: 1,
      maxProgress: 1,
      gradientColors: ['#90EE90', '#32CD32', '#228B22', '#006400'] as const,
      icon: "custom" as const,
      iconSource: require('../../assets/new-leaf-icon.webp'),
      isUnlocked: true,
    },
    {
      title: "Sun-kissed",
      description: "A week of progress",
      progress: 7,
      maxProgress: 7,
      gradientColors: ['#FFD700', '#FFA500', '#FF8C00', '#FF6B35'] as const,
      icon: "custom" as const,
      iconSource: require('../../assets/new-sun-icon.webp'),
      isUnlocked: true,
    },
    {
      title: "Deeply Rooted",
      description: "One month milestone",
      progress: 30,
      maxProgress: 30,
      gradientColors: ['#32CD32', '#228B22', '#006400'] as const,
      icon: "custom" as const,
      iconSource: require('../../assets/new-deeply-rooted-icon.webp'),
      isUnlocked: true,
    },
    {
      title: "Blossoming",
      description: "Two months of strength",
      progress: 60,
      maxProgress: 60,
      gradientColors: ['#FF69B4', '#DA70D6', '#9370DB'] as const,
      icon: "custom" as const,
      iconSource: require('../../assets/cherry-blossom-icon.webp'),
      isUnlocked: true,
    },
    {
      title: "Evergreen",
      description: "Three months of mastery",
      progress: 90,
      maxProgress: 90,
      gradientColors: ['#8A2BE2', '#4B0082', '#2E0854'] as const,
      icon: "custom" as const,
      iconSource: require('../../assets/Evergreen-icon.webp'),
      isUnlocked: true,
    },
    {
      title: "The Oak",
      description: "Six months of transformation",
      progress: 180,
      maxProgress: 180,
      gradientColors: ['#FFD700', '#FFA500', '#FF4500'] as const,
      icon: "custom" as const,
      iconSource: require('../../assets/landmark-achievement.webp'),
      isUnlocked: true,
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
            {unlockedCount}/{achievements.length} collected
          </Text>
        </View>
      </View>
      
      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.achievementsGrid}>
          {achievements.map((achievement, index) => (
            <AchievementBadge
              key={index}
              {...achievement}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryBackground,
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
    backgroundColor: COLORS.primaryText,
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
    color: COLORS.primaryText,
    textAlign: 'center',
  },
  progressContainer: {
    marginTop: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  progressBar: {
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: SPACING.xs,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.mutedText,
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
  },
  badgeIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  customIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  lockIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    // Subtle gradient effect
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  badgeGlow: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primaryAccent,
    top: -8,
    left: -8,
    zIndex: -1,
  },
  badgeGlint: {
    position: 'absolute',
    width: 4,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 2,
    top: 12,
    left: 30,
    transform: [{ rotate: '45deg' }],
  },
  badgeTitle: {
    ...TYPOGRAPHY.bodySmall,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: SPACING.xs,
    fontSize: 12,
    color: COLORS.secondaryText,
  },
  badgeTitleUnlocked: {
    color: COLORS.primaryAccent,
    fontWeight: '700',
    fontSize: 13,
  },
  badgeProgress: {
    ...TYPOGRAPHY.caption,
    textAlign: 'center',
    fontSize: 12,
    color: COLORS.mutedText,
  },
  badgeProgressUnlocked: {
    color: COLORS.primaryAccent,
    fontWeight: '600',
    fontSize: 12,
  },
  bottomSpacing: {
    height: 100,
  },
});

export default AchievementsScreen;