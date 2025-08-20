import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ColorContextType {
  progressRingColors: string[];
  showProgressRing: boolean;
  setProgressRingColors: (colors: string[] | null) => void;
  resetToDefault: () => void;
}

const ColorContext = createContext<ColorContextType | undefined>(undefined);

// Default colors (Ocean Blue)
const DEFAULT_COLORS = ['#00D4FF', '#0099FF', '#0066FF'];

const COLOR_STORAGE_KEY = '@nayl_progress_ring_colors';

export const ColorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [progressRingColors, setProgressRingColorsState] = useState<string[]>(DEFAULT_COLORS);
  const [showProgressRing, setShowProgressRingState] = useState<boolean>(true);

  // Load saved colors on mount
  useEffect(() => {
    loadColors();
  }, []);

  const loadColors = async () => {
    try {
      const savedColors = await AsyncStorage.getItem(COLOR_STORAGE_KEY);
      if (savedColors) {
        const parsedColors = JSON.parse(savedColors);
        if (parsedColors === null) {
          // No progress ring option
          setProgressRingColorsState(DEFAULT_COLORS);
          setShowProgressRingState(false);
        } else if (Array.isArray(parsedColors) && parsedColors.length === 3) {
          setProgressRingColorsState(parsedColors);
          setShowProgressRingState(true);
        }
      }
    } catch (error) {
      console.warn('Failed to load progress ring colors:', error);
    }
  };

  const setProgressRingColors = async (colors: string[] | null) => {
    try {
      if (colors === null) {
        // No progress ring option
        await AsyncStorage.setItem(COLOR_STORAGE_KEY, JSON.stringify(null));
        setShowProgressRingState(false);
        // Keep the colors in state for when ring is re-enabled
      } else {
        // Normal colors
        await AsyncStorage.setItem(COLOR_STORAGE_KEY, JSON.stringify(colors));
        setProgressRingColorsState(colors);
        setShowProgressRingState(true);
      }
    } catch (error) {
      console.warn('Failed to save progress ring colors:', error);
      // Still update state even if storage fails
      if (colors === null) {
        setShowProgressRingState(false);
      } else {
        setProgressRingColorsState(colors);
        setShowProgressRingState(true);
      }
    }
  };

  const resetToDefault = () => {
    setProgressRingColors(DEFAULT_COLORS);
  };

  return (
    <ColorContext.Provider
      value={{
        progressRingColors,
        showProgressRing,
        setProgressRingColors,
        resetToDefault,
      }}
    >
      {children}
    </ColorContext.Provider>
  );
};

export const useColors = (): ColorContextType => {
  const context = useContext(ColorContext);
  if (context === undefined) {
    throw new Error('useColors must be used within a ColorProvider');
  }
  return context;
};

