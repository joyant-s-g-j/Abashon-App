import { ScrollView } from 'react-native'
import React, { useState } from 'react'
import { PropertyFormData, User } from '../../types/property'
import { InputField, LabeledInput, LabelText } from '@/components/ReusableComponent';
import CustomDropdown from '@/components/CustomDropdown';
import { specificationsFields } from '@/constants/data';
interface RenderStepTwoProps {
  formData: PropertyFormData;
  updateNestedFormData: (parent: keyof PropertyFormData, field: string, value: any) => void;
  owners: User[];
}

const RenderStepTwo: React.FC<RenderStepTwoProps> = ({formData, updateNestedFormData, owners}) => {
  const [owner, setOwner] = useState('')
  const ownerOptions = owners.map((o) => ({
    label: o.name,
    value: o._id
  }))

  return (
    <ScrollView>
      <LabelText text='Property Details' className='text-xl font-rubik-bold mb-4' />
      {/* Owner select */}
      <LabelText text='Select Owner *' />
      <CustomDropdown 
        selectedValue={owner}
        onValueChange={setOwner}
        options={ownerOptions}
        placeholder="Select Owner"
      />

      {/* Specifications */}
      <LabeledInput
        sectionLabel="Specifications"
        fields={specificationsFields.map((field) => ({
          key: field.key,
          label: field.label,
          value: formData.specifications[field.key],
          placeholder: field.placeholder,
          keyboardType: "numeric",
          onChangeText: (text) => updateNestedFormData('specifications', field.key, text),
        }))}
      />

      {/* Description */}
      <InputField 
        label='Description *'
        value={formData.description}
        onChangeText={(text) => updateNestedFormData('description', '', text)}
        placeholder="Enter property description"
        multiline
        numberOfLines={10}
      />
    </ScrollView>
  )
}

export default RenderStepTwo