import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

interface AchievementSkeletonProps {
  count?: number;
}

const AchievementSkeleton: React.FC<AchievementSkeletonProps> = ({ count = 6 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <View key={`skeleton-${index}`} style={styles.achievementCard}>
          {/* Skeleton icon placeholder */}
          <View style={styles.iconPlaceholder}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
              style={styles.iconGradient}
            />
          </View>
          
          {/* Skeleton title placeholder */}
          <View style={styles.titlePlaceholder}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
              style={styles.titleGradient}
            />
          </View>
          
          {/* Skeleton description placeholder */}
          <View style={styles.descriptionPlaceholder}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.03)']}
              style={styles.descriptionGradient}
            />
          </View>
          
          {/* Skeleton progress bar placeholder */}
          <View style={styles.progressPlaceholder}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
              style={styles.progressGradient}
            />
          </View>
        </View>
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  achievementCard: {
    width: (width - 48) / 2, // Match the actual achievement card width
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200, // Match the actual achievement card height
  },
  iconPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 12,
    overflow: 'hidden',
  },
  iconGradient: {
    width: '100%',
    height: '100%',
  },
  titlePlaceholder: {
    width: '80%',
    height: 16,
    borderRadius: 8,
    marginBottom: 8,
    overflow: 'hidden',
  },
  titleGradient: {
    width: '100%',
    height: '100%',
  },
  descriptionPlaceholder: {
    width: '90%',
    height: 12,
    borderRadius: 6,
    marginBottom: 16,
    overflow: 'hidden',
  },
  descriptionGradient: {
    width: '100%',
    height: '100%',
  },
  progressPlaceholder: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressGradient: {
    width: '100%',
    height: '100%',
  },
});

export default AchievementSkeleton;
