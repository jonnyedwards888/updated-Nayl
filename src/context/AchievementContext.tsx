import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  iconSource?: any; // Add iconSource property
  gradientColors: [string, string, string];
  progress: number;
  maxProgress: number;
  isUnlocked: boolean;
  unlockedAt?: Date;
  category: 'streak' | 'milestone' | 'special' | 'daily';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface AchievementContextType {
  achievements: Achievement[];
  unlockedAchievements: Achievement[];
  showAchievementOverlay: (achievementId: string) => void;
  currentOverlay: Achievement | null;
  isOverlayVisible: boolean;
  hideAchievementOverlay: () => void;
  checkAndUnlockAchievements: (progressData: any) => void;
  getAchievementProgress: (achievementId: string) => number;
  testAchievement: () => void; // Test function to manually trigger an achievement
  unlockNextAchievement: () => void; // Function to unlock the next locked achievement
  resetAllAchievements: () => void; // Function to reset all achievements for testing
}

const AchievementContext = createContext<AchievementContextType | undefined>(undefined);

// Predefined achievements
const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'sprout',
    title: 'Sprout',
    description: 'First day without biting',
    icon: '🌱',
    iconSource: require('../../assets/bigger-achievement-icons/Sprout-280px.png'),
    gradientColors: ['#10B981', '#059669', '#047857'],
    progress: 0,
    maxProgress: 1,
    isUnlocked: false,
    category: 'streak',
    rarity: 'common',
  },
  {
    id: 'sun-kissed',
    title: 'Sun-kissed',
    description: 'A week of progress',
    icon: '☀️',
    iconSource: require('../../assets/bigger-achievement-icons/Sun-280px.png'),
    gradientColors: ['#F59E0B', '#D97706', '#B45309'],
    progress: 0,
    maxProgress: 7,
    isUnlocked: false,
    category: 'streak',
    rarity: 'rare',
  },
  {
    id: 'deeply-rooted',
    title: 'Deeply Rooted',
    description: 'One month milestone',
    icon: '🌳',
    iconSource: require('../../assets/bigger-achievement-icons/Deeply-Rooted-280px.png'),
    gradientColors: ['#8B5CF6', '#7C3AED', '#6D28D9'],
    progress: 0,
    maxProgress: 30,
    isUnlocked: false,
    category: 'streak',
    rarity: 'epic',
  },
  {
    id: 'blossoming',
    title: 'Blossoming',
    description: 'Two months of strength',
    icon: '🌸',
    iconSource: require('../../assets/bigger-achievement-icons/Blossom-280px.png'),
    gradientColors: ['#EC4899', '#DB2777', '#BE185D'],
    progress: 0,
    maxProgress: 60,
    isUnlocked: false,
    category: 'milestone',
    rarity: 'legendary',
  },
  {
    id: 'the-oak',
    title: 'The Oak',
    description: 'Three months of mastery',
    icon: '🌲',
    iconSource: require('../../assets/bigger-achievement-icons/Da-Oak-280px.png'),
    gradientColors: ['#8B5CF8', '#4B0082', '#2E0854'],
    progress: 0,
    maxProgress: 90,
    isUnlocked: false,
    category: 'milestone',
    rarity: 'legendary',
  },
  {
    id: 'conqueror',
    title: 'Conqueror',
    description: 'Six months of transformation',
    icon: '🏔️',
    iconSource: require('../../assets/bigger-achievement-icons/Landmark-280px.png'),
    gradientColors: ['#FFD700', '#FFA500', '#FF4500'],
    progress: 0,
    maxProgress: 180,
    isUnlocked: false,
    category: 'milestone',
    rarity: 'legendary',
  },
];

