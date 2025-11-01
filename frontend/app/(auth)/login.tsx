import images from '@/constants/images'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { Link, useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Alert, Image, Keyboard, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { SafeAreaView } from 'react-native-safe-area-context'

const login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter()
  const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {setKeyboardVisible(true)});
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {setKeyboardVisible(false)});

    return () => {
      keyboardDidShowListener.remove()
      keyboardDidHideListener.remove()
    };
  }, [])

  const validateForm = () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return false;
    }
    if (!password.trim()) {
      Alert.alert('Error', 'Please enter your password');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }
    
    return true;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true)
    try {
      
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/login`,
        {
          email: email.trim().toLowerCase(),
          password: password,
        },
        {
          timeout: 15000,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      
      let userData;
      let token;
      if(response.data.success) {
        userData = response.data.user;
        token = response.data.token;
      } else if (response.data.user) {
        userData = response.data.user;
        token = response.data.token;
      } else {
        userData = response.data
      }

      if(userData) {
        await AsyncStorage.setItem('user', JSON.stringify(userData));
      }
      if (token) {
        await AsyncStorage.setItem('token', token);
      }
      
      Alert.alert('Success', 'Login successful!');
      router.replace("/(root)/(tabs)");
    } catch (error) {
      console.error('❌ LOGIN ERROR:', error);
      
      if (axios.isAxiosError(error)) {
        console.error('Axios Error Code:', error.code);
        console.error('Status:', error.response?.status);
        console.error('Response Data:', error.response?.data);
        
        if (error.code === 'ECONNABORTED') {
          Alert.alert('Error', 'Request timeout. Please check your internet connection.');
        } else if (error.response?.data?.message) {
          Alert.alert('Error', error.response.data.message);
        } else if (error.response?.status === 401) {
          Alert.alert('Error', 'Invalid email or password');
        } else if (error.response?.status === 400) {
          Alert.alert('Error', error.response.data?.message || 'Invalid login credentials');
        } else if (error.message?.includes('Network')) {
          Alert.alert(
            'Network Error', 
            `Cannot connect to: ${API_BASE_URL}\n\nMake sure:\n1. Internet is connected\n2. Backend is running\n3. API URL is correct`
          );
        } else {
          Alert.alert('Error', error.message || 'Network error. Please try again.');
        }
      } else {
        Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false)
    }
  };

  return (
    <SafeAreaView className="bg-white h-full">
      <KeyboardAwareScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: isKeyboardVisible ? 200 : 0
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        enableOnAndroid={true}
        enableAutomaticScroll={false}
        extraScrollHeight={Platform.OS === 'ios' ? 100 : 150}
        extraHeight={Platform.OS === 'ios' ? 100 : 150}
        keyboardOpeningTime={250}
        scrollToOverflowEnabled={true}
        viewIsInsideTabBar={false}
      >
        <Image
          source={images.login}
          className="w-full h-80"
          resizeMode="cover"
        />
        <View className=" flex-1 px-5 py-3">
          <Text className="text-4xl font-rubik-bold text-black-300">Login</Text>
          <Text className="text-base font-rubik text-black-200 mt-1 mb-4">
            Please login to continue
          </Text>

          {/* Email Input */}
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
            className={`border border-gray-300 rounded-xl px-4 py-3 mb-4 text-black-300 font-rubik ${loading ? 'opacity-50' : ''}`}
            placeholderTextColor="#999"
          />

          {/* Password Input */}
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            secureTextEntry
            editable={!loading}
            className={`border border-gray-300 rounded-xl px-4 py-3 mb-2 text-black-300 font-rubik ${loading ? 'opacity-50' : ''}`}
            placeholderTextColor="#999"
          />

          {/* Forgot Password Link */}
          <TouchableOpacity className="mb-4">
            <Text className="text-primary-300 font-rubik-medium">Forgot Password?</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity
            onPress={handleLogin}
            disabled={loading}
            className="bg-primary-300 py-4 mt-6 rounded-xl"
          >
            <Text className="text-white text-center font-rubik-bold text-lg">
              {loading ? 'Signing In...' : 'Login'}
            </Text>
          </TouchableOpacity>

          {/* Register Redirect */}
          <View className="flex-row justify-center mt-6 mb-8">
            <Text className="text-black-200 font-rubik">Don't have an account? </Text>
            <TouchableOpacity disabled={loading}>
              <Link href="/sign-up" className="font-rubik-medium text-primary-300">
                Sign Up
              </Link>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  )
}

export default login