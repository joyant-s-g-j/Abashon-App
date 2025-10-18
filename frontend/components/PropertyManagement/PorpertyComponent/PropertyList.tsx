import { EmptyState, LoadingBox, SectionTitle } from '@/components/ReusableComponent';
import React from 'react';
import { View } from 'react-native';
import { Property } from '../types/property';
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
  if (isLoading) {
    return <LoadingBox text="Loading properties" />;
  }

  return (
    <>
        <EmptyState 
            isEmpty={properties.length === 0}
            icon='business-outline'
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