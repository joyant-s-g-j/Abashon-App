import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native'
import React from 'react'
import { InputField, LabelText } from '@/components/ReusableComponent'
import { PropertyFormData } from '../../types/property'
import { useCategories } from '@/components/CategoryManagement';
import { TowColumnCheckbox } from '@/components/ReusableComponent/TowColumnCheckbox';
import { Ionicons } from '@expo/vector-icons';

interface RenderStepOneProps {
    formData: PropertyFormData;
    updateFormData: (field: keyof PropertyFormData, value: any) => void;
    onImagePick: () => void
}

const RenderStepOne: React.FC<RenderStepOneProps> = ({formData, updateFormData, onImagePick}) => {
  const {categories} = useCategories();
  const selectedImage = formData.imageUri || formData.thumbnailImage
  
  return (
    <ScrollView>
      <LabelText text='Basic Information' className='text-xl font-rubik-bold mb-4' />
      {/* property name */}
      <InputField
        label="Property Name *"
        value={formData.name}
        onChangeText={(text) => updateFormData("name", text)}
        placeholder="Enter property name"
      />
      {/* category */}
      <TowColumnCheckbox
        label='Category *'
        items={categories}
        selectedId={formData.type}
        onSelect={(id) => updateFormData('type', id)}
        getId={(item) => item._id}
        getLabel={(item) => item.name}
      />
      {/* thumbnail Image */}
      <LabelText text='Thumbnail Image *' className='mt-4' />
      <TouchableOpacity
        onPress={onImagePick}
        className='border border-dashed border-black-100 rounded-md items-center justify-center h-40'
      >
        {selectedImage ? (
          <View className='items-center w-full h-full relative'>
            <Image 
              source={{ uri: selectedImage }}
              className='w-full h-full rounded-md'
              resizeMode='cover'
            />
            <View className='absolute bottom-2 left-0 right-0 items-center'>
              <View className='bg-black/50 px-3 py-1 rounded-full'>
                <Text className='text-sm font-rubik text-white'>Tap to change</Text>
              </View>
            </View>
          </View>
        ) : (
          <View className="items-center p-6">
            <Ionicons name='camera-outline' size={40} color="#9CA3AF" />
            <Text className="text-base font-rubik-medium text-black-300">Add Thumbnail</Text>
            <Text className="text-sm font-rubik text-black-200">Tap to select image</Text>
          </View>
        )}
      </TouchableOpacity> 
    </ScrollView>
  )
}

export default RenderStepOne