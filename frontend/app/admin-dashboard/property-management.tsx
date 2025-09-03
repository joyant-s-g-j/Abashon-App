import { Text, ScrollView, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AddButton, Header } from '@/components/ReusableComponent'
import SearchInput from '@/components/SearchInput'
import { filterProperties, Property, PropertyList, PropertyStats, useProperties, usePropertyModals } from '@/components/PropertyManagement'
import { useImagePicker } from '@/components/FacilityMangement'
import PropertyModal from '@/components/PropertyManagement/PorpertyComponent/PropertyModal'
import { PropertyFormData, PropertyStep } from '@/components/PropertyManagement/types/property'
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator'

const PropertyMangement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentStep, setCurrentStep] = useState<PropertyStep>(1)

  const {
    properties,
    isLoading,
    loadProperties,
    addProperty,
    updateProperty,
    deleteProperty
  } = useProperties();

  const { pickImage } = useImagePicker()

  const {
    showAddModal,
    showEditModal,
    selectedProperty,
    newProperty,
    editProperty,
    openAddModal,
    closeAddModal,
    openEditModal,
    closeEditModal,
    handleDeleteProperty,
    setNewProperty,
    setEditProperty,
    updateNewPropertyImage,
    updateEditPropertyImage,
    updateNewPropertyGalleryImages,
    updateEditPropertyGalleryImages
  } = usePropertyModals()

  const filteredProperties = filterProperties(properties, searchQuery)

  const handleConfirmDelete = (property: Property) => {
    deleteProperty(property)
  }

  const handleSubmit = async () => {
  const formData = getCurrentFormData()

  console.log('=== DEBUGGING FORM DATA ===')
  console.log('Raw form data:', formData)
  console.log('Selected property:', selectedProperty)
  console.log('Is edit mode:', showEditModal)
  console.log('Property ID:', selectedProperty?._id)
  
  // Validation add করুন
  if(!formData?.name?.trim()) {
    Alert.alert('Error', 'Property name is required')
    return
  }
  if(!formData.type) {
    Alert.alert('Error', 'Property type is required')
    return
  }
  if(!formData.owner) {
    Alert.alert('Error', 'Property owner is required')
    return
  }
  if(!formData.description?.trim()) {
    Alert.alert('Error', 'Property description is required')
    return
  }
  if(!formData.location.address?.trim()) {
    Alert.alert('Error', 'Property address is required')
    return
  }
  if(!formData.location.latitude || !formData.location.longitude) {
    Alert.alert('Error', 'Property coordinates are required')
    return
  }
  if(!formData.price || parseFloat(formData.price) <= 0) {
    Alert.alert('Error', 'Valid price is required')
    return
  }
  if(!formData.specifications?.bed || !formData.specifications?.bath || !formData.specifications?.area) {
    Alert.alert('Error', 'All specifications are required')
    return
  }

  console.log('Submitting form data:', JSON.stringify(formData, null, 2))
  
  try {
    if(showEditModal && selectedProperty) {
      const success = await updateProperty(selectedProperty._id, formData)
      if(success) {
        handleModalClose()
      }
    } else {
      const success = await addProperty(formData)
      if(success) {
        handleModalClose()
      }
    }
  } catch (error) {
    console.log("Error in handle submit", error)
    Alert.alert('Error', 'Failed to save property. Please try again.')
  }
}

  const handleModalClose = () => {
    setCurrentStep(1)
    closeAddModal();
    closeEditModal()
  }

  const compressImage = async (uri: string, quality = 0.7, maxWidth = 800, maxHeight = 600) => {
    try {
      const result = await ImageManipulator.manipulateAsync(
        uri,
        [
          { resize: { width: maxWidth, height: maxHeight } }
        ],
        {
          compress: quality,
          format: ImageManipulator.SaveFormat.JPEG,
          base64: true
        }
      );

      return `data:image/jpeg;base64,${result.base64}`
    } catch (error) {
      console.log('Error compressing image:', error)
      return uri
    }
  }

  const handlePickImage = async (isEdit = false) => {
    try {
        const imageData = await pickImage()
        
        if(imageData) {
          const compressedImage = await compressImage(imageData)
          if(isEdit) {
            updateEditPropertyImage(compressedImage)
          } else {
            updateNewPropertyImage(compressedImage)
          }            
        }
    } catch (error) {
        console.log('Error in handlePickImage:', error);
    }
  }

  const handlePickMultipleImages = async (isEdit = false) => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if(permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Please allow access to your photo library to select images.')
        return
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
        aspect: [4, 3],
        allowsEditing: false,
        base64: false,
        exif: false
      })

      if(!result.canceled && result.assets.length > 0) {
        const compressedImage = await Promise.all(
          result.assets.map(async (asset) => {
            try {
              return await compressImage(asset.uri, 0.6)
            } catch (error) {
              console.error('Failed to compress image:', error);
              return asset.uri;
            }
          })
        )
        
        const validImages = compressedImage.filter(imageData => 
          imageData &&
          typeof imageData === 'string' &&
          imageData.trim() !== ''
        )

        if(validImages.length > 0) {
          if(isEdit) {
            updateEditPropertyGalleryImages(validImages)
          } else {
            updateNewPropertyGalleryImages(validImages)
          }
        } else {
          Alert.alert('Error', 'No valid images were selected')
        }
    }

    } catch (error) {
      console.log('Error in handlePickMultipleImages:', error);
      Alert.alert('Error', 'Something went wrong while picking images.');
    }
  }

  const getCurrentFormData = (): PropertyFormData => {
    return showEditModal ? editProperty : newProperty
  }

  const setCurrentFormData = (data: PropertyFormData) => {
    if(showEditModal) {
      setEditProperty(data as any)
    } else {
      setNewProperty(data)
    }
  }

  const updateFormData = (field: keyof PropertyFormData, value: any) => {
    if(showEditModal) {
      setEditProperty(prev => ({...prev, [field]: value}))
    } else {
      setNewProperty(prev => ({...prev, [field]: value}))
    }
  }

  return (
    <SafeAreaView>
      <Header 
        backRoute='/admin-dashboard' 
        rightIcon={<AddButton onPress={openAddModal} />} 
        title='Property Management' 
      />
      <ScrollView 
        className='px-4'
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <SearchInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search Properties..."
        />
        
        <PropertyStats properties={properties} />

        <PropertyList 
          properties={filteredProperties}
          searchQuery={searchQuery}
          isLoading={isLoading}
          onEditProperty={openEditModal}
          onDeleteProperty={(property) => handleDeleteProperty(property, handleConfirmDelete)}
        />
      </ScrollView>

      <PropertyModal
        visible={showAddModal || showEditModal}
        onClose={handleModalClose}
        property={selectedProperty}
        isEdit={showEditModal}
        isLoading={isLoading}
        formData={getCurrentFormData()}
        setFormData={setCurrentFormData}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        onImagePick={() => handlePickImage(showEditModal)}
        onMultipleImagePick={() => handlePickMultipleImages(showEditModal)}
        onSubmit={handleSubmit}
      />
    </SafeAreaView>
  )
}

export default PropertyMangement