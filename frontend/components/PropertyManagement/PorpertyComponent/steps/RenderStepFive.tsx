import React from 'react'
import { PropertyFormData, User } from '../../types/property'
import { LabelText, ReviewText } from '@/components/ReusableComponent'
import { ScrollView, View } from 'react-native'
import { Category } from '@/components/CategoryManagement'
import { Facility } from '@/components/FacilityMangement'

interface RenderStepFiveProps {
    formData: PropertyFormData
    categories: Category[]
    owners: User[]
    facilities: Facility[]
}

const RenderStepFive: React.FC<RenderStepFiveProps> = ({formData, categories, owners, facilities}) => {
  const getCategoryName = (categoryId: string) => {
    const type = categories.find(cat => cat._id === categoryId);
    return type ? type.name : "Unknown Type"
  }
  const getOwnerName = (ownerId: string) => {
    const owner = owners.find(o => o._id === ownerId);
    return owner ? owner.name : "Unknown Owner"
  }
  const getFacilitiesName = (facilityIds: string[]) => {
    return facilityIds.map(id => {
        const facility = facilities.find(f => f._id === id);
        return facility ? facility.name : null
    }).filter(Boolean).join(", ")
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
        </View>
        <View>
            <LabelText text='Property Details' />
            <ReviewText 
                text={`Owner: ${typeof formData.owner === 'string'
                    ? getOwnerName(formData.owner)
                    : (formData.owner as any).name || 'No Owner Selected'
                }`}
            />
            <ReviewText text={`Bed: ${formData.specifications.bed}`} />
            <ReviewText text={`Bed: ${formData.specifications.bath}`} />
            <ReviewText text={`Bed: ${formData.specifications.area}`} />
            <ReviewText text={`Description: ${formData.description}`} />
        </View>
        <View>
            <LabelText text='Price & Location' />
            <ReviewText text={`Price: ${formData.price} $`} />
            <ReviewText text={`Location: ${formData.location.address}`} />
            <ReviewText text={`Location: ${formData.location.latitude}`} />
            <ReviewText text={`Location: ${formData.location.longitude}`} />
        </View>
        <View>
            <LabelText text='Facilities & Featured' />
            <ReviewText 
                text={`Selected Facilitites: ${
                    formData.facilities && formData.facilities.length > 0
                        ? getFacilitiesName(formData.facilities as any) : "No facilities Selected"
                }`}
            />
            <ReviewText text={`Is Featured: ${formData.isFeatured}`} />
        </View>
      </View>
    </ScrollView>
  )
}

export default RenderStepFive