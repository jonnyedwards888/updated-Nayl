import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

interface PersonalizingScreenProps {
  userName: string;
  onComplete: () => void;
}

const PersonalizingScreen: React.FC<PersonalizingScreenProps> = ({ userName, onComplete }) => {
  const [showPersonalizedMessage, setShowPersonalizedMessage] = useState(false);
  const [currentPercentage, setCurrentPercentage] = useState(0);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const percentageAnim = useSharedValue(0);
  const textOpacity = useSharedValue(1);
  const textTranslateY = useSharedValue(0);
  const personalizedMessageOpacity = useSharedValue(0);
  const personalizedMessageTranslateY = useSharedValue(20);

  // Sequence of messages that will be displayed
  const messages = [
    "Personalizing...",
    "Evaluating your answers...",
    "Crafting the perfect plan...",
    "Optimizing your AI Coach..."
  ];

  // Premium starfield system matching main app
  const [starPositions, setStarPositions] = useState(() => 
    Array.from({ length: 50 }, () => ({
      x: Math.random() * width * 2,
      y: Math.random() * height,
      opacity: Math.random() * 0.6 + 0.2, // More subtle opacity range
      speed: Math.random() * 0.08 + 0.02, // Slower, more elegant movement
      directionX: (Math.random() - 0.5) * 1.2,
      directionY: (Math.random() - 0.5) * 1.2,
      size: Math.random() * 1.8 + 0.8, // Varied sizes for depth
    }))
  );

  // Function to change message with animation
  const changeMessage = (newIndex: number) => {
    // Fade out current message
    textOpacity.value = withTiming(0, {
      duration: 300,
      easing: Easing.out(Easing.cubic),
    }, () => {
      // Update message index
      runOnJS(setCurrentMessageIndex)(newIndex);
      
      // Slide up and fade in new message
      textTranslateY.value = 20;
      textOpacity.value = withTiming(1, {
        duration: 400,
        easing: Easing.out(Easing.cubic),
      });
      textTranslateY.value = withTiming(0, {
        duration: 400,
        easing: Easing.out(Easing.cubic),
      });
    });
  };

  useEffect(() => {
    // Start the percentage animation
    percentageAnim.value = withTiming(100, {
      duration: 8000, // Increased to 8 seconds for more premium, deliberate feel
      easing: Easing.out(Easing.cubic),
    }, (finished) => {
      if (finished) {
        // When animation completes, show personalized message
        runOnJS(setShowPersonalizedMessage)(true);
        
        // Animate the personalized message in
        personalizedMessageOpacity.value = withTiming(1, {
          duration: 800,
          easing: Easing.out(Easing.cubic),
        });
        personalizedMessageTranslateY.value = withTiming(0, {
          duration: 800,
          easing: Easing.out(Easing.cubic),
        });
      }
    });

    // Update percentage display every 30ms for smooth counting effect
    const percentageInterval = setInterval(() => {
      const currentPercent = Math.round(percentageAnim.value);
      setCurrentPercentage(currentPercent);
      
      // Change messages at specific percentage thresholds - synchronized with 8-second duration
      if (currentPercent >= 25 && currentMessageIndex === 0) {
        changeMessage(1);
      } else if (currentPercent >= 50 && currentMessageIndex === 1) {
        changeMessage(2);
      } else if (currentPercent >= 75 && currentMessageIndex === 2) {
        changeMessage(3);
      }
    }, 30);

    return () => clearInterval(percentageInterval);
  }, [currentMessageIndex]);

  useEffect(() => {
    // Animate starfield with smooth, continuous movement
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

    return () => clearInterval(starfieldInterval);
  }, []);

  // Animated style for the current message
  const messageStyle = useAnimatedStyle(() => ({
    opacity: showPersonalizedMessage ? 0 : textOpacity.value, // Hide when showing final message
    transform: [{ translateY: textTranslateY.value }],
  }));

  // Animated style for the personalized message
  const personalizedMessageStyle = useAnimatedStyle(() => ({
    opacity: personalizedMessageOpacity.value,
    transform: [{ translateY: personalizedMessageTranslateY.value }],
  }));

  // Animated style for the percentage number
  const percentageStyle = useAnimatedStyle(() => ({
    opacity: showPersonalizedMessage ? 0 : 1, // Hide when showing final message
    transform: [{ scale: 1 + (percentageAnim.value / 100) * 0.1 }],
  }));

  return (
    <View style={styles.container}>
      {/* Dark Starry Background */}
      <LinearGradient
        colors={['#000000', '#050505', '#0A0A0A', '#0F0F0F']}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      {/* Premium Starfield Background - matching first onboarding page */}
      {starPositions.map((star, index) => (
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

      {/* Center Content */}
      <View style={styles.content}>
        {/* Animated Message Text */}
        <Animated.Text style={[styles.loadingText, messageStyle]}>
          {messages[currentMessageIndex]}
        </Animated.Text>

        {/* Percentage Number */}
        <Animated.Text style={[styles.percentageText, percentageStyle]}>
          {currentPercentage}%
        </Animated.Text>

        {/* Personalized Message */}
        <Animated.View style={[styles.personalizedMessageContainer, personalizedMessageStyle]}>
          <Text style={styles.personalizedMessage}>
            {userName}, your assessment is complete
          </Text>
          <Text style={styles.personalizedSubtitle}>
            Some good news...
          </Text>
          <Text style={styles.personalizedSubtitle}>
            Some not so great news...
          </Text>
          
          {/* Continue Button */}
          <TouchableOpacity
            style={styles.continueButton}
            onPress={onComplete}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#3B82F6', '#1E40AF']}
              style={styles.continueButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Nail Icon at Bottom - matching first onboarding page */}
      <View style={styles.nailIconContainer}>
        <Image
          source={require('../../assets/cosmic-nail-nobg.webp')}
          style={styles.nailIcon}
          resizeMode="contain"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A', // Matching first onboarding page
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  // Premium Starfield Styles - matching first onboarding page
  star: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
    elevation: 2,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  loadingText: {
    fontSize: 20,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 40,
    letterSpacing: 0.5,
  },
  percentageText: {
    fontSize: 72,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: -2,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  personalizedMessageContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    maxWidth: width * 0.8,
  },
  personalizedMessage: {
    fontSize: 40, // Much larger - matching the image
    fontWeight: '700', // Bolder for more impact
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 44, // Better line height for larger text
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    marginBottom: 8, // Space between main message and subtitles
  },
  personalizedSubtitle: {
    fontSize: 22, // Larger subtitle text
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.8)', // More visible
    textAlign: 'center',
    marginTop: 8, // Reduced spacing
    letterSpacing: 0.3,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  continueButton: {
    marginTop: 40, // More space above button
    width: width * 0.7, // Wider button
    height: 56, // Taller button
    borderRadius: 28, // More rounded corners
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden', // For gradient
  },
  continueButtonGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 28,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 20, // Larger button text
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  nailIconContainer: {
    height: height * 0.4, // Take up bottom 40% of screen - matching first onboarding page
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
  },
  nailIcon: {
    width: '100%',
    height: '100%',
    maxWidth: width * 0.8,
    opacity: 0.8,
  },
});

export default PersonalizingScreen;
