import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const HomeScreenSkeleton: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Background gradient skeleton */}
      <LinearGradient
        colors={['#000000', '#0F172A', '#000000']}
        style={styles.backgroundGradient}
      />
      
      {/* Header skeleton */}
      <View style={styles.header}>
        <View style={styles.profileHeaderPlaceholder}>
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
            style={styles.placeholderGradient}
          />
        </View>
        <View style={styles.headerIconsPlaceholder}>
          <View style={styles.iconPlaceholder}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
              style={styles.placeholderGradient}
            />
          </View>
          <View style={styles.iconPlaceholder}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
              style={styles.placeholderGradient}
            />
          </View>
        </View>
      </View>

      {/* Weekly tracker skeleton */}
      <View style={styles.weeklyTrackerContainer}>
        <View style={styles.weeklyTracker}>
          {Array.from({ length: 7 }).map((_, index) => (
            <View key={index} style={styles.dayContainer}>
              <View style={styles.dayCirclePlaceholder}>
                <LinearGradient
                  colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
                  style={styles.placeholderGradient}
                />
              </View>
              <View style={styles.dayLabelPlaceholder}>
                <LinearGradient
                  colors={['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.03)']}
                  style={styles.placeholderGradient}
                />
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Orb container skeleton */}
      <View style={styles.orbContainer}>
        <View style={styles.orbPlaceholder}>
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
            style={styles.placeholderGradient}
          />
        </View>
      </View>

      {/* Action buttons skeleton */}
      <View style={styles.actionButtonsContainer}>
        {Array.from({ length: 4 }).map((_, index) => (
          <View key={index} style={styles.actionButtonPlaceholder}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
              style={styles.placeholderGradient}
            />
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  profileHeaderPlaceholder: {
    width: 120,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  headerIconsPlaceholder: {
    flexDirection: 'row',
    gap: 16,
  },
  iconPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
  },
  weeklyTrackerContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  weeklyTracker: {
    flexDirection: 'row',
    gap: 12,
  },
  dayContainer: {
    alignItems: 'center',
    gap: 8,
  },
  dayCirclePlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
  },
  dayLabelPlaceholder: {
    width: 16,
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
  },
  orbContainer: {
    alignItems: 'center',
    marginVertical: 40,
  },
  orbPlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 100,
    overflow: 'hidden',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: 20,
  },
  actionButtonPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
  },
  placeholderGradient: {
    width: '100%',
    height: '100%',
  },
});

export default HomeScreenSkeleton;
