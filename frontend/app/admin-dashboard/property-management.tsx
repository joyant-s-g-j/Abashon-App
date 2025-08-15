import { Text, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Header } from '@/components/ReusableComponent'
import SearchInput from '@/components/SearchInput'
import { filterProperties, PropertyList, PropertyStats, useProperties } from '@/components/PropertyManagement'

const PropertyMangement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const {
    properties,
    isLoading,
    loadProperties,
    addProperty,
    updatePorperty,
    deleteProperty
  } = useProperties()

  const filteredProperties = filterProperties(properties, searchQuery)
  return (
    <SafeAreaView>
      <Header 
        backRoute='/admin-dashboard' 
        rightIcon={<Text className='bg-primary-300 text-3xl font-rubik-bold text-white px-3.5 py-1.5 rounded-full'>+</Text>} 
        title='Property Management' 
      />
      <ScrollView 
        className='px-4'
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <SearchInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search Properties..."
        />
        
        <PropertyStats properties={properties} />

        {/* <PropertyList 
          properties={filteredProperties}
          searchQuery={searchQuery}
          isLoading={isLoading}
          onEditProperty={}
        /> */}
      </ScrollView>
    </SafeAreaView>
  )
}

export default PropertyMangement