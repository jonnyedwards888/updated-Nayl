import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  SafeAreaView,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Animated,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS, TYPOGRAPHY } from '../constants/theme';
import reasonsService, { Reason } from '../services/reasonsService';

const { width, height } = Dimensions.get('window');

const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

interface ReasonsScreenProps {
  navigation: any;
}

const ReasonsScreen: React.FC<ReasonsScreenProps> = ({ navigation }) => {
  const [reasons, setReasons] = useState<Reason[]>([]);
  const [newReason, setNewReason] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const textInputRef = useRef<TextInput>(null);
  const starAnimations = useRef<Animated.Value[]>([]);
  const starPositions = useRef<Array<{left: number, top: number}>>([]);
  const modalStarPositions = useRef<Array<{left: number, top: number}>>([]);

  // Initialize star animations and positions
  useEffect(() => {
    starAnimations.current = Array.from({ length: 50 }, () => new Animated.Value(0));
    
    // Generate stable star positions for main screen
    starPositions.current = Array.from({ length: 50 }, () => ({
      left: Math.random() * width,
      top: Math.random() * height,
    }));
    
    // Generate stable star positions for modal
    modalStarPositions.current = Array.from({ length: 30 }, () => ({
      left: Math.random() * width,
      top: Math.random() * (height * 0.8),
    }));
    
    // Start star animations
    starAnimations.current.forEach((anim, index) => {
      const delay = Math.random() * 3000;
      setTimeout(() => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(anim, {
              toValue: 1,
              duration: 2000,
              useNativeDriver: true,
            }),
            Animated.timing(anim, {
              toValue: 0,
              duration: 2000,
              useNativeDriver: true,
            }),
          ])
        ).start();
      }, delay);
    });
  }, []);

  // Load reasons on mount (for now, using local storage simulation)
  useEffect(() => {
    loadReasons();
  }, []);

  const loadReasons = async () => {
    try {
      const reasonsData = await reasonsService.getReasons();
      setReasons(reasonsData);
    } catch (error) {
      console.error('Error loading reasons:', error);
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
    setNewReason('');
    // Focus the text input after a short delay
    setTimeout(() => {
      textInputRef.current?.focus();
    }, 100);
  };

  const hideModal = () => {
    setIsModalVisible(false);
    setNewReason('');
  };

  const addReason = async () => {
    if (!newReason.trim()) {
      Alert.alert('Error', 'Please enter a reason');
      return;
    }

    try {
      setIsAdding(true);
      
      const newReasonObj = await reasonsService.addReason(newReason.trim());
      setReasons(prev => [newReasonObj, ...prev]);
      setNewReason('');
      
      hideModal();
       // Remove the success alert
     } catch (error) {
      console.error('Error adding reason:', error);
      Alert.alert('Error', 'Failed to add reason. Please try again.');
    } finally {
      setIsAdding(false);
    }
  };

  const deleteReason = async (id: string) => {
    Alert.alert(
      'Delete Reason',
      'Are you sure you want to delete this reason?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await reasonsService.deleteReason(id);
              setReasons(prev => prev.filter(reason => reason.id !== id));
            } catch (error) {
              console.error('Error deleting reason:', error);
              Alert.alert('Error', 'Failed to delete reason. Please try again.');
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Premium Background with Gradient */}
      <LinearGradient
        colors={COLORS.backgroundGradient}
        style={styles.backgroundContainer}
      />
      
      {/* Animated Starfield */}
      <View style={styles.starfield}>
        {starPositions.current?.map((position, index) => (
          <Animated.View
            key={index}
            style={[
              styles.star,
              {
                left: position?.left || 0,
                top: position?.top || 0,
                opacity: starAnimations.current[index] || 0.8,
              },
            ]}
          />
        ))}
      </View>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.primaryText} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Reasons for Changing</Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={showModal}
        >
          <Ionicons name="add" size={24} color={COLORS.primaryText} />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <KeyboardAvoidingView 
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Reasons List */}
          <View style={styles.reasonsSection}>
            <Text style={styles.sectionTitle}>
              Your Reasons ({reasons.length})
            </Text>
            
            {reasons.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="heart-outline" size={48} color={COLORS.secondaryText} />
                <Text style={styles.emptyStateText}>
                  No reasons added yet. Tap the + button to add your first reason!
                </Text>
              </View>
            ) : (
              reasons.map((reason) => (
                <View key={reason.id} style={styles.reasonCard}>
                  <View style={styles.reasonContent}>
                    <Text style={styles.reasonText}>{reason.text}</Text>
                    <Text style={styles.reasonDate}>
                      Added {formatDate(reason.created_at)}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => deleteReason(reason.id)}
                  >
                    <Ionicons name="trash-outline" size={20} color={COLORS.destructiveAction} />
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>

          {/* Motivation Section */}
          <View style={styles.motivationSection}>
            <View style={styles.motivationCard}>
              <Ionicons name="bulb-outline" size={32} color="#FFD700" />
              <Text style={styles.motivationTitle}>Why This Matters</Text>
              <Text style={styles.motivationText}>
                Writing down your reasons helps you stay motivated and focused on your goal. 
                Review these whenever you feel tempted to bite your nails.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Simple, Bulletproof Modal */}
      <Modal
        visible={isModalVisible}
        transparent={false}
        animationType="slide"
        onRequestClose={hideModal}
        statusBarTranslucent={false}
      >
        <SafeAreaView style={styles.simpleModalContainer}>
          {/* Modal Background with Stars */}
          <LinearGradient
            colors={COLORS.backgroundGradient}
            style={styles.modalBackgroundContainer}
          />
          
          {/* Modal Starfield */}
          <View style={styles.modalStarfield}>
            {modalStarPositions.current?.map((position, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.modalStar,
                  {
                    left: position?.left || 0,
                    top: position?.top || 0,
                    opacity: starAnimations.current[index] || 0.8,
                  },
                ]}
              />
            ))}
          </View>

          {/* Modal Header */}
          <View style={styles.simpleModalHeader}>
            <TouchableOpacity
              style={styles.simpleModalBackButton}
              onPress={hideModal}
            >
              <Ionicons name="arrow-back" size={24} color={COLORS.primaryText} />
            </TouchableOpacity>
            <Text style={[styles.simpleModalTitle, { color: COLORS.primaryText }]}>Add New Reason</Text>
            <View style={styles.simpleModalSpacer} />
          </View>

          {/* Modal Body with KeyboardAvoidingView */}
          <KeyboardAvoidingView 
            style={styles.simpleModalBody}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
          >
            <Text style={[styles.simpleModalSubtitle, { color: COLORS.primaryText }]}>
              Why do you want to stop biting your nails?
            </Text>
            
            {/* TextInput */}
            <View style={styles.simpleModalTextInputContainer}>
              <TextInput
                ref={textInputRef}
                style={styles.simpleModalTextInput}
                placeholder="Enter your reason here..."
                placeholderTextColor={COLORS.mutedText}
                value={newReason}
                onChangeText={(text) => {
                  setNewReason(text);
                }}
                multiline
                numberOfLines={6}
                maxLength={200}
                textAlignVertical="top"
                autoFocus={false}
                blurOnSubmit={false}
                returnKeyType="done"
                enablesReturnKeyAutomatically={true}
                selectionColor={COLORS.primaryText}
                cursorColor={COLORS.primaryText}
                keyboardType="default"
                autoCapitalize="sentences"
                autoCorrect={true}
                spellCheck={true}
                editable={true}
                onFocus={() => {}}
                onBlur={() => {}}
                onSelectionChange={() => {}}
              />
            </View>
            
            {/* Character Count */}
            <Text style={[styles.simpleModalCharacterCount, { color: COLORS.secondaryText }]}>
              {newReason.length}/200
            </Text>
            
            {/* Add Reason Button - Visible Above Keyboard */}
            <TouchableOpacity
              style={[
                styles.simpleModalAddButtonInline,
                newReason.trim() && styles.simpleModalAddButtonActive
              ]}
              onPress={addReason}
              disabled={!newReason.trim() || isAdding}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#00D4FF', '#0099FF', '#0066FF']}
                style={styles.simpleModalAddButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.simpleModalAddText}>
                  {isAdding ? 'Adding...' : 'Add Reason'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent', // Make transparent to show gradient background
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -2, // Ensure it's behind the starfield
  },
  starfield: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1, // Ensure it's behind other content but above background
  },
  star: {
    position: 'absolute',
    width: 2,
    height: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 1,
    opacity: 0.8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    zIndex: 10,
    backgroundColor: 'transparent', // Remove black background to blend with theme
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.card,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...TYPOGRAPHY.headingLarge,
    color: COLORS.primaryText,
    fontWeight: '700',
    textAlign: 'center',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.card,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    backgroundColor: 'transparent', // Make transparent to show gradient background
  },
  sectionTitle: {
    ...TYPOGRAPHY.headingMedium,
    color: COLORS.primaryText,
    fontWeight: '600',
    marginBottom: SPACING.md,
  },
  reasonsSection: {
    marginBottom: SPACING.xl,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  emptyStateText: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.secondaryText,
    textAlign: 'center',
    marginTop: SPACING.md,
  },
  reasonCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.08)', // Slightly more visible
    borderRadius: SPACING.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)', // Subtle border
    ...SHADOWS.card,
  },
  reasonContent: {
    flex: 1,
  },
  reasonText: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.primaryText,
    marginBottom: SPACING.xs,
  },
  reasonDate: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.secondaryText,
  },
  deleteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 71, 87, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SPACING.sm,
  },
  motivationSection: {
    marginBottom: SPACING.xl,
  },
  motivationCard: {
    backgroundColor: 'rgba(255, 215, 0, 0.15)', // Slightly more visible gold
    borderRadius: SPACING.md,
    padding: SPACING.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.2)', // Subtle gold border
    ...SHADOWS.card,
  },
  motivationTitle: {
    ...TYPOGRAPHY.headingSmall,
    color: COLORS.primaryText,
    fontWeight: '600',
    marginTop: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  motivationText: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.primaryText,
    textAlign: 'center',
    lineHeight: 22,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    zIndex: 9999,
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9998,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#1A1A2E',
    borderTopLeftRadius: SPACING.lg,
    borderTopRightRadius: SPACING.lg,
    overflow: 'hidden',
    maxHeight: height * 0.8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 12,
    zIndex: 10000,
  },
  modalKeyboardView: {
    flex: 1,
  },
  modalHeader: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: '#2D2D44',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalHeaderDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginTop: SPACING.md,
  },
  modalTitle: {
    ...TYPOGRAPHY.headingMedium,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  modalCloseButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBody: {
    padding: SPACING.lg,
    flex: 1,
    backgroundColor: '#1A1A2E',
  },
  modalSubtitle: {
    ...TYPOGRAPHY.bodyLarge,
    color: '#FFFFFF',
    marginBottom: SPACING.lg,
    textAlign: 'center',
    fontWeight: '500',
  },
  textInputContainer: {
    position: 'relative',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: SPACING.md,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    marginBottom: SPACING.lg,
    minHeight: 140,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalTextInput: {
    color: '#FFFFFF',
    minHeight: 120,
    textAlignVertical: 'top',
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '400',
    textAlign: 'left',
    backgroundColor: 'transparent',
    includeFontPadding: false,
  },
  characterCountContainer: {
    position: 'absolute',
    bottom: SPACING.sm,
    right: SPACING.sm,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: SPACING.sm,
  },
  modalCharacterCount: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.secondaryText,
    fontWeight: '500',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: '#2D2D44',
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: SPACING.md,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginRight: SPACING.sm,
    alignItems: 'center',
  },
  modalCancelText: {
    ...TYPOGRAPHY.buttonText,
    color: COLORS.primaryText,
  },
  modalAddButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: SPACING.md,
    backgroundColor: COLORS.primaryAccent,
    ...SHADOWS.card,
    alignItems: 'center',
  },
  modalAddButtonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    opacity: 0.5,
  },
  modalAddText: {
    ...TYPOGRAPHY.buttonText,
    color: COLORS.primaryBackground,
    fontWeight: '700',
  },
  debugContainer: {
    padding: SPACING.sm,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: SPACING.sm,
    marginTop: SPACING.sm,
  },
  debugText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.secondaryText,
    textAlign: 'center',
  },
  simpleModalContainer: {
    flex: 1,
    backgroundColor: 'transparent', // Make transparent to show gradient background
  },
  simpleModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.secondaryBackground,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  simpleModalBackButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  simpleModalTitle: {
    ...TYPOGRAPHY.headingMedium,
    color: COLORS.primaryText,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
  simpleModalSpacer: {
    width: 40,
  },
  simpleModalBody: {
    padding: SPACING.lg,
    flex: 1,
    backgroundColor: 'transparent', // Make transparent to show gradient background
  },
  simpleModalSubtitle: {
    ...TYPOGRAPHY.bodyLarge,
    color: COLORS.primaryText,
    marginBottom: SPACING.lg,
    textAlign: 'center',
    fontWeight: '500',
  },
  simpleModalTextInputContainer: {
    position: 'relative',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: SPACING.md,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: SPACING.lg,
    minHeight: 140,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  simpleModalTextInput: {
    color: COLORS.primaryText,
    minHeight: 120,
    textAlignVertical: 'top',
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '400',
    textAlign: 'left',
    backgroundColor: 'transparent',
    includeFontPadding: false,
  },
  simpleModalCharacterCount: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.secondaryText,
    fontWeight: '500',
    textAlign: 'right',
    marginTop: SPACING.sm,
  },
  simpleModalAddButtonInline: {
    height: 48, // Fixed height instead of flex
    width: '60%', // Make button narrower instead of full width
    alignSelf: 'center', // Center the button
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: SPACING.md,
    marginTop: SPACING.md,
    overflow: 'hidden', // For gradient
  },
  simpleModalAddButtonGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: SPACING.md,
  },
  simpleModalAddText: {
    ...TYPOGRAPHY.buttonText,
    color: COLORS.primaryBackground,
    fontWeight: '700',
    fontSize: 16,
  },
  simpleModalDebugContainer: {
    padding: SPACING.sm,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: SPACING.sm,
    marginTop: SPACING.sm,
  },
  simpleModalDebugText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.secondaryText,
    textAlign: 'center',
  },
  simpleModalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: '#2D2D44',
    zIndex: 1000,
    elevation: 10,
  },
  simpleModalCancelButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: SPACING.md,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginRight: SPACING.sm,
    alignItems: 'center',
  },
  simpleModalCancelText: {
    ...TYPOGRAPHY.buttonText,
    color: COLORS.primaryText,
  },
  simpleModalAddButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: SPACING.md,
    backgroundColor: COLORS.primaryAccent,
    ...SHADOWS.card,
    alignItems: 'center',
  },
  simpleModalAddButtonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    opacity: 0.5,
  },
  simpleModalAddButtonActive: {
    shadowColor: COLORS.primaryAccent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  modalBackgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1, // Ensure it's behind other content
  },
  modalStarfield: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1, // Ensure it's behind other content
  },
  modalStar: {
    position: 'absolute',
    width: 2,
    height: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 1,
    opacity: 0.8,
  },
});

export default ReasonsScreen;
