import { View, Text, ImageSourcePropType, Alert, ScrollView } from 'react-native'
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
            value={facilities.filter((cat: any) => cat.isActive).length}
            label="Active Facilities"
            valueColor="text-green-600"
            style="flex-1 ml-2"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default FacilityManagement