export const AchievementProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [achievements, setAchievements] = useState<Achievement[]>(DEFAULT_ACHIEVEMENTS);
  const [currentOverlay, setCurrentOverlay] = useState<Achievement | null>(null);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);

  // Use ref to store the showAchievementOverlay function to avoid circular dependency
  const showAchievementOverlayRef = useRef<((achievementId: string) => void) | null>(null);

  // Load achievements from storage
  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = async () => {
    try {
      const stored = await AsyncStorage.getItem('achievements');
      if (stored) {
        const loadedAchievements = JSON.parse(stored);
        // Ensure all default achievements are present, merge with stored data
        const mergedAchievements = DEFAULT_ACHIEVEMENTS.map(defaultAchievement => {
          const storedAchievement = loadedAchievements.find((a: Achievement) => a.id === defaultAchievement.id);
          return storedAchievement ? { ...defaultAchievement, ...storedAchievement } : defaultAchievement;
        });
        setAchievements(mergedAchievements);
      }
    } catch (error) {
      console.error('Failed to load achievements:', error);
      // If loading fails, use default achievements
      setAchievements(DEFAULT_ACHIEVEMENTS);
    }
  };

  const saveAchievements = async (newAchievements: Achievement[]) => {
    try {
      await AsyncStorage.setItem('achievements', JSON.stringify(newAchievements));
    } catch (error) {
      console.error('Failed to save achievements:', error);
    }
  };

  const showAchievementOverlay = useCallback((achievementId: string) => {
    const achievement = achievements.find(a => a.id === achievementId);
    if (achievement) {
      console.log('🎉 Showing achievement overlay for:', achievement.title);
      setCurrentOverlay(achievement);
      setIsOverlayVisible(true);
      

    } else {
      console.log('❌ Achievement not found for ID:', achievementId);
    }
  }, [achievements]);

  // Store the function in ref to avoid circular dependency
  useEffect(() => {
    showAchievementOverlayRef.current = showAchievementOverlay;
  }, [showAchievementOverlay]);

  const hideAchievementOverlay = useCallback(() => {
    setIsOverlayVisible(false);
    setCurrentOverlay(null);
  }, []);

  const checkAndUnlockAchievements = useCallback((progressData: any) => {
    const { currentStreak, totalArticlesRead, brainRewiringProgress } = progressData;
    
    setAchievements(prevAchievements => {
      const updatedAchievements = prevAchievements.map(achievement => {
        let newProgress = achievement.progress;
        let shouldUnlock = false;

        switch (achievement.id) {
          case 'sprout':
            newProgress = Math.min(currentStreak, 1);
            shouldUnlock = currentStreak >= 1 && !achievement.isUnlocked;
            break;
          case 'sun-kissed':
            newProgress = Math.min(currentStreak, 7);
            shouldUnlock = currentStreak >= 7 && !achievement.isUnlocked;
            break;
          case 'deeply-rooted':
            newProgress = Math.min(currentStreak, 30);
            shouldUnlock = currentStreak >= 30 && !achievement.isUnlocked;
            break;
          case 'blossoming':
            newProgress = Math.min(brainRewiringProgress, 60);
            shouldUnlock = brainRewiringProgress >= 60 && !achievement.isUnlocked;
            break;
          case 'the-oak':
            newProgress = Math.min(brainRewiringProgress, 90);
            shouldUnlock = brainRewiringProgress >= 90 && !achievement.isUnlocked;
            break;
          case 'conqueror':
            newProgress = Math.min(brainRewiringProgress, 180);
            shouldUnlock = brainRewiringProgress >= 180 && !achievement.isUnlocked;
            break;
        }

        if (shouldUnlock) {
          console.log('🏆 Achievement unlocked:', achievement.title, 'Progress:', newProgress);
          // Show overlay for newly unlocked achievement using ref to avoid circular dependency
          setTimeout(() => {
            if (showAchievementOverlayRef.current) {
              console.log('🎯 Calling showAchievementOverlay for:', achievement.id);
              showAchievementOverlayRef.current(achievement.id);
            } else {
              console.log('❌ showAchievementOverlayRef.current is null');
            }
          }, 500);
        }

        return {
          ...achievement,
          progress: newProgress,
          isUnlocked: shouldUnlock || achievement.isUnlocked,
          unlockedAt: shouldUnlock ? new Date() : achievement.unlockedAt,
        };
      });

      // Save to storage
      saveAchievements(updatedAchievements);
      return updatedAchievements;
    });
  }, []); // Remove showAchievementPopup dependency to break circular dependency

  const getAchievementProgress = useCallback((achievementId: string) => {
    const achievement = achievements.find(a => a.id === achievementId);
    return achievement ? achievement.progress : 0;
  }, [achievements]);

  // Test function to manually trigger an achievement for testing
  const testAchievement = useCallback(() => {
    console.log('🧪 Testing achievement overlay...');
    const testAchievement = achievements.find(a => a.id === 'sprout');
    if (testAchievement) {
      console.log('🎯 Testing with achievement:', testAchievement.title);
      showAchievementOverlay('sprout');
    } else {
      console.log('❌ Test achievement not found');
    }
  }, [achievements, showAchievementOverlay]);

  // Function to unlock the next locked achievement
  const unlockNextAchievement = useCallback(() => {
    const nextLockedAchievement = achievements.find(a => !a.isUnlocked);
    if (nextLockedAchievement) {
      console.log('🔓 Unlocking next achievement:', nextLockedAchievement.title);
      
      // Update the achievement to unlocked
      setAchievements(prevAchievements => {
        const updatedAchievements = prevAchievements.map(a => 
          a.id === nextLockedAchievement.id 
            ? { ...a, isUnlocked: true, progress: a.maxProgress, unlockedAt: new Date() }
            : a
        );
        
        // Save to storage
        saveAchievements(updatedAchievements);
        return updatedAchievements;
      });
      
      // Show the achievement overlay
      setTimeout(() => {
        showAchievementOverlay(nextLockedAchievement.id);
      }, 100);
    } else {
      console.log('🎉 All achievements are already unlocked!');
    }
  }, [achievements, showAchievementOverlay]);

  // Function to reset all achievements for testing
  const resetAllAchievements = useCallback(() => {
    console.log('🔄 Resetting all achievements for testing...');
    
    setAchievements(prevAchievements => {
      const resetAchievements = prevAchievements.map(a => ({
        ...a,
        isUnlocked: false,
        progress: 0,
        unlockedAt: undefined
      }));
      
      // Save to storage
      saveAchievements(resetAchievements);
      return resetAchievements;
    });
    
    // Hide any current overlay
    setIsOverlayVisible(false);
    setCurrentOverlay(null);
  }, []);

  const unlockedAchievements = achievements.filter(a => a.isUnlocked);

  return (
    <AchievementContext.Provider
      value={{
        achievements,
        unlockedAchievements,
        showAchievementOverlay,
        currentOverlay,
        isOverlayVisible,
        hideAchievementOverlay,
        checkAndUnlockAchievements,
        getAchievementProgress,
        testAchievement,
        unlockNextAchievement,
        resetAllAchievements,
      }}
    >
      {children}
    </AchievementContext.Provider>
  );
};

export const useAchievements = () => {
  const context = useContext(AchievementContext);
  if (context === undefined) {
    throw new Error('useAchievements must be used within an AchievementProvider');
  }
  return context;
};
