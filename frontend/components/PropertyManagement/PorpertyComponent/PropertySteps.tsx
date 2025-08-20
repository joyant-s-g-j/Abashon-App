import React from 'react';
import { View } from 'react-native';
import { useProperties } from '../hooks/useProperty';
import { PropertyFormData, PropertyStep } from '../types/property';
import { RenderStepFour, RenderStepOne, RenderStepThree, RenderStepTwo } from './steps';

interface PropertyStepsProps {
  currentStep: PropertyStep;
  formData: PropertyFormData;
  setFormData: (data: PropertyFormData) => void;
  onImagePick: () => void;
  isEdit?: boolean;
}

const PropertySteps: React.FC<PropertyStepsProps> = ({
  currentStep,
  formData,
  setFormData,
  onImagePick,
  isEdit = false
}) => {
  const { owners } = useProperties();
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
          <RenderStepFour />
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