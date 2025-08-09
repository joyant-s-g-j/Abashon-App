import { View, Text, TouchableOpacity, Image, ImageSourcePropType } from 'react-native';
import React from 'react';
import { router } from 'expo-router';
import icons from '@/constants/icons';

interface HeaderProps {
  title: string;
  backRoute: string;
  rightIcon?: React.ReactNode | ImageSourcePropType;
  onRightPress?: () => void;  
}

const Header: React.FC<HeaderProps> = ({ title, backRoute, rightIcon, onRightPress }) => {
  const isImageSource = (icon: any): icon is ImageSourcePropType => {
    // Check if it's a number (require() result) or has uri/source properties
    return typeof icon === 'number' || 
           (typeof icon === 'object' && 
            icon !== null && 
            !React.isValidElement(icon) && // Exclude React elements
            (icon.uri !== undefined || typeof icon === 'object'));
  };

  return (
    <View className='w-full p-4 flex-row items-center justify-between z-50'>
      <TouchableOpacity
        onPress={() => router.push(backRoute as any)}
        className='bg-primary-200 rounded-full size-11 items-center justify-center'
      >
        <Image source={icons.backArrow} className='size-6' />
      </TouchableOpacity>

      <Text className='text-xl font-rubik-bold text-black-300'>{title}</Text>
      
      {rightIcon ? (
        isImageSource(rightIcon) ? (
          <TouchableOpacity
            onPress={onRightPress}
            className='bg-primary-200 rounded-full size-11 items-center justify-center'
          >
            <Image source={rightIcon} className='size-6' />
          </TouchableOpacity>
        ) : (
          // Render React component directly (like AddButton)
          rightIcon
        )
      ) : (
        <View className='w-11' /> // placeholder for spacing - matches size-11
      )}
    </View>
  );
};

export default Header;