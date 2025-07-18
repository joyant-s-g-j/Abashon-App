import { View, Text, Image, TouchableOpacity, TextInput} from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import images from '@/constants/images'
import { Link } from 'expo-router'
import axios from 'axios';

const login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        'http://192.168.0.101:5000/api/auth/login',
        {
          email: email,
          password: password,
        },
        {
          withCredentials: true,
        }
      );

      console.log('Login Success:', response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
      console.error('Login Failed:', error.response?.data || error.message);
    } else {
      console.error('An unexpected error occurred:', error);
    }
    }
  };
  return (
    <SafeAreaView className="bg-white h-full">
      <View className="flex-1 flex justify-center">
        <Image
          source={images.loginHome}
          className="w-full h-64"
          resizeMode="contain"
        />

        <View className="px-5 py-3">
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
            className="border border-gray-300 rounded-xl px-4 py-3 mb-4 text-black-300 font-rubik"
          />

          {/* Password Input */}
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            secureTextEntry
            className="border border-gray-300 rounded-xl px-4 py-3 mb-2 text-black-300 font-rubik"
          />

          {/* Login Button */}
          <TouchableOpacity
            onPress={handleLogin}
            className="bg-primary-300 py-4 mt-6 rounded-xl"
          >
            <Text className="text-white text-center font-rubik-bold text-lg">
              Login
            </Text>
          </TouchableOpacity>

          {/* Register Redirect */}
          <View className="flex-row justify-center mt-6">
            <Text className="text-black-200 font-rubik">Don’t have an account? </Text>
            <TouchableOpacity>
              <Link href="/sign-up" className="text-primary-300 font-rubik-medium">Sign Up</Link>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default login