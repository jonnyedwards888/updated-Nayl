import { Platform } from 'react-native';

// Inter font configuration
export const FONTS = {
  // Font family
  inter: Platform.select({
    ios: 'Inter',
    android: 'Inter',
    default: 'Inter',
  }),

  // Font weights
  thin: '100',
  extraLight: '200',
  light: '300',
  regular: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
  extraBold: '800',
  black: '900',

  // Font sizes
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

// Font styles for common use cases
export const FONT_STYLES = {
  // Headers
  h1: {
    fontFamily: FONTS.inter,
    fontWeight: FONTS.bold,
    fontSize: FONTS['4xl'],
  },
  h2: {
    fontFamily: FONTS.inter,
    fontWeight: FONTS.bold,
    fontSize: FONTS['3xl'],
  },
  h3: {
    fontFamily: FONTS.inter,
    fontWeight: FONTS.semiBold,
    fontSize: FONTS['2xl'],
  },
  h4: {
    fontFamily: FONTS.inter,
    fontWeight: FONTS.semiBold,
    fontSize: FONTS.xl,
  },

  // Body text
  body: {
    fontFamily: FONTS.inter,
    fontWeight: FONTS.regular,
    fontSize: FONTS.base,
  },
  bodySmall: {
    fontFamily: FONTS.inter,
    fontWeight: FONTS.regular,
    fontSize: FONTS.sm,
  },
  bodyLarge: {
    fontFamily: FONTS.inter,
    fontWeight: FONTS.regular,
    fontSize: FONTS.lg,
  },

  // Labels and captions
  label: {
    fontFamily: FONTS.inter,
    fontWeight: FONTS.medium,
    fontSize: FONTS.sm,
  },
  caption: {
    fontFamily: FONTS.inter,
    fontWeight: FONTS.regular,
    fontSize: FONTS.xs,
  },

  // Buttons
  button: {
    fontFamily: FONTS.inter,
    fontWeight: FONTS.semiBold,
    fontSize: FONTS.base,
  },
  buttonSmall: {
    fontFamily: FONTS.inter,
    fontWeight: FONTS.semiBold,
    fontSize: FONTS.sm,
  },
}; 