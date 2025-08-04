import { View, ScrollView } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import ImageSlider from '@/components/SinglePropertyPage/ImageSlider'
import PropertInfo from '@/components/SinglePropertyPage/PropertInfo'
import { gallery } from '@/constants/data'
import PorpertyDetails from '@/components/SinglePropertyPage/PorpertyDetails'
import BookingTab from '@/components/SinglePropertyPage/BookingTab'

const Property = () => {
  // const {id} = useLocalSearchParams()
  const galleryImages = gallery.map(item => item.image)
  return (
    <SafeAreaView className='flex-1'>
      <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
        <ImageSlider images={galleryImages} />
        <View className='p-4'>
          <PropertInfo />
          <PorpertyDetails />
        </View>
      </ScrollView>
      <BookingTab />
    </SafeAreaView>
  )
}

export default Property