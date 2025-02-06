import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { theme } from '../../constants/theme';

export const NetflixLogo = ({ style }) => {
  return (
    <Text style={[styles.logo, style]}>
      NETFLIX
    </Text>
  );
};

const styles = StyleSheet.create({
  logo: {
    color: theme.colors.primary,
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
}); 