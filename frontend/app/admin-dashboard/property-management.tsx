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
    try {
      if(showEditModal && selectedProperty) {
        await updateProperty(selectedProperty._id, formData)
      } else {
        await addProperty(formData)
      }
      handleModalClose()
    } catch (error) {
      console.log("Error in handle submit", error)
    }
  }

  const handleModalClose = () => {
    setCurrentStep(1)
    closeAddModal();
    closeEditModal()
  }

  const handlePickImage = async (isEdit = false) => {
    try {
        const imageData = await pickImage()
        
        if(imageData) {
          if(isEdit) {
            updateEditPropertyImage(imageData)
          } else {
            updateNewPropertyImage(imageData)
          }            
        }
    } catch (error) {
        console.log('Error in handlePickImage:', error);
    }
    console.log('=== handlePickImage end ===');
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
        base64: true,
        exif: false
      })

      if(!result.canceled && result.assets.length > 0) {
        const imageDataUrls = result.assets.map(asset => {
          if(asset.base64) {
            return `data:image/jpeg;base64,${asset.base64}`;
          } else {
            return asset.uri
          }
        })
        const validImages = imageDataUrls.filter(imageData => 
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