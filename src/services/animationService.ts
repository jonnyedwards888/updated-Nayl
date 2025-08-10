import { Animated, Easing } from 'react-native';

// Animation presets inspired by premium apps
export enum AnimationType {
  // Button interactions
  BUTTON_PRESS = 'button_press',
  BUTTON_RELEASE = 'button_release',
  BUTTON_BOUNCE = 'button_bounce',
  
  // Selection interactions
  SELECTION_HIGHLIGHT = 'selection_highlight',
  SELECTION_PULSE = 'selection_pulse',
  
  // Success/Completion
  SUCCESS_CHECKMARK = 'success_checkmark',
  COMPLETION_SPARKLE = 'completion_sparkle',
  
  // Loading/Progress
  PROGRESS_PULSE = 'progress_pulse',
  LOADING_SPIN = 'loading_spin',
  
  // Navigation
  PAGE_TRANSITION = 'page_transition',
  MODAL_ENTER = 'modal_enter',
  MODAL_EXIT = 'modal_exit',
  
  // Special effects
  BREATHING = 'breathing',
  FLOATING = 'floating',
  GLOW_PULSE = 'glow_pulse',
}

// Easing functions for premium feel
const PREMIUM_EASINGS = {
  // Apple-style easing
  apple: Easing.bezier(0.25, 0.46, 0.45, 0.94),
  
  // Instagram-style easing
  instagram: Easing.bezier(0.4, 0.0, 0.2, 1),
  
  // TikTok-style easing
  tiktok: Easing.bezier(0.25, 0.1, 0.25, 1),
  
  // Bounce easing
  bounce: Easing.bounce,
  
  // Elastic easing
  elastic: Easing.elastic(1),
  
  // Custom premium easing
  premium: Easing.bezier(0.34, 1.56, 0.64, 1),
};

