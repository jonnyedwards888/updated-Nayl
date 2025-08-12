import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useThemeGuaranteed } from '../context/ThemeContext';
import { useMeditation } from '../context/MeditationContext';
import { COLORS } from '../constants/theme';
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

type SoundType = 'campfire' | 'rain' | 'sea' | 'white-noise';

interface RelaxationSoundScreenProps {
  route: {
    params: {
      soundType: SoundType;
    };
  };
  navigation: any;
}

const RelaxationSoundScreen: React.FC<RelaxationSoundScreenProps> = ({ route, navigation }) => {
  const { colors } = useThemeGuaranteed();
  const { setIsMeditationActive } = useMeditation();
  const { soundType } = route.params;
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAudioLoaded, setIsAudioLoaded] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [loopCount, setLoopCount] = useState(0);
  const startTimeRef = useRef<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Audio file mapping - using the correct files for each type
  const audioFiles = {
    campfire: require('../../assets/relaxation-sounds/campfire-sounds-short.mp3'),
    rain: require('../../assets/relaxation-sounds/short-rain-sounds.mp3'),
    sea: require('../../assets/relaxation-sounds/ocean-waves.mp3'), // Using ocean-waves.mp3 for sea
    'white-noise': require('../../assets/relaxation-sounds/white-noise.mp3'), // Using white-noise.mp3 for white noise
  };

  // Background image mapping
  const backgroundImages = {
    campfire: require('../../assets/relaxation-sounds/campfire-image.jpg'),
    rain: require('../../assets/relaxation-sounds/rain-image.jpg'),
    sea: require('../../assets/relaxation-sounds/rain-image.jpg'), // Using rain image for sea for now
    'white-noise': require('../../assets/relaxation-sounds/rain-image.jpg'), // Using rain image for white noise for now
  };

  // Title mapping
  const titles = {
    campfire: 'Campfire',
    rain: 'Rain',
    sea: 'Ocean Waves',
    'white-noise': 'White Noise',
  };

  // Icon mapping
  const icons = {
    campfire: require('../../assets/library-sound-icons/new-campfire-icon.webp'),
    rain: require('../../assets/library-sound-icons/rain-icon.webp'),
    sea: require('../../assets/library-sound-icons/new-sea-icon.webp'),
    'white-noise': require('../../assets/library-sound-icons/white-noise-icon.webp'),
  };

  // Set meditation active to hide footer
  useEffect(() => {
    setIsMeditationActive(true);
    return () => {
      setIsMeditationActive(false);
    };
  }, [setIsMeditationActive]);

  useEffect(() => {
    setupAudio();
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  useEffect(() => {
    // Fade in animation removed - no longer needed
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
        // setDuration(status.durationMillis || 0); // This line was removed as per new_code
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
    <View style={styles.container}>
      {/* Background Image */}
      <Image
        source={backgroundImages[soundType as keyof typeof backgroundImages] || backgroundImages.campfire}
        style={styles.backgroundImage}
        resizeMode="cover"
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
      <View style={styles.content}>
        {/* Audio Info */}
        <View style={styles.audioInfo}>
          <View style={styles.audioIconContainer}>
            <Image 
              source={icons[soundType as keyof typeof icons] || icons.campfire} 
              style={styles.audioIcon}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.audioTitle}>
            {titles[soundType as keyof typeof titles] || titles.campfire}
          </Text>
          <Text style={styles.elapsedTime}>
            {formatTime(elapsedTime)} elapsed time
          </Text>
        </View>
      </View>

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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    position: 'relative',
    overflow: 'hidden',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    zIndex: -1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xxl + SPACING.lg, // Increased from SPACING.lg to account for status bar
    paddingBottom: SPACING.md,
    zIndex: 10,
    backgroundColor: 'transparent',
  },
  backButton: {
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
    backgroundColor: 'transparent',
  },
  audioInfo: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
    backgroundColor: 'transparent',
  },
  audioIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  audioIcon: {
    width: '100%',
    height: '100%',
  },
  audioTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.primaryText,
    marginBottom: SPACING.sm,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  elapsedTime: {
    fontSize: 16,
    fontWeight: '400',
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
    backgroundColor: 'transparent',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
    paddingBottom: SPACING.xxl,
  },
  stopButton: {
    borderRadius: SPACING.lg,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
