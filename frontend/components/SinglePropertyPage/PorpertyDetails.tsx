import { View, Text, Image } from 'react-native'
import React from 'react'
import Heading from './Heading'
import IconText from './IconText'
import Gallery from './Gallery'
import { facilities, gallery } from '@/constants/data'
import icons from '@/constants/icons'
import Location from './Location'

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
    </View>
  )
}

export default PorpertyDetails