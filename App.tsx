import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as Font from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import { PerformanceMeasureView } from '@shopify/react-native-performance';

// Import contexts
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { StreakProvider } from './src/context/StreakContext';
import { PanicModalProvider, usePanicModal } from './src/context/PanicModalContext';
import { TipsModalProvider } from './src/context/TipsModalContext';
import { MeditationProvider, useMeditation } from './src/context/MeditationContext';
import { ColorProvider } from './src/context/ColorContext';
import { AchievementProvider } from './src/context/AchievementContext';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import LibraryScreen from './src/screens/LibraryScreen';
import MeditationScreen from './src/screens/MeditationScreen';
import AchievementsScreen from './src/screens/AchievementsScreen';
import ReasonsScreen from './src/screens/ReasonsScreen';
import TriggerHistoryScreen from './src/screens/TriggerHistoryScreen';
import RelaxationSoundScreen from './src/screens/RelaxationSoundScreen';
import LearningScreen from './src/screens/LearningScreen';
import OnboardingQuestionnaireScreen from './src/screens/OnboardingQuestionnaireScreen';
import EditStreakScreen from './src/screens/EditStreakScreen';
import AnalyticsScreen from './src/screens/AnalyticsScreen';
import NailProgressScreen from './src/screens/NailProgressScreen';

// Import centralized stack navigators
import { HomeStack, ProfileStack, LibraryStack } from './src/navigation/StackNavigator';

// Import components
import { User, Book, House, Trophy, ChartBar } from 'phosphor-react-native';
import { Ionicons } from '@expo/vector-icons';

// Import constants
import { COLORS } from './src/constants/theme';
import hapticService, { HapticType, HapticIntensity } from './src/services/hapticService';

const Tab = createBottomTabNavigator();

// Simple function to control meditation state
export const setMeditationActive = (active: boolean) => {
  // This will be called from MeditationScreen
  console.log(`🧘 Setting meditation active: ${active}`);
  // We'll use a ref to communicate with the parent component
};

// Tab icon sizes and colors
const TAB_ICON_SIZE = 24;
const ICON_FILL_ACTIVE = '#C1FF72';
const ICON_FILL_INACTIVE = '#94A3B8';

