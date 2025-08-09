import { ExploreCard } from '@/components/Cards'
import Filters from '@/components/Filters'
import Header from '@/components/ReusableComponent/Header'
import Search from '@/components/Search'
import icons from '@/constants/icons'
import React from 'react'
import { FlatList, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const explore = () => {
  return (
    <SafeAreaView className="bg-white h-full">
      <Header title='Search for Your Ideal Home' backRoute='/' rightIcon={icons.bell} />
      <FlatList
        data={[1, 2, 3, 4]}
        renderItem={({item}) => <ExploreCard id={item.toString()} />}
        keyExtractor={(item) => item.toString()}
        contentContainerClassName="pb-32 px-4"
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>

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