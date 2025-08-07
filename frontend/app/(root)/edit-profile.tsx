import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import icons from '@/constants/icons'

const EditProfile = () => {
  return (
    <SafeAreaView className='flex-1 bg-white'>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
        className='px-6'
      >
        {/* Header */}
        <View className='flex-row items-center justify-between mt-4 mb-6'>
          <TouchableOpacity onPress={() => router.back()} className='flex flex-row bg-primary-200 rounded-full size-11 items-center justify-center'>
            <Image source={icons.backArrow} className='size-6' />
          </TouchableOpacity>
          <Text className='text-xl font-rubik-bold text-black-300'>Edit Profile</Text>
          <View className='w-10' />
        </View>

        {/* Profile picture section */}\
        
      </ScrollView>
    </SafeAreaView>
  )
}

export default EditProfile