import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

interface ScreenSkeletonProps {
  showHeader?: boolean;
  showContent?: boolean;
  showFooter?: boolean;
}

const ScreenSkeleton: React.FC<ScreenSkeletonProps> = ({ 
  showHeader = true, 
  showContent = true, 
  showFooter = false 
}) => {
  return (
    <View style={styles.container}>
      {/* Header skeleton */}
      {showHeader && (
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.backButtonPlaceholder}>
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
                style={styles.placeholderGradient}
              />
            </View>
            <View style={styles.titlePlaceholder}>
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.08)']}
                style={styles.placeholderGradient}
              />
            </View>
            <View style={styles.headerSpacer} />
          </View>
        </View>
      )}

      {/* Content skeleton */}
      {showContent && (
        <View style={styles.content}>
          {/* Content placeholder */}
          <View style={styles.contentPlaceholder}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.03)']}
              style={styles.placeholderGradient}
            />
          </View>
          
          {/* Additional content placeholders */}
          {Array.from({ length: 3 }).map((_, index) => (
            <View key={`content-${index}`} style={styles.contentItemPlaceholder}>
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.06)', 'rgba(255, 255, 255, 0.02)']}
                style={styles.placeholderGradient}
              />
            </View>
          ))}
        </View>
      )}

      {/* Footer skeleton */}
      {showFooter && (
        <View style={styles.footer}>
          <View style={styles.footerPlaceholder}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
              style={styles.placeholderGradient}
            />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButtonPlaceholder: {
    width: 24,
    height: 24,
    borderRadius: 12,
    overflow: 'hidden',
  },
  titlePlaceholder: {
    width: 120,
    height: 24,
    borderRadius: 12,
    overflow: 'hidden',
  },
  headerSpacer: {
    width: 24,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  contentPlaceholder: {
    width: '100%',
    height: 100,
    borderRadius: 20,
    marginBottom: 20,
    overflow: 'hidden',
  },
  contentItemPlaceholder: {
    width: '100%',
    height: 60,
    borderRadius: 15,
    marginBottom: 16,
    overflow: 'hidden',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  footerPlaceholder: {
    width: '100%',
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
  },
  placeholderGradient: {
    width: '100%',
    height: '100%',
  },
});

export default ScreenSkeleton;
