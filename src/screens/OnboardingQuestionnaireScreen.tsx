import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

// Color constants
const COLORS = {
  primaryBackground: '#000000',
  secondaryBackground: '#0F172A',
  primaryAccent: '#C1FF72',
  primaryText: '#FFFFFF',
  secondaryText: '#A9A9A9',
  mutedText: '#6B7280',
  cardBackground: '#1F2937',
  glassBorder: 'rgba(255, 255, 255, 0.1)',
};

// Spacing constants
const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

// Sample questions for the questionnaire
const QUESTIONS = [
  {
    id: 1,
    question: 'How often do you bite your nails?',
    subtitle: 'This helps us create your personalized plan.',
    options: [
      { id: 1, label: 'Never', value: 'never' },
      { id: 2, label: 'Rarely', value: 'rarely' },
      { id: 3, label: 'Sometimes', value: 'sometimes' },
      { id: 4, label: 'Often', value: 'often' },
      { id: 5, label: 'Very Often', value: 'very_often' },
    ],
  },
  {
    id: 2,
    question: 'When do you typically bite your nails?',
    subtitle: 'Understanding your triggers helps us provide better support.',
    options: [
      { id: 1, label: 'When stressed', value: 'stress' },
      { id: 2, label: 'When bored', value: 'boredom' },
      { id: 3, label: 'When anxious', value: 'anxiety' },
      { id: 4, label: 'When thinking', value: 'thinking' },
      { id: 5, label: 'All the time', value: 'always' },
    ],
  },
  {
    id: 3,
    question: 'How long have you been biting your nails?',
    subtitle: 'This helps us understand your habit timeline.',
    options: [
      { id: 1, label: 'Less than 1 year', value: 'less_than_1' },
      { id: 2, label: '1-3 years', value: '1_to_3' },
      { id: 3, label: '3-5 years', value: '3_to_5' },
      { id: 4, label: '5-10 years', value: '5_to_10' },
      { id: 5, label: 'More than 10 years', value: 'more_than_10' },
    ],
  },
  {
    id: 4,
    question: 'What motivates you to stop biting your nails?',
    subtitle: 'Your motivation drives your success journey.',
    options: [
      { id: 1, label: 'Better appearance', value: 'appearance' },
      { id: 2, label: 'Health concerns', value: 'health' },
      { id: 3, label: 'Social pressure', value: 'social' },
      { id: 4, label: 'Personal growth', value: 'growth' },
      { id: 5, label: 'All of the above', value: 'all' },
    ],
  },
];

interface AnswerPillProps {
  option: {
    id: number;
    label: string;
    value: string;
  };
  isSelected: boolean;
  onPress: () => void;
}

const AnswerPill: React.FC<AnswerPillProps> = ({ option, isSelected, onPress }) => {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <TouchableOpacity
      style={styles.answerPillContainer}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      {/* Circular button with number only */}
      <LinearGradient
        colors={
          isSelected
            ? [COLORS.primaryAccent, COLORS.primaryAccent + 'CC']
            : [COLORS.cardBackground, COLORS.cardBackground + '80']
        }
        style={[
          styles.answerPill,
          isSelected && styles.answerPillSelected,
        ]}
      >
        <Text style={[
          styles.numberText,
          isSelected && styles.numberTextSelected
        ]}>
          {option.id}
        </Text>
      </LinearGradient>
      
      {/* Text label positioned below the button */}
      <Text style={[
        styles.answerLabel,
        isSelected && styles.answerLabelSelected
      ]}>
        {option.label}
      </Text>
    </TouchableOpacity>
  );
};

