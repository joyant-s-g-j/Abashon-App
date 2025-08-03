import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import images from '@/constants/images'
import ImageSlider from '@/components/SinglePropertyPage/ImageSlider'
import PropertInfo from '@/components/SinglePropertyPage/PropertInfo'

const Property = () => {
  // const {id} = useLocalSearchParams()
  const imageBox = [
    images.japan,
    images.newYork,
  ]
  return (
    <SafeAreaView>
      <ScrollView>
        <ImageSlider images={imageBox} />
        <PropertInfo />
      </ScrollView>
    </SafeAreaView>
  )
}

export default Property