import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, Alert, Modal } from 'react-native';
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
  const REDIRECT_URI = process.env.REDIRECT_URI || 'http://localhost:19006'
  
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${GOOGLE_CLIENT_ID}&` +
    `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
    `response_type=code&` +
    `scope=openid%20email%20profile&` +
    `access_type=offline&` +
    `prompt=select_account`;

  const handleWebViewNavigation = async (navState: any) => {
    const { url } = navState;
    
    // Check if we've reached the redirect URI with an authorization code
    if (url.startsWith(REDIRECT_URI) && url.includes('code=')) {
      setShowWebView(false);
      
      // Extract authorization code
      const codeMatch = url.match(/code=([^&]+)/);
      if (codeMatch) {
        const authCode = decodeURIComponent(codeMatch[1]);
        await exchangeCodeForToken(authCode);
      }
    } else if (url.includes('error=')) {
      setShowWebView(false);
      const errorMatch = url.match(/error=([^&]+)/);
      const error = errorMatch ? decodeURIComponent(errorMatch[1]) : 'Unknown error';
      Alert.alert('Authentication Error', error);
      setIsLoading(false);
    }
  };

  const exchangeCodeForToken = async (code: string) => {
  setIsLoading(true);
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/google/code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code: code,
        redirectUri: REDIRECT_URI,
      }),
    });

    const text = await response.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      Alert.alert('Error', 'Invalid response from server. Please try again.');
      return;
    }

    if (response.ok && data.success) {
      // Store user data
      await AsyncStorage.setItem('userData', JSON.stringify(data));

      Alert.alert(
        'Success!',
        `Welcome ${data.name}! You have successfully signed in.`,
        [
          {
            text: 'OK',
            onPress: () => {
              router.replace('/(root)/(tabs)');
            },
          },
        ]
      );
    } else {
      Alert.alert('Error', data.message || 'Authentication failed');
    }

  } catch (error) {
    console.error('❌ Code exchange error:', error);
    Alert.alert('Error', 'Authentication failed. Please try again.');
  } finally {
    setIsLoading(false);
  }
};

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setShowWebView(true);
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
          <Text className="text-lg font-rubik text-black-200 text-center mt-4">
            Login to Abashon with Google
          </Text>

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
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333' }}>
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
              <Text style={{ fontSize: 14, color: '#fff', fontWeight: '600' }}>
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