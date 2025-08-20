import React, { useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { Achievement } from '../context/AchievementContext';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { ACHIEVEMENT_TYPOGRAPHY, ACHIEVEMENT_SPACING, ACHIEVEMENT_SHADOWS, ACHIEVEMENT_COLORS } from '../constants/achievementTypography';

const { width, height } = Dimensions.get('window');

interface AchievementPopupProps {
  achievement: Achievement;
  isVisible: boolean;
  onHide: () => void;
}

const AchievementPopup: React.FC<AchievementPopupProps> = ({
  achievement,
  isVisible,
  onHide,
}) => {
  const themeResult = useTheme();
  const colors = themeResult?.colors;
  
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  // Use useCallback to prevent Reanimated warnings
  const overlayStyle = useCallback(() => [
    styles.overlay,
    { opacity: opacityAnim }
  ], [opacityAnim]);

  const containerStyle = useCallback(() => [
    styles.popupContainer,
    { transform: [{ scale: scaleAnim }] }
  ], [scaleAnim]);

  useEffect(() => {
    if (isVisible) {
      // Reset animations
      scaleAnim.setValue(0);
      opacityAnim.setValue(0);
      
      // Enhanced entrance animation with premium feel
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 120,
          friction: 8,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Exit animation
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible, scaleAnim, opacityAnim]);

  if (!colors || !isVisible) return null;

  const getProgressText = () => {
    if (achievement.id === 'three-days') {
      return `${achievement.progress}/${achievement.maxProgress} Days`;
    }
    if (achievement.id === 'first-day') {
      return `${achievement.progress}/${achievement.maxProgress} Day`;
    }
    if (achievement.id === 'week-streak') {
      return `${achievement.progress}/${achievement.maxProgress} Days`;
    }
    if (achievement.id === 'month-streak') {
      return `${achievement.progress}/${achievement.maxProgress} Days`;
    }
    if (achievement.id === 'brain-rewiring') {
      return `${achievement.progress}/${achievement.maxProgress} Days`;
    }
    if (achievement.id === 'first-article') {
      return `${achievement.progress}/${achievement.maxProgress} Article`;
    }
    if (achievement.id === 'article-master') {
      return `${achievement.progress}/${achievement.maxProgress} Articles`;
    }
    return `${achievement.progress}/${achievement.maxProgress}`;
  };

  return (
    <Animated.View
      style={overlayStyle()}
    >
      {/* Premium glassmorphic background */}
      <BlurView intensity={60} style={styles.blurBackground}>
        <LinearGradient
          colors={[
            'rgba(0, 0, 0, 0.85)', 
            'rgba(15, 23, 42, 0.8)', 
            'rgba(33, 28, 75, 0.75)'
          ]}
          style={styles.gradientBackground}
        />
      </BlurView>

      <TouchableOpacity
        style={styles.overlayTouchable}
        activeOpacity={1}
        onPress={onHide}
      >
        <Animated.View
          style={containerStyle()}
        >
          {/* Premium achievement card with enhanced glassmorphism */}
          <View style={styles.achievementCard}>
            {/* Enhanced achievement icon with premium styling */}
            <View style={styles.achievementIconContainer}>
              <View style={styles.iconGlowContainer}>
                <Text style={styles.achievementIconText}>{achievement.icon}</Text>
              </View>
            </View>

            {/* Enhanced text container with premium typography */}
            <View style={styles.textContainer}>
              <Text style={[styles.achievementTitle, { color: colors.primaryText }]}>
                {achievement.title}
              </Text>
              <View style={styles.progressContainer}>
                <Text style={[styles.progressText, { color: colors.secondaryText }]}>
                  {getProgressText()}
                </Text>
              </View>
              <Text style={[styles.achievementDescription, { color: colors.primaryText }]}>
                {achievement.description}
              </Text>
            </View>

            {/* Enhanced close button with premium styling */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onHide}
              activeOpacity={0.7}
            >
              <View style={styles.closeButtonInner}>
                <Ionicons name="close" size={24} color={colors.primaryText} />
              </View>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  blurBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlayTouchable: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupContainer: {
    width: width * 0.9,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  achievementCard: {
    width: '100%',
    padding: ACHIEVEMENT_SPACING.containerPadding,
    alignItems: 'center',
    justifyContent: 'center',
    // Enhanced premium glassmorphism
    backgroundColor: ACHIEVEMENT_COLORS.popupBackground,
    borderRadius: 24,
    // Enhanced premium shadows with multiple layers
    ...ACHIEVEMENT_SHADOWS.card,
    // Premium glassmorphic effect with subtle borders
    borderWidth: 1,
    borderColor: ACHIEVEMENT_COLORS.primaryBorder,
    // Better spacing for visual balance
    marginHorizontal: ACHIEVEMENT_SPACING.textContainerPadding,
  },
  achievementIconContainer: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: ACHIEVEMENT_SPACING.iconMargin,
    // Enhanced container styling
    backgroundColor: ACHIEVEMENT_COLORS.textContainerBackground,
    borderRadius: 60,
    borderWidth: 1,
    borderColor: ACHIEVEMENT_COLORS.textContainerBorder,
  },
  iconGlowContainer: {
    // Enhanced glow effect for achievement icons
    ...ACHIEVEMENT_SHADOWS.icon,
  },
  achievementIconText: {
    ...ACHIEVEMENT_TYPOGRAPHY.iconText,
    fontSize: 60,
    lineHeight: 120,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: ACHIEVEMENT_SPACING.descriptionMargin,
    paddingHorizontal: ACHIEVEMENT_SPACING.textContainerPadding,
    // Enhanced container styling with glassmorphism
    backgroundColor: ACHIEVEMENT_COLORS.textContainerBackground,
    borderRadius: 16,
    paddingVertical: 20,
    borderWidth: 1,
    borderColor: ACHIEVEMENT_COLORS.textContainerBorder,
    // Better spacing for visual hierarchy
    marginHorizontal: ACHIEVEMENT_SPACING.textContainerPadding,
  },
  progressContainer: {
    alignItems: 'center',
    marginVertical: ACHIEVEMENT_SPACING.compactGap,
    // Better spacing for progress text
    paddingVertical: ACHIEVEMENT_SPACING.xs,
  },
  achievementTitle: {
    ...ACHIEVEMENT_TYPOGRAPHY.popupTitle,
  },
  progressText: {
    ...ACHIEVEMENT_TYPOGRAPHY.progressText,
  },
  achievementDescription: {
    ...ACHIEVEMENT_TYPOGRAPHY.popupDescription,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    // Enhanced glassmorphic styling
    backgroundColor: ACHIEVEMENT_COLORS.closeButtonBackground,
    justifyContent: 'center',
    alignItems: 'center',
    // Enhanced premium shadows
    ...ACHIEVEMENT_SHADOWS.closeButton,
    // Enhanced borders
    borderWidth: 1,
    borderColor: ACHIEVEMENT_COLORS.textContainerBorder,
  },
  closeButtonInner: {
    // Inner container for close button
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    // Subtle inner shadow
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
});

export default AchievementPopup;
