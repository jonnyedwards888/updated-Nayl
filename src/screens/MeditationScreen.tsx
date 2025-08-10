import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Animated,
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';

const { width, height } = Dimensions.get('window');

// Motivational quotes for nail biting discipline and meditation
const motivationalQuotes = [
  "Remember, you've overcome so much already.",
  "This is just one more step on your journey.",
  "Every moment of resistance builds your strength.",
  "You are stronger than any urge.",
  "Your future self will thank you for this.",
  "Each day without biting is a victory.",
  "You have the power to change your habits.",
  "Breathe through the discomfort.",
  "Your hands are healing, your mind is growing.",
  "This moment of mindfulness will pass.",
  "You are building a better version of yourself.",
  "Trust the process, trust yourself.",
  "Every breath brings you closer to freedom.",
  "You've got this, one breath at a time.",
  "Your determination is inspiring.",
];

interface MeditationScreenProps {
  navigation: any;
}

const MeditationScreen: React.FC<MeditationScreenProps> = ({ navigation }) => {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [showContent, setShowContent] = useState(false);
  const videoRef = useRef<Video>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Cycle through motivational quotes every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prevIndex) => 
        (prevIndex + 1) % motivationalQuotes.length
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleFinishReflecting = () => {
    navigation.goBack();
  };

  const handleVideoLoad = () => {
    console.log('Video loaded successfully');
    setIsVideoLoaded(true);
    setVideoError(null);
    // Show content with smooth fade-in animation
    setTimeout(() => {
      setShowContent(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, 100);
  };

  const handleVideoError = (error: any) => {
    console.error('Video error:', error);
    setVideoError(error?.message || 'Video failed to load');
  };

  // Try to load video with different approach
  const videoSource = require('../../assets/mountain-timelapse.mp4');

  return (
    <SafeAreaView style={styles.container}>
      {/* Fallback background gradient */}
      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f3460']}
        style={styles.fallbackBackground}
      />

      {/* Background Video */}
      <Video
        ref={videoRef}
        source={require('../../assets/meditation-nayl-video.mp4')}
        style={styles.backgroundVideo}
        shouldPlay
        isLooping
        isMuted
        resizeMode={ResizeMode.COVER}
        onLoad={handleVideoLoad}
        onError={handleVideoError}
        useNativeControls={false}
        posterStyle={{ resizeMode: ResizeMode.COVER }}
        posterSource={require('../../assets/meditation-nayl-video.mp4')}
      />

      {/* Dark overlay for better text readability */}
      <View style={styles.overlay} />

      {/* Debug info - remove this later */}
      {videoError && (
        <View style={styles.debugInfo}>
          <Text style={styles.debugText}>Video Error: {videoError}</Text>
        </View>
      )}

      {/* Content Container */}
      <Animated.View style={[
        styles.contentContainer,
        { opacity: fadeAnim }
      ]}>
        {/* Textured Circular Shape - Like QUITTR's with gaps */}
        <View style={styles.circularShape}>
          {/* Base layer - very transparent */}
          <LinearGradient
            colors={['rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0.2)', 'rgba(0, 0, 0, 0.1)']}
            style={styles.circularGradient}
          >
            {/* Multiple texture layers for the lined/gap effect */}
            <LinearGradient
              colors={['transparent', 'rgba(255, 255, 255, 0.08)', 'transparent']}
              style={styles.textureLayer}
            />
            <LinearGradient
              colors={['rgba(0, 0, 0, 0.1)', 'transparent', 'rgba(0, 0, 0, 0.15)']}
              style={styles.textureLayer2}
            />
            <LinearGradient
              colors={['transparent', 'rgba(255, 255, 255, 0.05)', 'transparent', 'rgba(255, 255, 255, 0.03)']}
              style={styles.textureLayer3}
            />
            <LinearGradient
              colors={['rgba(0, 0, 0, 0.05)', 'transparent', 'rgba(0, 0, 0, 0.08)']}
              style={styles.textureLayer4}
            />
            
            {/* Text content */}
            <Text style={styles.reflectText}>REFLECT AND BREATHE</Text>
            <Text style={styles.motivationalText}>
              {motivationalQuotes[currentQuoteIndex]}
            </Text>
          </LinearGradient>
        </View>
      </Animated.View>

      {/* Finish Button - Moved lower and styled like reference */}
      <Animated.View style={[
        styles.buttonContainer,
        { opacity: fadeAnim }
      ]}>
        <TouchableOpacity 
          style={styles.finishButton} 
          onPress={handleFinishReflecting}
          activeOpacity={0.8}
        >
          <Text style={styles.finishButtonText}>Finish Reflecting</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryBackground,
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
    backgroundColor: 'rgba(0, 0, 0, 0.2)', // Reduced from 0.4 for more transparency
  },
  debugInfo: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    zIndex: 10,
  },
  debugText: {
    color: COLORS.primaryText,
    fontSize: TYPOGRAPHY.caption.fontSize,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  circularShape: {
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: (width * 0.8) / 2,
    marginBottom: SPACING.xxxl,
    ...SHADOWS.deep,
  },
  circularGradient: {
    flex: 1,
    borderRadius: (width * 0.8) / 2,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  textureLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    borderRadius: (width * 0.8) / 2,
    opacity: 0.5,
  },
  textureLayer2: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    borderRadius: (width * 0.8) / 2,
    opacity: 0.3,
  },
  textureLayer3: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    borderRadius: (width * 0.8) / 2,
    opacity: 0.2,
  },
  textureLayer4: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    borderRadius: (width * 0.8) / 2,
    opacity: 0.1,
  },
  reflectText: {
    ...TYPOGRAPHY.caption,
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: SPACING.xl,
    textAlign: 'center',
    letterSpacing: 1,
  },
  motivationalText: {
    ...TYPOGRAPHY.headingMedium,
    fontSize: 32, // Increased from 24
    fontWeight: '800', // Increased from 700 for bolder text
    color: COLORS.primaryText,
    textAlign: 'center',
    lineHeight: 36, // Increased from 32 to match larger font
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  finishButton: {
    width: width * 0.6,
    height: 56,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    ...SHADOWS.button,
    backgroundColor: '#FFFFFF', // White background like reference
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  finishButtonText: {
    ...TYPOGRAPHY.buttonText,
    color: '#000000', // Dark text on white background
    fontSize: 18,
    fontWeight: '600',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: SPACING.xl,
    alignSelf: 'center',
    zIndex: 10,
  },
  fallbackBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
  },
});

export default MeditationScreen;