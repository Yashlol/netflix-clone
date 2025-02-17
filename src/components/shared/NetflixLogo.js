import React, { useEffect, useRef } from 'react';
import { Text, StyleSheet, Animated } from 'react-native';
import { theme } from '../../constants/theme';

export const BrandLogo = ({ style }) => {
  // Use useRef to maintain animation values between re-renders
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Start with full opacity and scale
    fadeAnim.setValue(1);
    scaleAnim.setValue(1);

    // Optional: Add subtle pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: false,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.Text 
      style={[
        styles.logo, 
        style,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        }
      ]}
    >
      ALANWATCH
    </Animated.Text>
  );
};

const styles = StyleSheet.create({
  logo: {
    color: theme.colors.primary,
    fontSize: 48,
    fontWeight: 'bold',
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 168, 225, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
}); 