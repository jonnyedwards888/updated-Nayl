import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { typography, body, bodySmall, caption } from '../constants/typography';
import Svg, { Circle, Path, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import { BlurView } from 'expo-blur';
import { useTheme, useThemeGuaranteed } from '../context/ThemeContext';

const { width, height } = Dimensions.get('window');

// Mock data
const mockElapsedDays = 1;
const RECOVERY_TARGET_DAYS = 90;
const recoveryPercentage = (mockElapsedDays / RECOVERY_TARGET_DAYS) * 100;
const daysToRecovery = RECOVERY_TARGET_DAYS - mockElapsedDays;
const estimatedRecoveryDate = new Date();
estimatedRecoveryDate.setDate(estimatedRecoveryDate.getDate() + daysToRecovery);

// Line graph data
const graphData = [
  { day: 0, value: 0 },
  { day: 7, value: 8 },
  { day: 14, value: 15 },
  { day: 21, value: 23 },
  { day: 30, value: 33 },
  { day: 45, value: 50 },
  { day: 60, value: 67 },
  { day: 75, value: 83 },
  { day: 90, value: 100 },
];

// Benefits data with multi-color icon system
const benefits = [
  {
    icon: 'custom',
    iconSource: require('../../assets/recovery-page-icons/increased-confidence.webp'),
    title: 'Improved Confidence',
    description: 'Feel more comfortable showing your hands in social and professional situations.',
    progress: 85,
    color: '#C1FF72', // Vibrant lime-green
  },
  {
    icon: 'custom',
    iconSource: require('../../assets/recovery-page-icons/healthy-nails.webp'),
    title: 'Healthier Nails',
    description: 'Nails and cuticles recover, grow stronger, and look better.',
    progress: 92,
    color: '#0A4F6B', // Calming teal
  },
  {
    icon: 'custom',
    iconSource: require('../../assets/recovery-page-icons/new-meditation-icon.webp'),
    title: 'Reduced Stress',
    description: 'Break the cycle of anxiety and nervous habits.',
    progress: 78,
    color: '#F59E0B', // Warm warning amber
  },
  {
    icon: 'custom',
    iconSource: require('../../assets/recovery-page-icons/fewer-infections-icon.webp'),
    title: 'Fewer Infections',
    description: 'Lower risk of nail, skin, and mouth infections.',
    progress: 88,
    color: '#0EA5E9', // Soft info blue
  },
  {
    icon: 'custom',
    iconSource: require('../../assets/recovery-page-icons/willpower-icon.webp'),
    title: 'Stronger Self-Control',
    description: 'Build willpower and break the habit for good.',
    progress: 73,
    color: '#C1FF72', // Back to lime-green
  },
  {
    icon: 'custom',
    iconSource: require('../../assets/recovery-page-icons/better-hygiene-icon.webp'),
    title: 'Better Hygiene',
    description: 'Fewer germs and less risk of illness.',
    progress: 95,
    color: '#0A4F6B', // Back to teal
  },
];

const AnalyticsScreen: React.FC = () => {
  const navigation = useNavigation();
  const themeResult = useThemeGuaranteed();
  const colors = themeResult?.colors;
  
  // Enhanced safety check for theme colors
  if (!colors || 
      typeof colors !== 'object' || 
      !colors.primaryBackground || 
      !colors.primaryText ||
      !colors.backgroundGradient) {
    console.warn('⚠️ AnalyticsScreen: Theme colors not ready, using fallback');
    // Return a minimal loading state
    return (
      <View style={{ 
        flex: 1, 
        backgroundColor: '#000000',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Text style={{ color: '#FFFFFF', fontSize: 18 }}>Loading analytics...</Text>
      </View>
    );
  }

  const [starPositions, setStarPositions] = useState(() => 
    Array.from({ length: 25 }, () => ({
      x: Math.random() * width * 2,
      y: Math.random() * height,
      opacity: Math.random() * 0.2 + 0.05,
      speed: Math.random() * 0.15 + 0.05,
      directionX: (Math.random() - 0.5) * 2,
      directionY: (Math.random() - 0.5) * 2,
      size: Math.random() * 1.5 + 0.5,
    }))
  );

  // Animated starfield
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
    }, 30);

    return () => {
      clearInterval(starfieldInterval);
    };
  }, []);

  // Generate SVG path for line graph
  const generatePath = () => {
    const graphWidth = width - 80;
    const graphHeight = 120;
    const maxValue = Math.max(...graphData.map(d => d.value));
    const maxDay = Math.max(...graphData.map(d => d.day));
    
    const points = graphData.map((point, index) => {
      const x = (point.day / maxDay) * graphWidth + 40;
      const y = graphHeight - (point.value / maxValue) * graphHeight + 60;
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
    
    return points;
  };

  // Generate area fill path
  const generateAreaPath = () => {
    const graphWidth = width - 80;
    const graphHeight = 120;
    const maxValue = Math.max(...graphData.map(d => d.value));
    const maxDay = Math.max(...graphData.map(d => d.day));
    
    const points = graphData.map((point, index) => {
      const x = (point.day / maxDay) * graphWidth + 40;
      const y = graphHeight - (point.value / maxValue) * graphHeight + 60;
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
    
    const lastPoint = graphData[graphData.length - 1];
    const lastX = (lastPoint.day / maxDay) * graphWidth + 40;
    const firstPoint = graphData[0];
    const firstX = (firstPoint.day / maxDay) * graphWidth + 40;
    
    return `${points} L ${lastX} ${graphHeight + 60} L ${firstX} ${graphHeight + 60} Z`;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.primaryBackground }]}>
      {/* Consistent background gradient with particle starfield (same as Home) */}
      <LinearGradient
        colors={colors.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        locations={[0, 0.55, 1]}
        style={styles.backgroundGradient}
      >
        <View style={styles.starfield}>
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
                },
              ]}
            />
          ))}
        </View>
      </LinearGradient>
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Home' as never)}>
            <Ionicons name="chevron-back" size={24} color={colors.primaryText} />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={[styles.screenTitle, { color: colors.primaryText }]}>Analytics</Text>
          </View>
          <TouchableOpacity style={styles.shareButton}>
            <Ionicons name="share-outline" size={24} color={colors.primaryText} />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Progress Section */}
        <View style={styles.progressSection}>
          <View style={styles.progressContainer}>
            <ProgressRing progress={recoveryPercentage} size={340} strokeWidth={14} />
            <View style={styles.progressTextContainer}>
              <Text style={[styles.progressLabel, { color: colors.secondaryText }]}>RECOVERY</Text>
              <Text style={[styles.progressPercentage, { color: colors.primaryText }]}>{Math.round(recoveryPercentage)}%</Text>
              <Text style={[styles.progressSubtext, { color: colors.secondaryText }]}>{mockElapsedDays} DAY STREAK</Text>
              <Text style={[styles.progressTarget, { color: colors.mutedText }]}>Progress to {RECOVERY_TARGET_DAYS} days</Text>
            </View>
          </View>
          
          <Text style={[styles.recoveryDate, { color: colors.secondaryText }]}>
            Estimated recovery: {estimatedRecoveryDate.toLocaleDateString('en-US', { 
              month: 'long', 
              day: 'numeric', 
              year: 'numeric' 
            })}
          </Text>
          
          <Text style={[styles.motivationalText, { color: colors.secondaryText }]}>
            Every day you resist the urge to bite your nails, you're building stronger willpower and healthier habits. Keep going!
          </Text>
        </View>

        {/* Graph Section */}
        <View style={styles.graphSection}>
          <Text style={[styles.graphTitle, { color: colors.primaryText }]}>Your Progress Journey</Text>
          <View style={[styles.graphContainer, { backgroundColor: colors.secondaryBackground, borderColor: colors.secondaryAccent }]}>
            <Svg width={width} height={180} style={styles.svg}>
              <Defs>
                <SvgLinearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <Stop offset="0%" stopColor="#A3E635" />
                  <Stop offset="100%" stopColor="#14B8A6" />
                </SvgLinearGradient>
                <SvgLinearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <Stop offset="0%" stopColor="rgba(163, 230, 53, 0.3)" />
                  <Stop offset="100%" stopColor="rgba(20, 184, 166, 0.1)" />
                </SvgLinearGradient>
              </Defs>
              
              <Path
                d={generateAreaPath()}
                fill="url(#areaGradient)"
              />
              
              <Path
                d={generatePath()}
                stroke="url(#lineGradient)"
                strokeWidth={3}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
            
            <View style={styles.axisLabels}>
              <Text style={[styles.axisLabel, { color: colors.mutedText }]}>Start</Text>
              <Text style={[styles.axisLabel, { color: colors.mutedText }]}>30 days</Text>
              <Text style={[styles.axisLabel, { color: colors.mutedText }]}>60 days</Text>
              <Text style={[styles.axisLabel, { color: colors.mutedText }]}>90 days</Text>
            </View>
          </View>
        </View>

        {/* Divider */}
        <View style={[styles.divider, { backgroundColor: colors.secondaryAccent }]} />

        {/* Benefits Section */}
        <View style={styles.benefitsSection}>
          <Text style={[styles.benefitsTitle, { color: colors.primaryText }]}>Why Stop Biting Your Nails?</Text>

          <View style={[styles.benefitsCard, { backgroundColor: colors.secondaryBackground, borderColor: colors.secondaryAccent }]}>
            {/* Subtle frosted glass effect */}
            <BlurView intensity={22} tint="dark" style={styles.benefitsBlur} />

            <View style={styles.benefitsCardBody}>
              {benefits.map((benefit, index) => (
                <React.Fragment key={index}>
                  <View style={styles.benefitRow}>
                    <View style={[styles.benefitIcon, { backgroundColor: benefit.color }]}>
                      <Image source={benefit.iconSource} style={styles.benefitIconImage} />
                    </View>
                    <View style={styles.benefitTextCol}>
                      <Text style={[styles.benefitTitle, { color: colors.primaryText }]}>{benefit.title}</Text>
                      <Text style={[styles.benefitDescription, { color: colors.secondaryText }]}>{benefit.description}</Text>
                      <View style={[styles.benefitProgressBg, { backgroundColor: colors.mutedText }]}>
                        <View 
                          style={[
                            styles.benefitProgressFill, 
                            { backgroundColor: benefit.color, width: `${benefit.progress}%` }
                          ]} 
                        />
                      </View>
                    </View>
                  </View>
                  {index < benefits.length - 1 && (
                    <View style={[styles.benefitDivider, { backgroundColor: colors.secondaryAccent }]} />
                  )}
                </React.Fragment>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

// Progress Ring Component
const ProgressRing: React.FC<{ progress: number; size: number; strokeWidth: number }> = ({ 
  progress, 
  size, 
  strokeWidth 
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <Svg width={size} height={size}>
      <Defs>
        <SvgLinearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <Stop offset="0%" stopColor="#A3E635" />
          <Stop offset="100%" stopColor="#14B8A6" />
        </SvgLinearGradient>
      </Defs>
      
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="rgba(255, 255, 255, 0.1)"
        strokeWidth={strokeWidth}
        fill="transparent"
      />
      
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="url(#progressGradient)"
        strokeWidth={strokeWidth}
        fill="transparent"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </Svg>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
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
  starfield: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  shareButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  progressSection: {
    alignItems: 'center',
    marginBottom: 48,
  },
  progressContainer: {
    width: 340,
    height: 340,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 40, // Increased spacing
  },
  progressTextContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  percentageGradient: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressPercentage: {
    fontSize: 48,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
    textShadowColor: 'rgba(193, 255, 114, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  progressSubtext: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  progressTarget: {
    fontSize: 11,
    color: '#94A3B8',
  },
  recoveryDate: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: '500',
  },
  motivationalText: {
    fontSize: 16,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: width - 80,
  },
  graphSection: {
    marginBottom: 48,
  },
  graphTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 24,
  },
  graphContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  svg: {
    alignSelf: 'center',
  },
  axisLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingHorizontal: 8,
  },
  axisLabel: {
    fontSize: 10,
    color: '#94A3B8',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 32,
  },
  benefitsSection: {
    marginBottom: 32,
  },
  benefitsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  benefitsCard: {
    backgroundColor: 'rgba(15, 23, 42, 0.38)',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.25,
    shadowRadius: 40,
    elevation: 10,
    overflow: 'hidden',
  },
  benefitsBlur: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
  },
  benefitsCardBody: {
    paddingVertical: 6,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 14,
  },
  benefitIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  benefitIconLarge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 14,
  },
  benefitTextCol: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  benefitDescription: {
    fontSize: 14,
    color: '#94A3B8',
    lineHeight: 20,
    marginBottom: 12,
  },
  benefitProgressBg: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 8,
  },
  benefitProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  benefitDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  bottomSpacing: {
    height: 32,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  benefitIconImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
});

export default AnalyticsScreen; 