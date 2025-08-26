import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import Heading from './Heading'
import IconText from './IconText'
import Gallery from './Gallery'
import Location from './Location'
import icons from '@/constants/icons'
import { Property } from '../PropertyManagement'

interface PropertDetailsProps {
  property?: Property | null;
}

const PorpertyDetails: React.FC<PropertDetailsProps> = ({ property }) => {
  if (!property) {
    return (
      <View className='p-4'>
        <Text className='text-base font-rubik text-gray-500'>Loading property details...</Text>
      </View>
    )
  }
  const galleryImages = [
    property?.thumbnailImage,
    ...(property?.galleryImages || [])
  ].filter(Boolean)

  const getFacilities = () => {
    if(!property.facilities || !Array.isArray(property.facilities)) {
      return []
    }

    return property.facilities.map((facility, index) => {
      if (typeof facility === 'object') {
        return {
          id: facility._id || index.toString(),
          name: facility.name || 'Facility',
          icon: facility.icon
        }
      }

      if (typeof facility === 'string') {
        return {
          id: index.toString(),
          name: facility
        }
      }

      return {
        id: index.toString(),
        name: 'Facility'
      }
    })
  }
  const facilities = getFacilities()
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
            {facilities.map((facility) => (
                <View key={facility.id} className="w-[22%] mb-3">
                    <IconText 
                      icon={{ uri: facility.icon as any }} 
                      text={facility.name}
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
          images={galleryImages as any}
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