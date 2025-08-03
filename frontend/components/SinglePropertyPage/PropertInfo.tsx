import { View, Text, Image } from 'react-native'
import React from 'react'
import icons from '@/constants/icons'

const PropertInfo = () => {
  return (
    <View className='p-4 flex flex-col gap-2'>
      <Text className='text-3xl text-black-300 font-rubik-bold'>Modern Appartment</Text>
      {/* category and rating */}
      <View className='flex-row gap-3 items-center'>
        <Text className='px-4 py-2 rounded-full text-lg font-rubik-semibold bg-primary-100 border border-primary-200 text-primary-300'>Apartment</Text>
        <View className='flex-row gap-1'>
            <Image source={icons.star} className='size-5' />
            <Text className='font-rubik-semibold text-black-200 text-lg'>4.8 (12 Reviews)</Text>
        </View>
      </View>
      {/* room count */}
      
    </View>
  )
}

export default PropertInfo