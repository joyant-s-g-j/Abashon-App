import { View, Text, Alert, Modal, TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'
import { Property, PropertyFormData, PropertyStep } from '../types/property';
import PropertySteps from './PropertySteps';
import FooterButtons from '@/components/FooterButtons';
import Stepper from './Stepper';

interface PropertyModalProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (data: PropertyFormData) => void;
    property: Property | null;
    isEdit: boolean;
    isLoading: boolean;
    formData: PropertyFormData;
    setFormData: (data: PropertyFormData) => void;
    currentStep: PropertyStep;
    setCurrentStep: (step: PropertyStep) => void;
    onImagePick: () => void;
}

const PropertyModal: React.FC<PropertyModalProps> = ({
    visible,
    onClose,
    onSubmit,
    property,
    isEdit = false,
    isLoading = false,
    formData,
    setFormData,
    currentStep,
    setCurrentStep,
    onImagePick
}) => {
  const handleSubmit = () => {
    if(!formData?.name.trim()) {
        Alert.alert('Error', 'Property name is required')
        return
    }
    if(!formData.type) {
        Alert.alert('Error', 'Property type is required')
        return
    }
    if(!formData.location.address.trim()) {
        Alert.alert('Error', 'Property address is required')
        return
    }
    if(!formData.price || parseFloat(formData.price) <= 0) {
        Alert.alert('Error', 'Valid price is required')
        return
    }
    onSubmit(formData)
  }

  const handleNext = () => {
    if(currentStep < 5) {
        setCurrentStep((currentStep + 1) as PropertyStep)
    }
  }

  const handlePrevious = () => {
    if(currentStep > 1) {
        setCurrentStep((currentStep - 1) as PropertyStep)
    }
  }

  const getStepTitle = () => {
    const titles = {
        1: 'Basic Information',
        2: 'Property Details',
        3: 'Location & Price',
        4: 'Facilities & Images',
        5: 'Review & Submit'
    }
    return titles[currentStep]
  }

  return (
    <Modal
        visible={visible}
        animationType='slide'
        presentationClassName='fullScreen'
        onRequestClose={onClose}
    >
        <View className='flex-1 bg-white'>
            {/* Header */}
            <View className='flex-row items-center justify-between p-4 border-b border-gray-200'>
                <TouchableOpacity onPress={onClose}>
                    <Text className='text-lg font-rubik-medium text-primary-300'>Cancel</Text>
                </TouchableOpacity>
                <View className='flex-1 items-center'>
                    <Text className='text-lg font-rubik-semibold text-black-300'>
                        {isEdit ? 'Edit Property' : 'Add Property'}
                    </Text>
                    <Text className='text-sm font-rubik text-black-300'>
                        Step {currentStep} of 5 • {getStepTitle()}
                    </Text>
                </View>
                <View className="w-16" />
            </View>

            {/* Progress Bar */}
            <Stepper currentStep={currentStep} totalSteps={5} />

            {/* content */}
            <ScrollView
                className='flex-1 p-4'
                showsVerticalScrollIndicator={false}
            >
                <PropertySteps 
                    currentStep={currentStep}
                    formData={formData}
                    setFormData={setFormData}
                    onImagePick={onImagePick}
                    isEdit={isEdit}
                />
            </ScrollView>

            {/* footer buttons */}
            <FooterButtons
                handlePrevious={handlePrevious}
                handleSubmit={handleSubmit}
                handleNext={handleNext}
                currentStep={currentStep}
                isLoading={isLoading}
                isEdit={isEdit}
            />
        </View>
    </Modal>
  )
}

export default PropertyModal