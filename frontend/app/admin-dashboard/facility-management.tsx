import { View, Text, ImageSourcePropType, Alert, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/components/Header';
import { AddButton } from './category-management';
import SearchInput from '@/components/SearchInput';
import StatCard from '@/components/StatCard';

type Facility = {
  _id: string;
  name: string;
  icon: ImageSourcePropType
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
    icon: ''
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
            filteredFacilities.map((category: any, index) => (
              <View key={index} className='bg-white rounded-xl p-6 mb-4 shadow-sm border border-gray-100'>
                <View className='flex-row items-center justify-between mb-4'>
                  <View className='flex-row items-center flex-1'>
                    <View className='size-12 bg-primary-100 rounded-xl items-center justify-center mr-4'>
                      <Text className='text-2xl'>🏊</Text>
                    </View>
                    <View className='flex-1'>
                      <Text className='text-lg font-rubik-semibold text-black-300'>{category.name}</Text>
                      <Text className='text-xs font-rubik text-black-200 mt-1'>ID: {category._id}</Text>
                      {category.createdAt && (
                        <Text className='text-xs font-rubik text-black-200 mt-1'>
                          Created: {new Date(category.createdAt).toLocaleDateString()}
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
      </ScrollView>
    </SafeAreaView>
  )
}

export default FacilityManagement