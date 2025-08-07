import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import icons from '@/constants/icons'
import images from '@/constants/images'
import * as ImagePicker from 'expo-image-picker'

const EditProfile = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    profilePic: ''
  })

  const picImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if(status !== 'granted') {
        Alert.alert('Permission Required', 'Sorry, we need camera roll permissions to change your profile picture.')
        return
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true
      })

      if(!result.canceled && result.assets[0]) {
        const asset = result.assets[0]
        const base64Image = `data:${asset.type === 'image' ? 'image/jpeg': asset.type};base64,${asset.base64}`
        setFormData(prev => ({
          ...prev,
          profilePic: base64Image
        }))
      }
    } catch (error) {
      console.log("Error picking image: ", error)
      Alert.alert('Error', 'Failed to select image')
    }
  }

  const getCurrentProfileImage = () => {
    if(formData.profilePic && formData.profilePic.startsWith('data:')) {
      return { uri: formData.profilePic }
    }
    if(formData.profilePic && formData.profilePic !== "local") {
      return { uri: formData.profilePic }
    }
    return images.avatar
  }
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

        {/* Profile picture section */}
        <View className='items-center mb-8'>
          <View className='relative'>
            <Image
              source={getCurrentProfileImage()}
              className='size-44 rounded-full'
              resizeMode='cover'
            />
            <TouchableOpacity
              className='absolute bottom-0 right-0 bg-primary-100 size-10  rounded-full items-center justify-center border-4 border-black-100/70'
            >
              <Image source={icons.edit} className='size-7 rounded-full' />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default EditProfile