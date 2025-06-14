import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, Mail, Phone, User, Lock } from 'lucide-react-native';

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const { login, loginWithPhone, register } = useAuth();

  const handleSubmit = async () => {
    if (isLoading) return;

    // Validation
    if (!isLogin && formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (!isLogin && formData.name.trim().length < 2) {
      Alert.alert('Error', 'Please enter your full name');
      return;
    }

    if (loginMethod === 'email' && !formData.email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (loginMethod === 'phone' && formData.phone.length < 10) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }

    if (formData.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      let success = false;

      if (isLogin) {
        if (loginMethod === 'email') {
          success = await login(formData.email, formData.password);
        } else {
          success = await loginWithPhone(formData.phone, formData.password);
        }
      } else {
        success = await register(formData.name, formData.email, formData.phone, formData.password);
      }

      if (success) {
        router.replace('/(tabs)');
      } else {
        Alert.alert('Error', isLogin ? 'Invalid credentials' : 'Registration failed');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image 
              source={require('@/assets/images/logo (4).png')} 
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.tagline}>Your Trusted Source for Nigerian Foodstuff</Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            <Text style={styles.title}>
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </Text>
            <Text style={styles.subtitle}>
              {isLogin ? 'Sign in to continue' : 'Join Luxuire today'}
            </Text>

            {/* Login Method Toggle (only for login) */}
            {isLogin && (
              <View style={styles.methodToggle}>
                <TouchableOpacity
                  style={[styles.methodButton, loginMethod === 'email' && styles.methodButtonActive]}
                  onPress={() => setLoginMethod('email')}
                >
                  <Mail size={16} color={loginMethod === 'email' ? '#FFFFFF' : '#666666'} strokeWidth={2} />
                  <Text style={[styles.methodButtonText, loginMethod === 'email' && styles.methodButtonTextActive]}>
                    Email
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.methodButton, loginMethod === 'phone' && styles.methodButtonActive]}
                  onPress={() => setLoginMethod('phone')}
                >
                  <Phone size={16} color={loginMethod === 'phone' ? '#FFFFFF' : '#666666'} strokeWidth={2} />
                  <Text style={[styles.methodButtonText, loginMethod === 'phone' && styles.methodButtonTextActive]}>
                    Phone
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Name Field (Register only) */}
            {!isLogin && (
              <View style={styles.inputContainer}>
                <User size={20} color="#666666" strokeWidth={2} />
                <TextInput
                  style={styles.input}
                  placeholder="Full Name"
                  value={formData.name}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                  placeholderTextColor="#999999"
                />
              </View>
            )}

            {/* Email Field */}
            {(loginMethod === 'email' || !isLogin) && (
              <View style={styles.inputContainer}>
                <Mail size={20} color="#666666" strokeWidth={2} />
                <TextInput
                  style={styles.input}
                  placeholder="Email Address"
                  value={formData.email}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor="#999999"
                />
              </View>
            )}

            {/* Phone Field */}
            {(loginMethod === 'phone' || !isLogin) && (
              <View style={styles.inputContainer}>
                <Phone size={20} color="#666666" strokeWidth={2} />
                <TextInput
                  style={styles.input}
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
                  keyboardType="phone-pad"
                  placeholderTextColor="#999999"
                />
              </View>
            )}

            {/* Password Field */}
            <View style={styles.inputContainer}>
              <Lock size={20} color="#666666" strokeWidth={2} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={formData.password}
                onChangeText={(text) => setFormData(prev => ({ ...prev, password: text }))}
                secureTextEntry={!showPassword}
                placeholderTextColor="#999999"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <EyeOff size={20} color="#666666" strokeWidth={2} />
                ) : (
                  <Eye size={20} color="#666666" strokeWidth={2} />
                )}
              </TouchableOpacity>
            </View>

            {/* Confirm Password Field (Register only) */}
            {!isLogin && (
              <View style={styles.inputContainer}>
                <Lock size={20} color="#666666" strokeWidth={2} />
                <TextInput
                  style={styles.input}
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, confirmPassword: text }))}
                  secureTextEntry={!showPassword}
                  placeholderTextColor="#999999"
                />
              </View>
            )}

            {/* Submit Button */}
            <TouchableOpacity 
              style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              <Text style={styles.submitButtonText}>
                {isLoading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
              </Text>
            </TouchableOpacity>

            {/* Toggle Auth Mode */}
            <TouchableOpacity 
              style={styles.toggleButton}
              onPress={() => setIsLogin(!isLogin)}
            >
              <Text style={styles.toggleButtonText}>
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <Text style={styles.toggleButtonTextBold}>
                  {isLogin ? 'Sign Up' : 'Sign In'}
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  tagline: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#666666',
  },
  formContainer: {
    flex: 1,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: '#333333',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#666666',
    marginBottom: 32,
  },
  methodToggle: {
    flexDirection: 'row',
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  methodButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  methodButtonActive: {
    backgroundColor: '#B3C33E',
  },
  methodButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#666666',
    marginLeft: 8,
  },
  methodButtonTextActive: {
    color: '#FFFFFF',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  input: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#333333',
    marginLeft: 12,
  },
  submitButton: {
    backgroundColor: '#B3C33E',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
    shadowColor: '#B3C33E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  toggleButton: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  toggleButtonText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666666',
  },
  toggleButtonTextBold: {
    fontFamily: 'Inter-SemiBold',
    color: '#B3C33E',
  },
});