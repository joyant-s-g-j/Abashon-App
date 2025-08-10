import { View, Text, Alert, ScrollView, TouchableOpacity, Modal, TextInput, Image, Switch } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchInput from '@/components/SearchInput';;
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system'
import { AddButton, Header, StatCard } from '@/components/ReusableComponent';
// import * as Location from 'expo-location';

type Category = {
  _id: string;
  name: string;
}

type Facility = {
  _id: string;
  name: string;
  icon: string;
}

type User = {
  _id: string;
  name: string;
  email: string;
}

type Property = {
  _id: string;
  name: string;
  thumnailImage: string;
  type: Category;
  averageRating: number;
  specifications: {
    bed: string;
    bath: string;
    area: string;
  };
  owner: User;
  description: string;
  facilities: Facility;
  galleryImages: string[];
  location: {
    address: string;
    latitude: number;
    longtitude: number;
  };
  price: number;
  isFeatured: boolean;
  createdAt: string;
}

const PropertyManagement = () => {
  const [properties, setProperties] = useState<Property[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [facilities, setFacilities] = useState<Facility[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [editStep, setEditStep] = useState(1)

  // New Property State
  const [newProperty, setNewProperty] = useState({
    name: '',
    thumnailImage: '',
    thumbnailUri: null as string | null,
    type: '',
    specifications: {
      bed: '',
      bath: '',
      area: ''
    },
    owner: '',
    description: '',
    facilities: '',
    galleryImages: [] as string[],
    galleryUris: [] as string[],
    location: {
      address: '',
      latitude: 0,
      longtitude: 0
    },
    price: '',
    isFeatured: false
  })

  // Edit Property State
  const [editProperty, setEditProperty] = useState({
    name: '',
    thumnailImage: '',
    thumbnailUri: null as string | null,
    originalThumbnail: '',
    type: '',
    specifications: {
      bed: '',
      bath: '',
      area: ''
    },
    owner: '',
    description: '',
    facilities: '',
    galleryImages: [] as string[],
    galleryUris: [] as string[],
    originalGalleryImages: [] as string[],
    location: {
      address: '',
      latitude: 0,
      longtitude: 0
    },
    price: '',
    isFeatured: false
  })

  const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL

  useEffect(() => {
    loadProperties()
    loadCategories()
    loadFacilities()
    loadUsers()
  }, [])

  const loadProperties = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/api/properties`)
      const result = await response.json()
      if(result.success) {
        setProperties(result.data)
      } else {
        Alert.alert('Error', 'Failed to load properties')
      }
    } catch (error) {
      console.error('Error loading properties', error)
      Alert.alert('Error', 'Failed to connect to server')
    } finally {
      setIsLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/categories`)
      const result = await response.json()
      if(result.success) {
        setCategories(result.data)
      }
    } catch (error) {
      console.error('Error loading categories', error)
    }
  }

  const loadFacilities = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/facilities`)
      const result = await response.json()
      if(result.success) {
        setFacilities(result.data)
      }
    } catch (error) {
      console.error('Error loading facilities', error)
    }
  }

  const loadUsers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/users`)
      const result = await response.json()
      if(result.success) {
        setUsers(result.data)
      }
    } catch (error) {
      console.error('Error loading users', error)
    }
  }

  const pickThumbnailImage = async (isEdit = false) => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant camera roll permissions to select images')
        return
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
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

          if(isEdit) {
            setEditProperty(prev => ({
              ...prev,
              thumbnailUri: imageUri,
              thumnailImage: base64WithPrefix
            }))
          } else {
            setNewProperty(prev => ({
              ...prev,
              thumbnailUri: imageUri,
              thumnailImage: base64WithPrefix
            }))
          }
        } catch (error) {
          Alert.alert('Error', 'Failed to process image')
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image')
    }
  }

  const pickGalleryImages = async (isEdit = false) => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant camera roll permissions to select images')
        return
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
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

          if(isEdit) {
            setEditProperty(prev => ({
              ...prev,
              galleryUris: [...prev.galleryUris, imageUri],
              galleryImages: [...prev.galleryImages, base64WithPrefix]
            }))
          } else {
            setNewProperty(prev => ({
              ...prev,
              galleryUris: [...prev.galleryUris, imageUri],
              galleryImages: [...prev.galleryImages, base64WithPrefix]
            }))
          }
        } catch (error) {
          Alert.alert('Error', 'Failed to process image')
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image')
    }
  }

  // const getCurrentLocation = async (isEdit = false) => {
  //   try {
  //     const { status } = await Location.requestForegroundPermissionsAsync()
  //     if (status !== 'granted') {
  //       Alert.alert('Permission needed', 'Please grant location permissions')
  //       return
  //     }

  //     const location = await Location.getCurrentPositionAsync({})
  //     const address = await Location.reverseGeocodeAsync({
  //       latitude: location.coords.latitude,
  //       longitude: location.coords.longitude
  //     })

  //     const fullAddress = address[0] ? 
  //       `${address[0].street || ''} ${address[0].city || ''} ${address[0].region || ''}`.trim() :
  //       'Current Location'

  //     if(isEdit) {
  //       setEditProperty(prev => ({
  //         ...prev,
  //         location: {
  //           address: fullAddress,
  //           latitude: location.coords.latitude,
  //           longtitude: location.coords.longitude
  //         }
  //       }))
  //     } else {
  //       setNewProperty(prev => ({
  //         ...prev,
  //         location: {
  //           address: fullAddress,
  //           latitude: location.coords.latitude,
  //           longtitude: location.coords.longitude
  //         }
  //       }))
  //     }
  //   } catch (error) {
  //     Alert.alert('Error', 'Failed to get location')
  //   }
  // }

  const removeGalleryImage = (index: number, isEdit = false) => {
    if(isEdit) {
      setEditProperty(prev => ({
        ...prev,
        galleryUris: prev.galleryUris.filter((_, i) => i !== index),
        galleryImages: prev.galleryImages.filter((_, i) => i !== index)
      }))
    } else {
      setNewProperty(prev => ({
        ...prev,
        galleryUris: prev.galleryUris.filter((_, i) => i !== index),
        galleryImages: prev.galleryImages.filter((_, i) => i !== index)
      }))
    }
  }

  const validateStep = (step: number, isEdit = false) => {
    const data = isEdit ? editProperty : newProperty
    
    switch(step) {
      case 1:
        if(!data.name.trim()) {
          Alert.alert('Error', 'Property name is required')
          return false
        }
        if(!data.thumnailImage) {
          Alert.alert('Error', 'Thumbnail image is required')
          return false
        }
        if(!data.type) {
          Alert.alert('Error', 'Property type is required')
          return false
        }
        return true
      
      case 2:
        if(!data.specifications.bed.trim()) {
          Alert.alert('Error', 'Number of beds is required')
          return false
        }
        if(!data.specifications.bath.trim()) {
          Alert.alert('Error', 'Number of baths is required')
          return false
        }
        if(!data.specifications.area.trim()) {
          Alert.alert('Error', 'Area is required')
          return false
        }
        if(!data.description.trim()) {
          Alert.alert('Error', 'Description is required')
          return false
        }
        return true
      
      case 3:
        if(!data.owner) {
          Alert.alert('Error', 'Owner is required')
          return false
        }
        if(!data.facilities) {
          Alert.alert('Error', 'Facility is required')
          return false
        }
        if(!data.price.trim()) {
          Alert.alert('Error', 'Price is required')
          return false
        }
        return true
      
      case 4:
        if(!data.location.address.trim()) {
          Alert.alert('Error', 'Address is required')
          return false
        }
        return true
      
      default:
        return true
    }
  }

  const nextStep = (isEdit = false) => {
    const currentStepNum = isEdit ? editStep : currentStep
    if(validateStep(currentStepNum, isEdit)) {
      if(isEdit) {
        setEditStep(prev => Math.min(prev + 1, 4))
      } else {
        setCurrentStep(prev => Math.min(prev + 1, 4))
      }
    }
  }

  const prevStep = (isEdit = false) => {
    if(isEdit) {
      setEditStep(prev => Math.max(prev - 1, 1))
    } else {
      setCurrentStep(prev => Math.max(prev - 1, 1))
    }
  }

  const handleAddProperty = async () => {
    if(!validateStep(4, false)) return

    setIsLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/api/properties`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newProperty.name.trim(),
          thumnailImage: newProperty.thumnailImage,
          type: newProperty.type,
          specifications: newProperty.specifications,
          owner: newProperty.owner,
          description: newProperty.description.trim(),
          facilities: newProperty.facilities,
          galleryImages: newProperty.galleryImages,
          location: newProperty.location,
          price: parseFloat(newProperty.price),
          isFeatured: newProperty.isFeatured
        })
      })
      const result = await response.json()
      
      if(response.ok && result.success) {
        setProperties(prev => [...prev, result.data])
        resetNewProperty()
        setShowAddModal(false)
        setCurrentStep(1)
        Alert.alert('Success', 'Property added successfully')
      } else {
        Alert.alert('Error', result.message || 'Failed to add property')
      }
    } catch (error) {
      console.error('Error adding property:', error)
      Alert.alert('Error', 'Failed to connect to server')
    } finally {
      setIsLoading(false)
    }
  }

  const openEditModal = (property: Property) => {
    setSelectedProperty(property)
    setEditProperty({
      name: property.name,
      thumnailImage: property.thumnailImage,
      thumbnailUri: property.thumnailImage,
      originalThumbnail: property.thumnailImage,
      type: property.type._id,
      specifications: property.specifications,
      owner: property.owner._id,
      description: property.description,
      facilities: property.facilities._id,
      galleryImages: [...property.galleryImages],
      galleryUris: [...property.galleryImages],
      originalGalleryImages: [...property.galleryImages],
      location: property.location,
      price: property.price.toString(),
      isFeatured: property.isFeatured
    })
    setEditStep(1)
    setShowEditModal(true)
  }

  const handleEditProperty = async () => {
    if(!selectedProperty || !validateStep(4, true)) return

    setIsLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/api/properties/${selectedProperty._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editProperty.name.trim(),
          thumnailImage: editProperty.thumnailImage,
          originalThumbnail: editProperty.originalThumbnail,
          type: editProperty.type,
          specifications: editProperty.specifications,
          owner: editProperty.owner,
          description: editProperty.description.trim(),
          facilities: editProperty.facilities,
          galleryImages: editProperty.galleryImages,
          originalGalleryImages: editProperty.originalGalleryImages,
          location: editProperty.location,
          price: parseFloat(editProperty.price),
          isFeatured: editProperty.isFeatured
        })
      })
      const result = await response.json()
      
      if(response.ok && result.success) {
        setProperties(prev => 
          prev.map(property => 
            property._id === selectedProperty._id ? result.data : property
          )
        )
        setShowEditModal(false)
        setSelectedProperty(null)
        resetEditProperty()
        setEditStep(1)
        Alert.alert('Success', 'Property updated successfully')
      } else {
        Alert.alert('Error', result.message || 'Failed to update property')
      }
    } catch (error) {
      console.error('Error updating property:', error)
      Alert.alert('Error', 'Failed to connect to server')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteProperty = (property: Property) => {
    Alert.alert(
      'Delete Property',
      `Are you sure you want to delete "${property.name}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => confirmDeleteProperty(property) }
      ]
    )
  }

  const confirmDeleteProperty = async (property: Property) => {
    setIsLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/api/properties/${property._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          thumnailImage: property.thumnailImage,
          galleryImages: property.galleryImages
        })
      })
      const result = await response.json()
      
      if(response.ok && result.success) {
        setProperties(prev => prev.filter(p => p._id !== property._id))
        Alert.alert('Success', 'Property deleted successfully')
      } else {
        Alert.alert('Error', result.message || 'Failed to delete property')
      }
    } catch (error) {
      console.error('Error deleting property:', error)
      Alert.alert('Error', 'Failed to connect to server')
    } finally {
      setIsLoading(false)
    }
  }

  const resetNewProperty = () => {
    setNewProperty({
      name: '',
      thumnailImage: '',
      thumbnailUri: null,
      type: '',
      specifications: { bed: '', bath: '', area: '' },
      owner: '',
      description: '',
      facilities: '',
      galleryImages: [],
      galleryUris: [],
      location: { address: '', latitude: 0, longtitude: 0 },
      price: '',
      isFeatured: false
    })
  }

  const resetEditProperty = () => {
    setEditProperty({
      name: '',
      thumnailImage: '',
      thumbnailUri: null,
      originalThumbnail: '',
      type: '',
      specifications: { bed: '', bath: '', area: '' },
      owner: '',
      description: '',
      facilities: '',
      galleryImages: [],
      galleryUris: [],
      originalGalleryImages: [],
      location: { address: '', latitude: 0, longtitude: 0 },
      price: '',
      isFeatured: false
    })
  }

  const cancelAddModal = () => {
    resetNewProperty()
    setCurrentStep(1)
    setShowAddModal(false)
  }

  const cancelEditModal = () => {
    resetEditProperty()
    setEditStep(1)
    setSelectedProperty(null)
    setShowEditModal(false)
  }

  const filteredProperties = properties.filter((property: any) => 
    property.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const renderStepIndicator = (step: number, isEdit = false) => {
    const currentStepNum = isEdit ? editStep : currentStep
    return (
      <View className='flex-row items-center justify-between mb-6'>
        {[1, 2, 3, 4].map((stepNum) => (
          <View key={stepNum} className='flex-row items-center flex-1'>
            <View className={`w-8 h-8 rounded-full items-center justify-center ${
              stepNum <= currentStepNum ? 'bg-primary-300' : 'bg-gray-300'
            }`}>
              <Text className={`font-rubik-semibold ${
                stepNum <= currentStepNum ? 'text-white' : 'text-gray-600'
              }`}>
                {stepNum}
              </Text>
            </View>
            {stepNum < 4 && (
              <View className={`flex-1 h-0.5 mx-2 ${
                stepNum < currentStepNum ? 'bg-primary-300' : 'bg-gray-300'
              }`} />
            )}
          </View>
        ))}
      </View>
    )
  }

  const renderStep1 = (isEdit = false) => {
    const data = isEdit ? editProperty : newProperty
    const setData = isEdit ? setEditProperty : setNewProperty

    return (
      <View>
        <Text className='text-lg font-rubik-bold text-black-300 mb-4'>Basic Information</Text>
        
        {/* Property Name */}
        <View className='mb-4'>
          <Text className='text-base font-rubik-semibold text-black-300 mb-2'>Property Name *</Text>
          <TextInput
            className='bg-gray-100 rounded-xl px-4 py-3 text-base font-rubik text-black-300'
            placeholder='Enter property name'
            value={data.name}
            onChangeText={(text) => setData((prev: any) => ({ ...prev, name: text }))}
            editable={!isLoading}
          />
        </View>

        {/* Thumbnail Image */}
        <View className='mb-4'>
          <Text className='text-base font-rubik-semibold text-black-300 mb-2'>Thumbnail Image *</Text>
          {data.thumbnailUri && (
            <View className='mb-4'>
              <Image 
                source={{ uri: data.thumbnailUri }} 
                className='w-full h-40 rounded-xl'
                resizeMode='cover'
              />
            </View>
          )}
          <TouchableOpacity
            onPress={() => pickThumbnailImage(isEdit)}
            disabled={isLoading}
            className='bg-gray-100 rounded-xl px-4 py-3 flex-row items-center justify-center'
          >
            <Text className='text-base font-rubik text-black-300 mr-2'>
              {data.thumbnailUri ? 'Change Image' : 'Select Thumbnail'}
            </Text>
            <Text className='text-lg'>🏠</Text>
          </TouchableOpacity>
        </View>

        {/* Property Type */}
        <View className='mb-6'>
          <Text className='text-base font-rubik-semibold text-black-300 mb-2'>Property Type *</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className='flex-row'>
            {categories.map((category) => (
              <TouchableOpacity
                key={category._id}
                onPress={() => setData((prev: any)=> ({ ...prev, type: category._id }))}
                className={`mr-3 px-4 py-2 rounded-lg border ${
                  data.type === category._id 
                    ? 'bg-primary-300 border-primary-300' 
                    : 'bg-white border-gray-300'
                }`}
              >
                <Text className={`font-rubik-medium ${
                  data.type === category._id ? 'text-white' : 'text-black-300'
                }`}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    )
  }

  const renderStep2 = (isEdit = false) => {
    const data = isEdit ? editProperty : newProperty
    const setData = isEdit ? setEditProperty : setNewProperty

    return (
      <>
        <Text className='text-lg font-rubik-bold text-black-300 mb-4'>Specifications & Details</Text>
        
        {/* Specifications Row */}
        <View className='flex-row gap-3 mb-4'>
          <View className='flex-1'>
            <Text className='text-base font-rubik-semibold text-black-300 mb-2'>Beds *</Text>
            <TextInput
              className='bg-gray-100 rounded-xl px-4 py-3 text-base font-rubik text-black-300'
              placeholder='e.g. 3'
              value={data.specifications.bed}
              onChangeText={(text) => setData((prev: any) => ({ 
                ...prev, 
                specifications: { ...prev.specifications, bed: text }
              }))}
              keyboardType='numeric'
              editable={!isLoading}
            />
          </View>
          <View className='flex-1'>
            <Text className='text-base font-rubik-semibold text-black-300 mb-2'>Baths *</Text>
            <TextInput
              className='bg-gray-100 rounded-xl px-4 py-3 text-base font-rubik text-black-300'
              placeholder='e.g. 2'
              value={data.specifications.bath}
              onChangeText={(text) => setData((prev: any) => ({ 
                ...prev, 
                specifications: { ...prev.specifications, bath: text }
              }))}
              keyboardType='numeric'
              editable={!isLoading}
            />
          </View>
          <View className='flex-1'>
            <Text className='text-base font-rubik-semibold text-black-300 mb-2'>Area *</Text>
            <TextInput
              className='bg-gray-100 rounded-xl px-4 py-3 text-base font-rubik text-black-300'
              placeholder='sq ft'
              value={data.specifications.area}
              onChangeText={(text) => setData((prev: any) => ({ 
                ...prev, 
                specifications: { ...prev.specifications, area: text }
              }))}
              editable={!isLoading}
            />
          </View>
        </View>

        {/* Description */}
        <View className='mb-6'>
          <Text className='text-base font-rubik-semibold text-black-300 mb-2'>Description *</Text>
          <TextInput
            className='bg-gray-100 rounded-xl px-4 py-3 text-base font-rubik text-black-300 h-32'
            placeholder='Enter property description...'
            value={data.description}
            onChangeText={(text) => setData((prev: any) => ({ ...prev, description: text }))}
            multiline
            textAlignVertical='top'
            editable={!isLoading}
          />
        </View>
      </>
    )
  }

  const renderStep3 = (isEdit = false) => {
    const data = isEdit ? editProperty : newProperty
    const setData = isEdit ? setEditProperty : setNewProperty

    return (
      <>
        <Text className='text-lg font-rubik-bold text-black-300 mb-4'>Owner & Facilities</Text>
        
        {/* Owner Selection */}
        <View className='mb-4'>
          <Text className='text-base font-rubik-semibold text-black-300 mb-2'>Owner *</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className='flex-row'>
            {users.map((user) => (
              <TouchableOpacity
                key={user._id}
                onPress={() => setData((prev: any) => ({ ...prev, owner: user._id }))}
                className={`mr-3 px-4 py-3 rounded-lg border ${
                  data.owner === user._id 
                    ? 'bg-primary-300 border-primary-300' 
                    : 'bg-white border-gray-300'
                }`}
              >
                <Text className={`font-rubik-medium text-sm ${
                  data.owner === user._id ? 'text-white' : 'text-black-300'
                }`}>
                  {user.name}
                </Text>
                <Text className={`font-rubik text-xs ${
                  data.owner === user._id ? 'text-white' : 'text-black-200'
                }`}>
                  {user.email}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Facilities Selection */}
        <View className='mb-4'>
          <Text className='text-base font-rubik-semibold text-black-300 mb-2'>Facility *</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className='flex-row'>
            {facilities.map((facility) => (
              <TouchableOpacity
                key={facility._id}
                onPress={() => setData((prev: any) => ({ ...prev, facilities: facility._id }))}
                className={`mr-3 px-4 py-3 rounded-lg border flex-row items-center ${
                  data.facilities === facility._id 
                    ? 'bg-primary-300 border-primary-300' 
                    : 'bg-white border-gray-300'
                }`}
              >
                <Image 
                  source={{ uri: facility.icon }} 
                  className='w-6 h-6 mr-2'
                  resizeMode='contain'
                />
                <Text className={`font-rubik-medium ${
                  data.facilities === facility._id ? 'text-white' : 'text-black-300'
                }`}>
                  {facility.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Price and Featured */}
        <View className='flex-row gap-3 mb-6'>
          <View className='flex-1'>
            <Text className='text-base font-rubik-semibold text-black-300 mb-2'>Price *</Text>
            <TextInput
              className='bg-gray-100 rounded-xl px-4 py-3 text-base font-rubik text-black-300'
              placeholder='Enter price'
              value={data.price}
              onChangeText={(text) => setData((prev: any) => ({ ...prev, price: text }))}
              keyboardType='numeric'
              editable={!isLoading}
            />
          </View>
          <View className='justify-end'>
            <View className='bg-gray-100 rounded-xl px-4 py-3 flex-row items-center'>
              <Text className='text-base font-rubik-medium text-black-300 mr-3'>Featured</Text>
              <Switch
                value={data.isFeatured}
                onValueChange={(value) => setData((prev: any) => ({ ...prev, isFeatured: value }))}
                trackColor={{false: '#d1d5db', true: '#3b82f6'}}
                thumbColor={data.isFeatured ? '#ffffff' : '#f9fafb'}
              />
            </View>
          </View>
        </View>
      </>
    )
  }

  const renderStep4 = (isEdit = false) => {
    const data = isEdit ? editProperty : newProperty
    const setData = isEdit ? setEditProperty : setNewProperty

    return (
      <>
        <Text className='text-lg font-rubik-bold text-black-300 mb-4'>Location & Gallery</Text>
        
        {/* Location */}
        <View className='mb-4'>
          <Text className='text-base font-rubik-semibold text-black-300 mb-2'>Address *</Text>
          <TextInput
            className='bg-gray-100 rounded-xl px-4 py-3 text-base font-rubik text-black-300 mb-3'
            placeholder='Enter address'
            value={data.location.address}
            onChangeText={(text) => setData((prev: any) => ({ 
              ...prev, 
              location: { ...prev.location, address: text }
            }))}
            editable={!isLoading}
            multiline
          />
          <TouchableOpacity
            // onPress={() => getCurrentLocation(isEdit)}
            disabled={isLoading}
            className='bg-blue-50 rounded-xl px-4 py-3 flex-row items-center justify-center'
          >
            <Text className='text-base font-rubik-medium text-primary-300 mr-2'>Get Current Location</Text>
            <Text className='text-lg'>📍</Text>
          </TouchableOpacity>
        </View>

        {/* Coordinates Display */}
        {(data.location.latitude !== 0 || data.location.longtitude !== 0) && (
          <View className='mb-4 bg-blue-50 rounded-xl p-4'>
            <Text className='text-sm font-rubik-semibold text-black-300 mb-1'>Coordinates</Text>
            <Text className='text-sm font-rubik text-black-200'>
              Lat: {data.location.latitude.toFixed(6)}, Lng: {data.location.longtitude.toFixed(6)}
            </Text>
          </View>
        )}

        {/* Gallery Images */}
        <View className='mb-6'>
          <Text className='text-base font-rubik-semibold text-black-300 mb-2'>Gallery Images</Text>
          
          {/* Gallery Grid */}
          {data.galleryUris.length > 0 && (
            <View className='mb-4'>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className='flex-row'>
                {data.galleryUris.map((uri, index) => (
                  <View key={index} className='mr-3 relative'>
                    <Image 
                      source={{ uri }} 
                      className='w-24 h-24 rounded-xl'
                      resizeMode='cover'
                    />
                    <TouchableOpacity
                      onPress={() => removeGalleryImage(index, isEdit)}
                      className='absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full items-center justify-center'
                    >
                      <Text className='text-white text-xs font-bold'>×</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}
          
          <TouchableOpacity
            onPress={() => pickGalleryImages(isEdit)}
            disabled={isLoading}
            className='bg-gray-100 rounded-xl px-4 py-3 flex-row items-center justify-center'
          >
            <Text className='text-base font-rubik text-black-300 mr-2'>Add Gallery Image</Text>
            <Text className='text-lg'>📸</Text>
          </TouchableOpacity>
        </View>
      </>
    )
  }

  return (
    <SafeAreaView className='flex-1 bg-gray-50'>
      <Header 
        title='Property Management' 
        backRoute='/admin-dashboard' 
        rightIcon={<AddButton onPress={() => setShowAddModal(true)} />} 
      />
      
      <ScrollView
        className='flex-1 px-4'
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 32}}
      >
        <SearchInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search Properties..."
        />
        
        <View className="flex-row justify-between mb-6">
          <StatCard
            value={properties.length}
            label="Total Properties"
            style="flex-1 mr-2"
          />
          <StatCard
            value={properties.filter(p => p.isFeatured).length}
            label="Featured Properties"
            valueColor="text-primary-300"
            style="flex-1 ml-2"
          />
        </View>

        <View>
          <Text className='text-lg font-rubik-semibold text-black-300 mb-4'>
            All Properties ({filteredProperties.length})
          </Text>
          
          {isLoading ? (
            <View className='bg-white rounded-xl p-8 items-center justify-center shadow-sm'>
              <Text className='text-primary-300 font-rubik-medium'>Loading properties...</Text>
            </View>
          ) : filteredProperties.length === 0 ? (
            <View className='bg-white rounded-xl p-8 items-center justify-center shadow-sm'>
              <Text className='text-3xl mb-2'>🏠</Text>
              <Text className='text-black-300 font-rubik-medium mb-1'>No Properties found</Text>
              <Text className='text-black-200 font-rubik text-center'>
                {searchQuery ? 'Try adjusting your search' : 'Add your first property to get started'}
              </Text>
            </View>
          ) : (
            filteredProperties.map((property, index) => (
              <View key={index} className='bg-white rounded-xl p-6 mb-4 shadow-sm border border-gray-100'>
                <View className='flex-row mb-4'>
                  <Image
                    source={{ uri: property.thumnailImage }}
                    className='w-20 h-20 rounded-xl mr-4'
                    resizeMode="cover"
                  />
                  <View className='flex-1'>
                    <View className='flex-row items-center justify-between mb-2'>
                      <Text className='text-lg font-rubik-semibold text-black-300 flex-1'>
                        {property.name}
                      </Text>
                      {property.isFeatured && (
                        <View className='bg-yellow-100 px-2 py-1 rounded-full'>
                          <Text className='text-xs font-rubik-semibold text-yellow-700'>Featured</Text>
                        </View>
                      )}
                    </View>
                    
                    <Text className='text-sm font-rubik text-primary-300 mb-1'>
                      {property.type?.name || 'N/A'}
                    </Text>
                    
                    <Text className='text-sm font-rubik text-black-200 mb-2'>
                      {property.specifications.bed} bed • {property.specifications.bath} bath • {property.specifications.area}
                    </Text>
                    
                    <View className='flex-row items-center justify-between'>
                      <Text className='text-lg font-rubik-bold text-black-300'>
                        ${property.price.toLocaleString()}
                      </Text>
                      <View className='flex-row items-center'>
                        <Text className='text-yellow-500 mr-1'>⭐</Text>
                        <Text className='text-sm font-rubik-medium text-black-300'>
                          {property.averageRating.toFixed(1)}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                <View className='border-t border-gray-100 pt-3'>
                  <Text className='text-xs font-rubik text-black-200 mb-2'>
                    Owner: {property.owner?.name || 'N/A'} • Created: {new Date(property.createdAt).toLocaleDateString()}
                  </Text>
                  <Text className='text-xs font-rubik text-black-200 mb-3' numberOfLines={2}>
                    📍 {property.location.address}
                  </Text>
                </View>

                {/* Action Buttons */}
                <View className='flex-row justify-between items-center'>
                  <TouchableOpacity
                    onPress={() => openEditModal(property)}
                    disabled={isLoading}
                    className='flex-1 bg-blue-50 py-3 px-4 rounded-lg mr-2'
                  >
                    <Text className='text-center text-primary-300 font-rubik-semibold text-sm'>Edit</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    disabled={isLoading}
                    onPress={() => handleDeleteProperty(property)}
                    className='flex-1 bg-red-50 py-3 px-4 rounded-lg ml-2'
                  >
                    <Text className='text-center text-red-700 font-rubik-semibold text-sm'>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Add Property Modal */}
        <Modal
          visible={showAddModal}
          animationType='slide'
          transparent={true}
          onRequestClose={cancelAddModal}
        >
          <View className='flex-1 justify-end bg-black/50'>
            <View className='bg-white rounded-t-3xl p-6 max-h-[90%]'>
              <View className='flex-row items-center justify-between mb-6'>
                <Text className='text-xl font-rubik-bold text-black-300'>Add New Property</Text>
                <TouchableOpacity onPress={cancelAddModal}>
                  <Text className='text-black-200 text-4xl'>×</Text>
                </TouchableOpacity>
              </View>

              {renderStepIndicator(currentStep, false)}

              <ScrollView showsVerticalScrollIndicator={false} className='flex-1'>
                {currentStep === 1 && renderStep1(false)}
                {currentStep === 2 && renderStep2(false)}
                {currentStep === 3 && renderStep3(false)}
                {currentStep === 4 && renderStep4(false)}
              </ScrollView>

              {/* Navigation Buttons */}
              <View className='flex-row gap-3 mt-6'>
                {currentStep > 1 && (
                  <TouchableOpacity
                    onPress={() => prevStep(false)}
                    disabled={isLoading}
                    className='flex-1 bg-gray-100 py-4 rounded-xl'
                  >
                    <Text className='text-center font-rubik-semibold text-black-200'>Previous</Text>
                  </TouchableOpacity>
                )}
                
                {currentStep < 4 ? (
                  <TouchableOpacity
                    onPress={() => nextStep(false)}
                    disabled={isLoading}
                    className='flex-1 bg-primary-300 py-4 rounded-xl'
                  >
                    <Text className='text-center font-rubik-bold text-white'>Next</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={handleAddProperty}
                    disabled={isLoading}
                    className='flex-1 bg-primary-300 py-4 rounded-xl'
                  >
                    <Text className='text-center font-rubik-bold text-white'>
                      {isLoading ? 'Adding...' : 'Add Property'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </Modal>

        {/* Edit Property Modal */}
        <Modal
          visible={showEditModal}
          animationType='slide'
          transparent={true}
          onRequestClose={cancelEditModal}
        >
          <View className='flex-1 justify-end bg-black/50'>
            <View className='bg-white rounded-t-3xl p-6 max-h-[90%]'>
              <View className='flex-row items-center justify-between mb-6'>
                <Text className='text-xl font-rubik-bold text-black-300'>Edit Property</Text>
                <TouchableOpacity onPress={cancelEditModal}>
                  <Text className='text-black-200 text-4xl'>×</Text>
                </TouchableOpacity>
              </View>

              {renderStepIndicator(editStep, true)}

              <ScrollView showsVerticalScrollIndicator={false} className='flex-1'>
                {editStep === 1 && renderStep1(true)}
                {editStep === 2 && renderStep2(true)}
                {editStep === 3 && renderStep3(true)}
                {editStep === 4 && renderStep4(true)}
              </ScrollView>

              {/* Navigation Buttons */}
              <View className='flex-row gap-3 mt-6'>
                {editStep > 1 && (
                  <TouchableOpacity
                    onPress={() => prevStep(true)}
                    disabled={isLoading}
                    className='flex-1 bg-gray-100 py-4 rounded-xl'
                  >
                    <Text className='text-center font-rubik-semibold text-black-200'>Previous</Text>
                  </TouchableOpacity>
                )}
                
                {editStep < 4 ? (
                  <TouchableOpacity
                    onPress={() => nextStep(true)}
                    disabled={isLoading}
                    className='flex-1 bg-primary-300 py-4 rounded-xl'
                  >
                    <Text className='text-center font-rubik-bold text-white'>Next</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={handleEditProperty}
                    disabled={isLoading}
                    className='flex-1 bg-primary-300 py-4 rounded-xl'
                  >
                    <Text className='text-center font-rubik-bold text-white'>
                      {isLoading ? 'Updating...' : 'Update Property'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  )
}

export default PropertyManagement