import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

interface AnimatedProgressRingProps {
  progress: number; // Progress as a percentage (0-100)
  size?: number;
  strokeWidth?: number;
  duration?: number;
}

const AnimatedProgressRing: React.FC<AnimatedProgressRingProps> = ({
  progress,
  size = 360,
  strokeWidth = 16,
  duration = 800, // Faster animation for premium feel
}) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const hasAnimated = useRef(false);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  // Animate progress from 0 to target value on mount (ONCE ONLY)
  useEffect(() => {
    // Only animate if we haven't animated before
    if (hasAnimated.current) {
      return;
    }

    hasAnimated.current = true;
    const startTime = Date.now();
    const targetProgress = progress;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progressRatio = Math.min(elapsed / duration, 1);
      
      // Use easing function for smooth animation
      const easeOutCubic = 1 - Math.pow(1 - progressRatio, 3);
      const currentProgress = targetProgress * easeOutCubic;
      
      setAnimatedProgress(currentProgress);
      
      if (progressRatio < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    animate();
  }, []); // Empty dependency array - only run once on mount

  // Calculate the current stroke dash offset based on animated progress
  const strokeDashoffset = circumference - (animatedProgress / 100) * circumference;

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        <Defs>
          <LinearGradient 
            id="analyticsProgressGradient" 
            x1="0%" 
            y1="0%" 
            x2="100%" 
            y2="0%"
          >
            <Stop offset="0%" stopColor="#00D4FF" />
            <Stop offset="50%" stopColor="#0099FF" />
            <Stop offset="100%" stopColor="#0066FF" />
          </LinearGradient>
        </Defs>
        
        {/* Background track circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        
        {/* Progress circle - will animate from 0 to target progress */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#analyticsProgressGradient)"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AnimatedProgressRing;
