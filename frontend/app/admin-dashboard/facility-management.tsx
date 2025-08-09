import { View, Text, ImageSourcePropType, Alert, ScrollView, TouchableOpacity, Modal, TextInput, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/components/Header';
import { AddButton } from './category-management';
import SearchInput from '@/components/SearchInput';
import StatCard from '@/components/StatCard';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system'

type Facility = {
  _id: string;
  name: string;
  icon: ImageSourcePropType;
  isActive?: boolean
}

const FacilityManagement = () => {
  const [facilities, setFacilities] = useState<Facility[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null)
  const [newFacility, setNewFacility] = useState({
    name: '',
    icon: '',
    imageUri: null as string | null,
    iconBase64: null as string | null
  })
  const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL

  useEffect(() => {
    loadFacilities()
  }, [])

  const loadFacilities = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/api/facilities`)
      const result = await response.json()

      if(result.success) {
        setFacilities(result.data)
      } else {
        Alert.alert('Error', 'Faild to load facilities')
      }
    } catch (error) {
      console.error('Error loading facilities', error)
      Alert.alert('Error', 'Faild to connect to server')
    } finally {
      setIsLoading(false)
    }
  }

  const pickImage = async () => {
    try {
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant camera roll permissions to select images')
        return
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1], // Square aspect ratio
        quality: 0.8,
        base64: true
      })

      if(!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri
        try {
          const base64 = await FileSystem.readAsStringAsync(imageUri, {
            encoding: FileSystem.EncodingType.Base64,
          })

          const base64WithPrefix = `data:image/jpeg;base64,${base64}`

          setNewFacility(prev => ({
            ...prev,
            imageUri: imageUri,
            iconBase64: base64WithPrefix,
            icon: base64WithPrefix
          }))
        } catch (error) {
          console.error('Error converting image to base64:', error)
          Alert.alert('Error', 'Failed to process image')
        }
      }
    } catch (error) {
      console.error('Error picking image:', error)
      Alert.alert('Error', 'Failed to pick image')
    }
  }

  const handleAddFacility = async () => {
    if(!newFacility.icon.trim()) {
      Alert.alert('Error', 'Facility icon is required')
      return
    }
    if(!newFacility.name.trim()) {
      Alert.alert('Error', 'Facility name is required')
      return
    }
    setIsLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/api/facilities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newFacility.name.trim(),
          icon: newFacility.icon.trim()
        })
      })
      const result = await response.json()
      if(response.ok && result.success) {
        setFacilities(prev => [...prev, result.data])
        setNewFacility({ name: '', icon: '', imageUri: null, iconBase64: null})
        setShowAddModal(false)
        Alert.alert('Success', 'Facility added successfully')
      } else {
        Alert.alert('Error', result.message || 'Failed to add facility')
      }
    } catch (error) {
      console.error('Error adding facility:', error)
      Alert.alert('Error', 'Failed to connect to server')
    } finally {
      setIsLoading(false)
    }
  }

  const cancelAddModal = () => {
    setNewFacility({ name: '', icon: '', imageUri: null, iconBase64: null })
    setShowAddModal(false)
  }

  const filteredFacilities = facilities.filter((facility: any) => 
    facility.name.toLowerCase().includes(searchQuery.toLowerCase())
  )
  return (
    <SafeAreaView className='flex-1 bg-gray-50'>
      <Header title='Facility Management' backRoute='/admin-dashboard' rightIcon={<AddButton onPress={() => setShowAddModal(true)} />} />
      <ScrollView
        className='flex-1 px-4'
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 32 }}
      >
        <SearchInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search Facilities..."
        />
        <View className="flex-row justify-between mb-6">
          <StatCard
            value={facilities.length}
            label="Total Facilities"
            style="flex-1 mr-2"
          />
          <StatCard
            value={facilities.filter((faci: any) => faci.isActive).length}
            label="Active Facilities"
            valueColor="text-primary-300"
            style="flex-1 ml-2"
          />
        </View>

        <View>
          <Text className='text-lg font-rubik-semibold text-black-300 mb-4'>
            All Facilities ({filteredFacilities.length})
          </Text>
          {isLoading ? (
            <View className='bg-white rounded-xl p-8 items-center justify-center shadow-sm'>
              <Text className='text-primary-300 font-rubik-medium'>Loading facilities</Text>
            </View>
          ) : filteredFacilities.length === 0 ? (
            <View className='bg-white rounded-xl p-8 items-center justify-center shadow-sm'>
              <Text className='text-3xl mb-2'>🏊</Text>
              <Text className='text-black-300 font-rubik-medium mb-1'>No Facilities found</Text>
              <Text className='text-black-200 font-rubik text-center'>
                {searchQuery ? 'Try adjusting your search' : 'Add your first facility to get started' }
              </Text>
            </View>
          ) : (
            filteredFacilities.map((facility: any, index) => (
              <View key={index} className='bg-white rounded-xl p-6 mb-4 shadow-sm border border-gray-100'>
                <View className='flex-row items-center justify-between mb-4'>
                  <View className='flex-row items-center flex-1'>
                    <View className='size-12 bg-primary-100 rounded-xl items-center justify-center mr-4'>
                      <Image
                        source={{ uri: facility.icon }}
                        className='size-8'
                        resizeMode="contain"
                      />
                    </View>
                    <View className='flex-1'>
                      <Text className='text-lg font-rubik-semibold text-black-300'>{facility.name}</Text>
                      <Text className='text-xs font-rubik text-black-200 mt-1'>ID: {facility._id}</Text>
                      {facility.createdAt && (
                        <Text className='text-xs font-rubik text-black-200 mt-1'>
                          Created: {new Date(facility.createdAt).toLocaleDateString()}
                        </Text>
                      )}
                    </View>
                  </View>
                </View>

                {/* Action Buttons */}
                <View className='flex-row justify-between items-center pt-4 border-t border-gray-100'>
                  <TouchableOpacity
                    // onPress={() => openEditModal(category)}
                    disabled={isLoading}
                    className='flex-1 bg-blue-50 py-3 px-4 rounded-lg mr-2'
                  >
                    <Text className='text-center text-primary-300 font-rubik-semibold text-sm'>Edit</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    disabled={isLoading}
                    // onPress={() => handleDeleteCategory(category)}
                    className='flex-1 bg-red-50 py-3 px-4 rounded-lg ml-2'
                  >
                    <Text className='text-center text-red-700 font-rubik-semibold text-sm'>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Add facility modal */}
        <Modal
          visible={showAddModal}
          animationType='slide'
          transparent={true}
          onRequestClose={cancelAddModal}
        >
          <View className='flex-1 justify-end bg-black/50'>
            <View className='bg-white rounded-t-3xl p-6 max-h-[80%]'>
              <View className='flex-row items-center justify-between mb-6'>
                <Text className='text-xl font-rubik-bold text-black-300'>Add New Facility</Text>
                <TouchableOpacity onPress={cancelAddModal}>
                  <Text className='text-black-200 text-4xl'>×</Text>
                </TouchableOpacity>
              </View> 

              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Facility Name */}
                <View className='mb-4'>
                  <Text className='text-base font-rubik-semibold text-black-300 mb-2'>Facility Name *</Text>
                  <TextInput
                    className='bg-gray-100 rounded-xl px-4 py-3 text-base font-rubik text-black-300'
                    placeholder='Enter facility name'
                    value={newFacility.name}
                    onChangeText={(text) => setNewFacility(prev => ({ ...prev, name: text}))}
                    editable={!isLoading}
                  />
                </View>

                <View className='mb-6'>
                  <Text className='text-base font-rubik-semibold text-black-300 mb-2'>Facility Icon *</Text>
                  
                  {/* Image Preview */}
                  {newFacility.imageUri && (
                    <View className='mb-4'>
                      <Image 
                        source={{ uri: newFacility.imageUri }} 
                        className='w-24 h-24 rounded-xl'
                        resizeMode='cover'
                      />
                    </View>
                  )}
                  
                  {/* Image Picker Button */}
                  <TouchableOpacity
                    onPress={pickImage}
                    disabled={isLoading}
                    className='bg-gray-100 rounded-xl px-4 py-3 flex-row items-center justify-center'
                  >
                    <Text className='text-base font-rubik text-black-300 mr-2'>
                      {newFacility.imageUri ? 'Change Image' : 'Select Image'}
                    </Text>
                    <Text className='text-lg'>📷</Text>
                  </TouchableOpacity>
                </View>

                {/* Action Buttons */}
                <View className='flex-row gap-3'>
                  <TouchableOpacity
                    onPress={cancelAddModal}
                    disabled={isLoading}
                    className='flex-1 bg-gray-100 py-4 rounded-xl'
                  >
                    <Text className='text-center font-rubik-semibold text-black-200'>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className='flex-1 bg-primary-300 py-4 rounded-xl'
                    disabled={isLoading}
                    onPress={handleAddFacility}
                  >
                    <Text className='text-center font-rubik-bold text-white'>
                      {isLoading ? 'Adding...' : 'Add Facility'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  )
}

export default FacilityManagement