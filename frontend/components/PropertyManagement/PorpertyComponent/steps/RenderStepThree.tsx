import { ScrollView } from 'react-native'
import React from 'react'
import { InputField, LabeledInput, LabelText } from '@/components/ReusableComponent'
import { locationFields } from '@/constants/data'
import { PropertyFormData } from '../../types/property'

interface RenderStepThreeProps {
  formData: PropertyFormData;
  updateFormData: (field: keyof PropertyFormData, value: any) => void;
  updateNestedFormData: (parent: keyof PropertyFormData, field: string, value: any) => void;
}

const RenderStepThree: React.FC<RenderStepThreeProps> = ({formData, updateFormData, updateNestedFormData}) => {
  return (
    <ScrollView>
      <LabelText text='Price & Location' className='text-xl font-rubik-bold mb-4' />
      {/* Price */}
      <InputField 
        label='Price *'
        value={formData.price}
        onChangeText={(text) => updateFormData('price', text)}
        placeholder='Enter property price'
        keyboardType='numeric'
      />
      {/* Location */}
      <LabeledInput 
        sectionLabel='Location'
        fields={locationFields.map((field) => ({
          key: field.key,
          label: field.label,
          value: formData.location[field.key],
          placeholder: field.placeholder,
          keyboardType: field.keyboardType,
          onChangeText: (text) => updateNestedFormData('location', field.key, text)
        }))}
      />
    </ScrollView>
  )
}

export default RenderStepThree