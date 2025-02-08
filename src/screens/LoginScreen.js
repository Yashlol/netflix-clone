import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Modal,
  ScrollView,
  ActivityIndicator,
  Animated,
  Easing,
} from 'react-native';
import { authService } from '../services/auth';
import { theme } from '../constants/theme';
import { NetflixLogo } from '../components/shared/NetflixLogo';
import { useAuth } from '../contexts/AuthContext';

// Move SignUpModal outside the main component
const SignUpModal = ({ visible, onClose, onSignUp, loading, formData, onFormChange }) => {
  const slideAnimation = useRef(new Animated.Value(0)).current;
  const fadeAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.timing(slideAnimation, {
          toValue: 1,
          duration: 300,
          delay: 100,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease),
        }),
        Animated.timing(fadeAnimation, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnimation, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnimation, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const translateY = slideAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [600, 0],
  });

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <Animated.View 
        style={[
          styles.modalContainer,
          {
            opacity: fadeAnimation,
            transform: [{ translateY }],
          }
        ]}
      >
        <ScrollView contentContainerStyle={styles.modalContent}>
          <Text style={styles.modalTitle}>Create Account</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor={theme.colors.text.tertiary}
            value={formData.username}
            onChangeText={(text) => onFormChange('username', text)}
            autoCapitalize="none"
            editable={!loading}
          />

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={theme.colors.text.tertiary}
            value={formData.email}
            onChangeText={(text) => onFormChange('email', text)}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!loading}
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={theme.colors.text.tertiary}
            value={formData.password}
            onChangeText={(text) => onFormChange('password', text)}
            secureTextEntry
            editable={!loading}
          />

          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor={theme.colors.text.tertiary}
            value={formData.confirmPassword}
            onChangeText={(text) => onFormChange('confirmPassword', text)}
            secureTextEntry
            editable={!loading}
          />

          <TouchableOpacity 
            style={styles.button}
            onPress={onSignUp}
            disabled={loading}
          >
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color={theme.colors.text.primary} />
                <Text style={[styles.buttonText, styles.loadingText]}>
                  {loading ? 'Creating Account...' : 'Sign Up'}
                </Text>
    </View>
            ) : (
              <Text style={styles.buttonText}>Sign Up</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={onClose}
            disabled={loading}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>
    </Modal>
  );
};

