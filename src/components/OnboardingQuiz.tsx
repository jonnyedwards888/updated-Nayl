import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import PagerView from 'react-native-pager-view';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import hapticService, { HapticType, HapticIntensity } from '../services/hapticService';
import OnboardingWelcome from './OnboardingWelcome';
import PersonalizingScreen from './PersonalizingScreen';
import NailBitingConsequencesScreen from './NailBitingConsequencesScreen';
import DependencyScoreScreen from './DependencyScoreScreen';
import KeyMilestonesScreen from './KeyMilestonesScreen';
import CommitmentScreen from './CommitmentScreen';
import PersonalizedPlanScreen from './PersonalizedPlanScreen';

const { width, height } = Dimensions.get('window');

interface OnboardingQuizProps {
  onComplete: () => void;
  onSkip: () => void;
}

const OnboardingQuiz: React.FC<OnboardingQuizProps> = ({ onComplete, onSkip }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [userName, setUserName] = useState('');
  
  const progressAnim = useSharedValue(0);
  const pagerRef = useRef<PagerView>(null);

  // Total number of onboarding screens
  const totalScreens = 12; // Welcome, Info, Quiz Intro, 4 Quiz Questions, Name Input, Personalizing, Consequences, Dependency Score, Key Milestones, Commitment, Personalized Plan

  // Memoize starfield data to prevent regeneration on every render
  const starfieldData = useMemo(() => {
    return {
      welcome: [...Array(80)].map((_, i) => ({
        left: `${Math.random() * 100}%` as any,
        top: `${Math.random() * 100}%` as any,
        opacity: Math.random() * 0.4 + 0.6, // Increased from 0.2-0.6 to 0.6-1.0 range for much better visibility
        width: Math.random() * 2 + 1, // Keep 1-3 range
        height: Math.random() * 2 + 1, // Keep 1-3 range
      })),
      info: [...Array(80)].map((_, i) => ({
        left: `${Math.random() * 100}%` as any,
        top: `${Math.random() * 100}%` as any,
        opacity: Math.random() * 0.4 + 0.6, // Increased from 0.2-0.6 to 0.6-1.0 range for much better visibility
        width: Math.random() * 2 + 1, // Keep 1-3 range
        height: Math.random() * 2 + 1, // Keep 1-3 range
      })),
      quizIntro: [...Array(50)].map((_, i) => ({
        left: `${Math.random() * 100}%` as any,
        top: `${Math.random() * 100}%` as any,
        opacity: Math.random() * 0.6 + 0.4, // Increased from 0.3-0.9 to 0.4-1.0 range for much better visibility
        width: Math.random() * 2.5 + 1.5, // Keep 1.5-4 range
        height: Math.random() * 2.5 + 1.5, // Keep 1.5-4 range
      })),
      questions: [...Array(20)].map((_, i) => ({
        left: `${Math.random() * 100}%` as any,
        top: `${Math.random() * 100}%` as any,
        opacity: Math.random() * 0.4 + 0.6, // Increased from 0.2-0.6 to 0.6-1.0 range for much better visibility
      })),
    };
  }, []);

  // Calculate user's dependency score based on quiz answers
  const calculateUserScore = () => {
    let score = 0;
    
    // Question 1: Frequency (multiple times per day = high score)
    if (quizAnswers['1'] === '1a') score += 40; // Multiple times per day
    else if (quizAnswers['1'] === '1b') score += 30; // Once or twice per day
    else if (quizAnswers['1'] === '1c') score += 20; // A few times per week
    else if (quizAnswers['1'] === '1d') score += 10; // Rarely
    
    // Question 2: Triggers (stress/anxiety = higher score)
    if (quizAnswers['2'] === '2a') score += 25; // Stress or anxiety
    else if (quizAnswers['2'] === '2b') score += 20; // Boredom
    else if (quizAnswers['2'] === '2c') score += 15; // Perfectionism
    else if (quizAnswers['2'] === '2d') score += 10; // Social situations
    
    // Question 3: Duration of trying to stop (longer = higher score)
    if (quizAnswers['3'] === '3a') score += 15; // First attempt
    else if (quizAnswers['3'] === '3b') score += 20; // Few times before
    else if (quizAnswers['3'] === '3c') score += 25; // Months
    else if (quizAnswers['3'] === '3d') score += 30; // Over a year
    
    // Question 4: Motivation (health focus = higher score)
    if (quizAnswers['4'] === '4a') score += 10; // Better looking nails
    else if (quizAnswers['4'] === '4b') score += 15; // Health and hygiene
    else if (quizAnswers['4'] === '4c') score += 20; // Self-discipline
    else if (quizAnswers['4'] === '4d') score += 25; // Setting example
    
    return Math.min(score, 100); // Cap at 100%
  };

  // Animation values for info page
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(-20);
  const statisticOpacity = useSharedValue(0);
  const statisticTranslateY = useSharedValue(20);
  const impact1Opacity = useSharedValue(0);
  const impact1TranslateY = useSharedValue(20);
  const impact2Opacity = useSharedValue(0);
  const impact2TranslateY = useSharedValue(20);
  const impact3Opacity = useSharedValue(0);
  const impact3TranslateY = useSharedValue(20);
  const buttonOpacity = useSharedValue(0);
  const buttonTranslateY = useSharedValue(20);
  const skipOpacity = useSharedValue(0);
  const skipTranslateY = useSharedValue(20);

  // Quiz questions
  const quizQuestions = [
    {
      id: '1',
      question: 'How often do you find yourself biting your nails?',
      subtitle: 'Be honest - this helps us personalize your experience',
      options: [
        { id: '1a', text: 'Multiple times per day' },
        { id: '1b', text: 'Once or twice per day' },
        { id: '1c', text: 'A few times per week' },
        { id: '1d', text: 'Rarely, but I want to stop completely' },
      ],
    },
    {
      id: '2',
      question: 'What triggers your nail biting most often?',
      subtitle: 'Understanding triggers is key to breaking the habit',
      options: [
        { id: '2a', text: 'Stress or anxiety' },
        { id: '2b', text: 'Boredom or idle time' },
        { id: '2c', text: 'Perfectionism or nail imperfections' },
        { id: '2d', text: 'Social situations or nervousness' },
      ],
    },
    {
      id: '3',
      question: 'How long have you been trying to stop?',
      subtitle: 'Your journey matters to us',
      options: [
        { id: '3a', text: 'This is my first serious attempt' },
        { id: '3b', text: 'I\'ve tried a few times before' },
        { id: '3c', text: 'I\'ve been working on it for months' },
        { id: '3d', text: 'I\'ve been trying for over a year' },
      ],
    },
    {
      id: '4',
      question: 'What would motivate you most to quit?',
      subtitle: 'We\'ll use this to keep you inspired',
      options: [
        { id: '4a', text: 'Better looking nails and hands' },
        { id: '4b', text: 'Improved health and hygiene' },
        { id: '4c', text: 'Building self-discipline and confidence' },
        { id: '4d', text: 'Setting a good example for others' },
      ],
    },
  ];

  // Update progress when current page changes
  useEffect(() => {
    const progress = ((currentPage + 1) / totalScreens) * 100;
    progressAnim.value = withTiming(progress, {
      duration: 300,
      easing: Easing.out(Easing.cubic),
    });
  }, [currentPage, totalScreens]);

  // Handle visibility changes for embedded components
  useEffect(() => {
    // Force re-render of welcome page when it becomes visible again
    if (currentPage === 0) {
      // Small delay to ensure smooth transition
      setTimeout(() => {
        // This will trigger a re-render of the welcome page
      }, 100);
    }
  }, [currentPage]);

  // Navigation functions
  const goToNext = () => {
    if (currentPage < totalScreens - 1) {
      const nextPage = currentPage + 1;
      setIsTransitioning(true);
      // Remove the delay that was causing the black gap
      pagerRef.current?.setPage(nextPage);
      setCurrentPage(nextPage);
      // Reset transition state after a brief moment to allow smooth animation
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }
  };

  const goToPage = (pageIndex: number) => {
    setIsTransitioning(true);
    // Remove the delay that was causing the black gap
    pagerRef.current?.setPage(pageIndex);
    setCurrentPage(pageIndex);
    // Reset transition state after a brief moment to allow smooth animation
    setTimeout(() => {
      setIsTransitioning(false);
    }, 50);
  };

  const handleWelcomeStart = () => {
    hapticService.trigger(HapticType.SUCCESS, HapticIntensity.NORMAL);
    goToNext(); // Go to info page
  };

  const handleWelcomeSkip = () => {
    hapticService.trigger(HapticType.LIGHT_TAP, HapticIntensity.SUBTLE);
    onSkip();
  };

  const handleQuizAnswer = (questionId: string, answerId: string) => {
    hapticService.trigger(HapticType.SELECTION, HapticIntensity.SUBTLE);
    setQuizAnswers(prev => ({ ...prev, [questionId]: answerId }));
    
    // Auto-advance to next question after a brief delay
    setTimeout(() => {
      const currentQuestionIndex = quizQuestions.findIndex(q => q.id === questionId);
      if (currentQuestionIndex < quizQuestions.length - 1) {
        goToNext();
      } else {
        // Last question, go to name input page
        goToPage(quizQuestions.length + 3); // Skip quiz intro and quiz questions
      }
    }, 300);
  };

  const handleSkip = () => {
    hapticService.trigger(HapticType.LIGHT_TAP, HapticIntensity.SUBTLE);
    onSkip();
  };

  const handleComplete = () => {
    hapticService.trigger(HapticType.SUCCESS, HapticIntensity.NORMAL);
    onComplete();
  };

  const onPageSelected = (e: any) => {
    const newPage = e.nativeEvent.position;
    setCurrentPage(newPage);
    // Reset transition state when page change is complete
    setIsTransitioning(false);
  };

  // Progress bar animated style
  const progressBarStyle = useAnimatedStyle(() => {
    return {
      width: `${progressAnim.value}%`,
    };
  });

  // Info page animated styles - only access shared values in useAnimatedStyle
  const titleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));

  const statisticAnimatedStyle = useAnimatedStyle(() => ({
    opacity: statisticOpacity.value,
    transform: [{ translateY: statisticTranslateY.value }],
  }));

  const impact1AnimatedStyle = useAnimatedStyle(() => ({
    opacity: impact1Opacity.value,
    transform: [{ translateY: impact1TranslateY.value }],
  }));

  const impact2AnimatedStyle = useAnimatedStyle(() => ({
    opacity: impact2Opacity.value,
    transform: [{ translateY: impact2TranslateY.value }],
  }));

  const impact3AnimatedStyle = useAnimatedStyle(() => ({
    opacity: impact3Opacity.value,
    transform: [{ translateY: impact3TranslateY.value }],
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
    transform: [{ translateY: buttonTranslateY.value }],
  }));

  const skipAnimatedStyle = useAnimatedStyle(() => ({
    opacity: skipOpacity.value,
    transform: [{ translateY: skipTranslateY.value }],
  }));

  // Trigger info page animations when it becomes visible
  useEffect(() => {
    if (currentPage === 1) { // Info page
      titleOpacity.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.cubic) });
      titleTranslateY.value = withTiming(0, { duration: 800, easing: Easing.out(Easing.cubic) });
      
      setTimeout(() => {
        statisticOpacity.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.cubic) });
        statisticTranslateY.value = withTiming(0, { duration: 800, easing: Easing.out(Easing.cubic) });
      }, 200);
      
      setTimeout(() => {
        impact1Opacity.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.cubic) });
        impact1TranslateY.value = withTiming(0, { duration: 800, easing: Easing.out(Easing.cubic) });
      }, 400);
      
      setTimeout(() => {
        impact2Opacity.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.cubic) });
        impact2TranslateY.value = withTiming(0, { duration: 800, easing: Easing.out(Easing.cubic) });
      }, 600);
      
      setTimeout(() => {
        impact3Opacity.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.cubic) });
        impact3TranslateY.value = withTiming(0, { duration: 800, easing: Easing.out(Easing.cubic) });
      }, 800);
      
      setTimeout(() => {
        buttonOpacity.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.cubic) });
        buttonTranslateY.value = withTiming(0, { duration: 800, easing: Easing.out(Easing.cubic) });
      }, 1000);
      
      setTimeout(() => {
        skipOpacity.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.cubic) });
        skipTranslateY.value = withTiming(0, { duration: 800, easing: Easing.out(Easing.cubic) });
      }, 1200);
    }
  }, [currentPage]);

  return (
    <View style={styles.container}>
      {/* Fixed Header with Progress Bar */}
      <View style={styles.fixedHeader}>
        <LinearGradient
          colors={['#000000', '#050505', '#0A0A0A', '#0F0F0F']}
          style={styles.headerBackground}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <Animated.View 
              style={[
                styles.progressFill, 
                progressBarStyle
              ]} 
            />
          </View>
          {/* <Text style={styles.progressText}>
            {currentPage + 1} of {totalScreens}
          </Text> */}
        </View>
      </View>

      {/* Main PagerView for All Onboarding Screens */}
      <PagerView
        ref={pagerRef}
        style={styles.pager}
        initialPage={0}
        onPageSelected={onPageSelected}
        scrollEnabled={!isTransitioning}
        pageMargin={0}
        overdrag={false}
        overScrollMode="never"
      >
        {/* Welcome Screen */}
        <View key="welcome" style={styles.page}>
          <LinearGradient
            colors={['#000000', '#050505', '#0A0A0A', '#0F0F0F']}
            style={styles.background}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          
          {/* Premium Starfield Background */}
          <View style={styles.starfield}>
            {starfieldData.welcome.map((star, i) => (
              <View
                key={i}
                style={[
                  styles.star,
                  star,
                ]}
              />
            ))}
          </View>
          
          <View style={styles.welcomeContainer}>
            <OnboardingWelcome 
              key="welcome-visible"
              onStart={handleWelcomeStart}
              onLogin={handleWelcomeSkip}
              isEmbedded={true}
              isVisible={currentPage === 0}
            />
          </View>
        </View>

        {/* Info Page */}
        <View key="info" style={styles.page}>
          <View style={styles.container}>
            <LinearGradient
              colors={['#000000', '#050505', '#0A0A0A', '#0F0F0F']}
              style={styles.background}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            
            {/* Premium Starfield Background */}
            <View style={styles.starfield}>
              {starfieldData.info.map((star, i) => (
                <View
                  key={i}
                  style={[
                    styles.star,
                    star,
                  ]}
                />
              ))}
            </View>

            <View style={styles.content}>
              {/* Main Title */}
              <Animated.Text 
                style={[styles.infoPageTitle, titleAnimatedStyle]}
              >
                The hidden costs of nail biting
              </Animated.Text>
              
              {/* Key Statistic */}
              <Animated.View 
                style={[styles.statisticContainer, statisticAnimatedStyle]}
              >
                <Text style={styles.statisticNumber}>1 in 3</Text>
                <Text style={styles.statisticText}>
                  people struggle with nail biting, affecting their health and confidence
                </Text>
              </Animated.View>

              {/* Impact Points */}
              <View style={styles.impactSection}>
                <Animated.View style={[styles.impactItem, impact1AnimatedStyle]}>
                  <View style={styles.impactIcon}>
                    <Text style={styles.impactIconText}>🦷</Text>
                  </View>
                  <Text style={styles.impactText}>
                    Dental damage and jaw problems from constant pressure
                  </Text>
                </Animated.View>

                <Animated.View style={[styles.impactItem, impact2AnimatedStyle]}>
                  <View style={styles.impactIcon}>
                    <Text style={styles.impactIconText}>🦠</Text>
                  </View>
                  <Text style={styles.impactText}>
                    Risk of infections and bacteria transfer to mouth
                  </Text>
                </Animated.View>

                <Animated.View style={[styles.impactItem, impact3AnimatedStyle]}>
                  <View style={styles.impactIcon}>
                    <Text style={styles.impactIconText}>😔</Text>
                  </View>
                  <Text style={styles.impactText}>
                    Social anxiety and embarrassment about hand appearance
                  </Text>
                </Animated.View>
              </View>

              {/* Call to Action Button */}
              <Animated.View style={[styles.buttonContainer, buttonAnimatedStyle]}>
                <TouchableOpacity 
                  style={styles.infoPageButton} 
                  onPress={() => {
                    hapticService.trigger(HapticType.SUCCESS, HapticIntensity.PROMINENT);
                    goToNext();
                  }}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#7C3AED', '#EC4899']}
                    style={styles.infoPageButtonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={styles.infoPageButtonText}>Continue</Text>
                  </LinearGradient>
                </TouchableOpacity>

                {/* Skip Link */}
                <TouchableOpacity 
                  style={styles.infoPageSkipLink} 
                  onPress={() => {
                    hapticService.trigger(HapticType.LIGHT_TAP, HapticIntensity.SUBTLE);
                    goToNext();
                  }}
                >
                  <Text style={styles.infoPageSkipText}>
                    Skip this information
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </View>
        </View>

        {/* Quiz Intro Screen */}
        <View key="quizIntro" style={styles.page}>
          <View style={styles.container}>
            <LinearGradient
              colors={['#000000', '#050505', '#0A0A0A', '#0F0F0F']}
              style={styles.background}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            
            {/* Premium Starfield Background */}
            <View style={styles.starfield}>
              {starfieldData.quizIntro.map((star, i) => (
                <View
                  key={i}
                  style={[
                    styles.star,
                    star,
                  ]}
                />
              ))}
            </View>

            <View style={styles.content}>
              {/* Main Title */}
              <Text style={styles.quizIntroTitle}>
                Let's understand your nail biting habits
              </Text>
              
              {/* Descriptive Text */}
              <Text style={styles.quizIntroSubtitle}>
                Using your answers, we will then craft the perfect plan to help you quit forever.
              </Text>

              {/* Privacy/Security Note */}
              <View style={styles.privacyContainer}>
                <Text style={styles.privacyIcon}>🔒</Text>
                <Text style={styles.privacyText}>
                  Your data is encrypted and will never be shared
                </Text>
              </View>

              {/* Central Animation */}
              <View style={styles.animationContainer}>
                <Text style={styles.staticImageText}>📝</Text>
              </View>

              {/* Call to Action Button */}
              <TouchableOpacity 
                style={styles.quizIntroButton} 
                onPress={() => {
                  hapticService.trigger(HapticType.SUCCESS, HapticIntensity.PROMINENT);
                  goToNext();
                }}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#7C3AED', '#1E40AF']}
                  style={styles.quizIntroButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.quizIntroButtonText}>Start Quiz</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Quiz Questions */}
        {quizQuestions.map((question, index) => (
          <View key={`question-${question.id}`} style={styles.page}>
            <LinearGradient
              colors={['#000000', '#050505', '#0A0A0A', '#0F0F0F']}
              style={styles.background}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            
            {/* Subtle Starfield Background */}
            <View style={styles.starfield}>
              {starfieldData.questions.map((star, i) => (
                <View
                  key={i}
                  style={[
                    styles.star,
                    star,
                  ]}
                />
              ))}
            </View>
            
            <View style={styles.content}>
              {/* Question Section */}
              <View style={styles.questionSection}>
                <Text style={styles.question}>
                  {question.question}
                </Text>
                
                <Text style={styles.subtitle}>
                  {question.subtitle}
                </Text>
              </View>

              {/* Answer Options */}
              <View style={styles.answersSection}>
                {question.options.map((option: any) => (
                  <TouchableOpacity
                    key={option.id}
                    style={styles.answerPill}
                    onPress={() => handleQuizAnswer(question.id, option.id)}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={['#3B82F6', '#1E40AF']}
                      style={styles.pillGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 0, y: 1 }}
                    />
                    
                    <View style={styles.pillContent}>
                      <Text style={styles.answerText} numberOfLines={2}>
                        {option.text}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Skip Button */}
              <View style={styles.skipButtonContainer}>
                <TouchableOpacity 
                  style={styles.skipButton} 
                  onPress={handleSkip}
                >
                  <Text style={styles.skipText}>Skip test</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}

        {/* Name Input Page */}
        <View key="nameInput" style={styles.page}>
          <LinearGradient
            colors={['#000000', '#050505', '#0A0A0A', '#0F0F0F']}
            style={styles.background}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          
          {/* Subtle Starfield Background */}
          <View style={styles.starfield}>
            {starfieldData.questions.map((star, i) => (
              <View
                key={i}
                style={[
                  styles.star,
                  star,
                ]}
              />
            ))}
          </View>
          
          <View style={styles.content}>
            {/* Question Section */}
            <View style={[styles.questionSection, { marginBottom: 40 }]}>
              <Text style={styles.question}>
                Finally, what's your name?
              </Text>
              
              <Text style={styles.subtitle}>
                We'll use this to personalize your experience
              </Text>
            </View>

            {/* Name Input Field */}
            <View style={styles.nameInputContainer}>
              <TextInput
                style={styles.nameInput}
                value={userName}
                onChangeText={setUserName}
                placeholder="Enter your name"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                autoFocus={true}
                autoCapitalize="words"
                autoCorrect={false}
                returnKeyType="done"
                onSubmitEditing={() => {
                  if (userName.trim()) {
                    goToNext();
                  }
                }}
              />
            </View>

            {/* Continue Button */}
            <TouchableOpacity
              style={[
                styles.continueButton,
                userName.trim() ? styles.continueButtonActive : styles.continueButtonInactive
              ]}
              onPress={() => {
                if (userName.trim()) {
                  goToNext();
                }
              }}
              disabled={!userName.trim()}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={userName.trim() ? ['#7C3AED', '#EC4899'] : ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
                style={styles.continueButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={[
                  styles.continueButtonText,
                  userName.trim() ? styles.continueButtonTextActive : styles.continueButtonTextInactive
                ]}>
                  Continue
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Personalizing Screen */}
        <View key="personalizing" style={styles.page}>
          <PersonalizingScreen
            userName={userName}
            onComplete={goToNext}
          />
        </View>

        {/* Consequences Screen */}
        <View key="consequences" style={styles.page}>
          <NailBitingConsequencesScreen
            userName={userName}
            onComplete={goToNext}
          />
        </View>

        {/* Dependency Score Screen */}
        <View key="dependencyScore" style={styles.page}>
          <DependencyScoreScreen
            userScore={calculateUserScore()}
            averageScore={25}
            onContinue={goToNext}
          />
        </View>

        {/* Key Milestones Screen */}
        <View key="keyMilestones" style={styles.page}>
          <KeyMilestonesScreen
            onContinue={goToNext}
          />
        </View>

        {/* Commitment Screen */}
        <View key="commitment" style={styles.page}>
          <CommitmentScreen
            onComplete={goToNext}
          />
        </View>

        {/* Personalized Plan Screen */}
        <View key="personalizedPlan" style={styles.page}>
          <PersonalizedPlanScreen
            userName={userName}
            onStartJourney={handleComplete}
          />
        </View>
      </PagerView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  fixedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 24,
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  progressContainer: {
    alignItems: 'center',
    zIndex: 1,
  },
  progressBar: {
    width: '100%',
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 1,
    marginBottom: 16,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 1,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 4,
  },
  progressText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
    fontWeight: '500',
  },
  pager: {
    flex: 1,
    marginTop: 80, // Increased from 50 to 80 to prevent header cutoff
    backgroundColor: '#000000', // Ensure consistent background
  },
  page: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 0, // Reduced from 0 to 0 (already at 0) to keep content high
    backgroundColor: '#000000', // Ensure consistent background
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    paddingTop: 20, // Reduced from 40 to 20 to make content smaller
    paddingBottom: 40,
  },
  questionSection: {
    alignItems: 'center',
    marginBottom: 20, // Increased from 16 to 20 to find better balance
    paddingTop: 0, // Reduced from 20 to 0 to move questions higher
  },
  question: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12, // Reduced from 16 to 12 to bring subtitle closer
    lineHeight: 36,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: width * 0.8,
    marginBottom: 8, // Added margin bottom to bring answer pills closer
  },
  answersSection: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20, // Increased from 16 to 20 to find better balance
    gap: 12, // Reduced from 16 to 12 for more compact pills
  },
  answerPill: {
    width: '100%',
    marginBottom: 10, // Increased from 6 to 10 to find better balance
    minHeight: 58, // Increased from 56 to 58 to match increased padding
    position: 'relative',
  },
  pillGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 28, // Increased from 27 to 28 to match new height
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)', // More subtle border
    // Remove backgroundColor since we're using LinearGradient
    // Add subtle shadow effects for premium look
    shadowColor: '#3B82F6', // Updated to match new blue theme
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4, // Android shadow
  },
  pillContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Center the text horizontally
    width: '100%',
    paddingVertical: 15, // Increased from 14 to 15 to match new height
    paddingHorizontal: 24, // Reduced from 32 to 24
    zIndex: 1,
  },
  numberCircle: {
    width: 30, // Increased from 28 to 30 for better proportion
    height: 30, // Increased from 28 to 30 for better proportion
    borderRadius: 15, // Increased from 14 to 15 for better proportion
    backgroundColor: 'rgba(0, 179, 255, 0.3)', // Updated to match new premium theme
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.5)', // Updated border to match new theme
  },
  numberText: {
    fontSize: 15, // Increased from 14 to 15 for better proportion
    fontWeight: '600',
    color: '#FFFFFF',
  },
  answerText: {
    fontSize: 19, // Increased from 18 to 19 for better proportion
    fontWeight: '700', // Increased from 600 to 700 for better contrast
    color: '#FFFFFF', // Pure white for maximum contrast against premium blue
    textAlign: 'center', // Center the text
    lineHeight: 23, // Increased from 22 to 23 for better proportion
    textShadowColor: 'rgba(0, 0, 0, 0.6)', // Enhanced shadow for better text readability
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2, // Increased shadow radius for subtle glow effect
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  skipButtonContainer: {
    position: 'absolute',
    bottom: 40, // Adjust as needed
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1, // Ensure it's above other content
  },
  finalContent: {
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
    flex: 1,
  },
  finalHeader: {
    alignItems: 'center',
    marginBottom: 32, // Reduced from 48 to 32 to move content higher
    paddingTop: 0, // Reduced from 10 to 0
  },
  finalTitle: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  finalTitleHighlight: {
    color: '#C1FF72',
  },
  finalSubtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 48,
    lineHeight: 26,
    maxWidth: width * 0.8,
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  featuresSection: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 32, // Reduced from 48 to 32 to move content higher
    gap: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 24,
  },
  featureIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  featureText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'left',
    lineHeight: 24,
  },
  paymentAssurance: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 32, // Reduced from 48 to 32 to move content higher
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  checkmarkContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#C1FF72',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  checkmark: {
    fontSize: 24,
    color: '#000000',
  },
  paymentText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  startButton: {
    width: '100%',
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
  },
  startButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startButtonText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: 0.5,
  },
  pricingText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 24,
  },
  starfield: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1, // Ensure it's behind other content
    overflow: 'hidden',
  },
  star: {
    position: 'absolute',
    width: 4, // Increased from 3 to 4 for much better visibility
    height: 4, // Increased from 3 to 4 for much better visibility
    backgroundColor: '#FFFFFF',
    borderRadius: 2, // Increased from 1.5 to 2
    opacity: 0.8, // Increased from 0.3 to 0.8 for much better visibility
    transform: [{ scale: 1 }], // Keep at 1 for better visibility
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9, // Increased from 0.6 to 0.9 for much better glow
    shadowRadius: 6, // Increased from 4 to 6 for much better glow
    elevation: 4, // Increased from 2 to 4
  },
  infoPageTitle: {
    fontSize: 36, // Increased for more impact
    fontWeight: '800', // Bolder for premium feel
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 24, // Reduced spacing
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    lineHeight: 44, // Better line height for readability
  },
  statisticContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)', // More subtle background
    borderRadius: 20, // Larger radius for premium feel
    paddingVertical: 20, // Reduced padding
    paddingHorizontal: 28, // Reduced horizontal padding
    marginBottom: 40, // Reduced spacing
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)', // More subtle border
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  statisticNumber: {
    fontSize: 56, // Larger for more impact
    fontWeight: '900', // Boldest for maximum impact
    color: '#DC2626', // Premium red color for impact
    textAlign: 'center',
    marginBottom: 12, // More spacing
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    letterSpacing: -1, // Tighter letter spacing for numbers
  },
  statisticText: {
    fontSize: 16, // Reduced from 18 to create better visual hierarchy
    color: '#AAAAAA', // Changed to subtle light grey for better contrast
    textAlign: 'center',
    lineHeight: 22, // Adjusted line height to match smaller font size
  },
  impactSection: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 32, // Reduced spacing
    gap: 20, // Reduced gap between items
  },
  impactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18, // Slightly reduced gap
    width: '100%',
    paddingVertical: 16, // Reduced padding
    paddingHorizontal: 24, // Reduced horizontal padding
    backgroundColor: 'rgba(45, 45, 55, 0.5)', // Semi-transparent dark background for glassmorphism
    borderRadius: 16, // Larger radius
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)', // Subtle edge highlight
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  impactIcon: {
    width: 56, // Larger icons
    height: 56, // Larger icons
    borderRadius: 28, // Larger radius
    backgroundColor: 'rgba(255, 255, 255, 0.08)', // More subtle background
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)', // Subtle border
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  impactIconText: {
    fontSize: 28, // Larger emojis
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  impactText: {
    fontSize: 19, // Slightly larger
    color: 'rgba(255, 255, 255, 0.95)', // More opaque for better readability
    flex: 1,
    textAlign: 'left',
    lineHeight: 26, // Better line height
    fontWeight: '500', // Medium weight for better readability
    letterSpacing: 0.2, // Slight letter spacing
  },
  infoPageButton: {
    width: width * 0.9, // Wider button with margins
    height: 64, // Slightly taller
    borderRadius: 32, // Larger radius
    overflow: 'hidden',
    marginBottom: 16, // Reduced spacing to bring skip link closer
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
    alignSelf: 'center', // Center the button
  },
  infoPageButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoPageButtonText: {
    fontSize: 22, // Larger text
    fontWeight: '800', // Bolder
    color: '#FFFFFF', // White text for better contrast with gradient
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  infoPageSkipLink: {
    paddingVertical: 16,
  },
  infoPageSkipText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#AAAAAA', // Changed to light grey to make it more subtle
    // Removed textDecorationLine: 'underline' to make it plain text
  },
  // Quiz Intro Page Styles
  quizIntroTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    lineHeight: 40,
  },
  quizIntroSubtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 26,
    maxWidth: width * 0.85,
    fontWeight: '500',
  },
  privacyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    gap: 12,
  },
  privacyIcon: {
    fontSize: 20,
    color: '#F59E0B', // Golden color for the lock
  },
  privacyText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
  },
  animationContainer: {
    width: width * 0.8,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },

  quizIntroButton: {
    width: width * 0.85,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
    alignSelf: 'center',
  },
  quizIntroButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quizIntroButtonText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  staticImageText: {
    fontSize: 120,
    color: '#FFFFFF',
  },
  nameInputContainer: {
    width: '100%',
    marginBottom: 32,
    marginTop: 20,
  },
  nameInput: {
    width: '100%',
    height: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    paddingHorizontal: 20,
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    textAlign: 'center',
    shadowColor: 'rgba(255, 255, 255, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  continueButton: {
    width: width * 0.85,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#C1FF72',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
    alignSelf: 'center',
    marginTop: 20,
  },
  continueButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
     continueButtonActive: {
     shadowColor: '#EC4899',
     shadowOffset: { width: 0, height: 8 },
     shadowOpacity: 0.4,
     shadowRadius: 16,
     elevation: 8,
   },
  continueButtonInactive: {
    shadowColor: 'rgba(255, 255, 255, 0.1)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  continueButtonTextActive: {
    color: '#FFFFFF',
  },
  continueButtonTextInactive: {
    color: 'rgba(255, 255, 255, 0.6)',
  },
  placeholderText: {
    fontSize: 24,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    marginTop: 100, // Adjust as needed to center content
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  welcomeContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },


});

export default OnboardingQuiz;
