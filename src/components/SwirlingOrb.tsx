import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Animated, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

interface SwirlingOrbProps {
  size?: number;
  children?: React.ReactNode;
}

const SwirlingOrb: React.FC<SwirlingOrbProps> = ({ 
  size = 224, 
  children 
}) => {
  // Animation values for each layer - only rotation, no scaling
  const rotation1 = useRef(new Animated.Value(0)).current;
  const rotation2 = useRef(new Animated.Value(0)).current;
  const rotation3 = useRef(new Animated.Value(0)).current;
  const rotation4 = useRef(new Animated.Value(0)).current;
  const rotation5 = useRef(new Animated.Value(0)).current;
  const rotation6 = useRef(new Animated.Value(0)).current;
  const rotation7 = useRef(new Animated.Value(0)).current;
  const rotation8 = useRef(new Animated.Value(0)).current;
  const orbRotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // All layers rotate at the same speed and direction for smooth, consistent motion
    const animation1 = Animated.loop(
      Animated.timing(rotation1, {
        toValue: 1,
        duration: 20000, // 20 seconds for smooth rotation
        useNativeDriver: true,
      })
    );

    const animation2 = Animated.loop(
      Animated.timing(rotation2, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
      })
    );

    const animation3 = Animated.loop(
      Animated.timing(rotation3, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
      })
    );

    const animation4 = Animated.loop(
      Animated.timing(rotation4, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
      })
    );

    const animation5 = Animated.loop(
      Animated.timing(rotation5, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
      })
    );

    const animation6 = Animated.loop(
      Animated.timing(rotation6, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
      })
    );

    const animation7 = Animated.loop(
      Animated.timing(rotation7, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
      })
    );

    const animation8 = Animated.loop(
      Animated.timing(rotation8, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
      })
    );

    // Orb rotation animation (clockwise, slower)
    const orbAnimation = Animated.loop(
      Animated.timing(orbRotation, {
        toValue: 1,
        duration: 30000, // 30 seconds for slow, smooth rotation
        useNativeDriver: true,
      })
    );

    // Start all animations
    animation1.start();
    animation2.start();
    animation3.start();
    animation4.start();
    animation5.start();
    animation6.start();
    animation7.start();
    animation8.start();
    orbAnimation.start();

    return () => {
      animation1.stop();
      animation2.stop();
      animation3.stop();
      animation4.stop();
      animation5.stop();
      animation6.stop();
      animation7.stop();
      animation8.stop();
    };
  }, []);

  const spin1 = rotation1.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const spin2 = rotation2.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const spin3 = rotation3.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const spin4 = rotation4.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const spin5 = rotation5.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const spin6 = rotation6.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const spin7 = rotation7.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const spin8 = rotation8.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const orbSpin = orbRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Metallic orb background image with rotation */}
      <Animated.View
        style={[
          styles.metallicOrbContainer,
          { 
            width: size, 
            height: size, 
            borderRadius: size / 2,
            transform: [{ rotate: orbSpin }]
          }
        ]}
      >
        <Image
          source={require('../../assets/cool-orb.webp')}
          style={[styles.metallicOrbImage, { width: size, height: size, borderRadius: size / 2 }]}
          resizeMode="cover"
        />
      </Animated.View>
      
             {/* Layer 1: Blue swirl */}
       <Animated.View 
         style={[
           styles.layer, 
           { 
             width: size, 
             height: size, 
             borderRadius: size / 2,
             transform: [{ rotate: spin1 }],
                           opacity: 0.4,
           }
         ]}
       >
         <LinearGradient
           colors={['rgba(59, 130, 246, 0.9)', 'rgba(29, 78, 216, 0.8)', 'transparent']}
           style={[styles.gradientView, { borderRadius: size / 2 }]}
           start={{ x: 0, y: 0 }}
           end={{ x: 1, y: 1 }}
         />
       </Animated.View>

               {/* Layer 2: Purple swirl */}
        <Animated.View 
          style={[
            styles.layer, 
            { 
              width: size, 
              height: size, 
              borderRadius: size / 2,
              transform: [{ rotate: spin2 }],
              opacity: 0.35,
            }
          ]}
        >
          <LinearGradient
            colors={['rgba(139, 92, 246, 0.9)', 'rgba(168, 85, 247, 0.7)', 'transparent']}
            style={[styles.gradientView, { borderRadius: size / 2 }]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
          />
        </Animated.View>

        {/* Layer 3: Pink swirl */}
        <Animated.View 
          style={[
            styles.layer, 
            { 
              width: size, 
              height: size, 
              borderRadius: size / 2,
              transform: [{ rotate: spin3 }],
              opacity: 0.3,
            }
          ]}
        >
          <LinearGradient
            colors={['rgba(236, 72, 153, 0.8)', 'rgba(192, 132, 252, 0.6)', 'transparent']}
            style={[styles.gradientView, { borderRadius: size / 2 }]}
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 1 }}
          />
        </Animated.View>

        {/* Layer 4: Blue radial */}
        <Animated.View 
          style={[
            styles.layer, 
            { 
              width: size, 
              height: size, 
              borderRadius: size / 2,
              transform: [{ rotate: spin4 }],
              opacity: 0.25,
            }
          ]}
        >
          <LinearGradient
            colors={['rgba(59, 130, 246, 0.7)', 'rgba(168, 85, 247, 0.5)', 'transparent']}
            style={[styles.gradientView, { borderRadius: size / 2 }]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
          />
        </Animated.View>

        {/* Layer 5: Purple radial */}
        <Animated.View 
          style={[
            styles.layer, 
            { 
              width: size, 
              height: size, 
              borderRadius: size / 2,
              transform: [{ rotate: spin5 }],
              opacity: 0.3,
            }
          ]}
        >
          <LinearGradient
            colors={['rgba(236, 72, 153, 0.6)', 'rgba(139, 92, 246, 0.4)', 'transparent']}
            style={[styles.gradientView, { borderRadius: size / 2 }]}
            start={{ x: 0.5, y: 0.5 }}
            end={{ x: 1, y: 0 }}
          />
        </Animated.View>

        {/* Layer 6: White glow */}
        <Animated.View 
          style={[
            styles.layer, 
            { 
              width: size, 
              height: size, 
              borderRadius: size / 2,
              transform: [{ rotate: spin6 }],
              opacity: 0.15,
            }
          ]}
        >
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.5)', 'rgba(59, 130, 246, 0.4)', 'transparent']}
            style={[styles.gradientView, { borderRadius: size / 2 }]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        </Animated.View>

        {/* Layer 7: Pink sparkle */}
        <Animated.View 
          style={[
            styles.layer, 
            { 
              width: size, 
              height: size, 
              borderRadius: size / 2,
              transform: [{ rotate: spin7 }],
              opacity: 0.35,
            }
          ]}
        >
          <LinearGradient
            colors={['rgba(236, 72, 153, 0.8)', 'rgba(168, 85, 247, 0.6)', 'rgba(59, 130, 246, 0.5)']}
            style={[styles.gradientView, { borderRadius: size / 2 }]}
            start={{ x: 1, y: 0.5 }}
            end={{ x: 0, y: 0.5 }}
          />
        </Animated.View>

        {/* Layer 8: Main blend */}
        <Animated.View 
          style={[
            styles.layer, 
            { 
              width: size, 
              height: size, 
              borderRadius: size / 2,
              transform: [{ rotate: spin8 }],
              opacity: 0.25,
            }
          ]}
        >
          <LinearGradient
            colors={['rgba(59, 130, 246, 0.6)', 'rgba(168, 85, 247, 0.5)', 'rgba(236, 72, 153, 0.4)']}
            style={[styles.gradientView, { borderRadius: size / 2 }]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        </Animated.View>

      {/* Content layer - Day 1 text and progress ring */}
      <View style={styles.contentLayer}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
  },
  metallicOrbContainer: {
    position: 'absolute',
    zIndex: 1,
  },
  metallicOrbImage: {
    width: '100%',
    height: '100%',
  },
  layer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3,
  },
  gradientView: {
    width: '100%',
    height: '100%',
  },
  contentLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
});

export default SwirlingOrb; 