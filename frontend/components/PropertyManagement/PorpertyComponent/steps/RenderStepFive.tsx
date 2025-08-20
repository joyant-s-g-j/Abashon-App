import React from 'react'
import { PropertyFormData, User } from '../../types/property'
import { LabelText, ReviewText } from '@/components/ReusableComponent'
import { ScrollView, Text, View } from 'react-native'
import { Category } from '@/components/CategoryManagement'

interface RenderStepFiveProps {
    formData: PropertyFormData
    categories: Category[]
    owners: User[]
}

const RenderStepFive: React.FC<RenderStepFiveProps> = ({formData, categories, owners}) => {
  const getCategoryName = (categoryId: string) => {
    const type = categories.find(cat => cat._id === categoryId);
    return type ? type.name : "Unknown Type"
  }
  const getOwnerName = (ownerId: string) => {
    const owner = owners.find(o => o._id === ownerId);
    return owner ? owner.name : "Unknown Owner"
  }
  return (
    <ScrollView>
      <LabelText text='Review & Submit' className='text-xl font-rubik-bold mb-4' />
      
      <View className='bg-gray-50 rounded-md p-4 gap-4'>
        <View>
            <LabelText text='Basic Information' />
            <ReviewText text={`Property Name: ${formData.name}`} />
            <ReviewText text={`Type: ${ typeof formData.type === 'string' 
                ? getCategoryName(formData.type)
                : (formData.owner as any).name || 'No Category Selected'
                }`} 
            />
            <ReviewText 
                text={`Owner: ${typeof formData.owner === 'string'
                    ? getOwnerName(formData.owner)
                    : (formData.owner as any).name || 'No Owner Selected'
                }`}
            />
        </View>
        <View>
            <LabelText text='Specifications' />
            <ReviewText text={`Bed: ${formData.specifications.bed}`} />
            <ReviewText text={`Bed: ${formData.specifications.bath}`} />
            <ReviewText text={`Bed: ${formData.specifications.area}`} />
        </View>
      </View>
    </ScrollView>
  )
}

export default RenderStepFive