class AnimationService {
  // Button press animation with haptic-like feel
  static buttonPress(animatedValue: Animated.Value, callback?: () => void) {
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 0.95,
        duration: 100,
        easing: PREMIUM_EASINGS.apple,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 150,
        easing: PREMIUM_EASINGS.premium,
        useNativeDriver: true,
      }),
    ]).start(callback);
  }
  
  // Button release with subtle bounce
  static buttonRelease(animatedValue: Animated.Value, callback?: () => void) {
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 1.05,
        duration: 100,
        easing: PREMIUM_EASINGS.premium,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 200,
        easing: PREMIUM_EASINGS.bounce,
        useNativeDriver: true,
      }),
    ]).start(callback);
  }
  
  // Button bounce animation
  static buttonBounce(animatedValue: Animated.Value, callback?: () => void) {
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 0.9,
        duration: 80,
        easing: PREMIUM_EASINGS.apple,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 1.1,
        duration: 120,
        easing: PREMIUM_EASINGS.premium,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 150,
        easing: PREMIUM_EASINGS.bounce,
        useNativeDriver: true,
      }),
    ]).start(callback);
  }
  
  // Selection highlight animation
  static selectionHighlight(animatedValue: Animated.Value, callback?: () => void) {
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 1.1,
        duration: 150,
        easing: PREMIUM_EASINGS.instagram,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 200,
        easing: PREMIUM_EASINGS.apple,
        useNativeDriver: true,
      }),
    ]).start(callback);
  }
  
  // Selection pulse animation
  static selectionPulse(animatedValue: Animated.Value, callback?: () => void) {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1.05,
          duration: 800,
          easing: PREMIUM_EASINGS.apple,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 800,
          easing: PREMIUM_EASINGS.apple,
          useNativeDriver: true,
        }),
      ])
    ).start(callback);
  }
  
  // Success checkmark animation
  static successCheckmark(animatedValue: Animated.Value, callback?: () => void) {
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 1.2,
        duration: 200,
        easing: PREMIUM_EASINGS.premium,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 150,
        easing: PREMIUM_EASINGS.bounce,
        useNativeDriver: true,
      }),
    ]).start(callback);
  }
  
  // Completion sparkle animation
  static completionSparkle(animatedValue: Animated.Value, callback?: () => void) {
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 1.3,
        duration: 300,
        easing: PREMIUM_EASINGS.elastic,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 200,
        easing: PREMIUM_EASINGS.bounce,
        useNativeDriver: true,
      }),
    ]).start(callback);
  }
  
  // Progress pulse animation
  static progressPulse(animatedValue: Animated.Value, callback?: () => void) {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1.1,
          duration: 1000,
          easing: PREMIUM_EASINGS.apple,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          easing: PREMIUM_EASINGS.apple,
          useNativeDriver: true,
        }),
      ])
    ).start(callback);
  }
  
  // Loading spin animation
  static loadingSpin(animatedValue: Animated.Value, callback?: () => void) {
    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start(callback);
  }
  
  // Page transition animation
  static pageTransition(animatedValue: Animated.Value, callback?: () => void) {
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 0.95,
        duration: 150,
        easing: PREMIUM_EASINGS.apple,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 200,
        easing: PREMIUM_EASINGS.premium,
        useNativeDriver: true,
      }),
    ]).start(callback);
  }
  
  // Modal enter animation
  static modalEnter(animatedValue: Animated.Value, callback?: () => void) {
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 1.05,
        duration: 200,
        easing: PREMIUM_EASINGS.premium,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 150,
        easing: PREMIUM_EASINGS.bounce,
        useNativeDriver: true,
      }),
    ]).start(callback);
  }
  
  // Modal exit animation
  static modalExit(animatedValue: Animated.Value, callback?: () => void) {
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 1.05,
        duration: 100,
        easing: PREMIUM_EASINGS.apple,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 200,
        easing: PREMIUM_EASINGS.instagram,
        useNativeDriver: true,
      }),
    ]).start(callback);
  }
  
  // Breathing animation
  static breathing(animatedValue: Animated.Value, callback?: () => void) {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1.05,
          duration: 3000,
          easing: PREMIUM_EASINGS.apple,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 3000,
          easing: PREMIUM_EASINGS.apple,
          useNativeDriver: true,
        }),
      ])
    ).start(callback);
  }
  
  // Floating animation
  static floating(animatedValue: Animated.Value, callback?: () => void) {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1.1,
          duration: 2000,
          easing: PREMIUM_EASINGS.apple,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0.9,
          duration: 2000,
          easing: PREMIUM_EASINGS.apple,
          useNativeDriver: true,
        }),
      ])
    ).start(callback);
  }
  
  // Glow pulse animation
  static glowPulse(animatedValue: Animated.Value, callback?: () => void) {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1.2,
          duration: 1500,
          easing: PREMIUM_EASINGS.apple,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0.8,
          duration: 1500,
          easing: PREMIUM_EASINGS.apple,
          useNativeDriver: true,
        }),
      ])
    ).start(callback);
  }
  
  // Generic animation trigger
  static trigger(type: AnimationType, animatedValue: Animated.Value, callback?: () => void) {
    switch (type) {
      case AnimationType.BUTTON_PRESS:
        this.buttonPress(animatedValue, callback);
        break;
      case AnimationType.BUTTON_RELEASE:
        this.buttonRelease(animatedValue, callback);
        break;
      case AnimationType.BUTTON_BOUNCE:
        this.buttonBounce(animatedValue, callback);
        break;
      case AnimationType.SELECTION_HIGHLIGHT:
        this.selectionHighlight(animatedValue, callback);
        break;
      case AnimationType.SELECTION_PULSE:
        this.selectionPulse(animatedValue, callback);
        break;
      case AnimationType.SUCCESS_CHECKMARK:
        this.successCheckmark(animatedValue, callback);
        break;
      case AnimationType.COMPLETION_SPARKLE:
        this.completionSparkle(animatedValue, callback);
        break;
      case AnimationType.PROGRESS_PULSE:
        this.progressPulse(animatedValue, callback);
        break;
      case AnimationType.LOADING_SPIN:
        this.loadingSpin(animatedValue, callback);
        break;
      case AnimationType.PAGE_TRANSITION:
        this.pageTransition(animatedValue, callback);
        break;
      case AnimationType.MODAL_ENTER:
        this.modalEnter(animatedValue, callback);
        break;
      case AnimationType.MODAL_EXIT:
        this.modalExit(animatedValue, callback);
        break;
      case AnimationType.BREATHING:
        this.breathing(animatedValue, callback);
        break;
      case AnimationType.FLOATING:
        this.floating(animatedValue, callback);
        break;
      case AnimationType.GLOW_PULSE:
        this.glowPulse(animatedValue, callback);
        break;
    }
  }
  
  // Create animated value with initial value
  static createAnimatedValue(initialValue: number = 1): Animated.Value {
    return new Animated.Value(initialValue);
  }
  
  // Stop animation
  static stop(animatedValue: Animated.Value) {
    animatedValue.stopAnimation();
  }
  
  // Reset animation to initial value
  static reset(animatedValue: Animated.Value, initialValue: number = 1) {
    animatedValue.setValue(initialValue);
  }
}

export default AnimationService; 