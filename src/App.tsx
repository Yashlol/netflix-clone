import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar, ActivityIndicator, View } from "react-native";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import MovieDetailScreen from "./screens/MovieDetailScreen";
import { theme } from "./constants/theme";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  MovieDetail: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function NavigationContent() {
  const { user, loading } = useAuth();
  console.log('Current auth state:', { user: user?.id, loading });

  if (loading) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: theme.colors.background.primary 
      }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.background.primary,
        },
        headerTintColor: theme.colors.text.primary,
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      {!user ? (
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
      ) : (
        <>
          <Stack.Screen
            name="MovieDetail"
            component={MovieDetailScreen}
            options={{ 
              title: "Alanwatch",
              headerShown: true,
              headerStyle: {
                backgroundColor: theme.colors.background.primary,
                minHeight: 80,
              },
              headerTitleStyle: {
                color: theme.colors.primary,
                fontSize: 24,
                fontWeight: 'bold',
                letterSpacing: 1,
              },
              headerTintColor: theme.colors.text.primary,
            }}
          />
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

const App: React.FC = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <StatusBar
          barStyle="light-content"
          backgroundColor={theme.colors.background.primary}
        />
        <NavigationContent />
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;
