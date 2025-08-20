import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import hapticService, { HapticType, HapticIntensity } from '../services/hapticService';

const { width, height } = Dimensions.get('window');

interface OnboardingSlideProps {
  onStartTrial: () => void;
}

const OnboardingSlide: React.FC<OnboardingSlideProps> = ({ onStartTrial }) => {
  // Handle start trial with haptic feedback
  const handleStartTrial = async () => {
    try {
      // Success haptic feedback for starting trial
      await hapticService.trigger(HapticType.SUCCESS, HapticIntensity.NORMAL);
      onStartTrial();
    } catch (error) {
      console.warn('Haptic feedback failed:', error);
      // Still proceed with trial start even if haptics fail
      onStartTrial();
    }
  };

  return (
    <View style={styles.container}>
      {/* Background Gradient */}
      <LinearGradient
        colors={['#000000', '#050505', '#0A0A0A', '#0F0F0F']}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        locations={[0, 0.3, 0.7, 1]}
      />
      
      {/* Premium Starfield Effect */}
      <View style={styles.starfield}>
        {Array.from({ length: 50 }, (_, i) => (
          <View
            key={i}
            style={[
              styles.star,
              {
                left: Math.random() * 400,
                top: Math.random() * 800,
                opacity: Math.random() * 0.4 + 0.1,
                width: Math.random() * 1.5 + 0.5,
                height: Math.random() * 1.5 + 0.5,
              }
            ]}
          />
        ))}
      </View>

      {/* Content Container */}
      <View style={styles.content}>
        {/* Top Section - Title and Tagline */}
        <View style={styles.headerSection}>
          <Text style={styles.title}>
            Unlock{' '}
            <Text style={styles.highlightedText}>Nayl</Text>
            {' '}and quit nailbiting for good.
          </Text>
          <Text style={styles.subtitle}>
            Designed by ex nail biters, helping you take back control.
          </Text>
        </View>

        {/* Middle Section - Features List */}
        <View style={styles.featuresSection}>
          {/* Feature 1 - Progress Tracking */}
          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Image 
                source={require('../../assets/onboarding-icons/progress-icon-duotone.png')}
                style={styles.iconImage}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.featureText}>
              Visualise and track your progress.
            </Text>
          </View>

          {/* Feature 2 - Journaling */}
          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Image 
                source={require('../../assets/onboarding-icons/diary-icon-duotone.png')}
                style={styles.iconImage}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.featureText}>
              Journal and understand your triggers.
            </Text>
          </View>

          {/* Feature 3 - Panic Button */}
          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Image 
                source={require('../../assets/onboarding-icons/panic-button-icon-duotone.png')}
                style={styles.iconImage}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.featureText}>
              Get instant help with the panic button.
            </Text>
          </View>
        </View>

        {/* Bottom Section - Call to Action */}
        <View style={styles.ctaSection}>
          {/* Payment Assurance */}
          <View style={styles.paymentAssurance}>
            <View style={styles.checkmarkIcon}>
              <Text style={styles.checkmarkText}>✓</Text>
            </View>
            <Text style={styles.assuranceText}>
              No Payment Due Now. Cancel Anytime
            </Text>
          </View>

          {/* Start Trial Button */}
          <TouchableOpacity style={styles.startTrialButton} onPress={handleStartTrial}>
            <Text style={styles.buttonText}>Start Free Trial</Text>
          </TouchableOpacity>

          {/* Pricing Details */}
          <Text style={styles.pricingText}>
            3 days free trial then £5.99/month
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  backgroundGradient: {
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
    zIndex: 1,
  },
  star: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 1,
    shadowColor: 'rgba(255, 255, 255, 0.6)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40,
    justifyContent: 'space-between',
    zIndex: 2,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 40,
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  highlightedText: {
    color: '#C1FF72', // Bright green color for "Nayl"
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '400',
    maxWidth: 280,
  },
  featuresSection: {
    flex: 1,
    justifyContent: 'center',
    gap: 32,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  featureIcon: {
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    shadowColor: 'rgba(193, 255, 114, 0.2)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  iconImage: {
    width: 32,
    height: 32,
  },
  featureText: {
    flex: 1,
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '500',
    lineHeight: 24,
  },
  ctaSection: {
    alignItems: 'center',
    gap: 20,
  },
  paymentAssurance: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  checkmarkIcon: {
    width: 20,
    height: 20,
    backgroundColor: '#00FF00',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: 'bold',
  },
  assuranceText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  startTrialButton: {
    backgroundColor: '#8A2BE2', // Purple button
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 16,
    minWidth: 200,
    alignItems: 'center',
    shadowColor: '#8A2BE2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  pricingText: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.8,
    textAlign: 'center',
    fontWeight: '400',
  },
});

export default OnboardingSlide;
