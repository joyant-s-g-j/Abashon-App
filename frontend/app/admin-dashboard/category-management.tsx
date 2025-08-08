import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import Header from '@/components/Header'

interface AddButtonProps {
  onPress: () => void;
}

const AddButton: React.FC<AddButtonProps> = ({ onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    className="flex flex-row bg-primary-300 rounded-full size-11 items-center justify-center"
  >
    <Text className="text-white text-xl font-bold">+</Text>
  </TouchableOpacity>
);

const CategoryManagement = () => {
  const router = useRouter()
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState('')
  const [searchQuery, setSearchQuery] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    icon: '📂'
  })
  return (
    <SafeAreaView className='flex-1 bg-gray-50'>
      <Header title='Category Management' backRoute='/admin-dashboard' rightIcon={<AddButton onPress={() => setShowAddModal(true)} />} />
      <ScrollView
        className='flex-1 px-4'
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 32 }}
      >
        {/* Search Bar */}
        <View className='bg-white rounded-xl px-4 py-3 mb-6 shadow-md border border-gray-100'>
          <TextInput
            className='text-base font-rubik text-black-300'
            placeholder='Search Categories...'
          />
        </View>
      </ScrollView>
    </SafeAreaView>
    
  )
}

export default CategoryManagement