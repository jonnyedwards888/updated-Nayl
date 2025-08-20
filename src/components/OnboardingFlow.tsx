import React from 'react';
import { View, StyleSheet } from 'react-native';
import OnboardingQuiz from './OnboardingQuiz';

interface OnboardingFlowProps {
  onComplete: () => void;
  onSkip: () => void;
}

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete, onSkip }) => {
  return (
    <View style={styles.container}>
      <OnboardingQuiz onComplete={onComplete} onSkip={onSkip} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
});

export default OnboardingFlow;
