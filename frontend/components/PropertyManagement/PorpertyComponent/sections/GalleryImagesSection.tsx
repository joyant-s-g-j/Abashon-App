import { View, Text, TouchableOpacity, Image, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
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
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingCount, setProcessingCount] = useState(0)

  const isValidImageUri = (uri: string): boolean => {
    return Boolean(uri && 
        typeof uri === 'string' && 
        uri.trim() !== '' &&
        (uri.startsWith('data:image/') || 
        uri.startsWith('file://') || 
        uri.startsWith('http://') || 
        uri.startsWith('https://')));
  };

  const validGalleryImages = galleryImages?.filter(isValidImageUri) || []

  const handleImagePick = async () => {
    setIsProcessing(true)
    setProcessingCount(0)
    try {
      await onMultipleImagePick()
    } finally {
      setIsProcessing(false)
      setProcessingCount(0)
    }
  }

  const updateProgress = (count: number) => {
    setProcessingCount(count)
  }
  return (
    <View className='mt-4'>
      <LabelText text='Gallery Images *' />
      {/* Processing Indicator */}
      {isProcessing && (
        <View className='border border-primary-200 rounded-md p-4 items-center justify-center mb-4 bg-primary-100'>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text className='text-primary-600 mt-2 font-rubik-medium'>
            Processing Images...
          </Text>
          {processingCount > 0 && (
            <Text className='text-primary-500 text-sm font-rubik mt-1'>
              {processingCount} image{processingCount === 1 ? '' : 's'} processed
            </Text>
          )}
          <View className='w-32 h-1 bg-primary-200 rounded-full mt-3 overflow-hidden'>
            <View className='h-full bg-primary-500 rounded-full animate-pulse' style={{width: '60%'}} />
          </View>
        </View>
      )}

      {/* Add Images Button */}
      {validGalleryImages.length === 0 && !isProcessing && (
        <TouchableOpacity
            onPress={handleImagePick}
            disabled={isProcessing}
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
      {validGalleryImages.length > 0 && !isProcessing && (
        <View>
            <Text className='text-sm font-rubik-medium text-black-300 mb-3'>
                {validGalleryImages.length} image{validGalleryImages.length === 1 ? '' : 's'} selected
            </Text>

            <View className='flex-row flex-wrap gap-2'>
                {validGalleryImages.map((imageUri, index) => (
                    <View key={index} className='relative'>
                        <Image 
                            source={{ uri: imageUri }}
                            className='size-20 rounded-md'
                            resizeMode='cover'
                            onError={() => {
                              const updatedImages = validGalleryImages.filter((_, i) => i !== index);
                              updateFormData('galleryImages', updatedImages)
                            }}
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
              onPress={handleImagePick}
              disabled={isProcessing}
              className={`mt-3 border rounded-lg p-3 items-center justify-center flex-row ${
                isProcessing 
                  ? 'border-gray-300 bg-gray-100' 
                  : 'border-primary-300 bg-white'
              }`}
            >
              {isProcessing ? (
                <ActivityIndicator size="small" color="#9CA3AF" />
              ) : (
                <Ionicons name="add" size={20} color="#3B82F6" />
              )}
              <Text className={`ml-2 font-rubik-medium ${
                isProcessing ? 'text-gray-400' : 'text-primary-300'
              }`}>
                {isProcessing ? 'Processing...' : 'Add More Images'}
              </Text>
            </TouchableOpacity>
        </View>
      )}
    </View>
  )
}

export default GalleryImagesSection