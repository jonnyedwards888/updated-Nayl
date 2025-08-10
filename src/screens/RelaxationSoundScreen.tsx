import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { body, bodySmall, caption, buttonText } from '../constants/typography';
import { COLORS, SHADOWS, TYPOGRAPHY } from '../constants/theme';

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

interface RelaxationSoundScreenProps {
  navigation: any;
  route: any;
}

const RelaxationSoundScreen: React.FC<RelaxationSoundScreenProps> = ({ navigation, route }) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const { soundType = 'campfire' } = route.params || {};

  // Audio file mapping
  const audioFiles = {
    campfire: require('../../assets/relaxation-sounds/campfire.mp3'),
    rain: require('../../assets/relaxation-sounds/rain-sounds.mp3'),
  };

  // Background image mapping
  const backgroundImages = {
    campfire: require('../../assets/relaxation-sounds/campfire-image.jpg'),
    rain: require('../../assets/relaxation-sounds/rain-image.jpg'),
  };

  // Title mapping
  const titles = {
    campfire: 'Campfire',
    rain: 'Rain',
  };

  // Icon mapping
  const icons = {
    campfire: 'flame',
    rain: 'rainy',
  };

  useEffect(() => {
    setupAudio();
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const setupAudio = async () => {
    try {
      // Configure audio mode for background playback
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
      
      loadAudio();
    } catch (error) {
      console.error('Error setting up audio:', error);
    }
  };

  const loadAudio = async () => {
    try {
      const audioFile = audioFiles[soundType as keyof typeof audioFiles];
      if (!audioFile) {
        console.error('Audio file not found for sound type:', soundType);
        return;
      }

      const { sound: audioSound } = await Audio.Sound.createAsync(
        audioFile,
        { shouldPlay: true, isLooping: true }
      );
      
      setSound(audioSound);
      setIsPlaying(true);

      // Get duration
      const status = await audioSound.getStatusAsync();
      if (status.isLoaded) {
        setDuration(status.durationMillis || 0);
      }

      // Set up position tracking
      audioSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.positionMillis) {
          setElapsedTime(status.positionMillis);
        }
      });

    } catch (error) {
      console.error('Error loading audio:', error);
    }
  };

  const stopAudio = async () => {
    try {
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
        setIsPlaying(false);
      }
      navigation.goBack();
    } catch (error) {
      console.error('Error stopping audio:', error);
    }
  };

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleBackPress = () => {
    stopAudio();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Background Image */}
      <Image
        source={backgroundImages[soundType as keyof typeof backgroundImages] || backgroundImages.campfire}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      
      {/* Overlay Gradient */}
      <LinearGradient
        colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0.8)']}
        style={styles.overlay}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <LinearGradient
            colors={['#8B5CF6', '#A78BFA']}
            style={styles.backButtonGradient}
          >
            <Ionicons name="chevron-back" size={20} color={COLORS.primaryText} />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Audio Info */}
        <View style={styles.audioInfo}>
          <View style={styles.audioIconContainer}>
            <Ionicons 
              name={(icons[soundType as keyof typeof icons] || icons.campfire) as any} 
              size={32} 
              color={COLORS.primaryText} 
            />
          </View>
          <Text style={styles.audioTitle}>
            {titles[soundType as keyof typeof titles] || titles.campfire}
          </Text>
          <Text style={styles.elapsedTime}>
            {formatTime(elapsedTime)} elapsed time
          </Text>
        </View>
      </Animated.View>

      {/* Bottom Control Panel */}
      <View style={styles.bottomPanel}>
        <TouchableOpacity style={styles.stopButton} onPress={stopAudio}>
          <LinearGradient
            colors={['#EF4444', '#DC2626']}
            style={styles.stopButtonGradient}
          >
            <Text style={styles.stopButtonText}>Stop Listening</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryBackground,
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
    borderRadius: 25,
    overflow: 'hidden',
    ...SHADOWS.card,
  },
  backButtonGradient: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
  audioInfo: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  audioIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
    ...SHADOWS.card,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  audioTitle: {
    ...TYPOGRAPHY.headingLarge,
    color: COLORS.primaryText,
    marginBottom: SPACING.sm,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  elapsedTime: {
    ...bodySmall,
    color: COLORS.primaryText,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  bottomPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
    paddingBottom: SPACING.xxl,
  },
  stopButton: {
    borderRadius: SPACING.lg,
    overflow: 'hidden',
    ...SHADOWS.card,
  },
  stopButtonGradient: {
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopButtonText: {
    ...buttonText,
    color: COLORS.primaryText,
    fontSize: 18,
    fontWeight: '600',
  },
});

export default RelaxationSoundScreen;
