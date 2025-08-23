import { ScrollView } from 'react-native'
import React from 'react'
import { PropertyFormData } from '../../types/property'
import { Facility } from '@/components/FacilityMangement'
import { LabelText } from '@/components/ReusableComponent'
import { TowColumnCheckbox } from '@/components/ReusableComponent/TowColumnCheckbox'
import { GalleryImagesSection } from '../sections'

interface RenderStepFourProps {
    formData: PropertyFormData
    updateFormData: (field: keyof PropertyFormData, value: any) => void
    onMultipleImagePick: () => void
    facilities: Facility[]
}

const RenderStepFour: React.FC<RenderStepFourProps> = ({
  formData,
  updateFormData,
  onMultipleImagePick,
  facilities
}) => {
  const normalizeToIds = (facilities: string[] | Facility[]): string[] => {
    if (!Array.isArray(facilities)) return [];
    
    return facilities.map(facility => {
      if (typeof facility === 'string') {
        return facility;
      }
      return facility._id;
    });
  };

  // Get the selected facility IDs
  const selectedFacilityIds = normalizeToIds(formData.facilities);

  const handleFacilitySelect = (ids: string | number | null | (string | number)[]) => {
    // Convert the component's output back to the format expected by formData
    if (Array.isArray(ids)) {
      const stringIds = ids.map(id => String(id));
      updateFormData('facilities', stringIds);
    } else if (ids === null) {
      updateFormData('facilities', []);
    } else {
      updateFormData('facilities', [String(ids)]);
    }
  };

  return (
    <ScrollView>
      <LabelText text='Facilities & Images' className='text-xl font-rubik-bold mb-4' />

      {/* Facilities */}
      <TowColumnCheckbox 
        label='Facilities *'
        items={facilities}
        multi={true}
        selectedIds={selectedFacilityIds}
        onSelect={handleFacilitySelect}
        getId={(item) => item._id}
        getLabel={(item) => item.name}
      />

      {/* Gallery Images */}
      <GalleryImagesSection 
        galleryImages={formData.galleryImages}
        updateFormData={updateFormData}
        onMultipleImagePick={onMultipleImagePick}
      />
    </ScrollView>
  )
}

export default RenderStepFour
