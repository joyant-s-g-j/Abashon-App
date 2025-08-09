import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router'

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL

interface Category {
  _id: string;
  name: string;
}

const Filters = () => {
  const params = useLocalSearchParams<{filter?: string}>();
  const [selectedCategory, setSelectedCategory] = useState(params.filter || "All")
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_BASE_URL}/api/categories`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const result = await response.json()

      if(result.success && Array.isArray(result.data)) {
        setCategories(result.data)
      } else {
        throw new Error('Invalid response format')
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
      setError('Failed to load categories')
      setCategories([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleCategoryPress = (categoryName: string) => {
    if(selectedCategory === categoryName) {
      setSelectedCategory('All')
      router.setParams({filter: 'All'})
      return;
    }
    setSelectedCategory(categoryName)
    router.setParams({filter: categoryName})
  }

  if (isLoading) {
    return (
      <View className='mt-3 px-4'>
        <ActivityIndicator size="small" color="#0891b2" />
      </View>
    )
  }
  return (
    <ScrollView horizontal 
        showsHorizontalScrollIndicator={false}
        className='mt-3'
    >
      <TouchableOpacity
        onPress={() => handleCategoryPress('All')} 
        className={`flex flex-col items-start mr-4 px-4 py-2 rounded-full 
            ${selectedCategory === 'All' ? 'bg-primary-300' : 'bg-primary-100 border border-primary-200'}`}
      >
        <Text 
          className={`text-sm ${selectedCategory === 'All' ? 'text-white font-rubik-bold mt-0.5' : 'text-black-300 font-rubik'}`}
        >
          All
        </Text>
      </TouchableOpacity>
      {categories.map((item) => (
        <TouchableOpacity
            key={item._id}
            onPress={() => handleCategoryPress(item.name)} 
            className={`flex flex-col items-start mr-4 px-4 py-2 rounded-full 
                ${selectedCategory === item.name ? 'bg-primary-300' : 'bg-primary-100 border border-primary-200'}`}
            >
            <Text 
                className={`text-sm ${selectedCategory === item.name ? 'text-white font-rubik-bold mt-0.5' : 'text-black-300 font-rubik'}`}
            >
                {item.name}
            </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  )
}

export default Filters