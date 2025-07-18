import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import images from '@/constants/images'
import icons from '@/constants/icons'
import { router } from 'expo-router'

const SignIn = () => {
  const handleGoogleLogin = () => {}

   const handleNavigateToLogin = () => {
    router.push('/login')
  }

  return (
    <SafeAreaView className='bg-white h-full'>
      <ScrollView contentContainerClassName='h-full'>
        <Image
          source={images.onboarding}
          className='w-full h-4/6'
          resizeMode='contain'
        />
        <View className='px-10'>
          <Text className='text-base text-center uppercase font-rubik text-black-200'>
            Welcome to Abashon
          </Text>
          <Text className='text-3xl font-rubik-bold text-black-300 text-center mt-2'>
            Find your dream home easily{"\n"}
            <Text className='text-primary-300'>
              Start your search today
            </Text>
          </Text>
          <Text className='text-lg font-rubik text-black-200 text-center mt-4'>
            Login to Abashon with Google
          </Text>

          <TouchableOpacity 
            onPress={handleNavigateToLogin}
            className='bg-primary-300 shadow-md shadow-zinc-400 rounded-full w-full py-4 mt-5'
          >
            <Text className='text-lg font-rubik-medium text-white text-center'>
              Login
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={handleGoogleLogin}
            className='bg-white shadow-md shadow-zinc-400 rounded-full w-full py-4 mt-5'
          >
            <View className='flex flex-row items-center justify-center gap-2'>
              <Image
                source={icons.google}
                className='w-5 h-5'
                resizeMode='contain'
              />
              <Text className='text-lg font-rubik-medium text-black-300'>
                Continue with Google
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignIn