import { View, Text, TextInput, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import images from '@/constants/images'
import { Link } from 'expo-router'

const SignUp = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSignup = () => {
    console.log('Signing up with:', name, email, password)
    // add your signup logic here
  }

  return (
    <SafeAreaView className="bg-white h-full">
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
          <View className="flex-row justify-center mt-6">
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
    </SafeAreaView>
  )
}

export default SignUp