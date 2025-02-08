import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/auth';
import { theme } from '../constants/theme';

const HomeScreen = ({ navigation }) => {
  const { setUser } = useAuth();

  const handleSignOut = async () => {
    try {
      await authService.signOut();
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Screen</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("MovieDetail")}
      >
        <Text style={styles.buttonText}>Go to Movie Details</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.signOutButton]}
        onPress={handleSignOut}
      >
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background.primary,
  },
  title: {
    fontSize: 24,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xl,
  },
  button: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    marginVertical: theme.spacing.sm,
    minWidth: 200,
    alignItems: 'center',
  },
  buttonText: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.md,
    fontWeight: 'bold',
  },
  signOutButton: {
    backgroundColor: theme.colors.error,
    marginTop: theme.spacing.xl,
  },
});

export default HomeScreen;
