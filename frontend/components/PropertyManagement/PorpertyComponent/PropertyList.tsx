import { View, Text } from 'react-native'
import React from 'react'
import { Property } from '../types/property'
import { EmptyState, LoadingBox, SectionTitle } from '@/components/ReusableComponent';
import PropertyCard from './PropertyCard';

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
  return (
    <>
        <LoadingBox isLoading={isLoading} message="Loading properties" />

        <EmptyState 
            isEmpty={properties.length === 0}
            emoji='🏡'
            title='No Properties found'
            message={
                searchQuery
                  ? "Try adjusting you search"
                  : "Add your first properties to get started"
            }
        />
  
        <View>
            <SectionTitle title="All Properties" count={properties.length} />
            {properties.map((property, index) => (
                <PropertyCard 
                    key={property._id || index}
                    property={property}
                    onEdit={() => onEditProperty(property)}
                    onDelete={() => onDeleteProperty(property)}
                    isLoading={isLoading}
                />
            ))}
        </View>
    </>
  )
}

export default PropertyList