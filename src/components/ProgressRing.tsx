import React from 'react';
import { View, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useColors } from '../context/ColorContext';

interface ProgressRingProps {
  progress: number; // Progress as a percentage (0-100)
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  isClaimable?: boolean;
  onClaim?: () => void;
  useGradient?: boolean;
  onPress?: () => void; // Add click handler for color picker
  showProgressRing?: boolean; // New prop to control visibility
}

const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 280,
  strokeWidth = 8,
  color = '#F8FAFC',
  backgroundColor = 'rgba(248, 250, 252, 0.1)',
  isClaimable = false,
  onClaim,
  useGradient = true,
  onPress,
  showProgressRing = true, // Default to showing
}) => {
  const { progressRingColors } = useColors();
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  // Pulse animation for claimable state - MUST be called before any early returns
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

  // If progress ring is hidden, just render the clickable area
  if (!showProgressRing) {
    return (
      <TouchableOpacity
        style={{
          width: size,
          height: size,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={onPress}
        activeOpacity={0.8}
      >
        {/* Empty clickable area - just the orb will be visible */}
      </TouchableOpacity>
    );
  }

  // Use custom colors from context if available, otherwise fall back to props
  const ringColors = progressRingColors && progressRingColors.length > 0 ? progressRingColors : [color];

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const RingContent = (
    <Animated.View style={[
      styles.container,
      isClaimable && {
        transform: [{ scale: pulseAnim }],
        shadowColor: '#F8FAFC',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.7,
        shadowRadius: 25,
        elevation: 15,
      }
    ]}>
      <Svg width={size} height={size}>
        <Defs>
          <LinearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            {ringColors.map((color, index) => (
              <Stop 
                key={index}
                offset={`${(index / (ringColors.length - 1)) * 100}%`} 
                stopColor={color} 
              />
            ))}
          </LinearGradient>
        </Defs>
        
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
          stroke={useGradient ? "url(#progressGradient)" : ringColors[0]}
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

  // If onPress is provided, wrap in TouchableOpacity for color picker functionality
  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        {RingContent}
      </TouchableOpacity>
    );
  }

  // If claimable and onClaim is provided, wrap in TouchableOpacity for claim functionality
  if (isClaimable && onClaim) {
    return (
      <TouchableOpacity onPress={onClaim} activeOpacity={0.8}>
        {RingContent}
      </TouchableOpacity>
    );
  }

  // Otherwise, return just the ring content
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