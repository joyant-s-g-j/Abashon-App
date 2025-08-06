import { View, Text, TextInput, Image, TouchableOpacity, Platform, Keyboard } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import images from '@/constants/images'
import { Link, useRouter } from 'expo-router'
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import CustomDropdown from '@/components/CustomDropdown'

const SignUp = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('');
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const router = useRouter()
  const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);
  
  const handleSignup = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/signup`,
        {
          name: name,
          email: email,
          password: password,
        },
        {
          withCredentials: true,
        }
      );
      console.log('Signup Success:', response.data);
      router.push("/login")
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Login Failed:', error?.response?.data || error?.message);
      } else {
        console.error('An unexpected error occurred:', error);
      }
    }
  };

  const roleOptions = [
  { label: "Select Role", value: "" },
  { label: "Customer", value: "customer" },
  { label: "Agent", value: "agent" },
];

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
        <View className="flex-1 flex justify-center">
          <Image
            source={images.loginHome}
            className="w-full h-64"
            resizeMode="contain"
          />
          <View className="px-5 py-3">
            <Text className="text-4xl font-rubik-bold text-black-300">Sign Up</Text>
            <Text className="text-base font-rubik text-black-200 mt-1 mb-4">
              Create a new account
            </Text>
            {/* Name Input */}
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Name"
              className="border border-gray-300 rounded-xl px-4 py-3 mb-4 text-black-300 font-rubik"
            />
            {/* User Role Picker */}
            <CustomDropdown
              selectedValue={role}
              onValueChange={setRole}
              options={roleOptions}
              placeholder="Select Role"
            />
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
            {/* Sign Up Button */}
            <TouchableOpacity
              onPress={handleSignup}
              className="bg-primary-300 py-4 mt-6 rounded-xl"
            >
              <Text className="text-white text-center font-rubik-bold text-lg">
                Sign Up
              </Text>
            </TouchableOpacity>
            {/* Login Redirect */}
            <View className="flex-row justify-center mt-6 mb-8">
              <Text className="text-black-200 font-rubik">
                Already have an account?{' '}
              </Text>
              <TouchableOpacity>
                <Link href="/login" className="text-primary-300 font-rubik-medium">
                  Sign In
                </Link>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  )
}

export default SignUp