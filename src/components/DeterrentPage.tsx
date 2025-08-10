import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { typography, body, bodySmall, buttonText } from '../constants/typography';

const { width, height } = Dimensions.get('window');

// Color constants
const COLORS = {
  primaryBackground: '#000000',
  overlayBackground: 'rgba(0, 0, 0, 0.95)',
  primaryAccent: '#C1FF72',
  primaryText: '#FFFFFF',
  secondaryText: '#A9A9A9',
  mutedText: '#6B7280',
  cardBackground: '#1F2937',
};

// Spacing constants
const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

interface DeterrentPageProps {
  icon: any;
  title: string;
  description: string;
  onBack: () => void;
}

const DeterrentPage: React.FC<DeterrentPageProps> = ({
  icon,
  title,
  description,
  onBack,
}) => {
  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onBack();
  };

  return (
    <View style={styles.overlay}>
      <LinearGradient
        colors={['#0A0A1A', '#1A1A2E', '#16213E']}
        style={styles.backgroundGradient}
      >
        {/* Back button */}
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color={COLORS.primaryText} />
        </TouchableOpacity>

        {/* Main content */}
        <View style={styles.content}>
          {/* Icon */}
          <View style={styles.iconContainer}>
            <Image 
              source={icon} 
              style={styles.icon}
              resizeMode="contain"
            />
          </View>

          {/* Title */}
          <Text style={styles.title}>{title}</Text>

          {/* Description */}
          <Text style={styles.description}>{description}</Text>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.overlayBackground,
    zIndex: 1000,
  },
  backgroundGradient: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xxl,
  },
  backButton: {
    position: 'absolute',
    top: SPACING.lg,
    left: SPACING.lg,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1001,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
  iconContainer: {
    marginBottom: SPACING.xxl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 150,
    height: 150,
  },
  title: {
    ...typography.h1,
    color: COLORS.primaryText,
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: SPACING.xl,
    lineHeight: 36,
  },
  description: {
    ...body,
    color: COLORS.secondaryText,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: width - SPACING.lg * 2,
  },
});

export default DeterrentPage;
