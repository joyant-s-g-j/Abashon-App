import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { LabelText } from '@/components/ReusableComponent'
import { PropertyFormData } from '../../types/property';
import { Ionicons } from '@expo/vector-icons';

interface GalleryImagesSectionProps {
    galleryImages: PropertyFormData['galleryImages'];
    updateFormData: (field: keyof PropertyFormData, value: any) => void;
    onMultipleImagePick: () => void
}

const GalleryImagesSection: React.FC<GalleryImagesSectionProps> = ({
    galleryImages,
    updateFormData,
    onMultipleImagePick
}) => {
  return (
    <View className='mt-4'>
      <LabelText text='Gallery Images *' />
      {/* Add Images Button */}
      {(!galleryImages || galleryImages.length === 0) && (
        <TouchableOpacity
            onPress={onMultipleImagePick}
            className='border border-dashed border-black-100 rounded-md p-4 items-center justify-center mb-4 h-40'
        >
            <Ionicons name='camera-outline' size={40} color="#9CA3AF" />
            <Text className='text-black-300 mt-2 font-rubik'>
                Tap to add images
            </Text>
            <Text className='text-black-100 text-sm font-rubik'>
                Select mutliple photo at once
            </Text>
      </TouchableOpacity>
      )}
      
      {/* Gallery Images Preview */}
      {galleryImages && galleryImages.length > 0 && (
        <View>
            <Text className='text-sm font-rubik-medium text-black-300 mb-3'>
                {galleryImages.length} images selected
            </Text>

            <View className='flex-row flex-wrap gap-2'>
                {galleryImages.map((imageUri, index) => (
                    <View key={index} className='relative'>
                        <Image 
                            source={{ uri: imageUri }}
                            className='size-20 rounded-md'
                            resizeMode='cover'
                        />

                        {/* Remove button */}
                        <TouchableOpacity
                            onPress={() => {
                                const updatedImages = galleryImages?.filter((_, i) => i !== index)
                                updateFormData('galleryImages', updatedImages)}
                            }
                            className='absolute -top-2 -right-2 bg-red-500 rounded-full p-1 items-center '
                        >
                            <Ionicons name='close' size={14} color="white" />
                        </TouchableOpacity>
                    </View>
                ))}
            </View>

            {/* Add more images button */}
            <TouchableOpacity 
              onPress={onMultipleImagePick}
              className='mt-3 border border-primary-300 rounded-lg p-3 items-center justify-center flex-row'
            >
              <Ionicons name="add" size={20} color="#3B82F6" />
              <Text className='text-primary-300 ml-2 font-rubik-medium'>
                Add More Images
              </Text>
            </TouchableOpacity>
        </View>
      )}
    </View>
  )
}

export default GalleryImagesSection