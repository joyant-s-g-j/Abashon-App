import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

interface BookingTabProps {
    price: number | undefined;
}

const BookingTab: React.FC<BookingTabProps> = ({ price }) => {
  return (
    <View 
        pointerEvents='box-none' 
        className='absolute bottom-0 rounded-t-2xl left-0 right-0 px-5 pt-5 pb-12 bg-white flex-row justify-between items-center border-t-[0.5] border-black-100 z-50'
    >
        <View className='flex-col'>
            <Text className='text-sm tracking-widest font-rubik-medium text-black-200 uppercase'>Price</Text>
            <Text className='text-lg font-rubik-bold text-primary-300'>
                ${price}
            </Text>
        </View>
        <TouchableOpacity 
            onPress={() => console.log('Booking press')}
            className='bg-primary-300 px-5 py-4 rounded-full'
        >
            <Text className='font-rubik-semibold text-white'>Booking Now</Text>
        </TouchableOpacity>
    </View>
  )
}

export default BookingTab