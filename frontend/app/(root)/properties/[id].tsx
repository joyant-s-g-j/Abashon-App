import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import images from '@/constants/images'
import ImageSlider from '@/components/SinglePropertyPage/ImageSlider'
import PropertInfo from '@/components/SinglePropertyPage/PropertInfo'
import { gallery } from '@/constants/data'
import PorpertyDetails from '@/components/SinglePropertyPage/PorpertyDetails'

const Property = () => {
  // const {id} = useLocalSearchParams()
  const galleryImages = gallery.map(item => item.image)
  return (
    <SafeAreaView>
      <ScrollView>
        <ImageSlider images={galleryImages} />
        <View className='p-4'>
          <PropertInfo />
          <PorpertyDetails />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Property