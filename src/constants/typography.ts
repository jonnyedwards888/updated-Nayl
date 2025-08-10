import { StyleSheet } from 'react-native';

// Color constants for typography
const COLORS = {
  primaryText: '#FFFFFF',
  secondaryText: '#A9A9A9',
  mutedText: '#6B7280',
  primaryAccent: '#C1FF72',
};

// Typography constants
export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
  '6xl': 60,
};

// Global typography styles
export const typography = StyleSheet.create({
  // Display styles
  displayLarge: {
    fontFamily: 'Inter',
    fontSize: FONT_SIZES['5xl'],
    fontWeight: '900',
    color: COLORS.primaryText,
  },
  displayMedium: {
    fontFamily: 'Inter',
    fontSize: FONT_SIZES['4xl'],
    fontWeight: '700',
    color: COLORS.primaryText,
  },

  // Heading styles
  h1: {
    fontFamily: 'Inter',
    fontSize: FONT_SIZES['3xl'],
    fontWeight: '700',
    color: COLORS.primaryText,
  },
  h2: {
    fontFamily: 'Inter',
    fontSize: FONT_SIZES['2xl'],
    fontWeight: '600',
    color: COLORS.primaryText,
  },
  h3: {
    fontFamily: 'Inter',
    fontSize: FONT_SIZES.xl,
    fontWeight: '600',
    color: COLORS.primaryText,
  },
  h4: {
    fontFamily: 'Inter',
    fontSize: FONT_SIZES.lg,
    fontWeight: '500',
    color: COLORS.primaryText,
  },

  // Body text styles
  bodyLarge: {
    fontFamily: 'Inter',
    fontSize: FONT_SIZES.lg,
    fontWeight: '400',
    color: COLORS.primaryText,
  },
  bodyMedium: {
    fontFamily: 'Inter',
    fontSize: FONT_SIZES.base,
    fontWeight: '500',
    color: COLORS.primaryText,
  },
  body: {
    fontFamily: 'Inter',
    fontSize: FONT_SIZES.base,
    fontWeight: '400',
    color: COLORS.primaryText,
  },
  bodySmall: {
    fontFamily: 'Inter',
    fontSize: FONT_SIZES.sm,
    fontWeight: '400',
    color: COLORS.primaryText,
  },

  // Label and caption styles
  label: {
    fontFamily: 'Inter',
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
    color: COLORS.primaryText,
  },
  caption: {
    fontFamily: 'Inter',
    fontSize: FONT_SIZES.xs,
    fontWeight: '400',
    color: COLORS.secondaryText,
  },

  // Button text styles
  buttonText: {
    fontFamily: 'Inter',
    fontSize: FONT_SIZES.base,
    fontWeight: '500',
    color: COLORS.primaryText,
  },
  buttonTextSmall: {
    fontFamily: 'Inter',
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
    color: COLORS.primaryText,
  },

  // Timer styles
  timerText: {
    fontFamily: 'monospace',
    fontSize: FONT_SIZES['3xl'],
    fontWeight: '800',
    color: COLORS.primaryText,
  },
  timerLabel: {
    fontFamily: 'Inter',
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
    color: COLORS.secondaryText,
  },

  // App title style
  appTitle: {
    fontFamily: 'Inter',
    fontSize: FONT_SIZES['2xl'],
    fontWeight: '700',
    color: COLORS.primaryText,
  },

  // Orb text style
  orbText: {
    fontFamily: 'Inter',
    fontSize: FONT_SIZES['4xl'],
    fontWeight: '600',
    color: COLORS.primaryText,
    textAlign: 'center',
    letterSpacing: 1.2,
  },
});

// Export individual styles for easy access
export const {
  displayLarge,
  displayMedium,
  h1,
  h2,
  h3,
  h4,
  bodyLarge,
  bodyMedium,
  body,
  bodySmall,
  label,
  caption,
  buttonText,
  buttonTextSmall,
  timerText,
  timerLabel,
  appTitle,
  orbText,
} = typography; 