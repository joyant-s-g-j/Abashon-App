import { View, Text, TouchableOpacity, ScrollView, TextInput, Modal, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import Header from '@/components/Header'

interface AddButtonProps {
  onPress: () => void;
}

type Category = {
  _id: number;
  name: string;
  isActive: boolean;
};

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
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [newCategory, setNewCategory] = useState({
    name: '',
  })

  const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/api/categories`)
      const result = await response.json()

      if(result.success) {
        setCategories(result.data)
      } else {
        Alert.alert('Error', 'Failed to load categories')
      }
    } catch (error) {
      console.error('Error loading categories:', error)
      Alert.alert('Error', 'Failed to connect to server')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddCategory = async () => {
    if(!newCategory.name.trim()) {
      Alert.alert('Error', 'Category name is required')
      return
    }
    setIsLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/api/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newCategory.name.trim() })
      })

      const result = await response.json()

      if(result.success) {
        setCategories(prev => [...prev, result.data])
        setNewCategory({ name: '' })
        setShowAddModal(false)
        Alert.alert('Success', result.message || 'Category added successfully!')
      } else {
        Alert.alert('Error', result.message || 'Failed to add category')
      }
    } catch (error) {
      console.error('Error adding category:', error)
      Alert.alert('Error', 'Failed to connect to server')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateCategory = async () => {
    if(!selectedCategory?.name?.trim()) {
      Alert.alert('Error', 'Category name is required')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/api/categories/${selectedCategory._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: selectedCategory.name.trim() })
      })

      const result = await response.json()

      if(result.success) {
        setCategories(prev => 
          prev.map(cat => 
            cat._id === selectedCategory._id ? result.data : cat
          )
        )
        setShowEditModal(false)
        setSelectedCategory(null)
        Alert.alert('Success', result.message || "Category updated successfully!")
      } else {
        Alert.alert('Error', result.message || 'Failed to update category')
      }
    } catch (error) {
      console.error('Error updating category:', error)
      Alert.alert('Error', 'Failed to connect to server')
    } finally {
      setIsLoading(false)
    }
  }

  const openEditModal = (category: any) => {
    setSelectedCategory({...category})
    setShowEditModal(true)
  }

  const cancelAddModal = () => {
    setNewCategory({ name: '' })
    setShowAddModal(false)
  }

  const cancelEditModal = () => {
    setSelectedCategory(null)
    setShowEditModal(false)
  }

  const filteredCategories = categories.filter((category: any) => 
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) 
  )
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
        {/* Stats Header */}
        <View className='flex-row justify-between mb-6'>
          <View className='bg-white rounded-xl p-4 flex-1 mr-2 shadow-sm'>
            <Text className='text-2xl font-rubik-bold text-black-300'>{categories.length}</Text>
            <Text className='text-sm font-rubik text-black-200'>Total Categories</Text>
          </View>
          <View className='bg-white rounded-xl p-4 flex-1 ml-2 shadow-sm'>
            <Text className='text-2xl font-rubik-bold text-green-600'>
              {categories.filter((cat: any) => cat.isActive).length}
            </Text>
            <Text className='text-sm font-rubik text-black-200'>Active Categories</Text>
          </View>
        </View>
        {/* Categories List */}
        <View>
          <Text className='text-lg font-rubik-semibold text-black-300 mb-4'>
            All Categories ({filteredCategories.length})
          </Text>
          {isLoading ? (
            <View className='bg-white rounded-xl p-8 items-center justify-center shadow-sm'>
              <Text className='text-primary-300 font-rubik-medium'>Loading categories</Text>
            </View>
          ) : filteredCategories.length === 0 ? (
            <View className='bg-white rounded-xl p-8 items-center justify-center shadow-sm'>
              <Text className='text-3xl mb-2'>📂</Text>
              <Text className='text-black-300 font-rubik-medium mb-1'>No categories found</Text>
              <Text className='text-black-200 font-rubik text-center'>
                {searchQuery ? 'Try adjusting your search' : 'Add your first category to get started' }
              </Text>
            </View>
          ) : (
            filteredCategories.map((category: any, index) => (
              <View key={index} className='bg-white rounded-xl p-6 mb-4 shadow-sm border border-gray-100'>
                <View className='flex-row items-center justify-between mb-4'>
                  <View className='flex-row items-center flex-1'>
                    <View className='size-12 bg-primary-100 rounded-xl items-center justify-center mr-4'>
                      <Text className='text-2xl'>📂</Text>
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
                    onPress={() => openEditModal(category)}
                    disabled={isLoading}
                    className='flex-1 bg-blue-50 py-3 px-4 rounded-lg mr-2'
                  >
                    <Text className='text-center text-primary-300 font-rubik-semibold text-sm'>Edit</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    className='flex-1 bg-red-50 py-3 px-4 rounded-lg ml-2'
                  >
                    <Text className='text-center text-red-700 font-rubik-semibold text-sm'>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Add Category Modal */}
        <Modal
          visible={showAddModal}
          animationType='slide'
          transparent={true}
          onRequestClose={cancelAddModal}
        >
          <View className='flex-1 justify-end bg-black/50'>
            <View className='bg-white rounded-t-3xl p-6 max-h-[80%]'>
              <View className='flex-row items-center justify-between mb-6'>
                <Text className='text-xl font-rubik-bold text-black-300'>Add New Category</Text>
                <TouchableOpacity onPress={cancelAddModal}>
                  <Text className='text-black-200 text-4xl'>×</Text>
                </TouchableOpacity>
              </View> 

              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Category Name */}
                <View className='mb-4'>
                  <Text className='text-base font-rubik-semibold text-black-300 mb-2'>Category Name *</Text>
                  <TextInput
                    className='bg-gray-100 rounded-xl px-4 py-3 text-base font-rubik text-black-300'
                    placeholder='Enter category name'
                    value={newCategory.name}
                    onChangeText={(text) => setNewCategory(prev => ({ ...prev, name: text}))}
                    editable={!isLoading}
                  />
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
                    onPress={handleAddCategory}
                  >
                    <Text className='text-center font-rubik-bold text-white'>
                      {isLoading ? 'Adding...' : 'Add Category'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Edit Category Modal */}
        <Modal
          visible={showEditModal}
          animationType='slide'
          transparent={true}
          onRequestClose={cancelEditModal}
        >
          <View className='flex-1 justify-end bg-black/50'>
            <View className='bg-white rounded-t-3xl p-6 max-h-[80%]'>
              <View className='flex-row items-center justify-between mb-6'>
                <Text className='text-xl font-rubik-bold text-black-300'>Edit Category</Text>
                <TouchableOpacity onPress={cancelEditModal}>
                  <Text className='text-black-200 text-4xl'>×</Text>
                </TouchableOpacity>
              </View> 
              {selectedCategory && (
                <ScrollView showsVerticalScrollIndicator={false}>
                  {/* Category Name */}
                  <View className='mb-4'>
                    <Text className='text-base font-rubik-semibold text-black-300 mb-2'>Category Name *</Text>
                    <TextInput
                      className='bg-gray-100 rounded-xl px-4 py-3 text-base font-rubik text-black-300'
                      placeholder='Enter category name'
                      value={selectedCategory.name}
                      editable={!isLoading}
                      onChangeText={(text) =>
                        setSelectedCategory(prev =>
                          prev ? { ...prev, name: text } : prev
                        )
                      }
                    />
                  </View>

                  {/* Action Buttons */}
                  <View className='flex-row gap-3'>
                    <TouchableOpacity
                      onPress={cancelEditModal}
                      className='flex-1 bg-gray-100 py-4 rounded-xl'
                      disabled={isLoading}
                    >
                      <Text className='text-center font-rubik-semibold text-black-200'>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={handleUpdateCategory}
                      className='flex-1 bg-primary-300 py-4 rounded-xl'
                      disabled={isLoading}
                    >
                      <Text className='text-center font-rubik-bold text-white'>
                        {isLoading ? 'Updating...' : 'Update Category'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              )}  
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
    
  )
}

export default CategoryManagement