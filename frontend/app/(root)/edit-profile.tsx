import Header from '@/components/ReusableComponent/Header'
import icons from '@/constants/icons'
import images from '@/constants/images'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as ImagePicker from 'expo-image-picker'
import { useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
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

  const validateForm = () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter your name')
      return false
    }
    if (!formData.email.trim()) {
      Alert.alert('Error', 'Please enter your email')
      return false
    }
    if (!formData.phone.trim()) {
      Alert.alert('Error', 'Please enter your phone number')
      return false
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      Alert.alert('Error', 'Please enter a valid email address')
      return false
    } 
    return true
  }

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if(status !== 'granted') {
        Alert.alert('Permission Required', 'Sorry, we need camera roll permissions to change your profile picture.')
        return
      }

      const result = await ImagePicker.launchImageLibraryAsync({
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

  const handleUpdateProfile = async () => {
    if (!validateForm()) return
    setLoading(true)
    try {
      const token = await AsyncStorage.getItem('token')
      if(!token) {
        Alert.alert('Error', 'Authentication token not found')
        router.replace('/sign-in')
        return
      }

      const storedUser = await AsyncStorage.getItem('user')
      const currentUser = storedUser ? JSON.parse(storedUser) : null

      const requestBody: {
        name: string;
        email: string;
        phone: string;
        profilePic: string;
        role?: string
      } = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        profilePic: formData.profilePic
      }

      if(currentUser?.role === 'admin') {
        requestBody.role = formData.role
      }

      const response  = await fetch(`${API_BASE_URL}/api/auth/update-profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      })

      const data = await response.json()

      if(response.ok && data.success) {
        await AsyncStorage.setItem('user', JSON.stringify(data.user))

        setUser(data.user)
        setFormData({
          name: data.user.name || '',
          email: data.user.email || '',
          phone: data.user.phone || '',
          role: data.user.role || '',
          profilePic: data.user.profilePic || ''
        })
        Alert.alert(
          'Success',
          'Profile updated successfully!',
          [
            {
              text: 'OK',
              onPress: () => router.back()
            }
          ]
        )
      } else {
        Alert.alert('Error', data.message || 'Failed to update Profile')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      if (error instanceof TypeError && error.message.includes('Network request failed')) {
        Alert.alert('Error', 'Network error. Please check your internet connection.')
      } else {
        Alert.alert('Error', 'Failed to update profile. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const isAdmin = user?.role === 'admin'
  return (
    <SafeAreaView className='flex-1 bg-white'>
      <Header title='Edit Profile' backRoute='/profile' />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
        className='px-4'
      >
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
          {!isAdmin && (
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
          )}
          
        </View>

        {/* update button */}
        <TouchableOpacity
          onPress={handleUpdateProfile}
          disabled={loading}
          className="mt-8 py-4 rounded-lg bg-primary-300"
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