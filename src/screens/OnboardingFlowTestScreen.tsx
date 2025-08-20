import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import OnboardingFlow from '../components/OnboardingFlow';

const OnboardingFlowTestScreen: React.FC = () => {
  const navigation = useNavigation();

  const handleOnboardingComplete = () => {
    // Route to main app (HomeMain screen)
    navigation.navigate('HomeMain' as never);
  };

  const handleOnboardingSkip = () => {
    // Route to main app (HomeMain screen)
    navigation.navigate('HomeMain' as never);
  };

  return (
    <View style={styles.container}>
      <OnboardingFlow 
        onComplete={handleOnboardingComplete}
        onSkip={handleOnboardingSkip}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default OnboardingFlowTestScreen;
