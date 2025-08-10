import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/theme';
import AnimationService, { AnimationType } from '../services/animationService';

interface BrandLogoProps {
  size?: 'small' | 'medium' | 'large';
  style?: any;
}

const BrandLogo: React.FC<BrandLogoProps> = ({ 
  size = 'medium', 
  style 
}) => {
  // Animation values for premium feel
  const glowAnim = useRef(new Animated.Value(1)).current;
  const floatAnim = useRef(new Animated.Value(1)).current;
  
  // Start breathing animation on mount
  useEffect(() => {
    AnimationService.breathing(floatAnim);
    AnimationService.glowPulse(glowAnim);
  }, []);
  
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          fontSize: 20,
          letterSpacing: 2,
          paddingHorizontal: 8,
          paddingVertical: 4,
        };
      case 'large':
        return {
          fontSize: 32,
          letterSpacing: 3,
          paddingHorizontal: 12,
          paddingVertical: 6,
        };
      default: // medium
        return {
          fontSize: 26,
          letterSpacing: 2.5,
          paddingHorizontal: 10,
          paddingVertical: 5,
        };
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <Animated.View 
      style={[
        styles.container, 
        style,
        {
          transform: [{ scale: floatAnim }],
        },
      ]}
    >
      <Text style={[styles.logoText, { fontSize: sizeStyles.fontSize, letterSpacing: sizeStyles.letterSpacing }]}>
        NAYL
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradientBackground: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    position: 'relative',
    overflow: 'hidden',
  },
           logoText: {
           fontFamily: 'System',
           fontWeight: '800',
           color: COLORS.primaryText,
           textAlign: 'center',
           textShadowColor: 'rgba(0, 0, 0, 0.5)',
           textShadowOffset: { width: 0, height: 2 },
           textShadowRadius: 4,
           // Custom letter styling for modern tech feel
           transform: [{ scaleX: 1.05 }], // Slightly wider letters
         },
  innerGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  borderGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
});

export default BrandLogo; 