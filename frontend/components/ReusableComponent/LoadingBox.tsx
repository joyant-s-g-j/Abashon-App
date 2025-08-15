import React from 'react';
import { View, Text } from 'react-native';

interface LoadingBoxProps {
  isLoading: boolean;
  message?: string;
}

const LoadingBox: React.FC<LoadingBoxProps> = ({ isLoading, message = "Loading..." }) => {
  if (!isLoading) return null;

  return (
    <View className='bg-white rounded-xl p-8 items-center justify-center shadow-sm'>
      <Text className='text-primary-300 font-rubik-medium'>{message}</Text>
    </View>
  );
};

export default LoadingBox;
