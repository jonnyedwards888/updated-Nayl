import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Animated,
  Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import Svg, { Circle, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import { useTheme, useThemeGuaranteed } from '../context/ThemeContext';
import { useStreak } from '../context/StreakContext';
import sessionService from '../services/sessionService';
import hapticService, { HapticType, HapticIntensity } from '../services/hapticService';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');

// Mock data
const RECOVERY_TARGET_DAYS = 60; // Brain rewiring target (60 days)

const AnalyticsScreen: React.FC = () => {
  const navigation = useNavigation();
  const themeResult = useThemeGuaranteed();
  const colors = themeResult?.colors;
  const { elapsedSeconds } = useStreak();
  
  // Calculate real progress data
  const recoveryPercentage = sessionService.calculateBrainRewiringPercentage(elapsedSeconds);
  const daysToRecovery = RECOVERY_TARGET_DAYS - Math.floor(elapsedSeconds / (24 * 60 * 60));
  const estimatedRecoveryDate = new Date();
  estimatedRecoveryDate.setDate(estimatedRecoveryDate.getDate() + daysToRecovery);

  // Enhanced safety check for theme colors
  if (!colors || 
      typeof colors !== 'object' || 
      !colors.primaryBackground || 
      !colors.primaryText ||
      !colors.backgroundGradient) {
    console.warn('⚠️ AnalyticsScreen: Theme colors not ready, using fallback');
    // Return a minimal loading state
    return (
      <View style={{ 
        flex: 1, 
        backgroundColor: '#000000',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Text style={{ color: '#FFFFFF', fontSize: 18 }}>Loading analytics...</Text>
      </View>
    );
  }

  const [starPositions, setStarPositions] = useState(() => 
    Array.from({ length: 25 }, () => ({
      x: Math.random() * width * 2,
      y: Math.random() * height,
      opacity: Math.random() * 0.2 + 0.05,
      speed: Math.random() * 0.15 + 0.05,
      directionX: (Math.random() - 0.5) * 2,
      directionY: (Math.random() - 0.5) * 2,
      size: Math.random() * 1.5 + 0.5,
    }))
  );

  // Animated starfield
  useEffect(() => {
    const starfieldInterval = setInterval(() => {
      setStarPositions(prevPositions => 
        prevPositions.map(star => {
          const newX = star.x + (star.directionX * star.speed);
          const newY = star.y + (star.directionY * star.speed);
          
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
    }, 30);

    return () => {
      clearInterval(starfieldInterval);
    };
  }, []);

  // Benefits data with multi-color icon system
  const benefits = [
    {
      icon: 'custom',
      iconSource: require('../../assets/recovery-page-icons/increased-confidence.webp'),
      title: 'Improved Confidence',
      description: 'Feel more comfortable showing your hands in social and professional situations.',
      progress: 85,
      color: '#C1FF72', // Vibrant lime-green
    },
    {
      icon: 'custom',
      iconSource: require('../../assets/recovery-page-icons/healthy-nails.webp'),
      title: 'Healthier Nails',
      description: 'Nails and cuticles recover, grow stronger, and look better.',
      progress: 92,
      color: '#0A4F6B', // Calming teal
    },
    {
      icon: 'custom',
      iconSource: require('../../assets/recovery-page-icons/new-meditation-icon.webp'),
      title: 'Reduced Stress',
      description: 'Break the cycle of anxiety and nervous habits.',
      progress: 78,
      color: '#F59E0B', // Warm warning amber
    },
    {
      icon: 'custom',
      iconSource: require('../../assets/recovery-page-icons/fewer-infections-icon.webp'),
      title: 'Fewer Infections',
      description: 'Lower risk of nail, skin, and mouth infections.',
      progress: 88,
      color: '#0EA5E9', // Soft info blue
    },
    {
      icon: 'custom',
      iconSource: require('../../assets/recovery-page-icons/willpower-icon.webp'),
      title: 'Stronger Self-Control',
      description: 'Build willpower and break the habit for good.',
      progress: 73,
      color: '#C1FF72', // Back to lime-green
    },
    {
      icon: 'custom',
      iconSource: require('../../assets/recovery-page-icons/better-hygiene-icon.webp'),
      title: 'Better Hygiene',
      description: 'Fewer germs and less risk of illness.',
      progress: 95,
      color: '#0A4F6B', // Back to teal
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Consistent background gradient with particle starfield (same as Home) */}
      <LinearGradient
        colors={colors.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        locations={[0, 0.55, 1]}
        style={styles.backgroundGradient}
      >
        <View style={styles.starfield}>
          {starPositions.map((star, index) => (
            <View
              key={index}
              style={[
                styles.star,
                {
                  left: star.x,
                  top: star.y,
                  opacity: star.opacity,
                  width: star.size,
                  height: star.size,
                },
              ]}
            />
          ))}
        </View>
      </LinearGradient>
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Home' as never)}>
            <Ionicons name="chevron-back" size={28} color={colors.primaryText} />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={[styles.screenTitle, { color: colors.primaryText }]}>Analytics</Text>
          </View>
          <TouchableOpacity style={styles.shareButton}>
            <Ionicons name="share-outline" size={28} color={colors.primaryText} />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Progress Section */}
        <View style={styles.progressSection}>
          <View style={styles.progressContainer}>
            <ProgressRing progress={recoveryPercentage} size={360} strokeWidth={16} />
            <View style={styles.progressTextContainer}>
              <Text style={[styles.progressLabel, { color: colors.secondaryText }]}>RECOVERY</Text>
              <Text style={[styles.progressPercentage, { color: colors.primaryText }]}>{Math.round(recoveryPercentage)}%</Text>
              <Text style={[styles.progressSubtext, { color: colors.secondaryText }]}>{Math.floor(elapsedSeconds / (24 * 60 * 60))} DAY STREAK</Text>
              <Text style={[styles.progressTarget, { color: colors.mutedText }]}>Progress to {RECOVERY_TARGET_DAYS} days (Brain Rewiring)</Text>
            </View>
          </View>
          
          {/* Enhanced Recovery Date Display */}
          <View style={styles.recoveryDateContainer}>
            <Text style={[styles.recoveryDateLabel, { color: colors.secondaryText }]}>
              You're on track to quit nail biting by:
            </Text>
            <View style={[styles.recoveryDateBox, { backgroundColor: colors.secondaryBackground, borderColor: colors.secondaryAccent }]}>
              <Text style={[styles.recoveryDateText, { color: colors.primaryText }]}>
                {estimatedRecoveryDate.toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </Text>
            </View>
          </View>
          
          {/* Enhanced Motivational Text */}
          <View style={[styles.motivationalContainer, { backgroundColor: colors.secondaryBackground, borderColor: colors.secondaryAccent }]}>
            <Text style={[styles.motivationalText, { color: colors.primaryText }]}>
              The first few days are always the hardest, but you've already shown incredible strength. Hold on to your reasons for starting this journey.
            </Text>
          </View>
        </View>

        {/* Divider */}
        <View style={[styles.divider, { backgroundColor: colors.secondaryAccent }]} />

        {/* Benefits Section */}
        <View style={styles.benefitsSection}>
          <Text style={[styles.benefitsTitle, { color: colors.primaryText }]}>Why Stop Biting Your Nails?</Text>

          <View style={[styles.benefitsCard, { backgroundColor: colors.secondaryBackground, borderColor: colors.secondaryAccent }]}>
            {/* Subtle frosted glass effect */}
            <BlurView intensity={22} tint="dark" style={styles.benefitsBlur} />

            <View style={styles.benefitsCardBody}>
              {benefits.map((benefit, index) => (
                <React.Fragment key={index}>
                  <View style={styles.benefitRow}>
                    <View style={[styles.benefitIcon, { backgroundColor: benefit.color }]}>
                      <Image source={benefit.iconSource} style={styles.benefitIconImage} />
                    </View>
                    <View style={styles.benefitTextCol}>
                      <Text style={[styles.benefitTitle, { color: colors.primaryText }]}>{benefit.title}</Text>
                      <Text style={[styles.benefitDescription, { color: colors.secondaryText }]}>{benefit.description}</Text>
                      <View style={[styles.benefitProgressBg, { backgroundColor: colors.mutedText }]}>
                        <View 
                          style={[
                            styles.benefitProgressFill, 
                            { backgroundColor: benefit.color, width: `${benefit.progress}%` }
                          ]} 
                        />
                      </View>
                    </View>
                  </View>
                  {index < benefits.length - 1 && (
                    <View style={[styles.benefitDivider, { backgroundColor: colors.secondaryAccent }]} />
                  )}
                </React.Fragment>
              ))}
            </View>
          </View>
        </View>

        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

// Progress Ring Component
const ProgressRing: React.FC<{ progress: number; size: number; strokeWidth: number }> = ({ 
  progress, 
  size, 
  strokeWidth 
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  
  // Track if we've already animated this progress value
  const hasAnimated = React.useRef(false);
  const [displayProgress, setDisplayProgress] = React.useState(0);
  
  // Animate progress when component mounts or progress changes
  React.useEffect(() => {
    // Only animate if we haven't animated this progress value yet
    if (!hasAnimated.current) {
      hasAnimated.current = true;
      
      // Start from 0 and animate to target progress
      let startTime = Date.now();
      const duration = 300; // 400ms animation - much quicker!
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progressRatio = Math.min(elapsed / duration, 1);
        
        // Use easing function for smooth animation
        const easedProgress = 1 - Math.pow(1 - progressRatio, 3); // Cubic ease-out
        const currentProgress = easedProgress * progress;
        
        setDisplayProgress(currentProgress);
        
        if (progressRatio < 1) {
          requestAnimationFrame(animate);
        } else {
          // Animation complete - add haptic feedback
          hapticService.trigger(HapticType.LIGHT_TAP, HapticIntensity.SUBTLE);
        }
      };
      
      requestAnimationFrame(animate);
    }
  }, [progress]); // Only depend on progress
  
  // Calculate stroke dash offset based on current display progress
  const strokeDashoffset = circumference - (displayProgress / 100) * circumference;

  return (
    <Svg width={size} height={size}>
      <Defs>
        <SvgLinearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <Stop offset="0%" stopColor="#F8FAFC" />
          <Stop offset="50%" stopColor="#E2E8F0" />
          <Stop offset="100%" stopColor="#CBD5E1" />
        </SvgLinearGradient>
      </Defs>
      
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="rgba(255, 255, 255, 0.08)"
        strokeWidth={strokeWidth}
        fill="transparent"
      />
      
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="url(#progressGradient)"
        strokeWidth={strokeWidth}
        fill="transparent"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </Svg>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent', // Changed from '#0F172A' to transparent
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  star: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    borderRadius: 1,
  },
  starfield: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xxl,
    paddingBottom: SPACING.lg,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    padding: SPACING.sm,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  screenTitle: {
    ...TYPOGRAPHY.headingLarge,
    color: '#FFFFFF',
  },
  shareButton: {
    padding: SPACING.sm,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  progressSection: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  progressContainer: {
    width: 360,
    height: 360,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: SPACING.lg,
  },
  progressTextContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressLabel: {
    ...TYPOGRAPHY.caption,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: SPACING.xs,
    letterSpacing: 1.2,
  },
  progressPercentage: {
    ...TYPOGRAPHY.displayLarge,
    color: '#FFFFFF',
    marginBottom: SPACING.xs,
    textShadowColor: 'rgba(193, 255, 114, 0.6)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  progressSubtext: {
    ...TYPOGRAPHY.bodyMedium,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: SPACING.xs,
    letterSpacing: 0.5,
  },
  progressTarget: {
    ...TYPOGRAPHY.caption,
    color: '#94A3B8',
    opacity: 0.8,
  },
  recoveryDateContainer: {
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  recoveryDateLabel: {
    ...TYPOGRAPHY.bodyMedium,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: SPACING.sm,
    fontWeight: '500',
    lineHeight: 24,
  },
  recoveryDateBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    ...SHADOWS.card,
  },
  recoveryDateText: {
    ...TYPOGRAPHY.headingSmall,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  motivationalContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    maxWidth: width - 80,
    ...SHADOWS.card,
  },
  motivationalText: {
    ...TYPOGRAPHY.bodyMedium,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '500',
  },
  bottomSpacing: {
    height: SPACING.lg,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    // Extend beyond safe area to cover the entire screen including below footer
    minHeight: height + 100, // Add extra height to ensure coverage
  },
  divider: {
    height: 1,
    marginVertical: SPACING.md,
  },
  benefitsSection: {
    marginBottom: SPACING.lg,
  },
  benefitsTitle: {
    ...TYPOGRAPHY.headingMedium,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  benefitsCard: {
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    ...SHADOWS.card,
    overflow: 'hidden',
  },
  benefitsBlur: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  benefitsCardBody: {
    padding: SPACING.lg,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  benefitIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
    overflow: 'hidden', // Ensure the image doesn't overflow the circular bounds
  },
  benefitIconImage: {
    width: '100%', // Fill the entire circular container
    height: '100%', // Fill the entire circular container
    borderRadius: 20, // Match the container's border radius
  },
  benefitTextCol: {
    flex: 1,
  },
  benefitTitle: {
    ...TYPOGRAPHY.bodyMedium,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  benefitDescription: {
    ...TYPOGRAPHY.bodySmall,
    marginBottom: SPACING.sm,
  },
  benefitProgressBg: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  benefitProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  benefitDivider: {
    height: 1,
    marginVertical: SPACING.sm,
  },
});

export default AnalyticsScreen; 