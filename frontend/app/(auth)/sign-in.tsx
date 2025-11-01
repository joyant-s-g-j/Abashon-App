import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, Alert, Modal, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import images from '@/constants/images';
import icons from '@/constants/icons';

const SignIn = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showWebView, setShowWebView] = useState(false);
  const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL
  const GOOGLE_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID
  
  // For production APK: use the backend callback URL
  // For Expo Go: can also use the same backend callback since we registered it
  const BACKEND_GOOGLE_CALLBACK = `${API_BASE_URL}/api/auth/google/callback`
  
  // Build Google OAuth URL with backend callback
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${GOOGLE_CLIENT_ID}&` +
    `redirect_uri=${encodeURIComponent(BACKEND_GOOGLE_CALLBACK)}&` +
    `response_type=code&` +
    `scope=openid%20email%20profile&` +
    `access_type=offline&` +
    `prompt=select_account`;

  const handleWebViewNavigation = async (navState: any) => {
    const { url } = navState;
    
    console.log('🔵 WebView Navigation URL:', url);
    
    // Check if we've reached the backend callback
    if (url.includes('/api/auth/google/callback')) {
      console.log('✅ Google callback detected');
      setShowWebView(false);
      
      // Extract authorization code if present
      if (url.includes('code=')) {
        const codeMatch = url.match(/code=([^&]+)/);
        if (codeMatch) {
          const authCode = decodeURIComponent(codeMatch[1]);
          console.log('📦 Authorization code extracted');
        }
      } else if (url.includes('error=')) {
        const errorMatch = url.match(/error=([^&]+)/);
        const error = errorMatch ? decodeURIComponent(errorMatch[1]) : 'Unknown error';
        console.error('❌ Google auth error:', error);
        Alert.alert('Authentication Error', error);
      }
    } else if (url.includes('com.abashon://auth-callback')) {
      console.log('✅ Deep link callback detected');
      setShowWebView(false);
      
      // Extract token and user data from deep link
      const urlParams = new URLSearchParams(url.split('?')[1]);
      const token = urlParams.get('token');
      const userData = {
        _id: urlParams.get('userId'),
        name: urlParams.get('name'),
        email: urlParams.get('email'),
        phone: urlParams.get('phone') || '',
        role: urlParams.get('role') || 'customer',
        avatar: urlParams.get('avatar') || '',
        authMethod: 'google'
      };
      
      console.log('📦 User data from deep link:', userData._id, userData.email);
      
      if (token && userData._id) {
        try {
          await AsyncStorage.multiRemove(['user', 'token']);
          await AsyncStorage.setItem('token', token);
          await AsyncStorage.setItem('user', JSON.stringify(userData));
          
          console.log('✅ Authentication successful, redirecting...');

          Alert.alert(
            'Success!',
            `Welcome ${userData.name}! You have successfully signed in.`,
            [
              {
                text: 'OK',
                onPress: () => {
                  router.replace('/(root)/(tabs)');
                },
              },
            ]
          );
        } catch (err) {
          console.error('❌ Error saving auth data:', err);
          Alert.alert('Error', 'Failed to save authentication data');
        }
      } else {
        console.error('❌ Missing token or user ID');
        Alert.alert('Error', 'Authentication failed - missing credentials');
      }
    } else if (url.includes('error=')) {
      setShowWebView(false);
      const errorMatch = url.match(/error=([^&]+)/);
      const error = errorMatch ? decodeURIComponent(errorMatch[1]) : 'Unknown error';
      console.error('❌ Authorization error:', error);
      Alert.alert('Authentication Error', error);
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      console.log('🔵 Google login initiated');
      console.log('Backend callback URL:', BACKEND_GOOGLE_CALLBACK);
      
      // Clear any existing data before starting new sign-in
      await AsyncStorage.multiRemove(['user', 'token']);
      setIsLoading(true);
      setShowWebView(true);
    } catch (error) {
      console.error('❌ Error clearing storage:', error);
      setIsLoading(true);
      setShowWebView(true);
    }
  };

  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView contentContainerClassName="h-full">
        <Image
          source={images.onboarding}
          className="w-full h-4/6"
          resizeMode="contain"
        />
        <View className="px-10">
          <Text className="text-base text-center uppercase font-rubik text-black-200">
            Welcome to Abashon
          </Text>
          <Text className="text-3xl font-rubik-bold text-black-300 text-center mt-2">
            Find your dream home easily{"\n"}
            <Text className="text-primary-300">Start your search today</Text>
          </Text>

          <TouchableOpacity
            onPress={() => router.replace('/login')}
            className='bg-blue-500 rounded-full w-full py-4 mt-4 items-center'
          >
            <Text className='text-lg font-rubik-medium text-white'>
              Continue with Email
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={handleGoogleLogin}
            disabled={isLoading}
            className={`bg-white shadow-md shadow-zinc-400 rounded-full w-full py-4 mt-5 ${
              isLoading ? 'opacity-50' : ''
            }`}
          >
            <View className="flex flex-row items-center justify-center gap-2">
              <Image
                source={icons.google}
                className="w-5 h-5"
                resizeMode="contain"
              />
              <Text className="text-lg font-rubik-medium text-black-300">
                {isLoading ? 'Signing in...' : 'Continue with Google'}
              </Text>
            </View>
          </TouchableOpacity>
          
        </View>
      </ScrollView>

      {/* WebView Modal */}
      <Modal
        visible={showWebView}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={{ flex: 1 }}>
          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            padding: 15, 
            borderBottomWidth: 1, 
            borderBottomColor: '#e0e0e0',
            backgroundColor: '#f8f9fa'
          }}>
            <Text className='text-xl font-rubik-bold text-black-300'>
              Sign in with Google
            </Text>
            <TouchableOpacity
              onPress={() => {
                setShowWebView(false);
                setIsLoading(false);
              }}
              style={{ 
                padding: 8,
                backgroundColor: '#dc3545',
                borderRadius: 6
              }}
            >
              <Text className='font-rubik-semibold text-white'>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
          
          <WebView
            source={{ uri: googleAuthUrl }}
            onNavigationStateChange={handleWebViewNavigation}
            startInLoadingState={true}
            scalesPageToFit={true}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            style={{ flex: 1 }}
            userAgent="Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36"
          />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default SignIn;