import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import hapticService, { HapticType, HapticIntensity } from '../services/hapticService';

const { width, height } = Dimensions.get('window');

interface OnboardingWelcomeProps {
  onStart: () => void;
  onSkip: () => void;
}

const OnboardingWelcomeClean: React.FC<OnboardingWelcomeProps> = ({ onStart, onSkip }) => {
  const handleStart = () => {
    hapticService.trigger(HapticType.SUCCESS, HapticIntensity.NORMAL);
    onStart();
  };

  const handleSkip = () => {
    hapticService.trigger(HapticType.LIGHT_TAP, HapticIntensity.SUBTLE);
    onSkip();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      {/* Background with starfield */}
      <LinearGradient
        colors={['rgba(4, 11, 37, 0.98)', 'rgba(1, 2, 8, 0.99)', 'rgb(0, 6, 22)']}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />
      
      {/* Subtle Starfield Background */}
      <View style={styles.starfield}>
        {[...Array(30)].map((_, i) => (
          <View
            key={i}
            style={[
              styles.star,
              {
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.4 + 0.1,
              },
            ]}
          />
        ))}
      </View>

      {/* Top Section - Welcome Text */}
      <View style={styles.topSection}>
        <Text style={styles.welcomeTitle}>Welcome</Text>
        <Text style={styles.welcomeSubtitle}>to Nayl</Text>
        <Text style={styles.tagline}>
          Break free from nail biting.{'\n'}Regain control over your life.
        </Text>
      </View>

      {/* Middle Section - Call-to-Action Buttons */}
      <View style={styles.middleSection}>
        <TouchableOpacity style={styles.primaryButton} onPress={handleStart}>
          <LinearGradient
            colors={['rgb(30, 64, 175)', 'rgb(30, 58, 138)', 'rgb(30, 58, 138)']}
            style={styles.primaryButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.primaryButtonText}>Start my journey</Text>
          </LinearGradient>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.secondaryButton} onPress={handleSkip}>
          <Text style={styles.secondaryButtonText}>Login</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Section - Main App Icon */}
      <View style={styles.bottomSection}>
        <Image 
          source={require('../../assets/onboarding-icons/Nayl-cooler-logo.webp')}
          style={styles.appIcon}
          resizeMode="contain"
        />
      </View>
    </View>
  );
};

// CSS-like styling with clear organization
const styles = StyleSheet.create({
  // Layout & Container
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  
  // Background Elements
  background: {
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
    zIndex: -1,
    overflow: 'hidden',
  },
  
  star: {
    position: 'absolute',
    width: 2,
    height: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 1,
    opacity: 0.1,
    transform: [{ scale: 0.5 }],
  },
  
  // Top Section
  topSection: {
    paddingTop: height * 0.12,
    alignItems: 'center',
    marginBottom: height * 0.08,
  },
  
  welcomeTitle: {
    fontSize: 52,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 4,
    letterSpacing: 1.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  
  welcomeSubtitle: {
    fontSize: 52,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 32,
    letterSpacing: 1.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  
  tagline: {
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 28,
    maxWidth: width * 0.85,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  
  // Middle Section
  middleSection: {
    width: '100%',
    alignItems: 'center',
    marginBottom: height * 0.25,
  },
  
  // Primary Button - Now MUCH wider!
  primaryButton: {
    width: width * 0.85, // 75% of screen width - significantly wider!
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#0099FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  
  primaryButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 28,
  },
  
  primaryButtonText: {
    fontSize: 20,
    fontWeight: '500',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
    textAlign: 'center',
  },
  
  // Secondary Button
  secondaryButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.7)',
    textDecorationLine: 'underline',
    letterSpacing: 0.3,
  },
  
  // Bottom Section
  bottomSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  
  appIcon: {
    width: '100%',
    height: height * 0.5,
    resizeMode: 'cover',
  },
});

export default OnboardingWelcomeClean;