export default function LoginScreen({ navigation }) {
  const { setUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [signUpForm, setSignUpForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
  });
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const formSlideAnim = useRef(new Animated.Value(0)).current;
  const loadingSpinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Initial animations
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        delay: 300,
        useNativeDriver: true,
      }),
      Animated.timing(formSlideAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
    ]).start();
  }, []);

  useEffect(() => {
    if (loading || verificationLoading) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(loadingSpinAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
            easing: Easing.linear,
          }),
          Animated.timing(loadingSpinAnim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      loadingSpinAnim.setValue(0);
    }
  }, [loading, verificationLoading]);

  const spin = loadingSpinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const formTranslateY = formSlideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0],
  });

  const handleFormChange = (field, value) => {
    setSignUpForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleResendVerification = async (emailToVerify) => {
    try {
      setVerificationLoading(true);
      await authService.resendVerificationEmail(emailToVerify);
      Alert.alert('Success', 'Verification email has been resent. Please check your inbox and spam folder.');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setVerificationLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      const { user } = await authService.signIn(email, password);
      
      if (user) {
        if (!user.email_confirmed_at) {
          Alert.alert(
            'Email Not Verified',
            'Please verify your email before logging in.',
            [
              {
                text: 'Resend Verification',
                onPress: () => handleResendVerification(email),
                disabled: verificationLoading
              },
              { text: 'OK' }
            ]
          );
          return;
        }
        setUser(user);
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    // Form validation
    if (!signUpForm.email || !signUpForm.password || !signUpForm.username) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (signUpForm.password !== signUpForm.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (signUpForm.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      const user = await authService.signUp(
        signUpForm.email.trim(), 
        signUpForm.password,
        signUpForm.username.trim()
      );
      
      if (user) {
        Alert.alert(
          'Account Created Successfully!',
          'Your account has been created. Please check your email for a verification link. You will need to verify your email before logging in.\n\nCheck your spam folder if you don\'t see the email.',
          [
            { 
              text: 'OK', 
              onPress: () => {
                setShowSignUp(false);
                // Pre-fill the login form with the email
                setEmail(signUpForm.email.trim());
                // Clear the sign-up form
                setSignUpForm({
                  email: '',
                  password: '',
                  confirmPassword: '',
                  username: '',
                });
              }
            },
            {
              text: 'Resend Email',
              onPress: () => handleResendVerification(signUpForm.email.trim()),
              disabled: verificationLoading
            }
          ]
        );
      }
    } catch (error) {
      console.error('Signup Error:', error);
      Alert.alert(
        'Sign Up Failed',
        error.message || 'Failed to create account. Please try again.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Clear password fields on error
              setSignUpForm(prev => ({
                ...prev,
                password: '',
                confirmPassword: '',
              }));
            }
          }
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Animated.View style={[{ opacity: fadeAnim }]}>
        {logoError ? (
          <NetflixLogo style={styles.logo} />
        ) : (
          <Image
            source={require('../assets/images/netflix-logo.png')}
            style={styles.logo}
            resizeMode="contain"
            onError={() => setLogoError(true)}
          />
        )}
      </Animated.View>
      
      <Animated.View 
        style={[
          styles.formContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: formTranslateY }],
          }
        ]}
      >
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={theme.colors.text.tertiary}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          editable={!loading && !verificationLoading}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={theme.colors.text.tertiary}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!loading && !verificationLoading}
        />

        <TouchableOpacity 
          style={styles.button}
          onPress={handleLogin}
          disabled={loading || verificationLoading}
        >
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color={theme.colors.text.primary} />
              <Text style={[styles.buttonText, styles.loadingText]}>
                Signing In...
              </Text>
            </View>
          ) : (
            <Text style={styles.buttonText}>Sign In</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.signUpButton}
          onPress={() => setShowSignUp(true)}
          disabled={loading || verificationLoading}
        >
          <Text style={styles.signUpText}>New to Netflix? Sign up now</Text>
        </TouchableOpacity>
      </Animated.View>

      <SignUpModal 
        visible={showSignUp}
        onClose={() => !loading && setShowSignUp(false)}
        onSignUp={handleSignUp}
        loading={loading}
        formData={signUpForm}
        onFormChange={handleFormChange}
      />

      {verificationLoading && (
        <Animated.View 
          style={[
            styles.verificationOverlay,
            {
              opacity: fadeAnim,
            }
          ]}
        >
          <Animated.View style={{ transform: [{ rotate: spin }] }}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </Animated.View>
          <Animated.Text 
            style={[
              styles.verificationText,
              {
                opacity: fadeAnim,
                transform: [{ translateY: formTranslateY }],
              }
            ]}
          >
            Sending verification email...
          </Animated.Text>
        </Animated.View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
    padding: theme.spacing.lg,
  },
  logo: {
    width: 150,
    height: 80,
    alignSelf: 'center',
    marginTop: theme.spacing['2xl'],
    marginBottom: theme.spacing.xl,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  input: {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.md,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
    fontSize: theme.typography.fontSize.md,
  },
  button: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  buttonText: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.md,
    fontWeight: 'bold',
  },
  signUpButton: {
    marginTop: theme.spacing.xl,
    alignItems: 'center',
  },
  signUpText: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.md,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  modalContent: {
    padding: theme.spacing.lg,
    paddingTop: theme.spacing['2xl'],
  },
  modalTitle: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: 'bold',
    marginBottom: theme.spacing.xl,
    textAlign: 'center',
  },
  cancelButton: {
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.md,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginLeft: theme.spacing.sm,
  },
  verificationOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  verificationText: {
    color: theme.colors.text.primary,
    marginTop: theme.spacing.md,
    fontSize: theme.typography.fontSize.md,
  },
});
