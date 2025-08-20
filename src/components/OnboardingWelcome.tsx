import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  Image,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import hapticService, { HapticType, HapticIntensity } from '../services/hapticService';

const { width, height } = Dimensions.get('window');

interface OnboardingWelcomeProps {
  onStart: () => void;
  onLogin: () => void;
  isEmbedded?: boolean;
  isVisible?: boolean;
}

const OnboardingWelcome: React.FC<OnboardingWelcomeProps> = ({ onStart, onLogin, isEmbedded = false, isVisible = true }) => {
  // Animation values for staggered loading sequence
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(-30);
  const taglineOpacity = useSharedValue(0);
  const taglineTranslateY = useSharedValue(20);
  const buttonsOpacity = useSharedValue(0);
  const buttonsTranslateY = useSharedValue(20);
  const nailOpacity = useSharedValue(0);
  const nailScale = useSharedValue(0.95);
  const nailTranslateY = useSharedValue(100);

  // Exit animation values for smooth transition
  const exitOpacity = useSharedValue(1);
  const exitTranslateX = useSharedValue(0);
  const isExiting = useSharedValue(false);

  // Button press animation
  const buttonScale = useSharedValue(1);

  // Premium starfield system
  const [starPositions, setStarPositions] = useState(() => 
    Array.from({ length: 50 }, () => ({
      x: Math.random() * width * 2,
      y: Math.random() * height,
      opacity: Math.random() * 0.6 + 0.2,
      speed: Math.random() * 0.08 + 0.02,
      directionX: (Math.random() - 0.5) * 1.2,
      directionY: (Math.random() - 0.5) * 1.2,
      size: Math.random() * 1.8 + 0.8,
    }))
  );

  // Start animations when component mounts or becomes visible
  useEffect(() => {
    if (isVisible) {
      // Reset animation values
      titleOpacity.value = 0;
      titleTranslateY.value = -30;
      taglineOpacity.value = 0;
      taglineTranslateY.value = 20;
      buttonsOpacity.value = 0;
      buttonsTranslateY.value = 20;
      nailOpacity.value = 0;
      nailScale.value = 0.95;
      nailTranslateY.value = 100;

      // Start animations with delays
      nailOpacity.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.cubic) });
      nailScale.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.cubic) });
      nailTranslateY.value = withTiming(0, { duration: 800, easing: Easing.out(Easing.cubic) });

      titleOpacity.value = withDelay(400, withTiming(1, { duration: 700, easing: Easing.out(Easing.cubic) }));
      titleTranslateY.value = withDelay(400, withTiming(0, { duration: 700, easing: Easing.out(Easing.cubic) }));

      taglineOpacity.value = withDelay(600, withTiming(1, { duration: 700, easing: Easing.out(Easing.cubic) }));
      taglineTranslateY.value = withDelay(600, withTiming(0, { duration: 700, easing: Easing.out(Easing.cubic) }));

      buttonsOpacity.value = withDelay(800, withTiming(1, { duration: 700, easing: Easing.out(Easing.cubic) }));
      buttonsTranslateY.value = withDelay(800, withTiming(0, { duration: 700, easing: Easing.out(Easing.cubic) }));
    }
  }, [isVisible]);

  // Animate starfield
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
    }, 50);

    return () => {
      clearInterval(starfieldInterval);
    };
  }, []);

  const handleStart = () => {
    hapticService.trigger(HapticType.ACHIEVEMENT, HapticIntensity.PROMINENT);
    
    if (!isEmbedded) {
      isExiting.value = true;
      exitOpacity.value = withTiming(0, { duration: 400, easing: Easing.out(Easing.cubic) });
      exitTranslateX.value = withTiming(-width, { duration: 400, easing: Easing.out(Easing.cubic) });
      
      setTimeout(() => {
        onStart();
      }, 400);
    } else {
      onStart();
    }
  };

  const handleStartPressIn = () => {
    buttonScale.value = withTiming(0.95, { duration: 100, easing: Easing.out(Easing.cubic) });
  };

  const handleStartPressOut = () => {
    buttonScale.value = withTiming(1, { duration: 100, easing: Easing.out(Easing.cubic) });
  };

  const handleLogin = () => {
    hapticService.trigger(HapticType.LIGHT_TAP, HapticIntensity.SUBTLE);
    onLogin();
  };

  const handleLoginPressIn = () => {
    buttonScale.value = withTiming(0.98, { duration: 100, easing: Easing.out(Easing.cubic) });
  };

  const handleLoginPressOut = () => {
    buttonScale.value = withTiming(1, { duration: 100, easing: Easing.out(Easing.cubic) });
  };

  // Simple animated styles - just like the working second page
  const titleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));

  const taglineAnimatedStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
    transform: [{ translateY: taglineTranslateY.value }],
  }));

  const buttonsAnimatedStyle = useAnimatedStyle(() => ({
    opacity: buttonsOpacity.value,
    transform: [{ translateY: buttonsTranslateY.value }],
  }));

  const nailAnimatedStyle = useAnimatedStyle(() => ({
    opacity: nailOpacity.value,
    transform: [{ scale: nailScale.value }, { translateY: nailTranslateY.value }],
  }));

  const exitAnimatedStyle = useAnimatedStyle(() => ({
    opacity: exitOpacity.value,
    transform: [{ translateX: exitTranslateX.value }],
  }));

  const buttonPressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  return (
    <Animated.View style={[
      styles.container, 
      isEmbedded && styles.containerEmbedded,
      exitAnimatedStyle
    ]}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Starfield Background */}
      {!isEmbedded && starPositions.map((star, index) => (
        <Animated.View
          key={index}
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
      
      {/* Main Content Section */}
      <View style={styles.contentSection}>
        {/* App Title */}
        <Animated.Text style={[
          styles.appTitle, 
          titleAnimatedStyle
        ]}>Nayl</Animated.Text>
        
        {/* Tagline */}
        <Animated.Text style={[
          styles.tagline, 
          taglineAnimatedStyle
        ]}>Save your nails and reclaim control with Nayl.</Animated.Text>
        
        {/* Start Journey Button */}
        <Animated.View style={buttonsAnimatedStyle}>
          <Animated.View style={buttonPressStyle}>
            <TouchableOpacity 
              style={styles.startButton} 
              onPress={handleStart}
              onPressIn={handleStartPressIn}
              onPressOut={handleStartPressOut}
              activeOpacity={1}
            >
              <LinearGradient
                colors={['#7C3AED', '#EC4899']}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.buttonText}>Start my journey</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
        
        {/* Login Link */}
        <Animated.View style={buttonsAnimatedStyle}>
          <Animated.View style={buttonPressStyle}>
            <TouchableOpacity 
              onPress={handleLogin}
              onPressIn={handleLoginPressIn}
              onPressOut={handleLoginPressOut}
              activeOpacity={1}
            >
              <Text style={styles.loginLink}>Login</Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </View>
      
      {/* Bottom Image Section */}
      <View style={styles.imageSection}>
        <Animated.Image
          source={require('../../assets/cosmic-nail-nobg.webp')}
          style={[
            styles.bottomImage, 
            nailAnimatedStyle
          ]}
          resizeMode="contain"
        />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A', // Dark background
  },
  containerEmbedded: {
    backgroundColor: 'transparent', // Remove background when embedded in PagerView
  },
  
  contentSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 60,
  },
  
  appTitle: {
    fontSize: 72, // Much bigger header
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  
  tagline: {
    fontSize: 22, // Slightly bigger subtext
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 48,
    lineHeight: 28,
    opacity: 0.9,
  },
  
  startButton: {
    width: width * 0.85, // Wide button with small margins
    height: 56,
    borderRadius: 28,
    marginBottom: 24,
    overflow: 'hidden',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  
  buttonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 28,
  },
  
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  
  loginLink: {
    fontSize: 16,
    color: '#FFFFFF',
    textDecorationLine: 'underline',
    opacity: 0.8,
  },
  
  imageSection: {
    height: height * 0.4, // Take up bottom 40% of screen
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
  },
  
  bottomImage: {
    width: '100%',
    height: '100%',
    maxWidth: width * 0.8,
  },
  
  // Premium Starfield Styles
  star: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
    elevation: 2,
  },
});

export default OnboardingWelcome;
