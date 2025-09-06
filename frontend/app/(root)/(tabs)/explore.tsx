import { ExploreCard } from '@/components/Cards'
import Filters from '@/components/Filters'
import { filterProperties, useProperties } from '@/components/PropertyManagement'
import Header from '@/components/ReusableComponent/Header'
import SearchInput from '@/components/SearchInput'
import icons from '@/constants/icons'
import { useLocalSearchParams } from 'expo-router'
import React, { useMemo, useState } from 'react'
import { FlatList, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const explore = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const params = useLocalSearchParams<{filter?: string}>()
  const selectedFilter = params.filter || "All"
  const {
    properties,
    isLoading,
  } = useProperties()
  const filteredProperties = useMemo(() => {
    let filtered = filterProperties(properties, searchQuery)

    if(selectedFilter !== "All") {
      filtered = filtered.filter(property => {
        if(typeof property.type === "object" && property.type.name) {
          return property.type.name === selectedFilter
        }
        return false
      })
    }
    return filtered
  }, [properties, searchQuery, selectedFilter])
  return (
    <SafeAreaView className="bg-white h-full">
      <Header title='Search for Your Ideal Home' backRoute='/' rightIcon={icons.bell} />
      <FlatList
        data={filteredProperties}
        renderItem={({item}) => (
          <ExploreCard 
            id={item._id.toString()}
            property={item}
          />
        )}
        keyExtractor={(item) => item._id.toString()}
        contentContainerClassName="pb-32 px-4"
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <SearchInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search Properties..."
            />
            <View className="flex mt-5 flex-row">
              <Text className="text-xl font-rubik-bold text-black-300">Our Recommendation</Text>
            </View>

            <Filters /> 
          </View> 
          }
        />
            
    </SafeAreaView>
  )
}

export default explore