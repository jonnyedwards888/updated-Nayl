import React, { useEffect, useRef } from 'react';
import { View, TextStyle, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, interpolate } from 'react-native-reanimated';

interface AnimatedDigitProps {
  digit: number;
  style?: TextStyle;
  durationMs?: number;
  slideDistance?: number;
}

// AnimatedDigit renders a single numeric digit with a vertical slot/tumbler animation
// Previous digit slides down and fades; new digit slides in from above
const AnimatedDigit: React.FC<AnimatedDigitProps> = ({
  digit,
  style,
  durationMs = 180,
  slideDistance = 18,
}) => {
  const progress = useSharedValue(1);
  const previousDigitRef = useRef<number | null>(null);
  const firstRenderRef = useRef(true);

  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      previousDigitRef.current = digit;
      progress.value = 1;
      return;
    }

    // Trigger transition
    progress.value = 0;
    progress.value = withTiming(1, { duration: durationMs });
  }, [digit, durationMs, progress]);

  const previousStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(progress.value, [0, 1], [0, slideDistance]) }],
    opacity: interpolate(progress.value, [0, 1], [1, 0]),
  }));

  const currentStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(progress.value, [0, 1], [-slideDistance, 0]) }],
    opacity: interpolate(progress.value, [0, 1], [0, 1]),
  }));

  const previousDigit = previousDigitRef.current ?? digit;
  previousDigitRef.current = digit; // update for next change

  return (
    <View style={styles.container}>
      <Animated.Text style={[style as any, styles.overlay, previousStyle]}>{previousDigit}</Animated.Text>
      <Animated.Text style={[style as any, currentStyle]}>{digit}</Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
});

export default AnimatedDigit;


