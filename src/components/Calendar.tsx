import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../constants/theme';
import { typography } from '../constants/typography';

const { width } = Dimensions.get('window');

const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

interface CalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  maxDate?: Date;
  minDate?: Date;
}

const Calendar: React.FC<CalendarProps> = ({
  selectedDate,
  onDateSelect,
  maxDate = new Date(),
  minDate = new Date(2020, 0, 1),
}) => {
  // Always initialize with current year and month (2025)
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [currentYear, setCurrentYear] = useState(() => {
    const now = new Date();
    return now.getFullYear();
  });

  // Get the first day of the month and number of days
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const day = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    // Convert Sunday (0) to 6, Monday (1) to 0, etc.
    return day === 0 ? 6 : day - 1;
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDayOfMonth = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      days.push(date);
    }

    return days;
  };

  // Navigate to previous month
  const goToPreviousMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() - 1);
    
    // Check if the new month is within the allowed range
    if (newMonth >= minDate) {
      setCurrentMonth(newMonth);
      setCurrentYear(newMonth.getFullYear());
    }
  };

  // Navigate to next month
  const goToNextMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + 1);
    
    // Check if the new month is within the allowed range
    if (newMonth <= maxDate) {
      setCurrentMonth(newMonth);
      setCurrentYear(newMonth.getFullYear());
    }
  };

  // Check if a date is selectable
  const isDateSelectable = (date: Date) => {
    return date >= minDate && date <= maxDate;
  };

  // Check if a date is selected
  const isDateSelected = (date: Date) => {
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  // Check if a date is today
  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const calendarDays = generateCalendarDays();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <View style={styles.container}>
      {/* Month Navigation */}
      <View style={styles.monthNavigation}>
        <Text style={styles.monthYearText}>
          {monthNames[currentMonth.getMonth()]} {currentYear}
        </Text>
        <View style={styles.navigationButtons}>
          <TouchableOpacity
            style={[styles.navButton, !isDateSelectable(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)) && styles.navButtonDisabled]}
            onPress={goToPreviousMonth}
            disabled={!isDateSelectable(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
          >
            <Ionicons name="chevron-back" size={16} color={COLORS.primaryText} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.navButton, !isDateSelectable(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)) && styles.navButtonDisabled]}
            onPress={goToNextMonth}
            disabled={!isDateSelectable(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
          >
            <Ionicons name="chevron-forward" size={16} color={COLORS.primaryText} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Day Headers */}
      <View style={styles.dayHeaders}>
        {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day) => (
          <Text key={day} style={styles.dayHeaderText}>
            {day}
          </Text>
        ))}
      </View>

      {/* Calendar Grid */}
      <View style={styles.calendarGrid}>
        {calendarDays.map((date, index) => (
          <View key={index} style={styles.dayCell}>
            {date ? (
              <TouchableOpacity
                style={[
                  styles.dayButton,
                  isDateSelected(date) && styles.selectedDayButton,
                  isToday(date) && !isDateSelected(date) && styles.todayButton,
                  !isDateSelectable(date) && styles.disabledDayButton,
                ]}
                onPress={() => isDateSelectable(date) && onDateSelect(date)}
                disabled={!isDateSelectable(date)}
              >
                <Text
                  style={[
                    styles.dayText,
                    isDateSelected(date) && styles.selectedDayText,
                    isToday(date) && !isDateSelected(date) && styles.todayText,
                    !isDateSelectable(date) && styles.disabledDayText,
                  ]}
                >
                  {date.getDate()}
                </Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.emptyCell} />
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
  },
  monthNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    paddingHorizontal: SPACING.md,
  },
  monthYearText: {
    ...typography.h3,
    color: COLORS.primaryText,
    fontWeight: '600',
  },
  navigationButtons: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  navButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  navButtonDisabled: {
    opacity: 0.3,
  },
  dayHeaders: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.md,
  },
  dayHeaderText: {
    ...typography.caption,
    color: COLORS.secondaryText,
    flex: 1,
    textAlign: 'center',
    fontWeight: '500',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SPACING.md,
  },
  dayCell: {
    width: (width - SPACING.lg * 2 - SPACING.md * 2) / 7,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  dayButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  selectedDayButton: {
    backgroundColor: COLORS.primaryAccent,
    ...SHADOWS.card,
  },
  todayButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  disabledDayButton: {
    opacity: 0.3,
  },
  dayText: {
    ...typography.body,
    color: COLORS.primaryText,
    fontWeight: '500',
  },
  selectedDayText: {
    color: COLORS.primaryText,
    fontWeight: '700',
  },
  todayText: {
    color: COLORS.primaryText,
    fontWeight: '600',
  },
  disabledDayText: {
    color: COLORS.secondaryText,
  },
  emptyCell: {
    width: 32,
    height: 32,
  },
});

export default Calendar;
