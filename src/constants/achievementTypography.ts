import { StyleSheet } from 'react-native';

// Premium Achievement Typography System
export const ACHIEVEMENT_TYPOGRAPHY = StyleSheet.create({
  // Hero Title - Main achievement name
  heroTitle: {
    fontFamily: 'Inter',
    fontSize: 42,
    fontWeight: '900',
    lineHeight: 48,
    letterSpacing: 1.2,
    textAlign: 'center',
    color: '#FFFFFF',
    // Premium text shadows for depth
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
  },

  // Subtitle - Achievement description
  subtitle: {
    fontFamily: 'Inter',
    fontSize: 22,
    fontWeight: '600',
    lineHeight: 32,
    letterSpacing: 0.3,
    textAlign: 'center',
    color: '#F8FAFC',
    // Enhanced text shadows
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },

  // Progress Text - Achievement progress indicator
  progressText: {
    fontFamily: 'Inter',
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 26,
    letterSpacing: 0.3,
    textAlign: 'center',
    color: '#C1FF72',
    // Accent color shadows
    textShadowColor: 'rgba(193, 255, 114, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  // Button Text - Action buttons
  buttonText: {
    fontFamily: 'Inter',
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 24,
    letterSpacing: 0.5,
    textAlign: 'center',
    color: '#FFFFFF',
    // Premium button text shadows
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  // Icon Text - Emoji or symbol achievements
  iconText: {
    fontFamily: 'Inter',
    fontSize: 160,
    fontWeight: '900',
    lineHeight: 240,
    textAlign: 'center',
    color: '#FFFFFF',
    // Enhanced icon shadows
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 8,
  },

  // Caption Text - Small descriptive text
  caption: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 22,
    letterSpacing: 0.2,
    textAlign: 'center',
    color: '#94A3B8',
    // Subtle shadows for captions
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  // Popup Title - For smaller achievement popups
  popupTitle: {
    fontFamily: 'Inter',
    fontSize: 32,
    fontWeight: '800',
    lineHeight: 38,
    letterSpacing: 0.8,
    textAlign: 'center',
    color: '#FFFFFF',
    // Enhanced popup shadows
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },

  // Popup Description - For smaller achievement descriptions
  popupDescription: {
    fontFamily: 'Inter',
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 26,
    letterSpacing: 0.2,
    textAlign: 'center',
    color: '#F8FAFC',
    // Enhanced popup shadows
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});

// Premium Achievement Spacing System
export const ACHIEVEMENT_SPACING = {
  // Component spacing
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
  
  // Specific achievement spacing - reduced for tighter layout
  titleMargin: 24,        // Reduced from 40px to bring header down
  iconMargin: 20,         // Reduced from 32px for tighter spacing
  descriptionMargin: 24,  // Reduced from 32px for better flow
  buttonMargin: 32,       // Reduced from 40px for tighter button spacing
  containerPadding: 32,   // Reduced from 40px for less top padding
  textContainerPadding: 16, // Reduced from 20px for tighter text spacing
  
  // Additional spacing for better balance
  sectionGap: 32,         // Reduced from 48px for tighter sections
  elementGap: 16,         // Reduced from 20px for tighter elements
  compactGap: 12,         // Reduced from 16px for tighter compact spacing
};

// Premium Achievement Shadows System
export const ACHIEVEMENT_SHADOWS = {
  // Card shadows
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 30 },
    shadowOpacity: 0.95,
    shadowRadius: 60,
    elevation: 30,
  },

  // Icon shadows
  icon: {
    shadowColor: '#C1FF72',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 40,
    elevation: 20,
  },

  // Button shadows
  button: {
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },

  // Close button shadows
  closeButton: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },

  // Text container shadows
  textContainer: {
    shadowColor: 'rgba(255, 255, 255, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
};

// Premium Achievement Colors System
export const ACHIEVEMENT_COLORS = {
  // Primary colors
  primary: '#FFFFFF',
  secondary: '#F8FAFC',
  accent: '#C1FF72',
  
  // Background colors
  cardBackground: 'rgba(8, 12, 25, 0.85)',
  popupBackground: 'rgba(8, 12, 25, 0.75)',
  textContainerBackground: 'rgba(255, 255, 255, 0.02)',
  
  // Border colors
  primaryBorder: 'rgba(193, 255, 114, 0.08)',
  secondaryBorder: 'rgba(102, 126, 234, 0.06)',
  textContainerBorder: 'rgba(255, 255, 255, 0.06)',
  
  // Button colors
  continueButton: ['#007AFF', '#0056CC', '#004499'],
  closeButtonBackground: 'rgba(255, 255, 255, 0.08)',
  closeButtonBorder: 'rgba(255, 255, 255, 0.15)',
  
  // 🎨 ARCANE-STYLE GRADIENTS - Exciting & Beautiful
  // Inspired by the warm, radiant gradients from Arcane TV show
  
  // Primary Arcane Gradient - Warm, radiant, dramatic with purple/blue tinges
  arcanePrimary: [
    'rgba(255, 255, 255, 0.95)',    // Bright white-yellow center (like Arcane light beam)
    'rgba(255, 220, 180, 0.9)',     // Warm golden with subtle purple tinge
    'rgba(255, 180, 120, 0.85)',    // Rich orange with blue undertones
    'rgba(220, 120, 80, 0.8)',      // Deep orange-red with purple tinge
    'rgba(180, 80, 120, 0.75)',     // Rich crimson with blue-purple
    'rgba(120, 60, 140, 0.7)',      // Deep burgundy with purple
    'rgba(80, 40, 100, 0.65)',      // Dark purple-blue
  ] as const,
  
  // Secondary Arcane Gradient - Cooler, atmospheric with radiant blues
  arcaneSecondary: [
    'rgba(255, 255, 255, 0.9)',     // Bright center
    'rgba(200, 200, 255, 0.85)',    // Soft white-blue
    'rgba(150, 150, 255, 0.8)',     // Rich blue
    'rgba(100, 100, 255, 0.75)',    // Deep blue
    'rgba(80, 80, 200, 0.7)',       // Dark blue
    'rgba(60, 60, 150, 0.65)',      // Very dark blue
  ] as const,
  
  // Accent Arcane Gradient - Green-gold energy with blue tinges
  arcaneAccent: [
    'rgba(255, 255, 200, 0.9)',     // Bright yellow-green
    'rgba(220, 255, 180, 0.85)',    // Lime green with blue tinge
    'rgba(180, 255, 160, 0.8)',     // Bright green with purple undertone
    'rgba(140, 255, 140, 0.75)',    // Medium green with blue
    'rgba(100, 200, 120, 0.7)',     // Darker green with purple tinge
    'rgba(80, 150, 100, 0.65)',     // Deep green with blue
  ] as const,
  
  // Atmospheric Arcane Gradient - Smoky, ethereal with purple/blue mist
  arcaneAtmospheric: [
    'rgba(255, 255, 255, 0.1)',     // Subtle white mist
    'rgba(255, 220, 255, 0.08)',    // Warm white with purple tinge
    'rgba(220, 200, 255, 0.06)',    // Golden mist with blue
    'rgba(200, 180, 255, 0.04)',    // Orange mist with purple
    'rgba(180, 160, 255, 0.02)',    // Red mist with blue tinge
    'transparent',                    // Fade to transparent
  ] as const,
  
  // Particle Arcane Colors - For dynamic effects with purple/blue tinges
  arcaneParticles: [
    '#FFD700',  // Bright gold
    '#FFA500',  // Orange
    '#FF6347',  // Tomato red
    '#FF4500',  // Orange red
    '#DC143C',  // Crimson
    '#FF69B4',  // Hot pink
    '#FF1493',  // Deep pink
    '#FF00FF',  // Magenta
    '#8A2BE2',  // Blue violet
    '#4B0082',  // Indigo
    '#9370DB',  // Medium slate blue
    '#20B2AA',  // Light sea green
    '#00CED1',  // Dark turquoise
    '#40E0D0',  // Turquoise
  ],
  
  // Glow Arcane Colors - For dramatic lighting effects with purple/blue tinges
  arcaneGlow: {
    primary: 'rgba(255, 255, 220, 0.4)',      // Bright center glow with purple tinge
    secondary: 'rgba(255, 180, 120, 0.3)',    // Orange glow with blue undertone
    accent: 'rgba(220, 120, 180, 0.25)',      // Red glow with purple tinge
    atmospheric: 'rgba(220, 200, 255, 0.15)', // Warm mist glow with blue tinge
    // New magical glow colors
    magical: 'rgba(180, 160, 255, 0.3)',      // Purple-blue magical glow
    radiant: 'rgba(160, 200, 255, 0.25)',     // Blue radiant glow
    ethereal: 'rgba(255, 200, 255, 0.2)',     // Pink-purple ethereal glow
  },
};

export default {
  ACHIEVEMENT_TYPOGRAPHY,
  ACHIEVEMENT_SPACING,
  ACHIEVEMENT_SHADOWS,
  ACHIEVEMENT_COLORS,
};
