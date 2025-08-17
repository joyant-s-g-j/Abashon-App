import { View, Text } from 'react-native'
import React from 'react'
import { PropertyFormData, PropertyStep } from '../types/property';
import RenderStepOne from './steps/RenderStepOne';

interface PropertyStepsProps {
    currentStep: PropertyStep;
    formData: PropertyFormData;
    setFormData: (data: PropertyFormData) => void;
    onImagePick?: () => void;
    isEdit?: boolean;
}

const PropertySteps: React.FC<PropertyStepsProps> = ({
    currentStep,
    formData,
    setFormData,
    onImagePick,
    isEdit = false
}) => {
  const updateFormData = (field: keyof PropertyFormData, value: any) => {
    setFormData({
        ...formData,
        [field]: value
    })
  };
  const updateNestedFormData = (parent: keyof PropertyFormData, field: string, value: any) => {
    setFormData({
        ...formData,
        [parent]: {
            ...(formData[parent] as any),
            [field]: value
        }
    })
  }
  const renderCurrentStep = () => {
    switch(currentStep) {
        case 1:
            return (
                <RenderStepOne 
                    formData={formData}
                    updateFormData={updateFormData}
                />
            )
        default:
            return (
                <RenderStepOne 
                    formData={formData}
                    updateFormData={updateFormData}
                />
            )
    }
  }
  return (
    <View className='flex-1'>
      {renderCurrentStep()}
    </View>
  )
}

export default PropertySteps