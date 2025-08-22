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
      
      {/* Subtle Floating Stars (same as PersonalizedPlanScreen) */}
      <View style={styles.starsContainer}>
        <View style={[styles.star, styles.star1]} />
        <View style={[styles.star, styles.star2]} />
        <View style={[styles.star, styles.star3]} />
        <View style={[styles.star, styles.star4]} />
        <View style={[styles.star, styles.star5]} />
        <View style={[styles.star, styles.star6]} />
        <View style={[styles.star, styles.star7]} />
        <View style={[styles.star, styles.star8]} />
        <View style={[styles.star, styles.star9]} />
        <View style={[styles.star, styles.star10]} />
        <View style={[styles.star, styles.star11]} />
        <View style={[styles.star, styles.star12]} />
        <View style={[styles.star, styles.star13]} />
        <View style={[styles.star, styles.star14]} />
        <View style={[styles.star, styles.star15]} />
        <View style={[styles.star, styles.star16]} />
        <View style={[styles.star, styles.star17]} />
        <View style={[styles.star, styles.star18]} />
        <View style={[styles.star, styles.star19]} />
        <View style={[styles.star, styles.star20]} />
        <View style={[styles.star, styles.star21]} />
        <View style={[styles.star, styles.star22]} />
        <View style={[styles.star, styles.star23]} />
        <View style={[styles.star, styles.star24]} />
        <View style={[styles.star, styles.star25]} />
        <View style={[styles.star, styles.star26]} />
        <View style={[styles.star, styles.star27]} />
        <View style={[styles.star, styles.star28]} />
        <View style={[styles.star, styles.star29]} />
        <View style={[styles.star, styles.star30]} />
        <View style={[styles.star, styles.star31]} />
        <View style={[styles.star, styles.star32]} />
        <View style={[styles.star, styles.star33]} />
        <View style={[styles.star, styles.star34]} />
        <View style={[styles.star, styles.star35]} />
        <View style={[styles.star, styles.star36]} />
        <View style={[styles.star, styles.star37]} />
        <View style={[styles.star, styles.star38]} />
        <View style={[styles.star, styles.star39]} />
        <View style={[styles.star, styles.star40]} />
        <View style={[styles.star, styles.star41]} />
        <View style={[styles.star, styles.star42]} />
        <View style={[styles.star, styles.star43]} />
        <View style={[styles.star, styles.star44]} />
        <View style={[styles.star, styles.star45]} />
        <View style={[styles.star, styles.star46]} />
        <View style={[styles.star, styles.star47]} />
        <View style={[styles.star, styles.star48]} />
        <View style={[styles.star, styles.star49]} />
        <View style={[styles.star, styles.star50]} />
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
    width: 1.5, // Much smaller for subtlety
    height: 1.5, // Much smaller for subtlety
    borderRadius: 0.75, // Smaller radius
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4, // Very subtle
    shadowRadius: 1, // Minimal shadow
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
  starsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    pointerEvents: 'none',
  },
  
  // Star size variations for depth
  starSmall: {
    width: 1,
    height: 1,
    borderRadius: 0.5,
    opacity: 0.3,
  },
  starMedium: {
    width: 2,
    height: 2,
    borderRadius: 1,
    opacity: 0.5,
  },
  starLarge: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    opacity: 0.7,
  },
  star1: {
    top: '15%',
    left: '20%',
    opacity: 0.4, // Much more subtle
    backgroundColor: 'rgba(147, 51, 234, 0.8)', // More transparent
    shadowColor: '#9333EA',
    width: 1.5, // Slightly smaller for depth
    height: 1.5,
    borderRadius: 0.75,
  },
  star2: {
    top: '25%',
    right: '30%',
    opacity: 0.6, // More subtle
    backgroundColor: 'rgba(59, 130, 246, 0.7)', // More transparent
    shadowColor: '#3B82F6',
    width: 2.5, // Slightly larger for depth
    height: 2.5,
    borderRadius: 1.25,
  },
  star3: {
    top: '40%',
    left: '10%',
    opacity: 0.3, // Very subtle
    backgroundColor: 'rgba(139, 92, 246, 0.6)', // More transparent
    shadowColor: '#8B5CF6',
    width: 1, // Smallest for depth
    height: 1,
    borderRadius: 0.5,
  },
  star4: {
    top: '60%',
    right: '15%',
    opacity: 0.5, // Subtle
    backgroundColor: 'rgba(96, 165, 250, 0.7)', // More transparent
    shadowColor: '#60A5FA',
    width: 2, // Medium for depth
    height: 2,
    borderRadius: 1,
  },
  star5: {
    top: '75%',
    left: '40%',
    opacity: 0.7, // Slightly more visible
    backgroundColor: 'rgba(168, 85, 247, 0.8)', // More transparent
    shadowColor: '#A855F7',
    width: 3, // Larger for depth
    height: 3,
    borderRadius: 1.5,
  },
  star6: {
    top: '85%',
    right: '25%',
    opacity: 0.7,
    backgroundColor: 'rgba(59, 130, 246, 1.0)',
    shadowColor: '#3B82F6',
  },
  star7: {
    top: '35%',
    left: '70%',
    opacity: 0.8,
    backgroundColor: 'rgba(147, 51, 234, 1.0)',
    shadowColor: '#9333EA',
  },
  star8: {
    top: '50%',
    right: '60%',
    opacity: 0.6,
    backgroundColor: 'rgba(139, 92, 246, 1.0)',
    shadowColor: '#8B5CF6',
  },
  star9: {
    top: '20%',
    left: '50%',
    opacity: 0.9,
    backgroundColor: 'rgba(96, 165, 250, 1.0)',
    shadowColor: '#60A5FA',
  },
  star10: {
    top: '70%',
    left: '80%',
    opacity: 0.7,
    backgroundColor: 'rgba(168, 85, 247, 1.0)',
    shadowColor: '#A855F7',
  },
  star11: {
    top: '30%',
    left: '85%',
    opacity: 0.8,
    backgroundColor: 'rgba(59, 130, 246, 1.0)',
    shadowColor: '#3B82F6',
  },
  star12: {
    top: '80%',
    left: '25%',
    opacity: 0.6,
    backgroundColor: 'rgba(147, 51, 234, 1.0)',
    shadowColor: '#9333EA',
  },
  star13: {
    top: '10%',
    left: '10%',
    opacity: 0.8,
    backgroundColor: 'rgba(139, 92, 246, 1.0)',
    shadowColor: '#8B5CF6',
  },
  star14: {
    top: '20%',
    right: '20%',
    opacity: 0.9,
    backgroundColor: 'rgba(96, 165, 250, 1.0)',
    shadowColor: '#60A5FA',
  },
  star15: {
    top: '40%',
    left: '30%',
    opacity: 0.7,
    backgroundColor: 'rgba(168, 85, 247, 1.0)',
    shadowColor: '#A855F7',
  },
  star16: {
    top: '60%',
    right: '30%',
    opacity: 0.8,
    backgroundColor: 'rgba(147, 51, 234, 1.0)',
    shadowColor: '#9333EA',
  },
  star17: {
    top: '80%',
    left: '40%',
    opacity: 0.9,
    backgroundColor: 'rgba(59, 130, 246, 1.0)',
    shadowColor: '#3B82F6',
  },
  star18: {
    top: '90%',
    right: '40%',
    opacity: 0.7,
    backgroundColor: 'rgba(139, 92, 246, 1.0)',
    shadowColor: '#8B5CF6',
  },
  star19: {
    top: '5%',
    left: '60%',
    opacity: 0.8,
    backgroundColor: 'rgba(147, 51, 234, 1.0)',
    shadowColor: '#9333EA',
  },
  star20: {
    top: '15%',
    right: '10%',
    opacity: 0.9,
    backgroundColor: 'rgba(59, 130, 246, 1.0)',
    shadowColor: '#3B82F6',
  },
  star21: {
    top: '25%',
    left: '80%',
    opacity: 0.7,
    backgroundColor: 'rgba(139, 92, 246, 1.0)',
    shadowColor: '#8B5CF6',
  },
  star22: {
    top: '45%',
    right: '5%',
    opacity: 0.8,
    backgroundColor: 'rgba(96, 165, 250, 1.0)',
    shadowColor: '#60A5FA',
  },
  star23: {
    top: '55%',
    left: '90%',
    opacity: 0.9,
    backgroundColor: 'rgba(168, 85, 247, 1.0)',
    shadowColor: '#A855F7',
  },
  star24: {
    top: '65%',
    right: '45%',
    opacity: 0.7,
    backgroundColor: 'rgba(147, 51, 234, 1.0)',
    shadowColor: '#9333EA',
  },
  star25: {
    top: '75%',
    left: '5%',
    opacity: 0.8,
    backgroundColor: 'rgba(59, 130, 246, 1.0)',
    shadowColor: '#3B82F6',
  },
  star26: {
    top: '85%',
    right: '70%',
    opacity: 0.9,
    backgroundColor: 'rgba(139, 92, 246, 1.0)',
    shadowColor: '#8B5CF6',
  },
  star27: {
    top: '95%',
    left: '70%',
    opacity: 0.7,
    backgroundColor: 'rgba(96, 165, 250, 1.0)',
    shadowColor: '#60A5FA',
  },
  star28: {
    top: '8%',
    left: '40%',
    opacity: 0.8,
    backgroundColor: 'rgba(168, 85, 247, 1.0)',
    shadowColor: '#A855F7',
  },
  star29: {
    top: '18%',
    right: '50%',
    opacity: 0.9,
    backgroundColor: 'rgba(147, 51, 234, 1.0)',
    shadowColor: '#9333EA',
  },
  star30: {
    top: '28%',
    left: '15%',
    opacity: 0.7,
    backgroundColor: 'rgba(59, 130, 246, 1.0)',
    shadowColor: '#3B82F6',
  },
  star31: {
    top: '38%',
    right: '80%',
    opacity: 0.8,
    backgroundColor: 'rgba(139, 92, 246, 1.0)',
    shadowColor: '#8B5CF6',
  },
  star32: {
    top: '48%',
    left: '75%',
    opacity: 0.9,
    backgroundColor: 'rgba(96, 165, 250, 1.0)',
    shadowColor: '#60A5FA',
  },
  star33: {
    top: '58%',
    right: '15%',
    opacity: 0.7,
    backgroundColor: 'rgba(168, 85, 247, 1.0)',
    shadowColor: '#A855F7',
  },
  star34: {
    top: '68%',
    left: '55%',
    opacity: 0.8,
    backgroundColor: 'rgba(147, 51, 234, 1.0)',
    shadowColor: '#9333EA',
  },
  star35: {
    top: '78%',
    right: '90%',
    opacity: 0.9,
    backgroundColor: 'rgba(59, 130, 246, 1.0)',
    shadowColor: '#3B82F6',
  },
  star36: {
    top: '88%',
    left: '25%',
    opacity: 0.7,
    backgroundColor: 'rgba(139, 92, 246, 1.0)',
    shadowColor: '#8B5CF6',
  },
  star37: {
    top: '12%',
    left: '85%',
    opacity: 0.8,
    backgroundColor: 'rgba(96, 165, 250, 1.0)',
    shadowColor: '#60A5FA',
  },
  star38: {
    top: '22%',
    right: '25%',
    opacity: 0.9,
    backgroundColor: 'rgba(168, 85, 247, 1.0)',
    shadowColor: '#A855F7',
  },
  star39: {
    top: '32%',
    left: '45%',
    opacity: 0.7,
    backgroundColor: 'rgba(147, 51, 234, 1.0)',
    shadowColor: '#9333EA',
  },
  star40: {
    top: '42%',
    right: '60%',
    opacity: 0.8,
    backgroundColor: 'rgba(59, 130, 246, 1.0)',
    shadowColor: '#3B82F6',
  },
  star41: {
    top: '52%',
    left: '20%',
    opacity: 0.9,
    backgroundColor: 'rgba(139, 92, 246, 1.0)',
    shadowColor: '#8B5CF6',
  },
  star42: {
    top: '62%',
    right: '75%',
    opacity: 0.7,
    backgroundColor: 'rgba(96, 165, 250, 1.0)',
    shadowColor: '#60A5FA',
  },
  star43: {
    top: '72%',
    left: '65%',
    opacity: 0.8,
    backgroundColor: 'rgba(168, 85, 247, 1.0)',
    shadowColor: '#A855F7',
  },
  star44: {
    top: '82%',
    right: '35%',
    opacity: 0.9,
    backgroundColor: 'rgba(147, 51, 234, 1.0)',
    shadowColor: '#9333EA',
  },
  star45: {
    top: '92%',
    left: '35%',
    opacity: 0.7,
    backgroundColor: 'rgba(59, 130, 246, 1.0)',
    shadowColor: '#3B82F6',
  },
  star46: {
    top: '7%',
    left: '30%',
    opacity: 0.8,
    backgroundColor: 'rgba(139, 92, 246, 1.0)',
    shadowColor: '#8B5CF6',
  },
  star47: {
    top: '17%',
    right: '40%',
    opacity: 0.9,
    backgroundColor: 'rgba(96, 165, 250, 1.0)',
    shadowColor: '#60A5FA',
  },
  star48: {
    top: '27%',
    left: '95%',
    opacity: 0.7,
    backgroundColor: 'rgba(168, 85, 247, 1.0)',
    shadowColor: '#A855F7',
  },
  star49: {
    top: '37%',
    right: '20%',
    opacity: 0.8,
    backgroundColor: 'rgba(147, 51, 234, 1.0)',
    shadowColor: '#9333EA',
  },
  star50: {
    top: '47%',
    left: '5%',
    opacity: 0.9,
    backgroundColor: 'rgba(59, 130, 246, 1.0)',
    shadowColor: '#3B82F6',
  },
});

export default OnboardingSlide;
