import { View, Text } from 'react-native'
import React from 'react'
import Heading from './Heading'
import IconText from './IconText'
import icons from '@/constants/icons'

const PorpertyInfoTwo = () => {
  const facilities = [
    { icon: icons.carPark, text: 'Car Parking' },
    { icon: icons.swim, text: 'Swimming Pool' },
    { icon: icons.dumbell, text: 'Gym' },
    { icon: icons.cutlery, text: 'Dining Area' },
    { icon: icons.wifi, text: 'Wi-Fi' },
    { icon: icons.dog, text: 'Pet Center' },
    { icon: icons.run, text: 'Sport Center' },
    { icon: icons.laundry, text: 'Laundry' }
    ];
  return (
    <View className='mt-4'>
      {/* facilities */}
      <View className='flex-col gap-3'>
        <Heading title='Facilities' />
        <View className="flex-row flex-wrap gap-4 mt-2">
            {facilities.map((item, index) => (
                <View key={index} className="w-[22%] mb-4">
                    <IconText 
                        icon={item.icon} 
                        text={item.text} 
                        direction='col'
                    />
                </View>
            ))}
        </View>
      </View>
    </View>
  )
}

export default PorpertyInfoTwo