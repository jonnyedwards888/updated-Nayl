import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import ExpoSignatureCanvas from './ExpoSignatureCanvas';
import hapticService, { HapticType, HapticIntensity } from '../services/hapticService';

const { width, height } = Dimensions.get('window');

interface CommitmentScreenProps {
  onComplete: () => void;
}

const CommitmentScreen: React.FC<CommitmentScreenProps> = ({ onComplete }) => {
  const [hasSignature, setHasSignature] = useState(false);
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

  // Animation values for sequential entrance
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(-30);
  
  const subtitleOpacity = useSharedValue(0);
  const subtitleTranslateY = useSharedValue(-20);
  
  const listOpacity = useSharedValue(0);
  const listTranslateY = useSharedValue(30);
  
  const signatureOpacity = useSharedValue(0);
  const signatureTranslateY = useSharedValue(30);
  
  const buttonOpacity = useSharedValue(0);
  const buttonTranslateY = useSharedValue(30);

  const signatureRef = useRef<any>(null);

  useEffect(() => {
    // Start the animation sequence
    const startAnimations = () => {
      // 1. Title animation (500ms, no delay)
      titleOpacity.value = withTiming(1, { duration: 500, easing: Easing.out(Easing.cubic) });
      titleTranslateY.value = withTiming(0, { duration: 500, easing: Easing.out(Easing.cubic) });

      // 2. Subtitle animation (300ms delay)
      setTimeout(() => {
        subtitleOpacity.value = withTiming(1, { duration: 500, easing: Easing.out(Easing.cubic) });
        subtitleTranslateY.value = withTiming(0, { duration: 500, easing: Easing.out(Easing.cubic) });
      }, 300);

      // 3. List animation (600ms delay)
      setTimeout(() => {
        listOpacity.value = withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) });
        listTranslateY.value = withTiming(0, { duration: 600, easing: Easing.out(Easing.cubic) });
      }, 600);

      // 4. Signature pad animation (900ms delay)
      setTimeout(() => {
        signatureOpacity.value = withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) });
        signatureTranslateY.value = withTiming(0, { duration: 600, easing: Easing.out(Easing.cubic) });
      }, 900);

      // 5. Button animation (1200ms delay)
      setTimeout(() => {
        buttonOpacity.value = withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) });
        buttonTranslateY.value = withTiming(0, { duration: 600, easing: Easing.out(Easing.cubic) });
      }, 1200);
    };

    // Start animations after a brief delay
    const timer = setTimeout(startAnimations, 100);
    return () => clearTimeout(timer);
  }, []);

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

  const handleSignatureChange = (hasSignature: boolean) => {
    setHasSignature(hasSignature);
  };

  const handleClearSignature = () => {
    if (signatureRef.current?.clearSignature) {
      signatureRef.current.clearSignature();
    }
    setHasSignature(false);
    hapticService.trigger(HapticType.SELECTION, HapticIntensity.SUBTLE);
  };

  const handleCommit = () => {
    if (!hasSignature) {
      Alert.alert('Signature Required', 'Please sign your commitment before continuing.');
      return;
    }

    hapticService.trigger(HapticType.SUCCESS, HapticIntensity.NORMAL);
    
    // Show a brief success message before completing
    Alert.alert(
      'Commitment Made! 🎯',
      'Your journey to healthier nails begins now. Stay strong and remember your commitment!',
      [
        {
          text: 'Let\'s Begin!',
          onPress: onComplete,
        },
      ]
    );
  };

  // Animated styles
  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));

  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
    transform: [{ translateY: subtitleTranslateY.value }],
  }));

  const listStyle = useAnimatedStyle(() => ({
    opacity: listOpacity.value,
    transform: [{ translateY: listTranslateY.value }],
  }));

  const signatureStyle = useAnimatedStyle(() => ({
    opacity: signatureOpacity.value,
    transform: [{ translateY: signatureTranslateY.value }],
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
    transform: [{ translateY: buttonTranslateY.value }],
  }));

  const commitments = [
    "Prioritizing my health and confidence.",
    "Being mindful of my triggers.",
    "Letting go of my old habits.",
    "Becoming the person I want to be.",
  ];

  return (
    <View style={styles.container}>
      {/* Dark Starry Background */}
      <LinearGradient
        colors={['#000000', '#050505', '#0A0A0A', '#0F0F0F', '#1A1A2E']}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      {/* Premium Starfield Background */}
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
        {/* Main Headline */}
        <Animated.View style={[styles.headlineContainer, titleStyle]}>
          <Text style={styles.headline}>
            Let's commit.
          </Text>
        </Animated.View>

        {/* Sub-headline */}
        <Animated.View style={[styles.subheadlineContainer, subtitleStyle]}>
          <Text style={styles.subheadline}>
            From this day onwards, I commit to:
          </Text>
        </Animated.View>

        {/* Commitments List */}
        <Animated.View style={[styles.commitmentsList, listStyle]}>
          {commitments.map((commitment, index) => (
            <View key={index} style={styles.commitmentItem}>
              <View style={styles.commitmentCheckmarkWrapper}>
                <View style={[styles.commitmentCheckmark, { backgroundColor: '#3B82F6' }]}>
                  <Text style={styles.checkmark}>✓</Text>
                </View>
              </View>
              <Text style={styles.commitmentText}>
                {commitment}
              </Text>
            </View>
          ))}
        </Animated.View>

        {/* Signature Pad */}
        <Animated.View style={[styles.signatureContainer, signatureStyle]}>
          <Text style={styles.signatureLabel}>Sign your commitment:</Text>
          
          <View style={styles.signaturePad}>
            <ExpoSignatureCanvas
              ref={signatureRef}
              style={styles.signatureCanvas}
              onSignatureChange={handleSignatureChange}
              strokeWidth={3}
              strokeColor="#FFFFFF"
              backgroundColor="rgba(255, 255, 255, 0.05)"
            />
            
            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleClearSignature}
              activeOpacity={0.7}
            >
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.signatureNote}>
            Your signature is not recorded
          </Text>
        </Animated.View>

        {/* Commit Button */}
        <Animated.View style={[styles.buttonContainer, buttonStyle]}>
          <TouchableOpacity
            style={[
              styles.commitButton,
              !hasSignature && styles.commitButtonDisabled
            ]}
            onPress={handleCommit}
            activeOpacity={0.8}
            disabled={!hasSignature}
          >
            <LinearGradient
              colors={hasSignature ? ['#3B82F6', '#2563EB', '#1D4ED8'] : ['#6B7280', '#4B5563']}
              style={styles.commitButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            >
              <Text style={styles.commitButtonText}>I commit to myself</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  star: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 4,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  headlineContainer: {
    marginBottom: 20,
    maxWidth: width * 0.9,
  },
  headline: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 44,
    letterSpacing: 0.8,
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
  },
  subheadlineContainer: {
    marginBottom: 40,
    maxWidth: width * 0.9,
  },
  subheadline: {
    fontSize: 20,
    fontWeight: '600',
    color: '#E2E8F0',
    textAlign: 'center',
    lineHeight: 26,
    letterSpacing: 0.3,
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  commitmentsList: {
    width: '100%',
    marginBottom: 40,
  },
  commitmentItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  commitmentCheckmarkWrapper: {
    marginRight: 16,
    marginTop: 2,
  },
  commitmentCheckmark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  checkmark: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  commitmentText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    lineHeight: 22,
    letterSpacing: 0.2,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  signatureContainer: {
    width: '100%',
    marginBottom: 40,
    alignItems: 'center',
  },
  signatureLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: 0.3,
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  signaturePad: {
    width: width * 0.85,
    height: 120,
    marginBottom: 12,
    position: 'relative',
  },
  signatureCanvas: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#3B82F6',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  clearButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(59, 130, 246, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  clearButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  signatureNote: {
    fontSize: 14,
    fontWeight: '400',
    color: '#94A3B8',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  commitButton: {
    width: width * 0.85,
    height: 58,
    borderRadius: 29,
    overflow: 'hidden',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 12,
  },
  commitButtonDisabled: {
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  commitButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  commitButtonText: {
    fontSize: 19,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.6,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});

export default CommitmentScreen;
