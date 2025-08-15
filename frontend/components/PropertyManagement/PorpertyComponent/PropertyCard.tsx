import { View, Text, Image } from 'react-native'
import React from 'react'
import { Property } from '../types/property'

interface PropertyCardProps {
    property: Property;
    isLoading: boolean;
    onEdit: (property: Property) => void;
    onDelete: (property: Property) => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
    property,
    isLoading,
    onEdit,
    onDelete
}) => {
  return (
    <View className='bg-white rounded-xl p-6 mb-4 shadow-sm border border-gray-100'>
      <View className='flex-row mb-4'>
        <Image 
            source={{ uri: property.thumbnailImage as string }}
            className='w-20 h-20 rounded-xl mr-4'
            resizeMode='cover'
        />
      </View>
    </View>
  )
}

export default PropertyCard