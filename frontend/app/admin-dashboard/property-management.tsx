import { View, Text, Image, TextInput, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Header, StatCard } from '@/components/ReusableComponent'
import icons from '@/constants/icons'
import SearchInput from '@/components/SearchInput'

const PropertyMangement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
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
        <View className="flex-row justify-between mb-6">
          <StatCard
            value="10"
            label="Total Properties"
            style="flex-1 mr-2"
          />
          <StatCard
            value="5"
            label="Featured Properties"
            valueColor="text-primary-300"
            style="flex-1 ml-2"
          />
        </View>
        <Text className='text-lg font-rubik-semibold text-black-300 mb-4'>
          All Properties
        </Text>
      </ScrollView>
    </SafeAreaView>
  )
}

export default PropertyMangement