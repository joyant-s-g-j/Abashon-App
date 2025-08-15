import { View, Text, Image, TouchableOpacity } from 'react-native'
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
  // Helper function to get type name
  const getTypeName = (type: string | any) => {
    if (typeof type === 'string') {
      return type;
    }
    return type?.name || 'N/A';
  };

  // Helper function to get specifications
  const getSpecs = (specifications: string | any) => {
    if (typeof specifications === 'string') {
      return specifications;
    }
    const specs = specifications || {};
    return `${specs.bed || '0'} bed • ${specs.bath || '0'} bath • ${specs.area || 'N/A'}`;
  };

  // Helper function to get owner name
  const getOwnerName = (owner: string | any) => {
    if (typeof owner === 'string') {
      return owner;
    }
    return owner?.name || 'N/A';
  };

  return (
    <View className='bg-white rounded-xl p-6 mb-4 shadow-sm border border-gray-100'>
      <View className='flex-row mb-4'>
        <Image
          source={{ uri: property.thumbnailImage as string }}
          className='w-20 h-20 rounded-xl mr-4'
          resizeMode="cover"
        />
        <View className='flex-1'>
          <View className='flex-row items-center justify-between mb-2'>
            <Text className='text-lg font-rubik-semibold text-black-300 flex-1'>
              {property.name}
            </Text>
            {property.isFeatured && (
              <View className='bg-yellow-100 px-2 py-1 rounded-full'>
                <Text className='text-xs font-rubik-semibold text-yellow-700'>Featured</Text>
              </View>
            )}
          </View>
          
          <Text className='text-sm font-rubik text-primary-300 mb-1'>
            {getTypeName(property.type)}
          </Text>
          
          <Text className='text-sm font-rubik text-black-200 mb-2'>
            {getSpecs(property.specifications)}
          </Text>
          
          <View className='flex-row items-center justify-between'>
            <Text className='text-lg font-rubik-bold text-black-300'>
              ${property.price.toLocaleString()}
            </Text>
            <View className='flex-row items-center'>
              <Text className='text-yellow-500 mr-1'>⭐</Text>
              <Text className='text-sm font-rubik-medium text-black-300'>
                {property.averageRating.toFixed(1)}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View className='border-t border-gray-100 pt-3'>
        <Text className='text-xs font-rubik text-black-200 mb-2'>
          Owner: {getOwnerName(property.owner)} 
          {/* • Created: {new Date(property.createdAt).toLocaleDateString()} */}
        </Text>
        <Text className='text-xs font-rubik text-black-200 mb-3' numberOfLines={2}>
          📍 {property.location.address}
        </Text>
      </View>

      {/* Action Buttons */}
      <View className='flex-row justify-between items-center'>
        <TouchableOpacity
          onPress={() => onEdit(property)}
          disabled={isLoading}
          className='flex-1 bg-blue-50 py-3 px-4 rounded-lg mr-2'
        >
          <Text className='text-center text-primary-300 font-rubik-semibold text-sm'>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          disabled={isLoading}
          onPress={() => onDelete(property)}
          className='flex-1 bg-red-50 py-3 px-4 rounded-lg ml-2'
        >
          <Text className='text-center text-red-700 font-rubik-semibold text-sm'>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default PropertyCard