import { View, Text } from 'react-native'
import React from 'react'
import { Property } from '../types/property'
import { StatCard } from '@/components/ReusableComponent';

interface PropertyStatsProps {
    properties: Property[];
}

const PropertyStats: React.FC<PropertyStatsProps> = ({properties}) => {
  const featuredProperties = properties.filter(proerty => proerty.isFeatured).length
  return (
    <View className="flex-row justify-between mb-6">
        <StatCard
            value={properties.length}
            label="Total Properties"
            style="flex-1 mr-2"
        />
        <StatCard
            value={featuredProperties}
            label="Featured Properties"
            valueColor="text-primary-300"
            style="flex-1 ml-2"
        />
    </View>
  )
}

export default PropertyStats