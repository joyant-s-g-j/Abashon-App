import { View, Text, TouchableOpacity, ScrollView, TextInput, Modal, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Header from '@/components/Header'
import SearchInput from '@/components/SearchInput';
import StatCard from '@/components/StatCard';
import ItemModal from '@/components/ItemModal';

interface AddButtonProps {
  onPress: () => void;
}

type Category = {
  _id: string;
  name: string;
  isActive: boolean;
};

export const AddButton: React.FC<AddButtonProps> = ({ onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    className="flex flex-row bg-primary-300 rounded-full size-11 items-center justify-center"
  >
    <Text className="text-white text-xl font-bold">+</Text>
  </TouchableOpacity>
);

const CategoryManagement = () => {
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

  const handleDeleteCategory = async (category: any) => {
    Alert.alert(
      'Delete Category',
      `Are you sure you want to delete "${category.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true)
            try {
              const response = await fetch(`${API_BASE_URL}/api/categories/${category._id}`, {
                method: 'DELETE'
              })
              const result = await response.json()

              if(result.success) {
                setCategories(prev => prev.filter(cat => cat._id !== category._id))
                Alert.alert('Success', result.message || 'Category deleted successfully!')
              } else {
                Alert.alert('Error', result.message || 'Failed to delete category')
              }
            } catch (error) {
              console.error('Error deleting category:', error)
              Alert.alert('Error', 'Failed to connect to server')
            } finally {
              setIsLoading(false)
            }
          }
        }
      ]
    )
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
        <SearchInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search Categories..."
        />
        {/* Stats Header */}
        <View className="flex-row justify-between mb-6">
          <StatCard
            value={categories.length}
            label="Total Categories"
            style="flex-1 mr-2"
          />
          <StatCard
            value={categories.filter((cat: any) => cat.isActive).length}
            label="Active Categories"
            valueColor="text-green-600"
            style="flex-1 ml-2"
          />
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
                    disabled={isLoading}
                    onPress={() => handleDeleteCategory(category)}
                    className='flex-1 bg-red-50 py-3 px-4 rounded-lg ml-2'
                  >
                    <Text className='text-center text-red-700 font-rubik-semibold text-sm'>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>

        <ItemModal
          visible={showAddModal}
          onClose={cancelAddModal}
          title='Category'
          nameValue={newCategory.name}
          onNameChange={text => setNewCategory(prev => ({ ...prev, name: text }))}
          onSubmit={handleAddCategory}
          progressButtonLabel='Adding'
          submitButtonLabel='Add Category'
          isLoading={isLoading}
        />

        <ItemModal
          visible={showEditModal}
          onClose={cancelEditModal}
          title='Category'
          nameValue={selectedCategory?.name ?? ''}
          onNameChange={text => setSelectedCategory(prev => (prev ? { ...prev, name: text } : prev ))}
          onSubmit={handleUpdateCategory}
          progressButtonLabel='Updating'
          submitButtonLabel='Update Category'
          isLoading={isLoading}
        />
      </ScrollView>
    </SafeAreaView>
    
  )
}

export default CategoryManagement