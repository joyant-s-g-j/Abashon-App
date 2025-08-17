import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { InputField } from '@/components/ReusableComponent'
import { PropertyFormData } from '../../types/property'
import { filterCategories, useCategories } from '@/components/CategoryManagement';

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

      <View>
        {categories.map((category, index) => {
          const isSelected = formData.type === category._id
          return (
            <TouchableOpacity
              key={index}
              className={`flex-row items-center`}
              onPress={() => updateFormData('type', category._id)}
            >
              <Text className='text-xl mr-2'>
                {isSelected ? '✅' : '⬜'}
              </Text>
              <Text className={`text-base font-rubik ${
                isSelected ? 'text-primary-300 font-rubik-semibold' : "text-black-300"
              }`}>
                {category.name}
              </Text>
            </TouchableOpacity>
          )
        })}
      </View>
    </View>
  )
}

export default RenderStepOne