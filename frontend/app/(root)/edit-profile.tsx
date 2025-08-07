import { View, Text, ScrollView, TouchableOpacity, Image, Alert, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router, useRouter } from 'expo-router'
import icons from '@/constants/icons'
import images from '@/constants/images'
import * as ImagePicker from 'expo-image-picker'
import AsyncStorage from '@react-native-async-storage/async-storage'

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  profilePic: string;
  authMethod: string;
}

const EditProfile = () => {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    profilePic: ''
  })

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user')
        if(storedUser) {
          const parsedUser = JSON.parse(storedUser)
          setUser(parsedUser)
          console.log("uuuse", parsedUser);
          setFormData({
            name: parsedUser.name || '',
            email: parsedUser.email || '',
            phone: parsedUser.phone || '',
            role: parsedUser.role || '',
            profilePic: parsedUser.profilePic || ''
          })
        }
      } catch (error) {
        console.error('Failed to load user:', error)
        Alert.alert('Error', 'Failed to load user data')
      }
    }
    fetchUser()
  }, [])

  const pickImage = async () => {
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
        className='px-4'
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
              onPress={pickImage}
              className='absolute bottom-0 right-0 bg-primary-100 size-10  rounded-full items-center justify-center border-4 border-black-100/70'
            >
              <Image source={icons.edit} className='size-7 rounded-full' />
            </TouchableOpacity>
          </View>
          <Text className='text-sm font-rubik text-black-200 mt-2'>
            Tap to change profile picture
          </Text>
        </View>

        {/* Form fields */}
        <View className='flex-col gap-5'>
          {/* Name Field */}
          <View>
            <Text className='text-base font-rubik-medium text-black-300 mb-2'>
              Full Name
            </Text>
            <TextInput 
              value={formData.name}
              onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
              placeholder='Enter your full name'
              className='border border-primary-200 rounded-lg px-4 py-3 text-base font-rubik text-black-300'
              placeholderTextColor="#666"
            />
          </View>
          {/* Email field */}
          <View>
            <Text className='text-base font-rubik-medium text-black-300 mb-2'>
              Email Address
            </Text>
            <TextInput 
              value={formData.email}
              onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
              placeholder='Enter your email'
              keyboardType="email-address"
              autoCapitalize='none'
              className='border border-primary-200 rounded-lg px-4 py-3 text-base font-rubik text-black-300'
              placeholderTextColor="#666"
            />
          </View>
          {/* Phone Field */}
          <View>
            <Text className="text-base font-rubik-medium text-black-300 mb-2">
              Phone Number
            </Text>
            <TextInput
              value={formData.phone}
              onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
              className="border border-primary-200 rounded-lg px-4 py-3 text-base font-rubik text-black-300"
              placeholderTextColor="#666"
            />
          </View>
          {/* Role Field */}
          <View>
            <Text className="text-base font-rubik-medium text-black-300 mb-2">
              Role
            </Text>
            <View className='flex-row gap-4'>
              <TouchableOpacity
                onPress={() => setFormData(prev => ({ ...prev, role: 'customer' }))}
                className={`flex-1 py-3 px-4 rounded-lg border ${
                  formData.role === 'customer'
                    ? 'bg-primary-100 border-primary-100'
                    : 'bg-white border-primary-200'
                }`}
              >
                <Text className={`text-center font-rubik-medium ${
                    formData.role === 'customer' ? 'text-primary-300' : "text-black-200"
                  }`}
                >
                  Customer
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setFormData(prev => ({ ...prev, role: 'agent' }))}
                className={`flex-1 py-3 px-4 rounded-lg border ${
                  formData.role === 'agent' 
                    ? 'bg-primary-100 border-primary-100' 
                    : 'bg-white border-primary-200'
                }`}
              >
                <Text className={`text-center font-rubik-medium ${
                  formData.role === 'agent' ? 'text-primary-300' : 'text-black-200'
                }`}>
                  Agent
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* update button */}
        <TouchableOpacity
          disabled={loading}
          className={`mt-8 py-4 rounded-lg ${ loading ? 'bg-primary-200' : 'bg-primary-300' }`}
        >
          <Text className='text-white text-center text-lg font-rubik-bold'>
            {loading ? 'Updating...' : 'Update Profile'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

export default EditProfile