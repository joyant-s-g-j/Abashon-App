import { View, Text, ScrollView, Image, TouchableOpacity, ImageSourcePropType } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import icons from '@/constants/icons'
import images from '@/constants/images'
import { settings } from '@/constants/data'
import { useRouter } from 'expo-router'

interface SettingsItemProps {
  icon: ImageSourcePropType;
  title: string;
  onPress?: () => void;
  textStyle?: string;
  showArrow?: boolean;
}

const SettingsItem = ({icon, title, onPress, textStyle, showArrow = true }: SettingsItemProps) => {
  return (
    <TouchableOpacity onPress={onPress} className='flex flex-row items-center justify-between py-3'>
      <View className='flex flex-row items-center gap-3'>
        <Image source={icon} className='size-6' resizeMode='contain' />
        <Text className={`text-lg font-rubik-medium text-black-300 ${textStyle}`}>{title}</Text>
      </View>

      {showArrow && <Image source={icons?.rightArrow} className='size-5' />}
    </TouchableOpacity>
  )
}

const profile = () => {
  const router = useRouter()
  const handleLogout = async () => {
    try {
      router.replace('/login');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }
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

        <View className='flex flex-col mt-5'>
          <SettingsItem icon={icons.calendar} title='My Bookings' />
          <SettingsItem icon={icons.wallet} title='Payments' />
        </View>

        <View className='flex flex-col mt-5 border-t pt-5 border-primary-200'>
          {settings.slice(2).map((item, index) => (
            <SettingsItem key={index} {...item} />
          ))}
        </View>

        <View className='flex flex-col mt-5 border-t pt-5 border-primary-200'>
          <SettingsItem
            icon={icons.logout} 
            title='Logout' 
            textStyle='text-danger' 
            showArrow={false} 
            onPress={handleLogout}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default profile