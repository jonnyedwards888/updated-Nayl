import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useThemeGuaranteed } from '../context/ThemeContext';
import { COLORS, TYPOGRAPHY } from '../constants/theme';
import { body, buttonText } from '../constants/typography';

const { width, height } = Dimensions.get('window');

// Spacing constants (4-point grid system)
const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

interface LearningScreenProps {
  navigation: any;
}

const LearningScreen: React.FC<LearningScreenProps> = ({ navigation }) => {
  const { colors } = useThemeGuaranteed();
  
  // Star positions for randomized animation
  const [starPositions, setStarPositions] = useState(() => 
    Array.from({ length: 50 }, () => ({
      x: Math.random() * width * 2,
      y: Math.random() * height,
      opacity: Math.random() * 0.8 + 0.1,
      speed: Math.random() * 0.15 + 0.03,
      directionX: (Math.random() - 0.5) * 1.5,
      directionY: (Math.random() - 0.5) * 1.5,
      size: Math.random() * 2.2 + 0.5,
    }))
  );

  // Animate starfield
  useEffect(() => {
    const starfieldInterval = setInterval(() => {
      setStarPositions(prevPositions => 
        prevPositions.map(star => {
          const newX = star.x + (star.directionX * star.speed);
          const newY = star.y + (star.directionY * star.speed);
          
          let wrappedX = newX;
          let wrappedY = newY;
          
          if (newX < -50) wrappedX = width + 50;
          if (newX > width + 50) wrappedX = -50;
          if (newY < -50) wrappedY = height + 50;
          if (newY > height + 50) wrappedY = -50;
          
          return {
            ...star,
            x: wrappedX,
            y: wrappedY,
          };
        })
      );
    }, 20);

    return () => clearInterval(starfieldInterval);
  }, []);

  // Video data
  const videos = [
    {
      id: '1',
      title: 'How to Stop Biting Your Nails',
      description: 'Learn effective techniques to break the nail biting habit',
      thumbnail: 'https://img.youtube.com/vi/1QWEpPzetjI/maxresdefault.jpg',
      url: 'https://www.youtube.com/watch?v=1QWEpPzetjI',
      duration: '8:45'
    },
    {
      id: '2',
      title: 'Nail Biting Causes & Solutions',
      description: 'Understanding the root causes and finding lasting solutions',
      thumbnail: 'https://img.youtube.com/vi/nrvO4ZDw4ts/maxresdefault.jpg',
      url: 'https://youtu.be/nrvO4ZDw4ts?si=SMtDwHeTXZE46JXd',
      duration: '12:30'
    },
    {
      id: '3',
      title: 'Nails and Health Connection',
      description: 'How nail health reflects your overall wellbeing',
      thumbnail: 'https://img.youtube.com/vi/_wW74LwHBiQ/maxresdefault.jpg',
      url: 'https://www.youtube.com/watch?v=_wW74LwHBiQ',
      duration: '15:20'
    }
  ];

  const handleVideoPress = async (video: any) => {
    try {
      // Check if YouTube app is available
      const supported = await Linking.canOpenURL(video.url);
      
      if (supported) {
        await Linking.openURL(video.url);
      } else {
        console.log('Cannot open URL:', video.url);
      }
    } catch (error) {
      console.error('Error opening video:', error);
    }
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Premium Background with Gradient */}
      <LinearGradient
        colors={colors.backgroundGradient}
        style={styles.backgroundContainer}
      >
        {/* Subtle starfield effect */}
        {starPositions.map((star, index) => (
          <View
            key={index}
            style={[
              styles.star,
              {
                left: star.x,
                top: star.y,
                opacity: star.opacity,
                width: star.size,
                height: star.size,
                borderRadius: star.size / 2,
              },
            ]}
          />
        ))}
      </LinearGradient>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={[
           styles.screenTitle, 
           { 
             color: colors.primaryText,
             // Premium layered shadows - base shadow + accent shadow
             textShadowColor: colors.primaryBackground,
             textShadowOffset: { width: 0, height: 1 },
             textShadowRadius: 2,
             // Additional premium accent shadow
             shadowColor: colors.primaryAccent,
             shadowOffset: { width: 0, height: 0 },
             shadowOpacity: 0.1,
             shadowRadius: 1,
           }
         ]}>Learning</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Introduction */}
        <View style={styles.introSection}>
          <Text style={[styles.introTitle, { color: colors.primaryText }]}>
            Master Your Nail Health
          </Text>
          <Text style={[styles.introDescription, { color: colors.secondaryText }]}>
            Watch these expert videos to understand nail biting, its causes, and effective solutions for a healthier you.
          </Text>
        </View>

        {/* Video Grid */}
        <View style={styles.videoGrid}>
          {videos.map((video) => (
            <TouchableOpacity
              key={video.id}
              style={styles.videoCard}
              onPress={() => handleVideoPress(video)}
            >
              <View style={styles.thumbnailContainer}>
                <Image
                  source={{ uri: video.thumbnail }}
                  style={styles.thumbnail}
                  resizeMode="cover"
                  onError={() => console.log('Failed to load thumbnail for:', video.title)}
                />
                <View style={styles.durationBadge}>
                  <Text style={styles.durationText}>{video.duration}</Text>
                </View>
                <View style={styles.playButton}>
                  <Ionicons name="play" size={24} color="#FFFFFF" />
                </View>
              </View>
              <View style={styles.videoInfo}>
                <Text style={[styles.videoTitle, { color: colors.primaryText }]}>
                  {video.title}
                </Text>
                <Text style={[styles.videoDescription, { color: colors.secondaryText }]}>
                  {video.description}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Progress Section */}
        <View style={styles.progressSection}>
          <Text style={[styles.progressTitle, { color: colors.primaryText }]}>
            Your Learning Progress
          </Text>
          <View style={styles.progressBar}>
            <LinearGradient
              colors={['#00D4FF', '#0099FF', '#0066FF']}
              style={[styles.progressFill, { width: '0%' }]}
            />
          </View>
          <Text style={[styles.progressText, { color: colors.secondaryText }]}>
            Start watching to track your progress
          </Text>
        </View>
      </ScrollView>
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
  star: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    borderRadius: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  screenTitle: {
    ...TYPOGRAPHY.headingLarge,
    flex: 1,
    textAlign: 'center',
    fontWeight: '700',
    letterSpacing: 0.5, // Improved letter spacing
  },
  headerSpacer: {
    width: 50,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  introSection: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
    paddingTop: SPACING.lg,
  },
  introTitle: {
    fontSize: 32,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: SPACING.md,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  introDescription: {
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: SPACING.lg,
  },
  videoGrid: {
    marginBottom: SPACING.xxl,
  },
  videoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: SPACING.lg,
    marginBottom: SPACING.lg,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  thumbnailContainer: {
    position: 'relative',
    height: 200,
    backgroundColor: '#1F2937', // Fallback background color
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  durationBadge: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: SPACING.sm,
  },
  durationText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -20 }, { translateY: -20 }],
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoInfo: {
    padding: SPACING.lg,
  },
  videoTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: SPACING.sm,
    lineHeight: 26,
  },
  videoDescription: {
    fontSize: 16,
    lineHeight: 22,
    opacity: 0.8,
  },
  progressSection: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
    paddingTop: SPACING.lg,
  },
  progressTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    marginBottom: SPACING.md,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
  },
});

export default LearningScreen;
