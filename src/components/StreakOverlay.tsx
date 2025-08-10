import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
  Image,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../constants/theme';
import { typography } from '../constants/typography';

const { width, height } = Dimensions.get('window');

interface StreakOverlayProps {
  visible: boolean;
  onClose: () => void;
  consecutiveDays: number;
  elapsedSeconds: number;
}

const StreakOverlay: React.FC<StreakOverlayProps> = ({
  visible,
  onClose,
  consecutiveDays,
  elapsedSeconds,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const flameScaleAnim = useRef(new Animated.Value(0.5)).current;
  const textFadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Animate in
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.spring(flameScaleAnim, {
          toValue: 1,
          tension: 80,
          friction: 10,
          useNativeDriver: true,
        }),
        Animated.timing(textFadeAnim, {
          toValue: 1,
          duration: 600,
          delay: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Animate out
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(flameScaleAnim, {
          toValue: 0.5,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(textFadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const formatTime = (totalSeconds: number) => {
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const getStreakMessage = (days: number) => {
    if (days === 0) return "Start your journey today!";
    if (days === 1) return "First day down! You're building momentum.";
    if (days < 7) return "You're in the early stages. Keep going!";
    if (days < 30) return "You're building a solid foundation!";
    if (days < 100) return "You're becoming unstoppable!";
    return "You're absolutely incredible! A true inspiration!";
  };

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        {/* Background with premium dark depth and wave ripples */}
        <LinearGradient
          colors={['rgba(2, 4, 12, 0.98)', 'rgba(1, 2, 8, 0.99)', 'rgba(0, 1, 4, 1)']}
          style={styles.backgroundGradient}
        >
          {/* Subtle starfield */}
          {Array.from({ length: 20 }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.star,
                {
                  left: Math.random() * width,
                  top: Math.random() * height,
                  opacity: Math.random() * 0.2 + 0.05,
                },
              ]}
            />
          ))}
          
          {/* Wave-style background ripples */}
          {Array.from({ length: 8 }).map((_, i) => (
            <View
              key={`wave-${i}`}
              style={[
                styles.waveRipple,
                {
                  left: -100 + (i * 50),
                  top: -50 + (i * 30),
                  opacity: 0.03 + (i * 0.005),
                  transform: [{ rotate: `${i * 15}deg` }],
                },
              ]}
            />
          ))}
          
          {/* Additional depth layers */}
          <View style={styles.depthLayer1} />
          <View style={styles.depthLayer2} />
        </LinearGradient>

        {/* Close button */}
        <TouchableOpacity
          style={styles.closeButton}
          onPress={onClose}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.05)']}
            style={styles.closeButtonGradient}
          >
            <Ionicons name="close" size={24} color={COLORS.primaryText} />
          </LinearGradient>
        </TouchableOpacity>

        {/* Main content */}
        <Animated.View
          style={[
            styles.contentContainer,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Streak title */}
          <Animated.View style={[styles.titleContainer, { opacity: textFadeAnim }]}>
            <Text style={styles.streakTitle}>
              {consecutiveDays} Day{consecutiveDays !== 1 ? 's' : ''} Streak
            </Text>
            <Text style={styles.streakSubtitle}>
              {getStreakMessage(consecutiveDays)}
            </Text>
          </Animated.View>

          {/* Large flame icon */}
          <Animated.View
            style={[
              styles.flameContainer,
              {
                transform: [{ scale: flameScaleAnim }],
              },
            ]}
          >
            <LinearGradient
              colors={['rgba(255, 165, 0, 0.25)', 'rgba(255, 69, 0, 0.15)', 'rgba(255, 20, 0, 0.08)']}
              style={styles.flameGlow}
            />
            <Image
              source={require('../../assets/new-flame-icon.webp')}
              style={styles.largeFlameIcon}
              resizeMode="contain"
            />
          </Animated.View>

          {/* Time display */}
          <Animated.View style={[styles.timeContainer, { opacity: textFadeAnim }]}>
            <Text style={styles.timeLabel}>You've been nail-biting free for:</Text>
            <Text style={styles.timeDisplay}>{formatTime(elapsedSeconds)}</Text>
          </Animated.View>

          {/* Progress indicator */}
          <Animated.View style={[styles.progressContainer, { opacity: textFadeAnim }]}>
            <View style={styles.progressBar}>
              <LinearGradient
                colors={['#FFD700', '#FFA500', '#FF6347']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[
                  styles.progressFill,
                  { width: `${Math.min((consecutiveDays / 7) * 100, 100)}%` },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {consecutiveDays}/7 days this week
            </Text>
          </Animated.View>

          {/* Motivational quote */}
          <Animated.View style={[styles.quoteContainer, { opacity: textFadeAnim }]}>
            <Text style={styles.quoteText}>
              "Every day you don't bite is a victory. Every streak you build is strength."
            </Text>
          </Animated.View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  star: {
    position: 'absolute',
    width: 2,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 1,
  },
  waveRipple: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    backgroundColor: 'transparent',
  },
  depthLayer1: {
    position: 'absolute',
    top: '20%',
    left: '10%',
    right: '10%',
    height: 200,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 100,
    transform: [{ rotate: '15deg' }],
  },
  depthLayer2: {
    position: 'absolute',
    bottom: '15%',
    left: '15%',
    right: '15%',
    height: 150,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 75,
    transform: [{ rotate: '-10deg' }],
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 10,
  },
  closeButtonGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    ...SHADOWS.deep,
  },
  contentContainer: {
    alignItems: 'center',
    paddingHorizontal: 32,
    maxWidth: width * 0.9,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  streakTitle: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FFD700',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(255, 215, 0, 0.8)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 12,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 4,
  },
  streakSubtitle: {
    fontSize: 16,
    color: COLORS.primaryText,
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: 22,
  },
  flameContainer: {
    position: 'relative',
    marginBottom: 32,
  },
  flameGlow: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    top: -20,
    left: -20,
  },
  largeFlameIcon: {
    width: 160,
    height: 160,
  },
  timeContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  timeLabel: {
    fontSize: 16,
    color: COLORS.secondaryText,
    marginBottom: 12,
    textAlign: 'center',
  },
  timeDisplay: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.primaryText,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  progressContainer: {
    alignItems: 'center',
    marginBottom: 32,
    width: '100%',
  },
  progressBar: {
    width: '100%',
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 4,
  },
  progressText: {
    fontSize: 14,
    color: COLORS.secondaryText,
    textAlign: 'center',
  },
  quoteContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  quoteText: {
    fontSize: 16,
    color: COLORS.primaryText,
    textAlign: 'center',
    fontStyle: 'italic',
    opacity: 0.8,
    lineHeight: 24,
  },
});

export default StreakOverlay;
