import { View, Text, Alert, Modal } from 'react-native'
import React from 'react'
import { Property, PropertyFormData, PropertyStep } from '../types/property';

interface PropertyModalProps {
    visible: boolean;
    onClose?: () => void;
    onSubmit?: (data: PropertyFormData) => void;
    property?: Property | null;
    isEdit?: boolean;
    isLoading?: boolean;
    formData?: PropertyFormData;
    setFormData?: (data: PropertyFormData) => void;
    currentStep?: PropertyStep;
    setCurrentStep?: (step: PropertyStep) => void;
    onImagePick?: () => void;
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
//   const handleSubmit = () => {
//     if(!formData.name.trim()) {
//         Alert.alert('Error', 'Property name is required')
//         return
//     }
//     if(!formData.type) {
//         Alert.alert('Error', 'Property type is required')
//         return
//     }
//     if(!formData.location.address.trim()) {
//         Alert.alert('Error', 'Property address is required')
//         return
//     }
//     if(!formData.price || parseFloat(formData.price) <= 0) {
//         Alert.alert('Error', 'Valid price is required')
//         return
//     }
//     onSubmit(formData)
//   }

//   const handleNext = () => {
//     if(currentStep < 5) {
//         setCurrentStep((currentStep + 1) as PropertyStep)
//     }
//   }

//   const handlePrevious = () => {
//     if(currentStep > 1) {
//         setCurrentStep((currentStep - 1) as PropertyStep)
//     }
//   }

//   const getStepTitle = () => {
//     const titles = {
//         1: 'Basic Information',
//         2: 'Property Details',
//         3: 'Location & Price',
//         4: 'Facilities & Images',
//         5: 'Review & Submit'
//     }
//     return titles[currentStep]
//   }

  return (
    <Modal
        visible={visible}
        animationType='slide'
        presentationClassName='fullScreen'
        onRequestClose={onClose}
    >
        <View className='flex-1 bg-white'>
            <Text>Modal is opening</Text>
        </View>
    </Modal>
  )
}

export default PropertyModal