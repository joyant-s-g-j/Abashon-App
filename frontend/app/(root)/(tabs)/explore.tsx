import { View, Text, TouchableOpacity, FlatList, Image } from 'react-native'
import React from 'react'
import { Link, router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Card, ExploreCard, FeaturedCard } from '@/components/Cards'
import icons from '@/constants/icons'
import Search from '@/components/Search'
import Filters from '@/components/Filters'

const explore = () => {
  return (
    <SafeAreaView className="bg-white h-full">
      <FlatList
        data={[1, 2, 3, 4]}
        renderItem={({item}) => <ExploreCard />}
        keyExtractor={(item) => item.toString()}
        contentContainerClassName="pb-32 px-4"
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <View className="flex flex-row items-center justify-between mt-5">
              <TouchableOpacity onPress={() => router.back()} className='flex flex-row bg-primary-200 rounded-full size-11 items-center justify-center'>
                <Image source={icons.backArrow} className='size-6' />
              </TouchableOpacity>
              <Text className='text-base mr-2 text-center font-rubik-medium text-black-300'>Search for Your Ideal Home</Text>
              <Image source={icons.bell} className="size-6" />
            </View>

            <Search />

            <View className="flex mt-5 flex-row items-center justify-between">
              <Text className="text-xl font-rubik-bold text-black-300">Our Recommendation</Text>
              <TouchableOpacity>
                <Text className="text-base font-rubik-bold text-primary-300">See All</Text>
              </TouchableOpacity>
            </View>

            <Filters /> 
          </View> 
          }
        />
            
    </SafeAreaView>
  )
}

export default explore