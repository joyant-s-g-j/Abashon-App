import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { PropertyFormData, User } from '../../types/property'
import { LabelText } from '@/components/ReusableComponent';
import { useProperties } from '../../hooks/useProperty';
interface RenderStepTwoProps {
  formData: PropertyFormData;
  updateFormData: (field: keyof PropertyFormData, value: any) => void;
  owners: User[];
}

const RenderStepTwo: React.FC<RenderStepTwoProps> = ({formData, updateFormData, owners}) => {
  return (
    <ScrollView>
      <LabelText text='Property Details' className='text-xl font-rubik-bold mb-4' />
      {owners.length === 0 ? (
        <Text>No owners found</Text>
      ) : (
        owners.map((owner: User) => (
          <View key={owner._id} className="mb-2">
            <Text className="text-black-300 text-base">{owner.name}</Text>
          </View>
        ))
      )}
    </ScrollView>
  )
}

export default RenderStepTwo