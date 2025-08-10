import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { COLORS, SPACING } from '../constants/theme';

interface WeeklyCheckInProps {
  currentStreak: number;
  onCheckIn: () => void;
  isCheckedToday: boolean;
  style?: any;
}

const WeeklyCheckIn: React.FC<WeeklyCheckInProps> = ({ 
  currentStreak, 
  onCheckIn, 
  isCheckedToday,
  style 
}) => {
  const themeResult = useTheme();
  const colors = themeResult?.colors;
  
  // Enhanced safety check for theme colors
  if (!colors || 
      typeof colors !== 'object' || 
      !colors.primaryBackground || 
      !colors.primaryText ||
      !colors.primaryAccent) {
    console.warn('⚠️ WeeklyCheckIn: Theme colors not ready, using fallback');
    // Return a minimal loading state
    return (
      <View style={{ 
        height: 120, 
        backgroundColor: '#2A2A2A', 
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Text style={{ color: '#FFFFFF', fontSize: 16 }}>Loading check-in...</Text>
      </View>
    );
  }
  
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>Weekly Check-ins</Text>
      
      <View style={styles.daysContainer}>
        {/* The original code had a loop for weeklyCheckIns, but the new code doesn't.
            Assuming the intent was to remove the loop and the related state/props.
            The new code only shows the currentStreak and isCheckedToday.
            This component is now simplified to reflect the new props. */}
        <View style={styles.dayWrapper}>
          <TouchableOpacity
            style={styles.dayButton}
            onPress={onCheckIn}
            activeOpacity={0.8}
          >
            {/* The original code had LinearGradient, innerGlow, dayLabel, iconContainer, icon.
                The new code only shows the button and the currentStreak/isCheckedToday.
                This component is now simplified to reflect the new props. */}
            <View style={styles.dayGradient}>
              {/* Inner glow effect */}
              <View style={styles.innerGlow} />
              
              {/* Day label */}
              <Text style={[styles.dayLabel, { color: COLORS.primaryText }]}>
                {currentStreak}
              </Text>
              
              {/* Check mark or X icon */}
              <View style={styles.iconContainer}>
                {isCheckedToday ? (
                  <Ionicons
                    name="checkmark"
                    size={16}
                    color={COLORS.primaryAccent}
                    style={styles.icon}
                  />
                ) : (
                  <Ionicons
                    name="close"
                    size={16}
                    color={COLORS.primaryText}
                    style={styles.icon}
                  />
                )}
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Progress indicator */}
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          {currentStreak} of 7 days completed
        </Text>
        <View style={styles.progressBar}>
          {/* The original code had a progress bar fill, but the new code doesn't.
              This component is now simplified to reflect the new props. */}
          <View
            style={[
              styles.progressFill,
              {
                width: `${currentStreak / 7 * 100}%`,
              },
            ]}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: SPACING.lg,
    marginHorizontal: SPACING.md,
    marginVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.primaryText,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  dayWrapper: {
    alignItems: 'center',
  },
  dayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  dayGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    position: 'relative',
  },
  innerGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dayLabel: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 2,
  },
  iconContainer: {
    position: 'absolute',
    bottom: 2,
    right: 2,
  },
  icon: {
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressText: {
    fontSize: 12,
    color: COLORS.primaryText,
    marginBottom: SPACING.sm,
    opacity: 0.8,
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primaryAccent,
    borderRadius: 2,
    shadowColor: COLORS.primaryAccent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 2,
  },
});

export default WeeklyCheckIn; 