import React, { useState, useRef, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import hapticService, { HapticType, HapticIntensity } from '../services/hapticService';
import AnimationService, { AnimationType } from '../services/animationService';
import { COLORS, SPACING } from '../constants/theme';
import { body, h2 } from '../constants/typography';

const { width } = Dimensions.get('window');

interface ResetModalProps {
  visible: boolean;
  onClose: () => void;
  onReset: (trigger: string) => void;
}

const triggerOptions = [
  { id: 'anxiety', label: 'Anxiety', emoji: '😰' },
  { id: 'stress', label: 'Stress', emoji: '😤' },
  { id: 'boredom', label: 'Boredom', emoji: '😐' },
  { id: 'nervousness', label: 'Nervousness', emoji: '😬' },
  { id: 'habit', label: 'Habit', emoji: '🤔' },
  { id: 'other', label: 'Other', emoji: '❓' },
];

const ResetModal: React.FC<ResetModalProps> = ({ 
  visible, 
  onClose, 
  onReset
}) => {
  const [selectedTrigger, setSelectedTrigger] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  
  // Animation values for modal entrance
  const modalScale = useRef(new Animated.Value(0)).current;
  
  // Smooth modal entrance
  useEffect(() => {
    if (visible) {
      // Gentle haptic feedback
      hapticService.trigger(HapticType.LIGHT_TAP, HapticIntensity.NORMAL);
      
      // Smooth entrance animation
      Animated.timing(modalScale, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      modalScale.setValue(0);
    }
  }, [visible]);
  

  
  const handleReset = () => {
    if (selectedTrigger) {
      // Immediately dismiss modal and trigger reset
      hapticService.trigger(HapticType.HEAVY_TAP, HapticIntensity.PROMINENT);
      onReset(selectedTrigger);
      onClose();
      setSelectedTrigger(null);
      setShowDropdown(false);
    }
  };
  
  const handleClose = () => {
    hapticService.trigger(HapticType.LIGHT_TAP, HapticIntensity.NORMAL);
    onClose();
  };
  
  const handleDropdownPress = () => {
    hapticService.trigger(HapticType.LIGHT_TAP, HapticIntensity.NORMAL);
    setShowDropdown(!showDropdown);
  };
  
  const handleOptionSelect = (triggerId: string) => {
    hapticService.trigger(HapticType.SELECTION, HapticIntensity.NORMAL);
    setSelectedTrigger(triggerId);
    setShowDropdown(false);
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [
                { scale: modalScale },
              ],
            },
          ]}
        >
          <LinearGradient
            colors={['rgba(0, 0, 0, 0.95)', 'rgba(20, 0, 0, 0.98)']} // Darker, more serious gradient
            style={styles.modalGradient}
          >
            <View style={styles.content}>
              {/* Warning icon */}
              <View style={styles.warningIcon}>
                <Ionicons name="warning" size={32} color="#FF4444" />
              </View>
              
              <Text style={styles.title}>Are you sure you want to reset?</Text>
              <Text style={styles.subtitle}>This will erase all your progress</Text>
              
              <Text style={styles.triggerQuestion}>What triggered you to bite your nails?</Text>
              
              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={handleDropdownPress}
              >
                <Text style={styles.dropdownButtonText}>
                  {selectedTrigger 
                    ? triggerOptions.find(option => option.id === selectedTrigger)?.label || 'Select an option'
                    : 'Select an option'
                  }
                </Text>
                <Ionicons 
                  name={showDropdown ? "chevron-up" : "chevron-down"} 
                  size={20} 
                  color={COLORS.primaryText} 
                />
              </TouchableOpacity>

              {showDropdown && (
                <View style={styles.dropdown}>
                  <ScrollView style={styles.dropdownScroll}>
                    {triggerOptions.map((option) => (
                      <TouchableOpacity
                        key={option.id}
                        style={styles.dropdownOption}
                        onPress={() => handleOptionSelect(option.id)}
                      >
                        <Text style={styles.optionEmoji}>{option.emoji}</Text>
                        <Text style={styles.optionLabel}>{option.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

              <TouchableOpacity
                style={[
                  styles.resetButton,
                  !selectedTrigger && styles.resetButtonDisabled,
                ]}
                onPress={handleReset}
                disabled={!selectedTrigger}
              >
                <LinearGradient
                  colors={selectedTrigger 
                    ? [COLORS.destructiveAction, COLORS.destructiveAction + 'CC']
                    : [COLORS.mutedText, COLORS.mutedText + 'CC']
                  }
                  style={styles.resetButtonGradient}
                >
                  <Ionicons 
                    name="refresh" 
                    size={20} 
                    color={COLORS.primaryText} 
                  />
                  <Text style={styles.resetButtonText}>
                    Reset Timer
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.closeButton} 
                onPress={handleClose}
              >
                <Text style={styles.closeButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width - SPACING.lg * 2,
    borderRadius: 20,
    padding: SPACING.lg,
  },
  modalGradient: {
    width: '100%',
    borderRadius: 20,
    padding: SPACING.lg,
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  warningIcon: {
    marginBottom: SPACING.md,
  },
  title: {
    ...h2,
    color: COLORS.primaryText,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    ...body,
    color: COLORS.secondaryText,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  countdownContainer: {
    marginBottom: SPACING.lg,
    alignItems: 'center',
  },
  countdownLabel: {
    ...body,
    color: COLORS.primaryText,
    marginBottom: SPACING.sm,
  },
  countdownValue: {
    ...h2,
    color: COLORS.destructiveAction,
    fontWeight: 'bold',
  },
  triggerQuestion: {
    ...body,
    color: COLORS.primaryText,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: SPACING.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: SPACING.md,
  },
  dropdownButtonText: {
    ...body,
    color: COLORS.primaryText,
  },
  dropdown: {
    width: '100%',
    maxHeight: 200,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: SPACING.lg,
  },
  dropdownScroll: {
    padding: SPACING.sm,
  },
  dropdownOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: 8,
  },
  optionEmoji: {
    fontSize: 20,
    marginRight: SPACING.md,
  },
  optionLabel: {
    ...body,
    color: COLORS.primaryText,
  },
  resetButton: {
    width: '100%',
    marginBottom: SPACING.lg,
  },
  resetButtonDisabled: {
    opacity: 0.5,
  },
  resetButtonProcessing: {
    opacity: 0.7,
  },
  resetButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
    borderRadius: 12,
  },
  resetButtonText: {
    ...body,
    color: COLORS.primaryText,
    fontWeight: '600',
    marginLeft: SPACING.sm,
  },
  closeButton: {
    padding: SPACING.md,
  },
  closeButtonText: {
    ...body,
    color: COLORS.secondaryText,
  },
});

export default ResetModal; 