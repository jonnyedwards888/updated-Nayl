import React from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Animated } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const { width } = Dimensions.get('window');

interface ProgressRingProps {
  progress: number; // Progress as a percentage (0-100)
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  isClaimable?: boolean;
  onClaim?: () => void;
}

const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 280,
  strokeWidth = 8,
  color = '#C1FF72',
  backgroundColor = 'rgba(193, 255, 114, 0.2)',
  isClaimable = false,
  onClaim,
}) => {
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  // Pulse animation for claimable state
  React.useEffect(() => {
    if (isClaimable) {
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.02,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isClaimable, pulseAnim]);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const RingContent = (
    <Animated.View style={[
      styles.container,
      isClaimable && {
        transform: [{ scale: pulseAnim }],
        shadowColor: '#A3FF00',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.7,
        shadowRadius: 25,
        elevation: 15,
      }
    ]}>
      <Svg width={size} height={size}>
        {/* Background circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
    </Animated.View>
  );

  if (isClaimable && onClaim) {
    return (
      <TouchableOpacity 
        style={styles.touchableContainer} 
        onPress={onClaim}
        activeOpacity={0.8}
      >
        {RingContent}
      </TouchableOpacity>
    );
  }

  return RingContent;
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  touchableContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ProgressRing; 