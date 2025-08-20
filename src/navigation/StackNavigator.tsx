import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Easing } from 'react-native';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LibraryScreen from '../screens/LibraryScreen';
import MeditationScreen from '../screens/MeditationScreen';
import AchievementsScreen from '../screens/AchievementsScreen';
import ReasonsScreen from '../screens/ReasonsScreen';
import TriggerHistoryScreen from '../screens/TriggerHistoryScreen';
import RelaxationSoundScreen from '../screens/RelaxationSoundScreen';
import LearningScreen from '../screens/LearningScreen';
import OnboardingQuestionnaireScreen from '../screens/OnboardingQuestionnaireScreen';
import OnboardingTestScreen from '../screens/OnboardingTestScreen';
import OnboardingFlowTestScreen from '../screens/OnboardingFlowTestScreen';
import EditStreakScreen from '../screens/EditStreakScreen';
import AnalyticsScreen from '../screens/AnalyticsScreen';

const Stack = createStackNavigator();

// Standardized screen transition configuration
const screenTransitionConfig = {
  transitionSpec: {
    open: {
      animation: 'timing' as const,
      config: {
        duration: 300,
        easing: Easing.out(Easing.cubic),
      },
    },
    close: {
      animation: 'timing' as const,
      config: {
        duration: 300,
        easing: Easing.in(Easing.cubic),
      },
    },
  },
  cardStyle: {
    backgroundColor: 'transparent',
  },
  gestureEnabled: true,
  gestureDirection: 'horizontal' as const,
  gestureResponseDistance: 50,
};

// Home stack with standardized transitions
export function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, ...screenTransitionConfig }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="OnboardingQuestionnaire" component={OnboardingQuestionnaireScreen} />
      <Stack.Screen name="OnboardingTest" component={OnboardingTestScreen} />
      <Stack.Screen name="OnboardingFlow" component={OnboardingFlowTestScreen} />
      <Stack.Screen name="EditStreak" component={EditStreakScreen} />
      <Stack.Screen name="Analytics" component={AnalyticsScreen} />
      <Stack.Screen name="Meditation" component={MeditationScreen} />
    </Stack.Navigator>
  );
}

// Profile stack with standardized transitions
export function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, ...screenTransitionConfig }}>
      <Stack.Screen name="ProfileMain" component={ProfileScreen} />
      <Stack.Screen name="Reasons" component={ReasonsScreen} />
      <Stack.Screen name="TriggerHistory" component={TriggerHistoryScreen} />
    </Stack.Navigator>
  );
}

// Library stack with standardized transitions
export function LibraryStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, ...screenTransitionConfig }}>
      <Stack.Screen name="LibraryMain" component={LibraryScreen} />
      <Stack.Screen name="Achievements" component={AchievementsScreen} />
      <Stack.Screen name="RelaxationSound" component={RelaxationSoundScreen} />
      <Stack.Screen name="Learning" component={LearningScreen} />
    </Stack.Navigator>
  );
}
