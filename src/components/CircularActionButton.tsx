import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useThemeGuaranteed } from '../context/ThemeContext';

const { width: screenWidth } = Dimensions.get('window');

interface CircularActionButtonProps {
  onPress: () => void;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  size?: 'small' | 'medium' | 'large';
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  disabled?: boolean;
  loading?: boolean;
  badge?: number;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  onLongPress?: () => void;
}

export default function CircularActionButton({
  onPress,
  icon,
  label,
  size = 'medium',
  variant = 'primary',
  disabled = false,
  loading = false,
  badge,
  position = 'center',
  onLongPress,
}: CircularActionButtonProps) {
  const { colors } = useThemeGuaranteed();
  
  // Enhanced safety check for theme colors
  if (!colors || 
      typeof colors !== 'object' || 
      !colors.primaryBackground || 
      !colors.primaryText ||
      !colors.primaryAccent) {
    console.warn('⚠️ CircularActionButton: Theme colors not ready, using fallback');
    // Return a minimal loading state
    return (
      <View style={{ 
        width: 80, 
        height: 80, 
        backgroundColor: '#2A2A2A', 
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Text style={{ color: '#FFFFFF', fontSize: 12 }}>Loading...</Text>
      </View>
    );
  }
  
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // Animation values
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const rotationAnim = React.useRef(new Animated.Value(0)).current;
  const glowAnim = React.useRef(new Animated.Value(0)).current;

  // Size configurations
  const sizeConfig = {
    small: { buttonSize: 56, iconSize: 16, fontSize: 14 },
    medium: { buttonSize: 56, iconSize: 24, fontSize: 12 },
    large: { buttonSize: 72, iconSize: 32, fontSize: 14 },
  };

  const { buttonSize, iconSize, fontSize } = sizeConfig[size];

  // Define variant type
  type VariantConfig = {
    colors: readonly [string, string] | readonly [string, string, string];
    hoverColors: readonly [string, string] | readonly [string, string, string];
    iconColor: string;
    textColor: string;
  };

  // Variant configurations
  const variantConfig: Record<string, VariantConfig> = {
    primary: {
      colors: ['rgb(22, 27, 56)', 'rgb(14, 19, 41)'] as const, // Use exact same colors as Brain Rewiring button
      hoverColors: ['rgb(26, 31, 60)', 'rgb(18, 23, 45)'] as const, // Slightly lighter on hover
      iconColor: colors.primaryText,
      textColor: colors.primaryText,
    },
    secondary: {
      colors: ['rgba(255,255,255,0.06)', 'rgba(255,255,255,0.02)', 'transparent'] as const,
      hoverColors: ['rgba(255,255,255,0.12)', 'rgba(255,255,255,0.06)', 'transparent'] as const,
      iconColor: colors.primaryText,
      textColor: colors.primaryText,
    },
    success: {
      colors: ['#00D4FF', '#0099FF', '#0066FF'] as const,
      hoverColors: ['#00B8E6', '#0088CC', '#0055B3'] as const,
      iconColor: '#FFFFFF',
      textColor: '#FFFFFF',
    },
    warning: {
      colors: ['#F05555', '#E02E2E', '#B61818'] as const,
      hoverColors: ['#D64A4A', '#C62A2A', '#A31515'] as const,
      iconColor: '#FFFFFF',
      textColor: '#FFFFFF',
    },
    danger: {
      colors: ['#FF4757', '#FF3742', '#FF2E3A'] as const,
      hoverColors: ['#E63E4C', '#E62F39', '#E62632'] as const,
      iconColor: '#FFFFFF',
      textColor: '#FFFFFF',
    },
  };

  // Safety check - ensure variant is valid and get currentVariant
  let currentVariant: VariantConfig = variantConfig[variant];
  if (!currentVariant) {
    console.error('❌ CircularActionButton: Invalid variant:', variant, 'Falling back to primary');
    currentVariant = variantConfig.primary;
  }
  
  // Final safety check - if even primary is invalid, create a minimal fallback
  if (!currentVariant) {
    console.error('❌ CircularActionButton: Even fallback variant is invalid! Creating minimal fallback');
    currentVariant = {
      colors: ['#000000', '#000000'] as const,
      hoverColors: ['#000000', '#000000'] as const,
      iconColor: '#FFFFFF',
      textColor: '#FFFFFF',
    };
  }

  // Position configurations
  const positionConfig = {
    'top-left': { top: 20, left: 20 },
    'top-right': { top: 20, right: 20 },
    'bottom-left': { bottom: 20, left: 20 },
    'bottom-right': { bottom: 20, right: 20 },
    'center': {},
  };

  const currentPosition = positionConfig[position];

  useEffect(() => {
    // Continuous rotation animation
    const rotateAnimation = Animated.loop(
      Animated.timing(rotationAnim, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
      })
    );

    if (isHovered && !disabled) {
      rotateAnimation.start();
    } else {
      rotateAnimation.stop();
      rotationAnim.setValue(0);
    }

    return () => rotateAnimation.stop();
  }, [isHovered, disabled, rotationAnim]);

  useEffect(() => {
    // Glow animation
    const glowAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: false,
        }),
      ])
    );

    if (isHovered && !disabled) {
      glowAnimation.start();
    } else {
      glowAnimation.stop();
      glowAnim.setValue(0);
    }

    return () => glowAnimation.stop();
  }, [isHovered, disabled, glowAnim]);

  const handlePressIn = () => {
    if (disabled) return;
    
    setIsPressed(true);
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    if (disabled) return;
    
    setIsPressed(false);
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    if (disabled || loading) return;
    onPress();
  };

  const handleLongPress = () => {
    if (disabled || loading) return;
    onLongPress?.();
  };

  const rotation = rotationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  return (
    <View style={[styles.container, currentPosition]}>
      <Animated.View
        style={[
          styles.buttonContainer,
          {
            transform: [{ scale: scaleAnim }, { rotate: rotation }],
            width: buttonSize,
            height: buttonSize,
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handlePress}
          onLongPress={handleLongPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={disabled}
          style={styles.touchable}
        >
          {variant === 'primary' ? (
            <LinearGradient
              colors={currentVariant.colors}
              style={[
                styles.button,
                {
                  width: buttonSize,
                  height: buttonSize,
                  borderRadius: buttonSize / 2,
                },
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            >
              {/* Glow effect - removed for primary variant to match Brain Rewiring button exactly */}

              {/* Icon */}
              {loading ? (
                <Animated.View style={[styles.loadingSpinner, { borderColor: currentVariant.iconColor }]} />
              ) : (
                <Ionicons
                  name={icon}
                  size={iconSize}
                  color={currentVariant.iconColor}
                  style={styles.icon}
                />
              )}

              {/* Badge */}
              {badge && badge > 0 && (
                <View style={[styles.badge, { backgroundColor: colors.primaryAccent }]}>
                  <Text style={[styles.badgeText, { color: colors.primaryText }]}>
                    {badge > 99 ? '99+' : badge}
                  </Text>
                </View>
              )}
            </LinearGradient>
          ) : (
            <LinearGradient
              colors={currentVariant.colors}
              style={[
                styles.button,
                {
                  width: buttonSize,
                  height: buttonSize,
                  borderRadius: buttonSize / 2,
                },
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            >
              {/* Glow effect */}
              <Animated.View
                style={[
                  styles.glow,
                  {
                    opacity: glowOpacity,
                    width: buttonSize,
                    height: buttonSize,
                    borderRadius: buttonSize / 2,
                  },
                ]}
              />

              {/* Icon */}
              {loading ? (
                <Animated.View style={[styles.loadingSpinner, { borderColor: currentVariant.iconColor }]} />
              ) : (
                <Ionicons
                  name={icon}
                  size={iconSize}
                  color={currentVariant.iconColor}
                  style={styles.icon}
                />
              )}

              {/* Badge */}
              {badge && badge > 0 && (
                <View style={[styles.badge, { backgroundColor: colors.primaryAccent }]}>
                  <Text style={[styles.badgeText, { color: colors.primaryText }]}>
                    {badge > 99 ? '99+' : badge}
                  </Text>
                </View>
              )}
            </LinearGradient>
          )}
        </TouchableOpacity>

        {/* Label */}
        <Text
          style={[
            styles.label,
            {
              color: currentVariant.textColor,
              fontSize: sizeConfig[size].fontSize,
              lineHeight: sizeConfig[size].fontSize + 2,
            },
          ]}
          numberOfLines={2}
          adjustsFontSizeToFit={true}
        >
          {label}
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  buttonContainer: {
    alignItems: 'center',
  },
  touchable: {
    borderRadius: 999,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  glow: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  icon: {
    zIndex: 2,
  },
  loadingSpinner: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderTopColor: 'transparent',
    borderRadius: 10,
    zIndex: 2,
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    zIndex: 3,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  label: {
    marginTop: 8,
    fontWeight: '700',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    minWidth: 80,
    maxWidth: 100,
  },
}); 