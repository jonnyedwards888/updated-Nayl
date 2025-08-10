import hapticService, { HapticType, HapticIntensity } from './hapticService';
import AnimationService, { AnimationType } from './animationService';

// Psychological feedback types based on behavioral psychology
export enum FeedbackType {
  // Positive reinforcement - encourage good behavior
  ACHIEVEMENT = 'achievement',
  MILESTONE = 'milestone',
  PROGRESS = 'progress',
  SUCCESS = 'success',
  
  // Negative reinforcement - discourage bad behavior
  RELAPSE = 'relapse',
  RESET = 'reset',
  FAILURE = 'failure',
  WARNING = 'warning',
  
  // Neutral feedback
  INFORMATION = 'information',
  SELECTION = 'selection',
  NAVIGATION = 'navigation',
}

// Intensity levels for psychological impact
export enum PsychologicalIntensity {
  SUBTLE = 'subtle',      // Gentle reminder
  MODERATE = 'moderate',  // Noticeable feedback
  STRONG = 'strong',      // Memorable impact
  INTENSE = 'intense',    // Strong emotional response
}

interface PsychologicalFeedbackConfig {
  type: FeedbackType;
  intensity: PsychologicalIntensity;
  context?: string;
  userProgress?: number;
  timeElapsed?: number;
}

class PsychologicalFeedbackService {
  
  // Positive reinforcement patterns
  private static positivePatterns = {
    [FeedbackType.ACHIEVEMENT]: {
      haptic: HapticType.ACHIEVEMENT,
      hapticIntensity: HapticIntensity.PROMINENT,
      animation: AnimationType.COMPLETION_SPARKLE,
      description: 'Celebratory feedback for major achievements',
    },
    [FeedbackType.MILESTONE]: {
      haptic: HapticType.SUCCESS,
      hapticIntensity: HapticIntensity.PROMINENT,
      animation: AnimationType.SUCCESS_CHECKMARK,
      description: 'Recognition of progress milestones',
    },
    [FeedbackType.PROGRESS]: {
      haptic: HapticType.PROGRESS,
      hapticIntensity: HapticIntensity.NORMAL,
      animation: AnimationType.PROGRESS_PULSE,
      description: 'Encouragement for continued progress',
    },
    [FeedbackType.SUCCESS]: {
      haptic: HapticType.SUCCESS,
      hapticIntensity: HapticIntensity.NORMAL,
      animation: AnimationType.SELECTION_HIGHLIGHT,
      description: 'Positive reinforcement for good choices',
    },
  };
  
  // Negative reinforcement patterns
  private static negativePatterns = {
    [FeedbackType.RELAPSE]: {
      haptic: HapticType.ERROR,
      hapticIntensity: HapticIntensity.PROMINENT,
      animation: AnimationType.BUTTON_BOUNCE,
      description: 'Strong discouragement for relapses',
    },
    [FeedbackType.RESET]: {
      haptic: HapticType.ERROR,
      hapticIntensity: HapticIntensity.PROMINENT,
      animation: AnimationType.BUTTON_BOUNCE,
      description: 'Dramatic feedback for resetting progress',
    },
    [FeedbackType.FAILURE]: {
      haptic: HapticType.WARNING,
      hapticIntensity: HapticIntensity.NORMAL,
      animation: AnimationType.SELECTION_HIGHLIGHT,
      description: 'Warning feedback for setbacks',
    },
    [FeedbackType.WARNING]: {
      haptic: HapticType.WARNING,
      hapticIntensity: HapticIntensity.NORMAL,
      animation: AnimationType.SELECTION_PULSE,
      description: 'Cautionary feedback',
    },
  };
  
  // Neutral feedback patterns
  private static neutralPatterns = {
    [FeedbackType.INFORMATION]: {
      haptic: HapticType.LIGHT_TAP,
      hapticIntensity: HapticIntensity.SUBTLE,
      animation: AnimationType.BUTTON_PRESS,
      description: 'Informational feedback',
    },
    [FeedbackType.SELECTION]: {
      haptic: HapticType.SELECTION,
      hapticIntensity: HapticIntensity.NORMAL,
      animation: AnimationType.SELECTION_HIGHLIGHT,
      description: 'Selection feedback',
    },
    [FeedbackType.NAVIGATION]: {
      haptic: HapticType.LIGHT_TAP,
      hapticIntensity: HapticIntensity.SUBTLE,
      animation: AnimationType.PAGE_TRANSITION,
      description: 'Navigation feedback',
    },
  };
  
