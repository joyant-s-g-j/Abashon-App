import { View, Text } from 'react-native'
import React from 'react'
import { Property } from '../types/property'
import { LoadingBox } from '@/components/ReusableComponent';

interface PropertyListProps {
    properties: Property[];
    searchQuery: string;
    isLoading: boolean;
    onEditProperty: (property: Property) => void;
    onDeleteProperty: (property: Property) => void;
}

const PropertyList: React.FC<PropertyListProps> = ({
    properties,
    searchQuery,
    isLoading,
    onEditProperty,
    onDeleteProperty
}) => {
  <LoadingBox isLoading={isLoading} message="Loading properties" />

  if(properties.length === 0) {
    
  }
  return (
    <View>
        <Text className='text-lg font-rubik-semibold text-black-300 mb-4'>
            All Properties
        </Text>
    </View>
  )
}

export default PropertyList