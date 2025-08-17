import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { InputField } from '@/components/ReusableComponent'
import { PropertyFormData } from '../../types/property'
import { filterCategories, useCategories } from '@/components/CategoryManagement';
import { TowColumnCheckbox } from '@/components/ReusableComponent/TowColumnCheckbox';

interface RenderStepOneProps {
    formData: PropertyFormData;
    updateFormData: (field: keyof PropertyFormData, value: any) => void;
}

const RenderStepOne: React.FC<RenderStepOneProps> = ({formData, updateFormData}) => {
  const {categories} = useCategories();
  
  return (
    <View>
      <Text className='text-xl font-rubik-bold text-black-300 mb-4'>
        Basic Information
      </Text>

      <InputField
        label="Property Name *"
        value={formData.name}
        onChangeText={(text) => updateFormData("name", text)}
        placeholder="Enter property name"
      />

      <Text className="text-lg font-rubik-semibold text-black-300 mt-4 mb-2">
        Select Category *
      </Text>

      <TowColumnCheckbox
        items={categories}
        selectedId={formData.type}
        onSelect={(id) => updateFormData('type', id)}
        getId={(item) => item._id}
        getLabel={(item) => item.name}
      />
    </View>
  )
}

export default RenderStepOne