const OnboardingQuestionnaireScreen: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  
  const currentQuestion = QUESTIONS[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / QUESTIONS.length) * 100;

  const handleAnswerSelect = (value: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Handle questionnaire completion
      console.log('Questionnaire completed:', selectedAnswers);
    }
  };

  const handleSkip = () => {
    // Handle skip action
    console.log('Questionnaire skipped');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${progress}%` }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>
          Question {currentQuestionIndex + 1} of {QUESTIONS.length}
        </Text>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Question Header */}
        <View style={styles.questionHeader}>
          <Text style={styles.questionNumber}>
            Question {currentQuestionIndex + 1} of {QUESTIONS.length}
          </Text>
          <Text style={styles.questionText}>
            {currentQuestion.question}
          </Text>
          <Text style={styles.questionSubtitle}>
            {currentQuestion.subtitle}
          </Text>
        </View>

        {/* Answer Pills */}
        <View style={styles.answerPillsContainer}>
          {currentQuestion.options.map((option) => (
            <AnswerPill
              key={option.id}
              option={option}
              isSelected={selectedAnswers[currentQuestion.id] === option.value}
              onPress={() => handleAnswerSelect(option.value)}
            />
          ))}
        </View>

        {/* Next Button */}
        <TouchableOpacity
          style={[
            styles.nextButton,
            selectedAnswers[currentQuestion.id] && styles.nextButtonActive
          ]}
          onPress={handleNext}
          disabled={!selectedAnswers[currentQuestion.id]}
        >
          <LinearGradient
            colors={
              selectedAnswers[currentQuestion.id]
                ? [COLORS.primaryAccent, COLORS.primaryAccent + 'CC']
                : [COLORS.mutedText, COLORS.mutedText]
            }
            style={styles.nextButtonGradient}
          >
            <Text style={[
              styles.nextButtonText,
              selectedAnswers[currentQuestion.id] && styles.nextButtonTextActive
            ]}>
              {currentQuestionIndex === QUESTIONS.length - 1 ? 'Complete' : 'Next'}
            </Text>
            <Ionicons
              name="arrow-forward"
              size={20}
              color={selectedAnswers[currentQuestion.id] ? '#000000' : COLORS.secondaryText}
            />
          </LinearGradient>
        </TouchableOpacity>

        {/* Skip Link */}
        <TouchableOpacity
          style={styles.skipContainer}
          onPress={handleSkip}
        >
          <Text style={styles.skipText}>Skip for now</Text>
          <Ionicons
            name="arrow-forward"
            size={16}
            color={COLORS.secondaryText}
          />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryBackground,
  },
  progressContainer: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  progressBar: {
    height: 4,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: SPACING.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primaryAccent,
    borderRadius: 2,
  },
  progressText: {
    fontSize: 14,
    color: COLORS.secondaryText,
    textAlign: 'center',
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxxl,
  },
  questionHeader: {
    marginBottom: SPACING.xxl,
  },
  questionNumber: {
    fontSize: 16,
    color: COLORS.secondaryText,
    fontWeight: '600',
    marginBottom: SPACING.md,
  },
  questionText: {
    fontSize: 28,
    color: COLORS.primaryText,
    fontWeight: '700',
    lineHeight: 36,
    marginBottom: SPACING.sm,
  },
  questionSubtitle: {
    fontSize: 16,
    color: COLORS.secondaryText,
    fontWeight: '400',
    lineHeight: 22,
  },
  answerPillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: SPACING.xxl,
  },
  answerPillContainer: {
    width: (width - SPACING.lg * 2 - SPACING.md) / 2,
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  answerPill: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    marginBottom: SPACING.sm,
  },
  answerPillSelected: {
    borderColor: COLORS.primaryAccent,
  },
  numberText: {
    fontSize: 18,
    color: COLORS.primaryText,
    fontWeight: '600',
  },
  numberTextSelected: {
    color: '#000000',
  },
  answerLabel: {
    fontSize: 12,
    color: COLORS.primaryText,
    fontWeight: '500',
    textAlign: 'center',
  },
  answerLabelSelected: {
    color: COLORS.primaryAccent,
    fontWeight: '600',
  },
  nextButton: {
    marginBottom: SPACING.xl,
  },
  nextButtonActive: {
    shadowColor: COLORS.primaryAccent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  nextButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: 12,
  },
  nextButtonText: {
    fontSize: 16,
    color: COLORS.secondaryText,
    fontWeight: '600',
    marginRight: SPACING.sm,
  },
  nextButtonTextActive: {
    color: '#000000',
  },
  skipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
  },
  skipText: {
    fontSize: 14,
    color: COLORS.secondaryText,
    fontWeight: '500',
    marginRight: SPACING.xs,
  },
});

export default OnboardingQuestionnaireScreen; 