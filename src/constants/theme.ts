// Nayl App Design System - Theme Constants

export const COLORS = {
  // Primary Colors - Premium Dark Theme
  primaryBackground: '#0A0A0F',
  secondaryBackground: '#1A1A2E',
  cardBackground: '#16213E',
  
  // Premium Accent Colors
  primaryAccent: '#C1FF72',
  secondaryAccent: '#0A4F6B',
  accentGradient: ['#C1FF72', '#A8E85C'],
  
  // Premium UI Colors
  premiumWhite: '#F8FAFC', // Subtle off-white for premium feel
  
  // Enhanced Semantic Colors
  destructiveAction: '#FF4757',
  success: '#2ED573',
  warning: '#FFA502',
  info: '#3742FA',
  
  // Premium Text Colors
  primaryText: '#FFFFFF',
  secondaryText: '#E2E8F0',
  mutedText: '#94A3B8',
  placeholder: '#64748B',
  
  // Background Colors
  overlay: 'rgba(0, 0, 0, 0.7)',
  
  // Premium Gradients
  // Subtle three-stop gradient with deeper navy base and a soft indigo-mid for more depth
  backgroundGradient: ['rgb(15, 23, 42)', 'rgb(33, 28, 75)', 'rgb(15, 23, 48)'] as const,
  orbGradient: ['#667eea', '#764ba2', '#f093fb'] as const,
  orbGlow: 'rgba(255, 255, 255, 0.55)',
  
  
  // Enhanced UI Colors
  progressBar: '#4F46E5',
  progressBarFill: '#818CF8',
  buttonGradient: ['#667eea', '#764ba2'],
};

export const TYPOGRAPHY = {
  // Premium Display Text
  displayLarge: { fontSize: 56, fontFamily: 'Inter-Bold', fontWeight: '900' as const },
  displayMedium: { fontSize: 42, fontFamily: 'Inter-Bold', fontWeight: '800' as const },
  
  // Enhanced Headings
  headingLarge: { fontSize: 36, fontFamily: 'Inter-Bold', fontWeight: '700' as const },
  headingMedium: { fontSize: 28, fontFamily: 'Inter-SemiBold', fontWeight: '600' as const },
  headingSmall: { fontSize: 22, fontFamily: 'Inter-SemiBold', fontWeight: '600' as const },
  
  // Premium Body Text
  bodyLarge: { fontSize: 20, fontFamily: 'Inter-Medium', fontWeight: '500' as const },
  bodyMedium: { fontSize: 18, fontFamily: 'Inter-Regular', fontWeight: '400' as const },
  bodySmall: { fontSize: 16, fontFamily: 'Inter-Regular', fontWeight: '400' as const },
  
  // Enhanced Specialized Text
  caption: { fontSize: 14, fontFamily: 'Inter-Regular', fontWeight: '400' as const },
  buttonText: { fontSize: 18, fontFamily: 'Inter-SemiBold', fontWeight: '600' as const },
  timerText: { fontSize: 48, fontFamily: 'Inter-Bold', fontWeight: '900' as const, fontVariant: ['tabular-nums'] as any },
  
  // Hero Text for Orb
  heroText: { fontSize: 52, fontFamily: 'Inter-Bold', fontWeight: '900' as const },
};

export const SPACING = {
  // 4-Point Grid System
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const SHADOWS = {
  // Premium Button shadows
  button: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  
  // Premium Card shadows
  card: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  
  // Enhanced Glow effects
  glow: {
    shadowColor: COLORS.primaryAccent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 12,
  },
  
  // Orb glow effect
  orbGlow: {
    shadowColor: COLORS.orbGlow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 30,
    elevation: 15,
  },
  
  // Premium depth shadows
  deep: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 16,
  },
};

export const ANIMATIONS = {
  // Duration constants
  fast: 200,
  normal: 300,
  slow: 400,
  verySlow: 800,
  
  // Easing functions
  easeInOut: 'ease-in-out',
  easeOut: 'ease-out',
  easeIn: 'ease-in',
};

export const LAYOUT = {
  // Screen dimensions
  screenPadding: SPACING.lg,
  componentPadding: SPACING.md,
  
  // Component sizes
  buttonHeight: 48,
  inputHeight: 48,
  tabBarHeight: 80,
  
  // Orb dimensions
  orbSize: 200,
  orbRingWidth: 8,
  progressDotSize: 8,
};

export default {
  COLORS,
  TYPOGRAPHY,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
  ANIMATIONS,
  LAYOUT,
}; 