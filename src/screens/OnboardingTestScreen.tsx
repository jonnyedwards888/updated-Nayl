import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import OnboardingSlide from '../components/OnboardingSlide';

const OnboardingTestScreen: React.FC = () => {
  const handleStartTrial = () => {
    Alert.alert(
      'Start Free Trial',
      'This would typically integrate with your payment system and start the onboarding flow.',
      [
        {
          text: 'OK',
          onPress: () => console.log('Trial started'),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <OnboardingSlide onStartTrial={handleStartTrial} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default OnboardingTestScreen;
