import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

interface MilestoneCheckmarkProps {
  color: string;
  size?: number;
  delay?: number;
  style?: any;
}

const MilestoneCheckmark: React.FC<MilestoneCheckmarkProps> = ({
  color,
  size = 32,
  delay = 0,
  style,
}) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      opacity.value = withSpring(1, { damping: 15, stiffness: 100 });
      scale.value = withSpring(1, { damping: 15, stiffness: 100 });
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  // Define gradient colors based on the base color
  const getGradientColors = (baseColor: string): [string, string, string] => {
    switch (baseColor) {
      case '#F97316': // Orange
        return ['#F97316', '#EA580C', '#DC2626'];
      case '#10B981': // Green
        return ['#10B981', '#059669', '#047857'];
      case '#3B82F6': // Blue
        return ['#3B82F6', '#2563EB', '#1D4ED8'];
      default:
        return [baseColor, baseColor, baseColor];
    }
  };

  const gradientColors = getGradientColors(color);

  return (
    <Animated.View style={[styles.container, { width: size, height: size }, style, animatedStyle]}>
      <LinearGradient
        colors={gradientColors}
        style={[styles.gradient, { borderRadius: size / 2 }]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Simple, clean checkmark symbol */}
        <Text style={styles.checkmark}>✓</Text>
        
        {/* Subtle highlight for premium feel */}
        <View style={[styles.highlight, { borderRadius: size / 2 }]} />
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  gradient: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  checkmark: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
    zIndex: 2,
  },
  highlight: {
    position: 'absolute',
    top: 2,
    left: 2,
    right: 2,
    height: '30%',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 999,
  },
});

export default MilestoneCheckmark;
