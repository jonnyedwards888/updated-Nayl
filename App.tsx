import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as Font from 'expo-font';
import { PerformanceMeasureView } from '@shopify/react-native-performance';

// Import contexts
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { StreakProvider } from './src/context/StreakContext';
import { PanicModalProvider } from './src/context/PanicModalContext';
import { TipsModalProvider } from './src/context/TipsModalContext';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import LibraryScreen from './src/screens/LibraryScreen';
import MeditationScreen from './src/screens/MeditationScreen';
import AchievementsScreen from './src/screens/AchievementsScreen';
import ReasonsScreen from './src/screens/ReasonsScreen';
import TriggerHistoryScreen from './src/screens/TriggerHistoryScreen';
import RelaxationSoundScreen from './src/screens/RelaxationSoundScreen';
import OnboardingQuestionnaireScreen from './src/screens/OnboardingQuestionnaireScreen';
import EditStreakScreen from './src/screens/EditStreakScreen';
import AnalyticsScreen from './src/screens/AnalyticsScreen';

// Import components
import { User, Book, House, Trophy, ChartBar } from 'phosphor-react-native';

// Import constants
import { COLORS } from './src/constants/theme';

const Tab = createBottomTabNavigator();

// Tab icon sizes and colors
const TAB_ICON_SIZE = 24;
const ICON_FILL_ACTIVE = '#C1FF72';
const ICON_FILL_INACTIVE = '#94A3B8';

// Navigation stacks
function HomeStack() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' }
      }}
    >
      <Tab.Screen name="HomeMain" component={HomeScreen} />
      <Tab.Screen name="OnboardingQuestionnaire" component={OnboardingQuestionnaireScreen} />
      <Tab.Screen name="EditStreak" component={EditStreakScreen} />
      <Tab.Screen name="Analytics" component={AnalyticsScreen} />
    </Tab.Navigator>
  );
}

function ProfileStack() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' }
      }}
    >
      <Tab.Screen name="ProfileMain" component={ProfileScreen} />
      <Tab.Screen name="Reasons" component={ReasonsScreen} />
      <Tab.Screen name="TriggerHistory" component={TriggerHistoryScreen} />
    </Tab.Navigator>
  );
}

function LibraryStack() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' }
      }}
    >
      <Tab.Screen name="LibraryMain" component={LibraryScreen} />
      <Tab.Screen name="Meditation" component={MeditationScreen} />
      <Tab.Screen name="Achievements" component={AchievementsScreen} />
      <Tab.Screen name="RelaxationSound" component={RelaxationSoundScreen} />
    </Tab.Navigator>
  );
}

// Main app content with theme awareness
function AppContent() {
  const { colors } = useTheme();
  
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: colors.cardBackground,
            borderTopColor: colors.glassBorder,
            borderTopWidth: 1,
            height: 80,
            paddingBottom: 10,
            paddingTop: 10,
          },
          tabBarActiveTintColor: colors.primaryAccent,
          tabBarInactiveTintColor: colors.mutedText,
        }}
      >
        <Tab.Screen 
          name="Home" 
          component={HomeStack}
          options={{
            tabBarIcon: ({ focused, color }) => (
              <House 
                size={TAB_ICON_SIZE} 
                color={color as string}
                secondaryColor={focused ? ICON_FILL_ACTIVE : ICON_FILL_INACTIVE}
                weight="duotone"
              />
            ),
          }}
        />
        <Tab.Screen 
          name="Achievements" 
          component={AchievementsScreen}
          options={{
            tabBarIcon: ({ focused, color }) => (
              <Trophy 
                size={TAB_ICON_SIZE} 
                color={color as string}
                secondaryColor={focused ? ICON_FILL_ACTIVE : ICON_FILL_INACTIVE}
                weight="duotone"
              />
            ),
          }}
        />
        <Tab.Screen 
          name="Analytics" 
          component={AnalyticsScreen}
          options={{
            tabBarIcon: ({ focused, color }) => (
              <ChartBar 
                size={TAB_ICON_SIZE} 
                color={color as string}
                secondaryColor={focused ? ICON_FILL_ACTIVE : ICON_FILL_INACTIVE}
                weight="duotone"
              />
            ),
          }}
        />
        <Tab.Screen 
          name="Library" 
          component={LibraryStack}
          options={{
            tabBarIcon: ({ focused, color }) => (
              <Book 
                size={TAB_ICON_SIZE} 
                color={color as string}
                secondaryColor={focused ? ICON_FILL_ACTIVE : ICON_FILL_INACTIVE}
                weight="duotone"
              />
            ),
          }}
        />
        <Tab.Screen 
          name="Profile" 
          component={ProfileStack}
          options={{
            tabBarIcon: ({ focused, color }) => (
              <User 
                size={TAB_ICON_SIZE} 
                color={color as string}
                secondaryColor={focused ? ICON_FILL_ACTIVE : ICON_FILL_INACTIVE}
                weight="duotone"
              />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

// Theme-aware app content component
function ThemeAwareAppContent() {
  const { colors, isReady } = useTheme();
  
  // Don't render until theme is ready and colors are valid
  if (!isReady || !colors || typeof colors !== 'object') {
    console.log('⏳ Theme not ready yet, showing loading state');
    return (
      <View style={[styles.loadingContainer, { backgroundColor: '#000000' }]}>
        <Text style={[styles.loadingText, { color: '#FFFFFF' }]}>Loading Nayl...</Text>
        <StatusBar style="light" backgroundColor="#000000" />
      </View>
    );
  }
  
  // Additional validation
  if (!colors.primaryBackground || !colors.primaryText) {
    console.log('⚠️ Theme colors not fully loaded, showing loading state');
    return (
      <View style={[styles.loadingContainer, { backgroundColor: '#000000' }]}>
        <Text style={[styles.loadingText, { color: '#FFFFFF' }]}>Loading theme...</Text>
        <StatusBar style="light" backgroundColor="#000000" />
      </View>
    );
  }
  
  console.log('✅ Theme is ready, rendering app content');
  return <AppContent />;
}

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          'Inter': require('./assets/fonts/Inter-Regular.ttf'),
        });
        setFontsLoaded(true);
      } catch (error) {
        console.log('Font loading error:', error);
        setFontsLoaded(true);
      }
    }

    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading Nayl...</Text>
        <StatusBar style="light" backgroundColor="#000000" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <StreakProvider>
          <PanicModalProvider>
            <TipsModalProvider>
              <PerformanceMeasureView screenName="App">
                <ThemeAwareAppContent />
              </PerformanceMeasureView>
            </TipsModalProvider>
          </PanicModalProvider>
        </StreakProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: Platform.OS === 'web' ? 'Inter, sans-serif' : 'Inter',
  },
});
