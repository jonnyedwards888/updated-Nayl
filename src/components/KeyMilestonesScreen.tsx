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
  withDelay,
  Easing,
} from 'react-native-reanimated';
import Svg, { Path, Circle, G } from 'react-native-svg';
import hapticService, { HapticType, HapticIntensity } from '../services/hapticService';
import MilestoneCheckmark from './MilestoneCheckmark';

const { width, height } = Dimensions.get('window');

interface KeyMilestonesScreenProps {
  onContinue: () => void;
}

const KeyMilestonesScreen: React.FC<KeyMilestonesScreenProps> = ({ onContinue }) => {
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
  
  const graphOpacity = useSharedValue(0);
  const graphTranslateY = useSharedValue(30);
  
  const lineProgress = useSharedValue(0);
  
  const milestone1Opacity = useSharedValue(0);
  const milestone1Scale = useSharedValue(0);
  
  const milestone2Opacity = useSharedValue(0);
  const milestone2Scale = useSharedValue(0);
  
  const milestone3Opacity = useSharedValue(0);
  const milestone3Scale = useSharedValue(0);
  
  const listOpacity = useSharedValue(0);
  const listTranslateY = useSharedValue(30);
  
  const buttonOpacity = useSharedValue(0);
  const buttonTranslateY = useSharedValue(30);

  // Graph dimensions and data
  const graphWidth = width * 0.8;
  const graphHeight = 200;
  const graphPadding = 40;
  
  // Define the improvement curve points
  const curvePoints = [
    { x: 0, y: graphHeight - graphPadding }, // Start at bottom
    { x: graphWidth * 0.2, y: graphHeight - graphPadding - 60 }, // Early improvement
    { x: graphWidth * 0.4, y: graphHeight - graphPadding - 100 }, // 30 days
    { x: graphWidth * 0.6, y: graphHeight - graphPadding - 120 }, // Continued progress
    { x: graphWidth * 0.8, y: graphHeight - graphPadding - 140 }, // 90 days
    { x: graphWidth, y: graphHeight - graphPadding - 150 }, // Final improvement
  ];

  // Create SVG path for the improvement curve
  const createCurvePath = () => {
    if (curvePoints.length < 2) return '';
    
    let path = `M ${curvePoints[0].x} ${curvePoints[0].y}`;
    
    for (let i = 1; i < curvePoints.length; i++) {
      const prev = curvePoints[i - 1];
      const curr = curvePoints[i];
      
      // Create smooth curve using quadratic bezier
      const controlX = prev.x + (curr.x - prev.x) * 0.5;
      const controlY = prev.y;
      
      path += ` Q ${controlX} ${controlY} ${curr.x} ${curr.y}`;
    }
    
    return path;
  };

  // Get animated path based on progress
  const getAnimatedPath = () => {
    const progress = lineProgress.value;
    if (progress <= 0) return '';
    
    const visiblePoints = curvePoints.filter((_, index) => 
      (index / (curvePoints.length - 1)) <= progress
    );
    
    if (visiblePoints.length < 2) return '';
    
    let path = `M ${visiblePoints[0].x} ${visiblePoints[0].y}`;
    
    for (let i = 1; i < visiblePoints.length; i++) {
      const prev = visiblePoints[i - 1];
      const curr = visiblePoints[i];
      
      const controlX = prev.x + (curr.x - prev.x) * 0.5;
      const controlY = prev.y;
      
      path += ` Q ${controlX} ${controlY} ${curr.x} ${curr.y}`;
    }
    
    return path;
  };

  useEffect(() => {
    // Start the animation sequence
    const startAnimations = () => {
      // 1. Title animation (500ms, no delay)
      titleOpacity.value = withTiming(1, { duration: 500, easing: Easing.out(Easing.cubic) });
      titleTranslateY.value = withTiming(0, { duration: 500, easing: Easing.out(Easing.cubic) });

      // 2. Graph container animation (300ms delay)
      setTimeout(() => {
        graphOpacity.value = withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) });
        graphTranslateY.value = withTiming(0, { duration: 600, easing: Easing.out(Easing.cubic) });
        
        // Start line drawing animation
        lineProgress.value = withTiming(1, { 
          duration: 2000, 
          easing: Easing.out(Easing.cubic) 
        });
      }, 300);

      // 3. Milestone markers animation (as line progresses)
      setTimeout(() => {
        // First milestone (7 days) - appears when line reaches ~20%
        milestone1Opacity.value = withSpring(1, { damping: 15, stiffness: 100 });
        milestone1Scale.value = withSpring(1, { damping: 15, stiffness: 100 });
      }, 800);

      setTimeout(() => {
        // Second milestone (30 days) - appears when line reaches ~40%
        milestone2Opacity.value = withSpring(1, { damping: 15, stiffness: 100 });
        milestone2Scale.value = withSpring(1, { damping: 15, stiffness: 100 });
      }, 1200);

      setTimeout(() => {
        // Third milestone (90 days) - appears when line reaches ~80%
        milestone3Opacity.value = withSpring(1, { damping: 15, stiffness: 100 });
        milestone3Scale.value = withSpring(1, { damping: 15, stiffness: 100 });
      }, 1800);

      // Add subtle pulse animation to milestone markers
      setTimeout(() => {
        milestone1Scale.value = withSpring(1.05, { damping: 15, stiffness: 100 });
        setTimeout(() => {
          milestone1Scale.value = withSpring(1, { damping: 15, stiffness: 100 });
        }, 200);
      }, 1000);

      setTimeout(() => {
        milestone2Scale.value = withSpring(1.05, { damping: 15, stiffness: 100 });
        setTimeout(() => {
          milestone2Scale.value = withSpring(1, { damping: 15, stiffness: 100 });
        }, 200);
      }, 1400);

      setTimeout(() => {
        milestone3Scale.value = withSpring(1.05, { damping: 15, stiffness: 100 });
        setTimeout(() => {
          milestone3Scale.value = withSpring(1, { damping: 15, stiffness: 100 });
        }, 200);
      }, 2000);

      // 4. List animation (after line completes)
      setTimeout(() => {
        listOpacity.value = withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) });
        listTranslateY.value = withTiming(0, { duration: 600, easing: Easing.out(Easing.cubic) });
      }, 2200);

      // 5. Button animation (after list)
      setTimeout(() => {
        buttonOpacity.value = withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) });
        buttonTranslateY.value = withTiming(0, { duration: 600, easing: Easing.out(Easing.cubic) });
      }, 2800);
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

  const handleContinue = () => {
    hapticService.trigger(HapticType.SUCCESS, HapticIntensity.NORMAL);
    onContinue();
  };

  // Animated styles
  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));

  const graphStyle = useAnimatedStyle(() => ({
    opacity: graphOpacity.value,
    transform: [{ translateY: graphTranslateY.value }],
  }));

  const listStyle = useAnimatedStyle(() => ({
    opacity: listOpacity.value,
    transform: [{ translateY: listTranslateY.value }],
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
    transform: [{ translateY: buttonTranslateY.value }],
  }));

  const milestone1Style = useAnimatedStyle(() => ({
    opacity: milestone1Opacity.value,
    transform: [{ scale: milestone1Scale.value }],
  }));

  const milestone2Style = useAnimatedStyle(() => ({
    opacity: milestone2Opacity.value,
    transform: [{ scale: milestone2Scale.value }],
  }));

  const milestone3Style = useAnimatedStyle(() => ({
    opacity: milestone3Opacity.value,
    transform: [{ scale: milestone3Scale.value }],
  }));

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
            Your journey to healthier nails
          </Text>
        </Animated.View>

        {/* Animated Graph */}
        <Animated.View style={[styles.graphContainer, graphStyle]}>
          <Svg width={graphWidth} height={graphHeight} style={styles.graph}>
            {/* Enhanced Grid lines */}
            <G stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.5">
              {[0, 1, 2, 3, 4].map((i) => (
                <Path
                  key={`grid-${i}`}
                  d={`M 0 ${graphHeight - graphPadding - (i * 30)} L ${graphWidth} ${graphHeight - graphPadding - (i * 30)}`}
                />
              ))}
            </G>
            
            {/* Enhanced Improvement curve with premium styling */}
            <Path
              d={getAnimatedPath()}
              stroke="#3B82F6"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.9"
            />
            
            {/* Enhanced Milestone markers with premium styling */}
            <Animated.View style={[styles.milestoneContainer, milestone1Style]}>
              <View style={[styles.milestoneMarker, { left: graphWidth * 0.2 - 16, top: graphHeight - graphPadding - 60 - 16 }]}>
                <MilestoneCheckmark color="#F97316" size={32} />
              </View>
              <Text style={[styles.milestoneLabel, { left: graphWidth * 0.2 - 20 }]}>
                7 days
              </Text>
            </Animated.View>

            <Animated.View style={[styles.milestoneContainer, milestone2Style]}>
              <View style={[styles.milestoneMarker, { left: graphWidth * 0.4 - 16, top: graphHeight - graphPadding - 100 - 16 }]}>
                <MilestoneCheckmark color="#10B981" size={32} />
              </View>
              <Text style={[styles.milestoneLabel, { left: graphWidth * 0.4 - 20 }]}>
                30 days
              </Text>
            </Animated.View>

            <Animated.View style={[styles.milestoneContainer, milestone3Style]}>
              <View style={[styles.milestoneMarker, { left: graphWidth * 0.8 - 16, top: graphHeight - graphPadding - 140 - 16 }]}>
                <MilestoneCheckmark color="#3B82F6" size={32} />
              </View>
              <Text style={[styles.milestoneLabel, { left: graphWidth * 0.8 - 20 }]}>
                90 days
              </Text>
            </Animated.View>
          </Svg>
        </Animated.View>

        {/* Milestones List */}
        <Animated.View style={[styles.milestonesList, listStyle]}>
          <Text style={styles.listTitle}>The key milestones are</Text>
          
          <View style={styles.milestoneItem}>
            <View style={styles.milestoneCheckmarkWrapper}>
              <MilestoneCheckmark color="#F97316" size={32} />
            </View>
            <Text style={styles.milestoneText}>
              Noticeably healthier nails and skin within the first 1-2 weeks.
            </Text>
          </View>

          <View style={styles.milestoneItem}>
            <View style={styles.milestoneCheckmarkWrapper}>
              <MilestoneCheckmark color="#10B981" size={32} />
            </View>
            <Text style={styles.milestoneText}>
              Significant reduction in anxiety and stress-related habits after 30 days.
            </Text>
          </View>

          <View style={styles.milestoneItem}>
            <View style={styles.milestoneCheckmarkWrapper}>
              <MilestoneCheckmark color="#3B82F6" size={32} />
            </View>
            <Text style={styles.milestoneText}>
              Increased confidence in social and professional situations within 90 days.
            </Text>
          </View>
        </Animated.View>

        {/* Continue Button */}
        <Animated.View style={[styles.buttonContainer, buttonStyle]}>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#3B82F6', '#2563EB', '#1D4ED8']}
              style={styles.continueButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
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
    marginBottom: 60,
    maxWidth: width * 0.9,
  },
  headline: {
    fontSize: 34,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 42,
    letterSpacing: 0.6,
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
  },
  graphContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  graph: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
  },
  milestoneContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  milestoneMarker: {
    position: 'absolute',
    zIndex: 10,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  milestoneLabel: {
    position: 'absolute',
    top: 20,
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    width: 50,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  milestonesList: {
    width: '100%',
    marginBottom: 60,
  },
  listTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 28,
    letterSpacing: 0.4,
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  milestoneItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  milestoneCheckmarkWrapper: {
    marginRight: 16,
    marginTop: 2,
  },
  milestoneIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    marginTop: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  checkmark: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  milestoneText: {
    flex: 1,
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
    lineHeight: 24,
    letterSpacing: 0.3,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  continueButton: {
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
  continueButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButtonText: {
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

export default KeyMilestonesScreen;
