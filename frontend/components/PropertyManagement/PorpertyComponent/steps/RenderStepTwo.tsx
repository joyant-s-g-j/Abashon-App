import { View, Text, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { PropertyFormData, User } from '../../types/property'
import { LabelText } from '@/components/ReusableComponent';
import { useProperties } from '../../hooks/useProperty';
import CustomDropdown from '@/components/CustomDropdown';
import CustomInput from '@/components/CustomInput';
import { specificationsFields } from '@/constants/data';
import Specifications from '../Specifications';
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
      <View>
        <LabelText text='Specifications' className='text-xl' />
        {specificationsFields.map((field) => (
          <Specifications 
            key={field.key}
            label={field.label}
            value={formData.specifications[field.key]}
            placeholder={field.placeholder}
            onChnageText={(text) => updateNestedFormData('specifications', field.key, text)}
          />
        ))}
      </View>
    </ScrollView>
  )
}

export default RenderStepTwo