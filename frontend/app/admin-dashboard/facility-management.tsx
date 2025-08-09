import { View, Text, ImageSourcePropType, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/components/Header';
import { AddButton } from './category-management';

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
    <SafeAreaView>
      <Header title='Facility Management' backRoute='/admin-dashboard' rightIcon={<AddButton onPress={() => setShowAddModal(true)} />} />
    </SafeAreaView>
  )
}

export default FacilityManagement