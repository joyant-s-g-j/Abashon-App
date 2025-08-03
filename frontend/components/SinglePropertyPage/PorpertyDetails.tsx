import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import Heading from './Heading'
import IconText from './IconText'
import Gallery from './Gallery'
import { facilities, gallery } from '@/constants/data'
import Location from './Location'
import icons from '@/constants/icons'

const PorpertyDetails = () => {
  const galleryImages = gallery.map(item => item.image)
  const handleImagePress = (index: number) => {
    // Handle individual image press
    console.log('Image pressed:', index);
    // You can navigate to full screen image viewer
  };

  const handleViewAllPress = () => {
    // Handle view all images press
    console.log('View all images pressed');
    // Navigate to full gallery view
  };

  return (
    <View className='mt-4'>
      {/* facilities */}
      <View className='flex-col gap-3'>
        <Heading title='Facilities' />
        <View className="flex-row flex-wrap gap-4">
            {facilities.map((item, index) => (
                <View key={index} className="w-[22%] mb-3">
                    <IconText 
                        icon={item.icon} 
                        text={item.title} 
                        direction='col'
                    />
                </View>
            ))}
        </View>
      </View>
      {/* gallary */}
      <View>
        <Heading title='Gallery' />
        <Gallery 
            images={galleryImages}
            onImagePress={handleImagePress}
            onViewAllPress={handleViewAllPress}
        />
      </View>
      {/* location */}
      <Location />
      {/* Ratings */}
      <View className='flex-row justify-between mt-3'>
        <TouchableOpacity className='flex-row gap-2'>
          <Image source={icons.star} className='size-5' />
          <Text className='text-black-300 font-rubik-semibold text-lg'>4.8 (12 reviews)</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text className='text-primary-300 font-rubik-semibold text-lg'>See All</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default PorpertyDetails