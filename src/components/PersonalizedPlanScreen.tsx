import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import LottieView from 'lottie-react-native';
import hapticService, { HapticType, HapticIntensity } from '../services/hapticService';

const { width, height } = Dimensions.get('window');

interface PersonalizedPlanScreenProps {
  userName?: string;
  onStartJourney: () => void;
}

const PersonalizedPlanScreen: React.FC<PersonalizedPlanScreenProps> = ({
  userName = 'Friend',
  onStartJourney,
}) => {
  // Animation values for scroll-triggered animations
  const headerOpacity = useSharedValue(0);
  const headerTranslateY = useSharedValue(30);
  
  const benefit1Opacity = useSharedValue(0);
  const benefit1TranslateY = useSharedValue(40);
  
  const benefit2Opacity = useSharedValue(0);
  const benefit2TranslateY = useSharedValue(40);
  
  const testimonialOpacity = useSharedValue(0);
  const testimonialTranslateY = useSharedValue(40);
  
  const ctaOpacity = useSharedValue(0);
  const ctaTranslateY = useSharedValue(40);

  // Calculate target date (90 days from now)
  const getTargetDate = () => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 90);
    return targetDate.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Trigger animations when elements come into view
  const triggerAnimation = (element: string) => {
    switch (element) {
      case 'header':
        headerOpacity.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.cubic) });
        headerTranslateY.value = withSpring(0, { damping: 15, stiffness: 100 });
        break;
      case 'benefit1':
        benefit1Opacity.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.cubic) });
        benefit1TranslateY.value = withSpring(0, { damping: 15, stiffness: 100 });
        break;
      case 'benefit2':
        benefit2Opacity.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.cubic) });
        benefit2TranslateY.value = withSpring(0, { damping: 15, stiffness: 100 });
        break;
      case 'testimonial':
        testimonialOpacity.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.cubic) });
        testimonialTranslateY.value = withSpring(0, { damping: 15, stiffness: 100 });
        break;
      case 'cta':
        ctaOpacity.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.cubic) });
        ctaTranslateY.value = withSpring(0, { damping: 15, stiffness: 100 });
        break;
    }
  };

  // Animated styles
  const headerStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: headerTranslateY.value }],
  }));

  const benefit1Style = useAnimatedStyle(() => ({
    opacity: benefit1Opacity.value,
    transform: [{ translateY: benefit1TranslateY.value }],
  }));

  const benefit2Style = useAnimatedStyle(() => ({
    opacity: benefit2Opacity.value,
    transform: [{ translateY: benefit2TranslateY.value }],
  }));

  const testimonialStyle = useAnimatedStyle(() => ({
    opacity: testimonialOpacity.value,
    transform: [{ translateY: testimonialTranslateY.value }],
  }));

  const ctaStyle = useAnimatedStyle(() => ({
    opacity: ctaOpacity.value,
    transform: [{ translateY: ctaTranslateY.value }],
  }));

  // Handle scroll to trigger animations
  const handleScroll = (event: any) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    const screenHeight = height;

    // Trigger animations based on scroll position
    if (scrollY > 50) triggerAnimation('header');
    if (scrollY > 200) triggerAnimation('benefit1');
    if (scrollY > 500) triggerAnimation('benefit2');
    if (scrollY > 800) triggerAnimation('testimonial');
    if (scrollY > 1000) triggerAnimation('cta');
  };

  // Start header animation on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      triggerAnimation('header');
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const handleStartJourney = async () => {
    try {
      await hapticService.trigger(HapticType.SUCCESS, HapticIntensity.NORMAL);
      onStartJourney();
    } catch (error) {
      console.warn('Haptic feedback error:', error);
      onStartJourney();
    }
  };

  return (
    <View style={styles.container}>
      {/* Premium Background Gradient */}
      <LinearGradient
        colors={['#000000', '#050505', '#0A0A0A', '#0F0F0F', '#1A1A2E']}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Header Section */}
        <Animated.View style={[styles.headerSection, headerStyle]}>
          <Text style={styles.personalizedHeadline}>
            {userName}, we've made your custom plan.
          </Text>
          <Text style={styles.targetDateSubheadline}>
            You're on track to quit nail-biting by: {getTargetDate()}
          </Text>
        </Animated.View>

        {/* Benefit Section 1: Break the Cycle */}
        <Animated.View style={[styles.benefitSection, benefit1Style]}>
          <Text style={styles.benefitTitle}>1. Break the Cycle of Habit</Text>
          
          <View style={styles.lottieContainer}>
            <LottieView
              source={require('../../assets/animations/focus-mindfulness.json')}
              autoPlay
              loop
              style={styles.lottieAnimation}
            />
          </View>

          <View style={styles.benefitsList}>
            <View style={styles.benefitItem}>
              <View style={styles.bulletPoint} />
              <Text style={styles.benefitText}>Build unbreakable self-control</Text>
            </View>
            <View style={styles.benefitItem}>
              <View style={styles.bulletPoint} />
              <Text style={styles.benefitText}>Become more aware of your triggers</Text>
            </View>
            <View style={styles.benefitItem}>
              <View style={styles.bulletPoint} />
              <Text style={styles.benefitText}>Rewire your brain to prefer healthier habits</Text>
            </View>
          </View>
        </Animated.View>

        {/* Benefit Section 2: Rebuild & Restore */}
        <Animated.View style={[styles.benefitSection, benefit2Style]}>
          <Text style={styles.benefitTitle}>2. Restore Your Nail Health</Text>
          
          <View style={styles.lottieContainer}>
            <LottieView
              source={require('../../assets/animations/health-transformation.json')}
              autoPlay
              loop
              style={styles.lottieAnimation}
            />
          </View>

          <View style={styles.benefitsList}>
            <View style={styles.benefitItem}>
              <View style={styles.bulletPoint} />
              <Text style={styles.benefitText}>Allow nails and skin to heal and recover</Text>
            </View>
            <View style={styles.benefitItem}>
              <View style={styles.bulletPoint} />
              <Text style={styles.benefitText}>Prevent damage to your teeth and gums</Text>
            </View>
            <View style={styles.benefitItem}>
              <View style={styles.bulletPoint} />
              <Text style={styles.benefitText}>Reduce your risk of infections</Text>
            </View>
          </View>
        </Animated.View>

        {/* Social Proof Section */}
        <Animated.View style={[styles.testimonialSection, testimonialStyle]}>
          <Text style={styles.testimonialTitle}>Real Results from Real People</Text>
          <View style={styles.testimonialCard}>
            <Text style={styles.testimonialText}>
              "I've been biting my nails for 20 years and thought I'd never stop. Nayl's tools and community helped me finally quit for good."
            </Text>
            <Text style={styles.testimonialAuthor}>- Jessica P. (28F)</Text>
          </View>
        </Animated.View>

        {/* Final Call-to-Action */}
        <Animated.View style={[styles.ctaSection, ctaStyle]}>
          <TouchableOpacity
            style={styles.startJourneyButton}
            onPress={handleStartJourney}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#3B82F6', '#2563EB', '#1D4ED8']}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            >
              <Text style={styles.buttonText}>Start My Journey</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 60,
  },
  personalizedHeadline: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 40,
    letterSpacing: 0.8,
    marginBottom: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
  },
  targetDateSubheadline: {
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
  benefitSection: {
    marginBottom: 60,
    alignItems: 'center',
  },
  benefitTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 36,
    letterSpacing: 0.6,
    marginBottom: 32,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  lottieContainer: {
    width: 200,
    height: 200,
    marginBottom: 32,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  lottieAnimation: {
    width: '100%',
    height: '100%',
  },
  benefitsList: {
    width: '100%',
    maxWidth: 320,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  bulletPoint: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3B82F6',
    marginRight: 16,
    marginTop: 8,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 4,
  },
  benefitText: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: '#FFFFFF',
    lineHeight: 24,
    letterSpacing: 0.2,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  testimonialSection: {
    marginBottom: 60,
    alignItems: 'center',
  },
  testimonialTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 30,
    letterSpacing: 0.4,
    marginBottom: 24,
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  testimonialCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  testimonialText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    lineHeight: 22,
    letterSpacing: 0.2,
    textAlign: 'center',
    marginBottom: 16,
    fontStyle: 'italic',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  testimonialAuthor: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94A3B8',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  ctaSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  startJourneyButton: {
    width: width * 0.85,
    height: 64,
    borderRadius: 32,
    overflow: 'hidden',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.6,
    shadowRadius: 24,
    elevation: 16,
  },
  buttonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.8,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  bottomSpacing: {
    height: 40,
  },
});

export default PersonalizedPlanScreen;
