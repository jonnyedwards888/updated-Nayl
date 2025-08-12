import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { body, bodySmall, caption, buttonText } from '../constants/typography';
import { COLORS, SHADOWS, TYPOGRAPHY } from '../constants/theme';
import { useTheme, useThemeGuaranteed } from '../context/ThemeContext';
import { useNavigation, NavigationProp } from '@react-navigation/native';

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

type LibraryStackParamList = {
  LibraryMain: undefined;
  Meditation: undefined;
  Achievements: undefined;
  RelaxationSound: { soundType: string };
};

interface LibraryScreenProps {
  navigation?: NavigationProp<LibraryStackParamList>;
}

const LibraryScreen: React.FC<LibraryScreenProps> = ({ navigation: propNavigation }) => {
  const { colors } = useThemeGuaranteed();
  const navigation = useNavigation<NavigationProp<LibraryStackParamList>>();
  const starfieldAnimation = useRef(new Animated.Value(0)).current;
  
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

  // Navigation handler with error handling
  const handleRelaxationNavigation = (soundType: string) => {
    try {
      console.log('🔍 Navigation debug info:');
      console.log('- Current navigation object:', navigation);
      console.log('- Attempting to navigate to RelaxationSound with type:', soundType);
      
      // Try the navigation
      navigation.navigate('RelaxationSound', { soundType });
      
      console.log('✅ Navigation call completed successfully');
    } catch (error) {
      console.error('❌ Navigation error:', error);
      console.error('🚨 Navigation failed. This suggests a deeper navigation setup issue.');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.primaryBackground }]}>
      {/* Premium Background with Gradient */}
      <LinearGradient
        colors={colors.backgroundGradient}
        style={styles.backgroundContainer}
      >
        {/* Subtle starfield effect */}
        {starPositions.map((star, index) => (
          <Animated.View
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

      {/* Mountain Scene Background Image */}
      <View style={styles.mountainContainer}>
        <Image
          source={require('../../assets/mountain-scene-background.webp')}
          style={styles.mountainImage}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.8)']}
          style={styles.mountainOverlay}
        />
      </View>

      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.screenTitle, { color: colors.primaryText }]}>Library</Text>
        <TouchableOpacity style={styles.websiteButton}>
          <Text style={[styles.websiteText, { color: colors.primaryText }]}>Website</Text>
          <Ionicons name="arrow-forward" size={16} color={colors.primaryText} />
        </TouchableOpacity>
      </View>

      {/* Category Icons on Mountain Image */}
      <View style={styles.categoriesOverlay}>
        <View style={styles.categoryRow}>
          <TouchableOpacity style={styles.categoryButton}>
            <View style={[styles.categoryIconContainer, { backgroundColor: colors.secondaryBackground }]}>
              <Ionicons name="fitness" size={24} color={colors.primaryText} />
            </View>
            <Text style={[styles.categoryLabel, { color: colors.primaryText }]}>Breathing Exercise</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.categoryButton}>
            <View style={[styles.categoryIconContainer, { backgroundColor: colors.secondaryBackground }]}>
              <Ionicons name="chatbubble-ellipses" size={24} color={colors.primaryText} />
            </View>
            <Text style={[styles.categoryLabel, { color: colors.primaryText }]}>Melius AI Therapist</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.categoryButton}>
            <View style={[styles.categoryIconContainer, { backgroundColor: colors.secondaryBackground }]}>
              <Ionicons name="leaf" size={24} color={colors.primaryText} />
            </View>
            <Text style={[styles.categoryLabel, { color: colors.primaryText }]}>Meditate</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.categoryButton}>
            <View style={[styles.categoryIconContainer, { backgroundColor: colors.secondaryBackground }]}>
              <Ionicons name="document-text" size={24} color={colors.primaryText} />
            </View>
            <Text style={[styles.categoryLabel, { color: colors.primaryText }]}>Porn Research</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Content Buttons */}
        <View style={styles.contentButtonsContainer}>
          <View style={styles.contentButtonRow}>
            <TouchableOpacity style={styles.contentButton}>
              <LinearGradient
                colors={['#FF6B35', '#FF8E53', '#FF6B35', '#FF4A1C']}
                style={styles.contentButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                locations={[0, 0.3, 0.7, 1]}
              >
                <View style={styles.contentButtonInner}>
                  <Ionicons name="document-text" size={22} color={colors.primaryText} />
                  <Text style={[styles.contentButtonText, { color: colors.primaryText }]}>Articles</Text>
                </View>
                <View style={[styles.contentButtonGlow, { backgroundColor: 'rgba(255, 107, 53, 0.15)' }]} />
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.contentButton}>
              <LinearGradient
                colors={['#8B5CF6', '#A78BFA', '#8B5CF6', '#7C3AED']}
                style={styles.contentButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                locations={[0, 0.3, 0.7, 1]}
              >
                <View style={styles.contentButtonInner}>
                  <Ionicons name="trophy" size={22} color={colors.primaryText} />
                  <Text style={[styles.contentButtonText, { color: colors.primaryText }]}>Leaderboard</Text>
                </View>
                <View style={[styles.contentButtonGlow, { backgroundColor: 'rgba(139, 92, 246, 0.15)' }]} />
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <View style={styles.contentButtonRow}>
            <TouchableOpacity style={styles.contentButton}>
              <LinearGradient
                colors={['#10B981', '#34D399', '#10B981', '#059669']}
                style={styles.contentButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                locations={[0, 0.3, 0.7, 1]}
              >
                <View style={styles.contentButtonInner}>
                  <Ionicons name="bar-chart" size={22} color={colors.primaryText} />
                  <Text style={[styles.contentButtonText, { color: colors.primaryText }]}>Learn</Text>
                </View>
                <View style={[styles.contentButtonGlow, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]} />
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.contentButton}>
              <LinearGradient
                colors={['#F59E0B', '#FBBF24', '#F59E0B', '#D97706']}
                style={styles.contentButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                locations={[0, 0.3, 0.7, 1]}
              >
                <View style={styles.contentButtonInner}>
                  <Ionicons name="heart" size={22} color={colors.primaryText} />
                  <Text style={[styles.contentButtonText, { color: colors.primaryText }]}>Wellness</Text>
                </View>
                <View style={[styles.contentButtonGlow, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]} />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Content Cards */}
        <View style={styles.contentCardsContainer}>
          {/* Content cards removed - The Science of Habit Formation and Mindfulness Techniques */}
        </View>

        {/* Relaxation Noises Section */}
        <View style={styles.relaxationSection}>
          <Text style={styles.sectionTitle}>Relaxation Noises</Text>
          <Text style={styles.sectionSubtitle}>Helping your heart-rate regulate when urges surge.</Text>
          
          <View style={styles.relaxationGrid}>
            <TouchableOpacity style={styles.relaxationItem} onPress={() => handleRelaxationNavigation('rain')}>
              <View style={styles.relaxationIconContainer}>
                <Image 
                  source={require('../../assets/library-sound-icons/rain-icon.webp')} 
                  style={styles.relaxationIcon}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.relaxationLabel}>Rain</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.relaxationItem} onPress={() => handleRelaxationNavigation('sea')}>
              <View style={styles.relaxationIconContainer}>
                <Image 
                  source={require('../../assets/library-sound-icons/new-sea-icon.webp')} 
                  style={styles.relaxationIcon}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.relaxationLabel}>Ocean Waves</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.relaxationItem} onPress={() => handleRelaxationNavigation('campfire')}>
              <View style={styles.relaxationIconContainer}>
                <Image 
                  source={require('../../assets/library-sound-icons/new-campfire-icon.webp')} 
                  style={styles.relaxationIcon}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.relaxationLabel}>Campfire</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.relaxationItem} onPress={() => handleRelaxationNavigation('white-noise')}>
              <View style={styles.relaxationIconContainer}>
                <Image 
                  source={require('../../assets/library-sound-icons/white-noise-icon.webp')} 
                  style={styles.relaxationIcon}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.relaxationLabel}>White Noise</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Leaderboard Section */}
        <View style={styles.leaderboardSection}>
          <View style={styles.leaderboardHeader}>
            <Text style={styles.sectionTitle}>Leaderboard</Text>
            <Text style={styles.leaderboardRank}>You are #207</Text>
          </View>
          
          <View style={styles.leaderboardList}>
            <View style={styles.leaderboardItem}>
              <View style={styles.rankContainer}>
                <Ionicons name="medal" size={24} color="#FFD700" />
                <Text style={styles.leaderboardName}>Vincent</Text>
              </View>
              <View style={[styles.rankBadge, styles.goldBadge]}>
                <Text style={styles.rankBadgeText}>339 days</Text>
              </View>
            </View>

            <View style={styles.leaderboardItem}>
              <View style={styles.rankContainer}>
                <Ionicons name="medal" size={24} color="#C0C0C0" />
                <Text style={styles.leaderboardName}>Oscar</Text>
              </View>
              <View style={[styles.rankBadge, styles.silverBadge]}>
                <Text style={styles.rankBadgeText}>269 days</Text>
              </View>
            </View>

            <View style={styles.leaderboardItem}>
              <View style={styles.rankContainer}>
                <Ionicons name="medal" size={24} color="#CD7F32" />
                <Text style={styles.leaderboardName}>Owen</Text>
              </View>
              <View style={[styles.rankBadge, styles.bronzeBadge]}>
                <Text style={styles.rankBadgeText}>256 days</Text>
              </View>
            </View>
          </View>
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
    backgroundColor: COLORS.primaryText,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
    zIndex: 10,
  },
  screenTitle: {
    ...TYPOGRAPHY.headingMedium,
    color: COLORS.primaryText,
    fontWeight: '700',
    marginLeft: SPACING.sm,
  },
  websiteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.sm,
  },
  websiteText: {
    ...body,
    color: COLORS.primaryText,
    marginRight: SPACING.xs,
  },
  mountainContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.28,
    zIndex: 1,
  },
  mountainImage: {
    width: '100%',
    height: '100%',
  },
  mountainOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  categoriesOverlay: {
    position: 'absolute',
    top: height * 0.18,
    left: 0,
    right: 0,
    zIndex: 5,
    paddingHorizontal: SPACING.lg,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: SPACING.lg,
  },
  categoryButton: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: SPACING.xs,
  },
  categoryIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
    ...SHADOWS.card,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  categoryLabel: {
    ...bodySmall,
    color: COLORS.primaryText,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: height * 0.26,
  },
  contentButtonsContainer: {
    marginBottom: SPACING.xl,
    paddingHorizontal: SPACING.xs,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: SPACING.lg,
    paddingVertical: SPACING.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  contentButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md + 4,
    gap: SPACING.md,
  },
  contentButton: {
    flex: 1,
    marginHorizontal: SPACING.xs,
    borderRadius: SPACING.lg,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  contentButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.lg + 4,
    paddingHorizontal: SPACING.lg + 8,
    borderRadius: SPACING.lg,
    position: 'relative',
  },
  contentButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
  },
  contentButtonText: {
    ...buttonText,
    color: COLORS.primaryText,
    fontSize: 16,
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 0.5,
  },
  contentButtonGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: SPACING.lg,
    opacity: 0.6,
    zIndex: 1,
  },
  contentCardsContainer: {
    marginBottom: SPACING.xl,
  },
  contentCard: {
    backgroundColor: COLORS.secondaryBackground,
    borderRadius: SPACING.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.secondaryAccent,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  contentCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  contentCardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  contentCardMeta: {
    flex: 1,
  },
  contentCardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.primaryText,
    marginBottom: SPACING.xs,
  },
  contentCardSubtitle: {
    fontSize: 14,
    color: COLORS.secondaryText,
    marginBottom: SPACING.sm,
  },
  contentCardDescription: {
    fontSize: 14,
    color: COLORS.secondaryText,
    lineHeight: 20,
    marginBottom: SPACING.md,
  },
  contentCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contentCardReadTime: {
    fontSize: 12,
    color: COLORS.mutedText,
  },
  contentCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contentCardButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primaryAccent,
    marginRight: SPACING.xs,
  },
  relaxationSection: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    ...TYPOGRAPHY.headingSmall,
    color: COLORS.primaryText,
    marginBottom: SPACING.sm,
  },
  sectionSubtitle: {
    ...bodySmall,
    color: COLORS.secondaryText,
    marginBottom: SPACING.lg,
  },
  relaxationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  relaxationItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  relaxationIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  relaxationIcon: {
    width: '100%',
    height: '100%',
  },
  relaxationLabel: {
    ...bodySmall,
    color: COLORS.primaryText,
    textAlign: 'center',
  },
  leaderboardSection: {
    marginBottom: SPACING.xxl,
  },
  leaderboardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  leaderboardRank: {
    ...bodySmall,
    color: COLORS.primaryAccent,
    fontWeight: '600',
  },
  leaderboardList: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: SPACING.lg,
    padding: SPACING.lg,
    ...SHADOWS.card,
  },
  leaderboardItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  rankContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leaderboardName: {
    ...body,
    color: COLORS.primaryText,
    marginLeft: SPACING.sm,
  },
  rankBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: SPACING.md,
  },
  goldBadge: {
    backgroundColor: '#FFD700',
  },
  silverBadge: {
    backgroundColor: '#C0C0C0',
  },
  bronzeBadge: {
    backgroundColor: '#CD7F32',
  },
  rankBadgeText: {
    ...caption,
    color: '#000000',
    fontWeight: '600',
  },
});

export default LibraryScreen;
