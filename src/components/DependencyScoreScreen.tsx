import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import hapticService, { HapticType, HapticIntensity } from '../services/hapticService';

const { width, height } = Dimensions.get('window');

interface DependencyScoreScreenProps {
  userScore: number; // User's dependency score (0-100)
  averageScore: number; // Average dependency score (0-100)
  onContinue: () => void;
}

const DependencyScoreScreen: React.FC<DependencyScoreScreenProps> = ({ 
  userScore, 
  averageScore, 
  onContinue 
}) => {
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
  
  const chartOpacity = useSharedValue(0);
  const chartTranslateY = useSharedValue(30);
  
  const disclaimerOpacity = useSharedValue(0);
  const disclaimerTranslateY = useSharedValue(20);
  
  const buttonOpacity = useSharedValue(0);
  const buttonTranslateY = useSharedValue(30);

  // Bar height animations
  const userBarHeight = useSharedValue(0);
  const averageBarHeight = useSharedValue(0);

  // Determine headline text based on user score vs average
  const getHeadlineText = () => {
    if (userScore > averageScore) {
      return `Your nail-biting frequency is higher than the average person.`;
    } else {
      return `Congratulations! You're already on the right track.`;
    }
  };

  // Get sub-headline for low scores
  const getSubHeadlineText = () => {
    if (userScore <= averageScore) {
      return `Your nail-biting frequency is lower than average. Nayl can help you build on this strong foundation and quit for good.`;
    }
    return null;
  };

  // Highlight the key word in the headline
  const renderHeadline = () => {
    const text = getHeadlineText();
    const words = text.split(' ');
    
    return (
      <Text style={styles.headline}>
        {words.map((word, index) => {
          if (word.toLowerCase().includes('higher') || word.toLowerCase().includes('lower') || word.toLowerCase().includes('average')) {
            return (
              <Text key={index} style={styles.highlightedWord}>
                {word}
              </Text>
            );
          }
          return word + ' ';
        })}
      </Text>
    );
  };

  // Determine bar colors based on score comparison
  const getUserBarColor = () => {
    return userScore > averageScore ? '#DC2626' : '#10B981'; // Red for high, green for low
  };

  const getUserBarShadowColor = () => {
    return userScore > averageScore ? '#DC2626' : '#10B981'; // Red for high, green for low
  };

  useEffect(() => {
    // Start the animation sequence
    const startAnimations = () => {
      // 1. Title animation (500ms, no delay)
      titleOpacity.value = withTiming(1, { duration: 500, easing: Easing.out(Easing.cubic) });
      titleTranslateY.value = withTiming(0, { duration: 500, easing: Easing.out(Easing.cubic) });

      // 2. Chart animation (300ms delay)
      setTimeout(() => {
        chartOpacity.value = withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) });
        chartTranslateY.value = withTiming(0, { duration: 600, easing: Easing.out(Easing.cubic) });
        
        // Animate bars growing from 0 to final height
        userBarHeight.value = withSpring(userScore, { 
          damping: 15, 
          stiffness: 100,
          mass: 0.8
        });
        
        averageBarHeight.value = withSpring(averageScore, { 
          damping: 15, 
          stiffness: 100,
          mass: 0.8
        });
      }, 300);

      // 3. Disclaimer animation (800ms delay)
      setTimeout(() => {
        disclaimerOpacity.value = withTiming(1, { duration: 500, easing: Easing.out(Easing.cubic) });
        disclaimerTranslateY.value = withTiming(0, { duration: 500, easing: Easing.out(Easing.cubic) });
      }, 800);

      // 4. Button animation (1000ms delay)
      setTimeout(() => {
        buttonOpacity.value = withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) });
        buttonTranslateY.value = withTiming(0, { duration: 600, easing: Easing.out(Easing.cubic) });
      }, 1000);
    };

    // Start animations after a brief delay
    const timer = setTimeout(startAnimations, 100);
    return () => clearTimeout(timer);
  }, [userScore, averageScore]);

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

  const handleContinue = () => {
    hapticService.trigger(HapticType.SUCCESS, HapticIntensity.NORMAL);
    onContinue();
  };

  // Animated styles
  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));

  const chartStyle = useAnimatedStyle(() => ({
    opacity: chartOpacity.value,
    transform: [{ translateY: chartTranslateY.value }],
  }));

  const disclaimerStyle = useAnimatedStyle(() => ({
    opacity: disclaimerOpacity.value,
    transform: [{ translateY: disclaimerTranslateY.value }],
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
    transform: [{ translateY: buttonTranslateY.value }],
  }));

  // Bar height animated styles
  const userBarStyle = useAnimatedStyle(() => ({
    height: `${userBarHeight.value}%`,
  }));

  const averageBarStyle = useAnimatedStyle(() => ({
    height: `${averageBarHeight.value}%`,
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
        {/* Dynamic Headline */}
        <Animated.View style={[styles.headlineContainer, titleStyle]}>
          {renderHeadline()}
          
          {/* Conditional Sub-headline for Low Scores */}
          {getSubHeadlineText() && (
            <Animated.Text style={[styles.subHeadline, titleStyle]}>
              {getSubHeadlineText()}
            </Animated.Text>
          )}
        </Animated.View>

        {/* Bar Chart */}
        <Animated.View style={[styles.chartContainer, chartStyle]}>
          <View style={styles.chart}>
            {/* You Bar */}
            <View style={styles.barColumn}>
              <Text style={styles.percentageLabel}>{userScore}%</Text>
              <View style={styles.barContainer}>
                <Animated.View 
                  style={[
                    styles.bar, 
                    styles.userBar, 
                    userBarStyle,
                    {
                      backgroundColor: getUserBarColor(),
                      shadowColor: getUserBarShadowColor(),
                    }
                  ]} 
                />
              </View>
              <Text style={styles.barLabel}>You</Text>
            </View>

            {/* Average Bar */}
            <View style={styles.barColumn}>
              <Text style={styles.percentageLabel}>{averageScore}%</Text>
              <View style={styles.barContainer}>
                <Animated.View style={[styles.bar, styles.averageBar, averageBarStyle]} />
              </View>
              <Text style={styles.barLabel}>Average</Text>
            </View>
          </View>

          {/* Disclaimer */}
          <Animated.Text style={[styles.disclaimer, disclaimerStyle]}>
            This result is for informational purposes only and does not constitute a medical diagnosis.
          </Animated.Text>
        </Animated.View>

        {/* Continue Button */}
        <Animated.View style={[styles.buttonContainer, buttonStyle]}>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#2563EB', '#1D4ED8']}
              style={styles.continueButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            >
              <Text style={styles.continueButtonText}>What it means</Text>
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
    shadowOpacity: 0.4,
    shadowRadius: 2,
    elevation: 2,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  headlineContainer: {
    marginBottom: 60,
    maxWidth: width * 0.9,
  },
  headline: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 36,
    letterSpacing: 0.5,
  },
  highlightedWord: {
    color: '#DC2626',
  },
  subHeadline: {
    fontSize: 18,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 24,
    maxWidth: width * 0.9,
    letterSpacing: 0.2,
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: width * 0.8,
    marginBottom: 40,
  },
  barColumn: {
    alignItems: 'center',
    flex: 1,
  },
  percentageLabel: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  barContainer: {
    width: 60,
    height: 200,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    borderRadius: 8,
  },
  userBar: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 8,
  },
  averageBar: {
    backgroundColor: '#10B981',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 8,
  },
  barLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  disclaimer: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: width * 0.8,
    fontStyle: 'italic',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  continueButton: {
    width: width * 0.85,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  continueButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
});

export default DependencyScoreScreen;