  /**
   * Provide psychological feedback based on behavioral psychology principles
   */
  static async provideFeedback(config: PsychologicalFeedbackConfig) {
    const { type, intensity, context, userProgress, timeElapsed } = config;
    
    // Determine feedback pattern based on type
    let pattern;
    if (this.positivePatterns[type]) {
      pattern = this.positivePatterns[type];
    } else if (this.negativePatterns[type]) {
      pattern = this.negativePatterns[type];
    } else {
      pattern = this.neutralPatterns[type];
    }
    
    // Adjust intensity based on psychological factors
    const adjustedIntensity = this.adjustIntensityForContext(
      pattern.hapticIntensity,
      intensity,
      context,
      userProgress,
      timeElapsed
    );
    
    // Provide haptic feedback
    await hapticService.trigger(pattern.haptic, adjustedIntensity);
    
    // Return animation type for visual feedback
    return pattern.animation;
  }
  
  /**
   * Adjust haptic intensity based on psychological context
   */
  private static adjustIntensityForContext(
    baseIntensity: HapticIntensity,
    psychologicalIntensity: PsychologicalIntensity,
    context?: string,
    userProgress?: number,
    timeElapsed?: number
  ): HapticIntensity {
    
    // Base intensity mapping
    const intensityMap = {
      [PsychologicalIntensity.SUBTLE]: HapticIntensity.SUBTLE,
      [PsychologicalIntensity.MODERATE]: HapticIntensity.NORMAL,
      [PsychologicalIntensity.STRONG]: HapticIntensity.PROMINENT,
      [PsychologicalIntensity.INTENSE]: HapticIntensity.PROMINENT,
    };
    
    let adjustedIntensity = intensityMap[psychologicalIntensity];
    
    // Context-specific adjustments
    if (context === 'reset' && timeElapsed && timeElapsed > 3600) {
      // Stronger feedback for resetting longer streaks
      adjustedIntensity = HapticIntensity.PROMINENT;
    }
    
    if (context === 'achievement' && userProgress && userProgress > 80) {
      // Stronger feedback for high progress achievements
      adjustedIntensity = HapticIntensity.PROMINENT;
    }
    
    if (context === 'relapse' && userProgress && userProgress > 50) {
      // Stronger feedback for relapses during high progress
      adjustedIntensity = HapticIntensity.PROMINENT;
    }
    
    return adjustedIntensity;
  }
  
  /**
   * Provide dramatic reset feedback with psychological impact
   */
  static async provideResetFeedback(timeElapsed: number) {
    // Dramatic haptic sequence for reset
    await hapticService.triggerPattern({
      type: HapticType.HEAVY_TAP,
      intensity: HapticIntensity.PROMINENT,
      repeat: 3,
      interval: 200,
    });
    
    // Additional error feedback
    setTimeout(async () => {
      await hapticService.trigger(HapticType.ERROR, HapticIntensity.PROMINENT);
    }, 600);
    
    return AnimationType.BUTTON_BOUNCE;
  }
  
  /**
   * Provide achievement feedback with progress-based intensity
   */
  static async provideAchievementFeedback(progress: number, milestone: string) {
    let hapticType = HapticType.SUCCESS;
    let intensity = HapticIntensity.NORMAL;
    
    // Adjust based on milestone significance
    switch (milestone) {
      case '1hour':
        hapticType = HapticType.SUCCESS;
        intensity = HapticIntensity.NORMAL;
        break;
      case '1day':
        hapticType = HapticType.ACHIEVEMENT;
        intensity = HapticIntensity.PROMINENT;
        break;
      case '1week':
        hapticType = HapticType.ACHIEVEMENT;
        intensity = HapticIntensity.PROMINENT;
        break;
      case '1month':
        hapticType = HapticType.COMPLETION;
        intensity = HapticIntensity.PROMINENT;
        break;
    }
    
    await hapticService.trigger(hapticType, intensity);
    
    // Additional celebration for major milestones
    if (milestone === '1week' || milestone === '1month') {
      setTimeout(async () => {
        await hapticService.trigger(HapticType.SUCCESS, HapticIntensity.NORMAL);
      }, 300);
    }
    
    return AnimationType.COMPLETION_SPARKLE;
  }
  
  /**
   * Provide relapse discouragement feedback
   */
  static async provideRelapseFeedback(progress: number, timeElapsed: number) {
    // Stronger feedback for higher progress relapses
    const intensity = progress > 50 ? HapticIntensity.PROMINENT : HapticIntensity.NORMAL;
    
    await hapticService.triggerPattern({
      type: HapticType.ERROR,
      intensity,
      repeat: 2,
      interval: 300,
    });
    
    return AnimationType.BUTTON_BOUNCE;
  }
  
  /**
   * Provide progress encouragement feedback
   */
  static async provideProgressFeedback(progress: number) {
    const intensity = progress > 80 ? HapticIntensity.PROMINENT : HapticIntensity.NORMAL;
    
    await hapticService.trigger(HapticType.PROGRESS, intensity);
    
    return AnimationType.PROGRESS_PULSE;
  }
  
  /**
   * Provide gentle reminder feedback
   */
  static async provideReminderFeedback() {
    await hapticService.trigger(HapticType.SOFT_TAP, HapticIntensity.SUBTLE);
    
    return AnimationType.BREATHING;
  }
}

export default PsychologicalFeedbackService; 