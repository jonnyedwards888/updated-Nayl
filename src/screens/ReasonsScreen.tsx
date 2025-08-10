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
  const [modalAnimation] = useState(new Animated.Value(0));
  const textInputRef = useRef<TextInput>(null);

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
    Animated.timing(modalAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      // Focus the text input after animation completes
      setTimeout(() => {
        textInputRef.current?.focus();
      }, 350);
    });
  };

  const hideModal = () => {
    Animated.timing(modalAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setIsModalVisible(false);
      setNewReason('');
    });
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
      Alert.alert('Success', 'Reason added successfully!');
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
                      Added {formatDate(reason.createdAt)}
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

      {/* Enhanced Add Reason Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={hideModal}
        statusBarTranslucent={true}
      >
        <StatusBar barStyle="light-content" backgroundColor="rgba(0, 0, 0, 0.8)" />
        <Animated.View 
          style={[
            styles.modalOverlay,
            {
              opacity: modalAnimation,
            }
          ]}
        >
          <TouchableOpacity 
            style={styles.modalBackdrop} 
            onPress={hideModal}
            activeOpacity={1}
          />
          <Animated.View 
            style={[
              styles.modalContent,
              {
                transform: [{
                  translateY: modalAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [height, 0],
                  }),
                }],
              }
            ]}
          >
            <KeyboardAvoidingView 
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.modalKeyboardView}
            >
              {/* Modal Header */}
              <View style={styles.modalHeader}>
                <View style={styles.modalHeaderContent}>
                  <Text style={styles.modalTitle}>Add New Reason</Text>
                  <TouchableOpacity
                    style={styles.modalCloseButton}
                    onPress={hideModal}
                  >
                    <Ionicons name="close" size={28} color={COLORS.primaryText} />
                  </TouchableOpacity>
                </View>
                <View style={styles.modalHeaderDivider} />
              </View>

              {/* Modal Body */}
              <View style={styles.modalBody}>
                <Text style={styles.modalSubtitle}>
                  Why do you want to stop biting your nails?
                </Text>
                <View style={styles.textInputContainer}>
                  <TextInput
                    ref={textInputRef}
                    style={styles.modalTextInput}
                    placeholder="Enter your reason here..."
                    placeholderTextColor={COLORS.mutedText}
                    value={newReason}
                    onChangeText={setNewReason}
                    multiline
                    numberOfLines={6}
                    maxLength={200}
                    textAlignVertical="top"
                    autoFocus={false}
                    blurOnSubmit={false}
                    returnKeyType="done"
                    enablesReturnKeyAutomatically={true}
                  />
                  <View style={styles.characterCountContainer}>
                    <Text style={styles.modalCharacterCount}>
                      {newReason.length}/200
                    </Text>
                  </View>
                </View>
              </View>

              {/* Modal Footer */}
              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={styles.modalCancelButton}
                  onPress={hideModal}
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.modalAddButton,
                    !newReason.trim() && styles.modalAddButtonDisabled
                  ]}
                  onPress={addReason}
                  disabled={!newReason.trim() || isAdding}
                  activeOpacity={0.8}
                >
                  <Text style={styles.modalAddText}>
                    {isAdding ? 'Adding...' : 'Add Reason'}
                  </Text>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </Animated.View>
        </Animated.View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryBackground,
  },
  backgroundContainer: {
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
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
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
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.card,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
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
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: SPACING.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
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
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: SPACING.md,
    padding: SPACING.lg,
    alignItems: 'center',
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
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    width: '100%',
    backgroundColor: COLORS.secondaryBackground,
    borderTopLeftRadius: SPACING.lg,
    borderTopRightRadius: SPACING.lg,
    overflow: 'hidden',
    maxHeight: height * 0.8,
    ...SHADOWS.card,
  },
  modalKeyboardView: {
    flex: 1,
  },
  modalHeader: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.cardBackground,
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
    color: COLORS.primaryText,
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
  },
  modalSubtitle: {
    ...TYPOGRAPHY.bodyLarge,
    color: COLORS.primaryText,
    marginBottom: SPACING.lg,
    textAlign: 'center',
    fontWeight: '500',
  },
  textInputContainer: {
    position: 'relative',
    backgroundColor: COLORS.primaryBackground,
    borderRadius: SPACING.md,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    ...SHADOWS.card,
  },
  modalTextInput: {
    ...TYPOGRAPHY.bodyLarge,
    color: COLORS.primaryText,
    minHeight: 120,
    textAlignVertical: 'top',
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '400',
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
    backgroundColor: COLORS.cardBackground,
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
});

export default ReasonsScreen;
