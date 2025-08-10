import * as Haptics from 'expo-haptics';

// Premium haptic patterns inspired by top apps
export enum HapticType {
  // Light interactions - UI elements, buttons, toggles
  LIGHT_TAP = 'light_tap',
  SOFT_TAP = 'soft_tap',
  
  // Medium interactions - selections, confirmations
  MEDIUM_TAP = 'medium_tap',
  SELECTION = 'selection',
  
  // Heavy interactions - important actions, achievements
  HEAVY_TAP = 'heavy_tap',
  ACHIEVEMENT = 'achievement',
  
  // Success/Error patterns
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  
  // Special patterns
  BREATHING = 'breathing',
  PROGRESS = 'progress',
  COMPLETION = 'completion',
  
  // Custom patterns
  CUSTOM_LIGHT = 'custom_light',
  CUSTOM_MEDIUM = 'custom_medium',
  CUSTOM_HEAVY = 'custom_heavy',
}

// Haptic intensity levels
export enum HapticIntensity {
  SUBTLE = 'subtle',
  NORMAL = 'normal',
  PROMINENT = 'prominent',
}

interface HapticConfig {
  type: HapticType;
  intensity?: HapticIntensity;
  delay?: number;
  repeat?: number;
  interval?: number;
}

class HapticService {
  private isEnabled: boolean = true;
  private lastHapticTime: number = 0;
  private readonly MIN_INTERVAL = 50; // Minimum 50ms between haptics
  
  // Enable/disable haptics
  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }
  
  isHapticEnabled(): boolean {
    return this.isEnabled;
  }
  
  // Throttle haptics to prevent overwhelming feedback
  private shouldTriggerHaptic(): boolean {
    if (!this.isEnabled) return false;
    
    const now = Date.now();
    if (now - this.lastHapticTime < this.MIN_INTERVAL) {
      return false;
    }
    
    this.lastHapticTime = now;
    return true;
  }
  
  // Core haptic patterns
  async trigger(type: HapticType, intensity: HapticIntensity = HapticIntensity.NORMAL) {
    if (!this.shouldTriggerHaptic()) return;
    
    try {
      switch (type) {
        case HapticType.LIGHT_TAP:
          await this.lightTap(intensity);
          break;
        case HapticType.SOFT_TAP:
          await this.softTap(intensity);
          break;
        case HapticType.MEDIUM_TAP:
          await this.mediumTap(intensity);
          break;
        case HapticType.SELECTION:
          await this.selection(intensity);
          break;
        case HapticType.HEAVY_TAP:
          await this.heavyTap(intensity);
          break;
        case HapticType.ACHIEVEMENT:
          await this.achievement(intensity);
          break;
        case HapticType.SUCCESS:
          await this.success(intensity);
          break;
        case HapticType.ERROR:
          await this.error(intensity);
          break;
        case HapticType.WARNING:
          await this.warning(intensity);
          break;
        case HapticType.BREATHING:
          await this.breathing(intensity);
          break;
        case HapticType.PROGRESS:
          await this.progress(intensity);
          break;
        case HapticType.COMPLETION:
          await this.completion(intensity);
          break;
        default:
          await this.customHaptic(type, intensity);
      }
    } catch (error) {
      console.warn('Haptic feedback failed:', error);
    }
  }
  
  // Individual haptic patterns
  private async lightTap(intensity: HapticIntensity) {
    const style = this.getImpactStyle(intensity);
    await Haptics.impactAsync(style);
  }
  
  private async softTap(intensity: HapticIntensity) {
    // Very subtle feedback for gentle interactions
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }
  
  private async mediumTap(intensity: HapticIntensity) {
    const style = this.getImpactStyle(intensity);
    await Haptics.impactAsync(style);
  }
  
  private async selection(intensity: HapticIntensity) {
    // Selection feedback with slight delay for emphasis
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (intensity === HapticIntensity.PROMINENT) {
      setTimeout(async () => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }, 100);
    }
  }
  
  private async heavyTap(intensity: HapticIntensity) {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  }
  
  private async achievement(intensity: HapticIntensity) {
    // Celebratory pattern: heavy + success notification
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setTimeout(async () => {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 150);
  }
  
  private async success(intensity: HapticIntensity) {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }
  
  private async error(intensity: HapticIntensity) {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  }
  
  private async warning(intensity: HapticIntensity) {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  }
  
  private async breathing(intensity: HapticIntensity) {
    // Breathing pattern: gentle pulsing haptics
    const pattern = [100, 200, 100, 200, 100]; // Timing in ms
    for (let i = 0; i < pattern.length; i++) {
      setTimeout(async () => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }, pattern[i]);
    }
  }
  
  private async progress(intensity: HapticIntensity) {
    // Progress feedback: medium impact
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }
  
  private async completion(intensity: HapticIntensity) {
    // Completion pattern: success + medium impact
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setTimeout(async () => {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }, 100);
  }
  
  private async customHaptic(type: HapticType, intensity: HapticIntensity) {
    // Handle custom haptic types
    switch (type) {
      case HapticType.CUSTOM_LIGHT:
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case HapticType.CUSTOM_MEDIUM:
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      case HapticType.CUSTOM_HEAVY:
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        break;
    }
  }
  
  // Helper to get impact style based on intensity
  private getImpactStyle(intensity: HapticIntensity): Haptics.ImpactFeedbackStyle {
    switch (intensity) {
      case HapticIntensity.SUBTLE:
        return Haptics.ImpactFeedbackStyle.Light;
      case HapticIntensity.PROMINENT:
        return Haptics.ImpactFeedbackStyle.Heavy;
      default:
        return Haptics.ImpactFeedbackStyle.Medium;
    }
  }
  
  // Complex haptic patterns
  async triggerPattern(config: HapticConfig) {
    if (!this.isEnabled) return;
    
    const { type, intensity = HapticIntensity.NORMAL, delay = 0, repeat = 1, interval = 100 } = config;
    
    if (delay > 0) {
      setTimeout(() => this.executePattern(type, intensity, repeat, interval), delay);
    } else {
      await this.executePattern(type, intensity, repeat, interval);
    }
  }
  
  private async executePattern(type: HapticType, intensity: HapticIntensity, repeat: number, interval: number) {
    for (let i = 0; i < repeat; i++) {
      await this.trigger(type, intensity);
      if (i < repeat - 1) {
        await new Promise(resolve => setTimeout(resolve, interval));
      }
    }
  }
  
  // Quick access methods for common patterns
  async tap() {
    await this.trigger(HapticType.LIGHT_TAP);
  }
  
  async select() {
    await this.trigger(HapticType.SELECTION);
  }
  
  async confirm() {
    await this.trigger(HapticType.SUCCESS);
  }
  
  async cancel() {
    await this.trigger(HapticType.WARNING);
  }
  
  async celebrate() {
    await this.trigger(HapticType.ACHIEVEMENT);
  }
  
  async breathe() {
    await this.trigger(HapticType.BREATHING);
  }
}

// Export singleton instance
const hapticService = new HapticService();
export default hapticService; 