import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import icons from '@/constants/icons'
import images from '@/constants/images'

const profile = () => {
  const handleLogout = async () => {}
  return (
    <SafeAreaView>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName='pb-32 px-7'
      >
        <View className='flex flex-row items-center justify-between mt-5'>
          <Text className='text-xl font-rubik-bold'>Profile</Text>
          <Image source={icons.bell} className='size-5' />
        </View>
        
        <View className='flex-row justify-center flex mt-5'>
          <View className='flex flex-col items-center relative mt-5'>
            <Image
              source={images.avatar}
              className='size-44 relative rounded-full'
            />
            <TouchableOpacity className='absolute bottom-11 right-10'>
              <Image source={icons.edit} className='size-9' />
            </TouchableOpacity>

            <Text className='text-2xl font-rubik-bold mt-2'>
              Joyant Sheikhar Gupta Joy
            </Text>
          </View>
        </View>

        <View className='flex flex-col mt-10'>

        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default profile