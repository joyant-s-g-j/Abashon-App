import React from 'react';
import { View } from 'react-native';
import { useProperties } from '../hooks/useProperty';
import { PropertyFormData, PropertyStep } from '../types/property';
import { RenderStepFive, RenderStepFour, RenderStepOne, RenderStepThree, RenderStepTwo } from './steps';
import { useCategories } from '@/components/CategoryManagement';

interface PropertyStepsProps {
  currentStep: PropertyStep;
  formData: PropertyFormData;
  setFormData: (data: PropertyFormData) => void;
  onImagePick: () => void;
  onMultipleImagePick: () => void;
  isEdit?: boolean;
}

const PropertySteps: React.FC<PropertyStepsProps> = ({
  currentStep,
  formData,
  setFormData,
  onImagePick,
  onMultipleImagePick,
  isEdit = false
}) => {
  const { owners } = useProperties();
  const { categories } = useCategories()
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
            onImagePick={onImagePick}
          />
        )
      case 2:
        return (
          <RenderStepTwo 
            formData={formData}
            updateFormData={updateFormData}
            updateNestedFormData={updateNestedFormData}
            owners={owners}
          />
        )
      case 3:
        return (
          <RenderStepThree 
            formData={formData}
            updateNestedFormData={updateNestedFormData}
          />
        )
      case 4:
        return (
          <RenderStepFour 
            formData={formData}
            updateFormData={updateFormData}
            onMultipleImagePick={onMultipleImagePick}
          />
        )
      case 5:
        return (
          <RenderStepFive 
            formData={formData}
            owners={owners}
            categories={categories}
          />
        )
      default:
        return (
            <RenderStepOne 
              formData={formData}
              updateFormData={updateFormData}
              onImagePick={onImagePick}
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