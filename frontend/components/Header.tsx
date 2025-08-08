import { View, Text, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { router } from 'expo-router';
import icons from '@/constants/icons';


interface HeaderProps {
  title: string;
  backRoute: string;
  rightIcon?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ title, backRoute, rightIcon }) => {
  return (
    <View className='w-full p-4 flex-row items-center justify-between z-50'>
      <TouchableOpacity
        onPress={() => router.push(backRoute as any)}
        className='bg-primary-200 rounded-full size-11 items-center justify-center'
      >
        <Image source={icons.backArrow} className='size-6' />
      </TouchableOpacity>

      <Text className='text-xl font-rubik-bold text-black-300'>{title}</Text>
      <View className='w-10 items-center'>
        {rightIcon ? rightIcon : null}
      </View>
    </View>
  );
};

export default Header;
