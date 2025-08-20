import { View, Text } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';

interface EmptyStateProps {
    isEmpty: boolean;
    icon?: string;
    title: string;
    message: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
    isEmpty,
    icon,
    title,
    message
}) => {
  if (!isEmpty) return null; 
  return (
    <View className='bg-white rounded-xl p-8 items-center justify-center shadow-sm'>
        {/* <Text className='text-3xl mb-2'>{emoji}</Text> */}
        <Ionicons name={icon as keyof typeof Ionicons.glyphMap} size={40} color="#9CA3AF" />
        <Text className='text-black-300 font-rubik-medium mb-1'>{title}</Text>
        <Text className='text-black-200 font-rubik text-center'>{message}</Text>
    </View>
  )
}

export default EmptyState