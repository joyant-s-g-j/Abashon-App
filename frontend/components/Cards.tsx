import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import images from '@/constants/images'
import icons from '@/constants/icons'
import { useRouter } from 'expo-router'
import { Property } from './PropertyManagement'

interface Props {
    id: string
    onPress?: () => void
}

export function useNavigateToProperty() {
    const router = useRouter()

    function navigateToProperty(id: string, onPress?: () => void) {
        if(onPress) {
            onPress();
        }
        router.replace(`/properties/${id}`);
    }
    return { navigateToProperty }
}

export const FeaturedCard = ({id, onPress }: Props) => {
  const { navigateToProperty } = useNavigateToProperty();
  return (
    <TouchableOpacity onPress={() => navigateToProperty(id, onPress)} className='flex flex-col items-start w-60 h-80 relative'>
        
        <Image source={images.japan} className='size-full rounded-2xl' />
        <Image source={images.cardGradient} className='size-full rounded-2xl absolute bottom-0' />

        <View className='flex flex-row items-center bg-white/90 px-3 py-1.5 rounded-full absolute top-5 right-5'>
            <Image source={icons.star} className='size-3.5' />
            <Text className='text-xs font-rubik-bold text-primary-300 ml-1'>4.4</Text>
        </View>

        <View className='flex flex-col items-start absolute bottom-5 inset-x-5'>
            <Text 
                className='text-xl font-rubik-extrabold text-white'
                numberOfLines={1}
            >
                Modern Appartment
            </Text>
            <Text className='text-base font-rubik text-white'>
                22 W 15th St, New York
            </Text>

            <View className='flex flex-row items-center justify-between w-full'>
                <Text className='text-xl font-rubik-extrabold text-white'>$2,500</Text>
                <Image source={icons.heart} className='size-5'/>
            </View>
        </View>
    </TouchableOpacity>
  )
}

export const Card = ({id, onPress}: Props) => {
  const { navigateToProperty } = useNavigateToProperty();
  return (
    <TouchableOpacity 
        onPress={() => navigateToProperty(id, onPress)}
        className='flex-1 w-full mt-4 px-3 py-4 rounded-lg bg-white shadow-lg shadow-black-100/70 relative'
    >
      <View className='flex flex-row items-center absolute px-2 top-5 right-5 bg-white/90 p-1 rounded-full z-50'>
            <Image source={icons.star} className='size-2.5' />
            <Text className='text-xs font-rubik-bold text-primary-300 ml-0.5'>4.4</Text>
        </View>

        <Image source={images.newYork} className='w-full h-40 rounded-lg' />

        <View className='flex flex-col mt-2'>
            <Text 
                className='text-base font-rubik-bold text-black-300'
            >
                Cozy Studio
            </Text>
            <Text className='text-base font-rubik text-black-200'>
                22 W 15th St, New York
            </Text>

            <View className='flex flex-row items-center justify-between mt-2'>
                <Text className='text-base font-rubik-bold text-primary-300'>$2,500</Text>
                <Image source={icons.heart} className='size-5 mr-2' tintColor="#191d31" />
            </View>
        </View>
    </TouchableOpacity>
  )
}

interface ExploreCardProps {
    id: string;
    property: Property;
}

export const ExploreCard: React.FC<ExploreCardProps> = ({ id, property }) => {
    const { navigateToProperty } = useNavigateToProperty();
    return (
        <TouchableOpacity
            onPress={() => navigateToProperty(id)}
            className='flex-row items-center w-full mt-4 px-4 py-4 rounded-lg bg-white shadow-lg shadow-black-100/70'
        >
            {/* Image with rating */}
            <View className='relative'>
                <Image source={{ uri: property.thumbnailImage as string }} className='w-28 h-28 rounded-lg' />
                
                <View className='flex-row items-center absolute top-1 left-1 bg-white/90 px-1 py-0.5 rounded-full'>
                    <Image source={icons.star} className='size-3' />
                    <Text className='text-xs font-rubik-bold text-primary-300 ml-0.5'>{property.averageRating.toFixed(1)}</Text>
                </View>
            </View>

            {/* Content */}
            <View className='flex-1 flex flex-row justify-between items-center ml-4 h-full'>
                <View>
                    <Text className='text-base font-rubik-bold text-black-300'>
                        {property.name}
                    </Text>
                    <Text className='text-base font-rubik-bold text-primary-300'>${property.price}</Text>
                    
                </View>
                

                <View className='items-end'>
                    <Image source={icons.heart} className='size-5' tintColor="#cfcfcf" />
                </View>
            </View>
        </TouchableOpacity>
    );
};

