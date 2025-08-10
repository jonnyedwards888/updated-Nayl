import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { typography, body, bodySmall, caption, buttonText } from '../constants/typography';

const { width, height } = Dimensions.get('window');

// Color constants
const COLORS = {
  primaryBackground: '#000000',
  overlayBackground: 'rgba(0, 0, 0, 0.95)',
  primaryAccent: '#C1FF72',
  secondaryAccent: '#0A4F6B',
  primaryText: '#FFFFFF',
  secondaryText: '#A9A9A9',
  mutedText: '#6B7280',
  cardBackground: '#1F2937',
  success: '#10B981',
  warning: '#F59E0B',
  info: '#0EA5E9',
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

// Tips data with icons, headers, and descriptions
const tips = [
  {
    icon: 'calendar-outline',
    header: 'Take It One Day at a Time',
    description: 'Focus on just getting through today. Thinking about quitting permanently can be overwhelming.',
    color: COLORS.success,
  },
  {
    icon: 'hand-left-outline',
    header: 'Keep Hands Away',
    description: 'Try completely avoiding putting your nails anywhere near your mouth. Even close proximity can trigger the urge.',
    color: COLORS.warning,
  },
  {
    icon: 'leaf-outline',
    header: 'Find Alternative Activities',
    description: 'Keep your hands busy with fidget toys, stress balls, or gentle hand exercises.',
    color: COLORS.info,
  },
  {
    icon: 'water-outline',
    header: 'Stay Hydrated',
    description: 'Drinking water can help reduce stress and keep your mouth occupied, reducing the urge to bite.',
    color: COLORS.secondaryAccent,
  },
  {
    icon: 'heart-outline',
    header: 'Practice Self-Care',
    description: 'Take deep breaths, meditate, or go for a walk when you feel the urge. Stress often triggers nail biting.',
    color: COLORS.primaryAccent,
  },
  {
    icon: 'shield-checkmark-outline',
    header: 'Use Bitter Polish',
    description: 'Apply a bitter-tasting nail polish to make biting unpleasant and help break the habit.',
    color: COLORS.warning,
  },
  {
    icon: 'trophy-outline',
    header: 'Celebrate Small Wins',
    description: 'Acknowledge every hour, day, or week you go without biting. Every moment of resistance is progress.',
    color: COLORS.success,
  },
  {
    icon: 'people-outline',
    header: 'Tell Friends and Family',
    description: 'Let people close to you know about your goal. Their support and gentle reminders can help.',
    color: COLORS.info,
  },
  {
    icon: 'brush-outline',
    header: 'Keep Nails Trimmed',
    description: 'Short, well-groomed nails are less tempting to bite and look more appealing.',
    color: COLORS.secondaryAccent,
  },
  {
    icon: 'bulb-outline',
    header: 'Identify Triggers',
    description: 'Notice what situations make you want to bite - stress, boredom, or anxiety. Awareness is the first step.',
    color: COLORS.primaryAccent,
  },
];

interface TipsModalProps {
  visible: boolean;
  onClose: () => void;
}

const TipsModal: React.FC<TipsModalProps> = ({ visible, onClose }) => {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  // Auto-cycle through tips
  useEffect(() => {
    if (!visible) return;

    const interval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % tips.length);
    }, 8000); // Change tip every 8 seconds (slower)

    return () => clearInterval(interval);
  }, [visible]);

  // Animate tip changes
  useEffect(() => {
    if (visible) {
      // Fade out and slide up
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 50,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Fade in and slide down
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
      });
    }
  }, [currentTipIndex, visible]);

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  };

  const handleNextTip = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCurrentTipIndex((prev) => (prev + 1) % tips.length);
  };

  const handlePrevTip = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCurrentTipIndex((prev) => (prev - 1 + tips.length) % tips.length);
  };

  if (!visible) return null;

  const currentTip = tips[currentTipIndex];

  return (
    <View style={styles.overlay}>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity style={styles.backButton} onPress={handleClose}>
              <Ionicons name="chevron-back" size={24} color={COLORS.primaryText} />
            </TouchableOpacity>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Tips & Strategies</Text>
            </View>
            <View style={styles.headerSpacer} />
          </View>
        </View>

        {/* Tip Content */}
        <View style={styles.content}>
          <Animated.View 
            style={[
              styles.tipContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }
            ]}
          >
            {/* Icon */}
            <View style={[styles.iconContainer, { backgroundColor: `${currentTip.color}20` }]}>
              <Ionicons 
                name={currentTip.icon as any} 
                size={48} 
                color={currentTip.color} 
              />
            </View>

            {/* Header */}
            <Text style={styles.tipHeader}>{currentTip.header}</Text>

            {/* Description */}
            <Text style={styles.tipDescription}>{currentTip.description}</Text>
          </Animated.View>

          {/* Navigation Dots */}
          <View style={styles.dotsContainer}>
            {tips.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index === currentTipIndex && styles.activeDot
                ]}
              />
            ))}
          </View>

          {/* Navigation Buttons */}
          <View style={styles.navigationContainer}>
            <TouchableOpacity style={styles.navButton} onPress={handlePrevTip}>
              <Ionicons name="chevron-back" size={24} color={COLORS.primaryText} />
            </TouchableOpacity>
            
            <Text style={styles.tipCounter}>
              {currentTipIndex + 1} / {tips.length}
            </Text>
            
            <TouchableOpacity style={styles.navButton} onPress={handleNextTip}>
              <Ionicons name="chevron-forward" size={24} color={COLORS.primaryText} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.overlayBackground,
    zIndex: 1000,
  },
  container: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
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
  title: {
    ...typography.appTitle,
    color: COLORS.primaryText,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
  tipContainer: {
    alignItems: 'center',
    maxWidth: width * 0.8,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xl,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  tipHeader: {
    ...body,
    color: COLORS.primaryText,
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: SPACING.lg,
    lineHeight: 36,
  },
  tipDescription: {
    ...bodySmall,
    color: COLORS.secondaryText,
    textAlign: 'center',
    lineHeight: 26,
    fontSize: 18,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.xl,
    marginBottom: SPACING.lg,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: SPACING.xs,
  },
  activeDot: {
    backgroundColor: COLORS.primaryAccent,
  },
  navigationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.lg,
  },
  navButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 22,
    marginHorizontal: SPACING.md,
  },
  tipCounter: {
    ...caption,
    color: COLORS.mutedText,
    fontSize: 14,
    fontWeight: '500',
  },
  bottomSpacing: {
    height: SPACING.lg,
  },
});

export default TipsModal; 