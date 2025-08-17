import { Text, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AddButton, Header } from '@/components/ReusableComponent'
import SearchInput from '@/components/SearchInput'
import { filterProperties, Property, PropertyList, PropertyStats, useProperties, usePropertyModals } from '@/components/PropertyManagement'
import { useImagePicker } from '@/components/FacilityMangement'
import PropertyModal from '@/components/PropertyManagement/PorpertyComponent/PropertyModal'
import { PropertyFormData, PropertyStep } from '@/components/PropertyManagement/types/property'

const PropertyMangement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentStep, setCurrentStep] = useState<PropertyStep>(1)

  const {
    properties,
    isLoading,
    loadProperties,
    addProperty,
    updatePorperty,
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
    updateEditPropertyImage
  } = usePropertyModals()

  const filteredProperties = filterProperties(properties, searchQuery)

  const handleConfirmDelete = (property: Property) => {
    deleteProperty(property)
  }


  const handleOpenAddModal = () => {
    openAddModal();
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
        onImagePick={() => handlePickImage(false)}
      />
    </SafeAreaView>
  )
}

export default PropertyMangement