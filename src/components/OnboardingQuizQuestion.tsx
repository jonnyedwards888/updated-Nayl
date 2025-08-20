import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  FadeIn, 
  SlideInUp, 
  withDelay 
} from 'react-native-reanimated';
import hapticService, { HapticType, HapticIntensity } from '../services/hapticService';
import { Easing } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

interface OnboardingQuizQuestionProps {
  question: string;
  subtitle: string;
  answerOptions: Array<{ id: string; text: string }>;
  currentStep: number;
  totalSteps: number;
  onAnswerSelect: (answerId: string) => void;
  onSkip: () => void;
  showProgressBar?: boolean;
}

const OnboardingQuizQuestion: React.FC<OnboardingQuizQuestionProps> = ({
  question,
  subtitle,
  answerOptions,
  currentStep,
  totalSteps,
  onAnswerSelect,
  onSkip,
  showProgressBar = true,
}) => {
  const handleAnswerSelect = async (answerId: string) => {
    try {
      await hapticService.trigger(HapticType.SELECTION, HapticIntensity.SUBTLE);
    } catch (error) {
      console.warn('Haptic feedback failed:', error);
    }
    onAnswerSelect(answerId);
  };

  const handleSkip = async () => {
    try {
      await hapticService.trigger(HapticType.LIGHT_TAP, HapticIntensity.SUBTLE);
    } catch (error) {
      console.warn('Haptic feedback failed:', error);
    }
    onSkip();
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#000000', '#050505', '#0A0A0A', '#0F0F0F']}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <View style={styles.content}>
        {/* Question Section with Staggered Animation */}
        <Animated.View 
          style={styles.questionSection}
          entering={FadeIn.duration(600).delay(200).easing(Easing.out(Easing.cubic))}
        >
          <Animated.Text 
            style={styles.question}
            entering={SlideInUp.duration(500).delay(300).easing(Easing.out(Easing.cubic))}
          >
            {question}
          </Animated.Text>
          
          <Animated.Text 
            style={styles.subtitle}
            entering={SlideInUp.duration(500).delay(400).easing(Easing.out(Easing.cubic))}
          >
            {subtitle}
          </Animated.Text>
        </Animated.View>

        {/* Answer Options with Staggered Animation */}
        <View style={styles.answersSection}>
          {answerOptions.map((option, index) => (
            <Animated.View
              key={option.id}
              entering={SlideInUp
                .duration(500)
                .delay(500 + (index * 100)) // Stagger each pill by 100ms
                .easing(Easing.out(Easing.cubic))
              }
            >
              <TouchableOpacity
                style={styles.answerPill}
                onPress={() => handleAnswerSelect(option.id)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#1E3A8A', '#1E40AF', '#2563EB']}
                  style={styles.pillGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.pillContent}>
                    {/* Number Circle */}
                    <View style={styles.numberCircle}>
                      <Text style={styles.numberText}>{index + 1}</Text>
                    </View>
                    {/* Answer Text */}
                    <Text style={styles.answerText}>{option.text}</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        {/* Skip Button with Delayed Animation */}
        <Animated.View
          entering={FadeIn.duration(400).delay(800).easing(Easing.out(Easing.cubic))}
        >
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 120, // Account for fixed header
    justifyContent: 'center',
  },
  questionSection: {
    marginBottom: 48,
    alignItems: 'center',
  },
  question: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 36,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: width * 0.8,
  },
  answersSection: {
    marginBottom: 48,
    gap: 16,
  },
  answerPill: {
    marginBottom: 16,
  },
  pillGradient: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  pillContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  numberCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  answerText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    flex: 1,
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  skipText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default OnboardingQuizQuestion;
