import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useColors } from '../context/ColorContext';
import { LinearGradient } from 'expo-linear-gradient';
import hapticService, { HapticType, HapticIntensity } from '../services/hapticService';

const { width, height } = Dimensions.get('window');

interface ColorPickerModalProps {
  isVisible: boolean;
  onClose: () => void;
}

// Predefined color options for the progress ring
const COLOR_OPTIONS = [
  // No Progress Ring option
  { name: 'No Progress Ring', colors: null, isNoRing: true },
  
  // Blue variants (current default)
  { name: 'Ocean Blue', colors: ['#00D4FF', '#0099FF', '#0066FF'] },
  { name: 'Deep Purple', colors: ['#8B5CF6', '#7C3AED', '#6D28D9'] },
  { name: 'Emerald Green', colors: ['#10B981', '#059669', '#047857'] },
  { name: 'Sunset Orange', colors: ['#F59E0B', '#D97706', '#B45309'] },
  { name: 'Rose Pink', colors: ['#EC4899', '#DB2777', '#BE185D'] },
  { name: 'Teal Blue', colors: ['#14B8A6', '#0D9488', '#0F766E'] },
  { name: 'Amber Gold', colors: ['#FCD34D', '#F59E0B', '#D97706'] },
  { name: 'Violet Indigo', colors: ['#A855F7', '#9333EA', '#7C3AED'] },
];

const ColorPickerModal: React.FC<ColorPickerModalProps> = ({ isVisible, onClose }) => {
  const themeResult = useTheme();
  const colors = themeResult?.colors;
  const { setProgressRingColors, progressRingColors, showProgressRing } = useColors();
  const [selectedColorSet, setSelectedColorSet] = useState<string[] | null>(null);
  const modalOpacity = React.useRef(new Animated.Value(0)).current;
  const contentTranslateY = React.useRef(new Animated.Value(50)).current;

  // Sync selection state with current progress ring state
  useEffect(() => {
    if (isVisible) {
      setSelectedColorSet(showProgressRing ? progressRingColors : null);
    }
  }, [isVisible, showProgressRing, progressRingColors]);

  useEffect(() => {
    if (isVisible) {
      // Haptic feedback
      hapticService.trigger(HapticType.LIGHT_TAP, HapticIntensity.NORMAL);
      
      // Entrance animation
      Animated.parallel([
        Animated.timing(modalOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(contentTranslateY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
      ]).start();
    } else {
      // Exit animation
      Animated.parallel([
        Animated.timing(modalOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(contentTranslateY, {
          toValue: 50,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible, modalOpacity, contentTranslateY]);

  const handleColorSelect = async (option: typeof COLOR_OPTIONS[0]) => {
    try {
      if (option.isNoRing) {
        // No progress ring option
        await setProgressRingColors(null);
        console.log('🎨 Progress ring hidden');
      } else if (option.colors) {
        // Normal color option
        await setProgressRingColors(option.colors);
        console.log('🎨 Progress ring color updated:', option.name);
      }
      
      // Haptic feedback
      await hapticService.trigger(HapticType.SUCCESS, HapticIntensity.SUBTLE);
      
      // Close modal
      onClose();
    } catch (error) {
      console.error('Error updating progress ring colors:', error);
    }
  };

  const handleSave = async () => {
    try {
      hapticService.trigger(HapticType.SUCCESS, HapticIntensity.NORMAL);
      await setProgressRingColors(selectedColorSet);
      onClose();
    } catch (error) {
      console.error('Failed to save colors:', error);
      hapticService.trigger(HapticType.ERROR, HapticIntensity.NORMAL);
    }
  };

  const handleCancel = () => {
    hapticService.trigger(HapticType.LIGHT_TAP, HapticIntensity.NORMAL);
    setSelectedColorSet(null); // Reset to null
    onClose();
  };

  // Move the early return check AFTER all hooks are called
  if (!colors) {
    return null;
  }

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="none"
      onRequestClose={handleCancel}
    >
      <Animated.View style={[styles.overlay, { opacity: modalOpacity }]}>
        <TouchableOpacity 
          style={styles.overlayTouchable} 
          onPress={handleCancel}
          activeOpacity={1}
        />
        
        <Animated.View 
          style={[
            styles.modalContent,
            { transform: [{ translateY: contentTranslateY }] }
          ]}
        >
          <LinearGradient
            colors={colors.backgroundGradient}
            style={styles.backgroundGradient}
          />
          
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Choose Progress Ring Colors</Text>
            <TouchableOpacity style={styles.closeButton} onPress={handleCancel}>
              <Ionicons name="close" size={24} color={colors.primaryText} />
            </TouchableOpacity>
          </View>

          {/* Color Options */}
          <ScrollView style={styles.colorOptionsContainer} showsVerticalScrollIndicator={false}>
            {COLOR_OPTIONS.map((option, index) => (
              <TouchableOpacity
                key={option.name}
                style={[
                  styles.colorOption,
                  (option.isNoRing ? selectedColorSet === null : selectedColorSet === option.colors) && styles.selectedColorOption
                ]}
                onPress={() => handleColorSelect(option)}
                activeOpacity={0.7}
              >
                <View style={styles.colorOptionContent}>
                  {option.isNoRing ? (
                    // No progress ring option
                    <View style={styles.noRingOption}>
                      <Ionicons name="remove-circle-outline" size={24} color={colors?.primaryText || '#FFFFFF'} />
                      <Text style={[styles.colorOptionName, { color: colors?.primaryText || '#FFFFFF' }]}>
                        {option.name}
                      </Text>
                    </View>
                  ) : (
                    // Normal color option
                    <>
                      <View style={styles.colorPreview}>
                        {option.colors?.map((color, index) => (
                          <View
                            key={index}
                            style={[
                              styles.colorSwatch,
                              { backgroundColor: color },
                              index === 0 && styles.firstColorSwatch,
                              index === option.colors!.length - 1 && styles.lastColorSwatch,
                            ]}
                          />
                        ))}
                      </View>
                      <Text style={[styles.colorOptionName, { color: colors?.primaryText || '#FFFFFF' }]}>
                        {option.name}
                      </Text>
                    </>
                  )}
                </View>
                {(option.isNoRing ? selectedColorSet === null : selectedColorSet === option.colors) && (
                  <Ionicons name="checkmark-circle" size={24} color={colors?.primaryAccent || '#00D4FF'} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save Colors</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayTouchable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    width: width * 0.9,
    maxHeight: height * 0.8,
    backgroundColor: 'transparent',
    borderRadius: 20,
    overflow: 'hidden',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  colorOptionsContainer: {
    paddingHorizontal: 24,
    maxHeight: 400,
  },
  colorOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedColorOption: {
    backgroundColor: 'rgba(193, 255, 114, 0.1)',
    borderColor: 'rgba(193, 255, 114, 0.3)',
  },
  colorOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  noRingOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  colorPreview: {
    flexDirection: 'row',
    marginRight: 16,
  },
  colorSwatch: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  firstColorSwatch: {
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  lastColorSwatch: {
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  colorOptionName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    flex: 1,
  },
  selectedColorOptionName: {
    color: '#C1FF72',
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 20,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  saveButton: {
    flex: 1,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#C1FF72',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
});

export default ColorPickerModal;

