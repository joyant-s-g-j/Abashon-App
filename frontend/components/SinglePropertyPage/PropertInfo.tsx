import { View, Text, Image } from 'react-native'
import React from 'react'
import icons from '@/constants/icons'
import IconText from './IconText'
import images from '@/constants/images'


const PropertInfo = () => {
  return (
    <View className='p-4 flex flex-col gap-2'>
      <Text className='text-3xl text-black-300 font-rubik-bold'>Modern Appartment</Text>
      {/* category and rating */}
      <View className='flex-row gap-3 items-center'>
        <Text className='px-4 py-2 rounded-full text-base font-rubik-semibold bg-primary-100 border border-primary-200 text-primary-300'>Apartment</Text>
        <View className='flex-row gap-1'>
            <Image source={icons.star} className='size-5' />
            <Text className='font-rubik-semibold text-black-200 text-base'>4.8 (12 Reviews)</Text>
        </View>
      </View>
      {/* room count */}
      <View className='flex-row justify-between border-b pb-4 border-primary-200'>
        <IconText icon={icons.bed} text='8 Beds' />
        <IconText icon={icons.bath} text='3 Bath' />
        <IconText icon={icons.area} text='2000 sqft' />
      </View>
      {/* agent info */}
      <View className='my-4 flex-col gap-2'>
        <Text className='text-2xl text-black-300 font-rubik-bold'>Agent</Text>
        <View className='flex-row justify-between items-center'>
            <View className='flex-row gap-3 items-center'>
                <Image source={images.avatar} className='size-14 rounded-full' />
                <View className='flex-col'>
                    <Text className='text-lg font-rubik-semibold text-black-300'>Joyant Sheikhar</Text>
                    <Text className='text-base font-rubik text-black-200'>Owner</Text>
                </View>
            </View>
            <View className='flex-row gap-3 items-center'>
                <Image source={icons.chat} className='size-8' />
                <Image source={icons.phone} className='size-8' />
            </View>
        </View>
      </View>
    </View>
  )
}

export default PropertInfo