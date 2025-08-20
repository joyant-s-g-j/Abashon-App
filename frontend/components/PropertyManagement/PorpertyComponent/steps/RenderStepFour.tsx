import { ScrollView, Text } from 'react-native'
import React from 'react'
import { PropertyFormData } from '../../types/property'
import { useFacilities } from '@/components/FacilityMangement';
import { LabelText } from '@/components/ReusableComponent';
import { TowColumnCheckbox } from '@/components/ReusableComponent/TowColumnCheckbox';

interface RenderStepFourProps {
    formData: PropertyFormData;
    updateFormData: (field: keyof PropertyFormData, value: any) => void;
    onImagePick: () => void
}

const RenderStepFour: React.FC<RenderStepFourProps> = ({formData, updateFormData, onImagePick}) => {
  const {facilities} = useFacilities();
  const selectedImage = formData.imageUri || formData.galleryImages
  return (
    <ScrollView>
      <LabelText text='Facilities & Images' className='text-xl font-rubik-bold mb-4' />
      {/* facilities */}
      <TowColumnCheckbox 
        label='Facilities *'
        items={facilities}
        multi={true}
        selectedIds={formData.facilities}
        onSelect={(ids) => updateFormData('facilities', ids)}
        getId={(item) => item._id}
        getLabel={(item) => item.name}
      />
      {/* galleryImages */}
    </ScrollView>
  )
}

export default RenderStepFour