// Main app content with theme awareness
function AppContent() {
  const { colors } = useTheme();
  const { isPanicModalVisible } = usePanicModal();
  const { isMeditationActive } = useMeditation();
  
  // State to track if we're on an onboarding screen
  const [isOnboardingScreen, setIsOnboardingScreen] = useState(false);
  
  // Removed problematic Image.prefetch that was causing URL request handler errors
  
  return (
    <NavigationContainer
      onStateChange={(state) => {
        // Check if current route is an onboarding screen
        if (state?.routes && state.index !== undefined) {
          const currentRoute = state.routes[state.index];
          if (currentRoute?.state?.routes && currentRoute.state.index !== undefined) {
            const currentStackRoute = currentRoute.state.routes[currentRoute.state.index];
            const isOnboarding = currentStackRoute?.name && 
              ['OnboardingQuestionnaire', 'OnboardingTest', 'OnboardingFlow'].includes(currentStackRoute.name);
            
            setIsOnboardingScreen(isOnboarding || false);
          }
        }
      }}
    >
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            // Completely transparent footer to eliminate white edges
            backgroundColor: 'transparent',
            borderTopColor: 'transparent',
            borderTopWidth: 0,
            height: 80,
            paddingBottom: 6, // Reduced from 10 to move content higher
            paddingTop: 6, // Reduced from 10 to move content higher
            display: (isPanicModalVisible || isMeditationActive || isOnboardingScreen) ? 'none' : 'flex', // Hide tab bar when panic modal is visible, during meditation, or on onboarding screens
            
            // Remove all shadows and borders
            shadowColor: 'transparent',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0,
            shadowRadius: 0,
            elevation: 0,
            
            // Remove curved edges for now to eliminate the white background issue
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
          },
          // Custom footer background - Deep black with subtle gradient
          tabBarBackground: () => (
            <LinearGradient
              colors={[
                'rgba(8, 10, 15, 0.95)',   // Deep black top
                'rgba(5, 7, 12, 0.98)',    // Even darker bottom
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: 80,
                // Premium shadow
                shadowColor: '#000000',
                shadowOffset: { width: 0, height: -4 },
                shadowOpacity: 0.3,
                shadowRadius: 12,
                elevation: 8,
                // Subtle top border for depth
                borderTopWidth: 0.5,
                borderTopColor: 'rgba(255, 255, 255, 0.08)',
              }}
            />
          ),
          tabBarActiveTintColor: colors.iconActivePrimary,
          tabBarInactiveTintColor: colors.iconInactivePrimary,
          
          // Premium tab bar styling
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
            marginTop: 2, // Reduced from 4 to move text higher up
          },
          tabBarItemStyle: {
            paddingVertical: 2, // Reduced from 4 to move content higher
          },
        }}
        screenListeners={{
          tabPress: async (e) => {
            // Premium haptic feedback for tab navigation
            try {
              await hapticService.trigger(HapticType.LIGHT_TAP, HapticIntensity.SUBTLE);
            } catch (error) {
              console.warn('Haptic feedback error:', error);
            }
          },
        }}
      >
        {/* ========================================
            FOOTER NAVIGATION TABS
            ========================================
            
            CUSTOMIZATION GUIDE:
            =====================
            
            1. ICON COLORS (Theme-based):
               - Active Primary: colors.iconActivePrimary (white)
               - Active Secondary: colors.iconActiveSecondary (green accent)
               - Inactive Primary: colors.iconInactivePrimary (muted gray)
               - Inactive Secondary: colors.iconInactiveSecondary (dark gray)
               
            2. BACKGROUND INDICATORS:
               - Default: 'rgba(193, 255, 114, 0.05)' (subtle green)
               - Analytics: 'rgba(231, 0, 0, 0.92)' (bright red - CUSTOM)
               - Change any tab's backgroundColor for custom colors
               
            3. ICON STYLING:
               - weight="duotone" for two-tone effect
               - size={TAB_ICON_SIZE} (24px)
               - padding: 8, borderRadius: 12 for background
               
            4. GLOW EFFECTS:
               - shadowColor: colors.iconGlow (green glow)
               - shadowOpacity: 0.4 when focused
               - shadowRadius: 6 for soft glow
               
            TO CUSTOMIZE A TAB:
            - Change backgroundColor for custom background color
            - Override color/secondaryColor for custom icon colors
            - Modify shadowColor for custom glow effects
            ======================================== */}
        
        {/* Home Tab - Main screen */}
        <Tab.Screen 
          name="Home" 
          component={HomeStack}
          options={{
            tabBarIcon: ({ focused, color }) => (
              <View>
                <House 
                  size={TAB_ICON_SIZE} 
                  // Icon colors: white for active, muted gray for inactive
                  color={focused ? colors.iconActivePrimary : colors.iconInactivePrimary}
                  // Secondary fill: green accent for active, dark gray for inactive
                  secondaryColor={focused ? colors.iconActiveSecondary : colors.iconInactiveSecondary}
                  weight="duotone"
                />
              </View>
            ),
          }}
        />
        
        {/* Progress Tab - Camera icon for nail progress */}
        <Tab.Screen 
          name="Progress" 
          component={NailProgressScreen}
          options={{
            tabBarIcon: ({ focused, color }) => (
              <View>
                <Ionicons 
                  name="camera-outline"
                  size={TAB_ICON_SIZE} 
                  // Icon colors: white for active, muted gray for inactive
                  color={focused ? colors.iconActivePrimary : colors.iconInactivePrimary}
                />
              </View>
            ),
          }}
        />
        
        {/* Analytics Tab - Bar chart icon with subtle green glow */}
        <Tab.Screen 
          name="Analytics" 
          component={AnalyticsScreen}
          options={{
            tabBarIcon: ({ focused, color }) => (
              <View style={{
                padding: 8,
                borderRadius: 12,
                // Active tab background indicator - subtle green glow (same as other tabs)
                backgroundColor: focused ? 'rgba(193, 255, 114, 0.05)' : 'transparent',
                // Icon glow effect for active state
                shadowColor: focused ? colors.iconGlow : 'transparent',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: focused ? 0.4 : 0,
                shadowRadius: 6,
                elevation: focused ? 2 : 0,
              }}>
                <ChartBar 
                  size={TAB_ICON_SIZE} 
                  color={focused ? colors.iconActivePrimary : colors.iconInactivePrimary}
                  secondaryColor={focused ? colors.iconActiveSecondary : colors.iconInactiveSecondary}
                  weight="duotone"
                />
              </View>
            ),
          }}
        />
        
        {/* Library Tab - Book icon */}
        <Tab.Screen 
          name="Library" 
          component={LibraryStack}
          options={{
            tabBarIcon: ({ focused, color }) => (
              <View>
                <Book 
                  size={TAB_ICON_SIZE} 
                  // Icon colors: white for active, muted gray for inactive
                  color={focused ? colors.iconActivePrimary : colors.iconInactivePrimary}
                  // Secondary fill: green accent for active, dark gray for inactive
                  secondaryColor={focused ? colors.iconActiveSecondary : colors.iconInactiveSecondary}
                  weight="duotone"
                />
              </View>
            ),
          }}
        />
        
        {/* Profile Tab - User icon */}
        <Tab.Screen 
          name="Profile" 
          component={ProfileStack}
          options={{
            tabBarIcon: ({ focused, color }) => (
              <View>
                <User 
                  size={TAB_ICON_SIZE} 
                  // Icon colors: white for active, muted gray for inactive
                  color={focused ? colors.iconActivePrimary : colors.iconInactivePrimary}
                  // Secondary fill: green accent for active, dark gray for inactive
                  secondaryColor={focused ? colors.iconActiveSecondary : colors.iconInactiveSecondary}
                  weight="duotone"
                />
              </View>
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
              <MeditationProvider>
                <ColorProvider>
                  <AchievementProvider>
                    <ThemeAwareAppContent />
                  </AchievementProvider>
                </ColorProvider>
              </MeditationProvider>
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
