import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

interface LoadingBoxProps {
  text?: string;
}

const LoadingBox: React.FC<LoadingBoxProps> = ({ text = "Loading..." }) => {
  return (
    <View className="flex-1 justify-center items-center">
      <ActivityIndicator size="large" color="#3B82F6" />
      <Text className="mt-3 text-base text-gray-600">{text}</Text>
    </View>
  );
};

export default LoadingBox;
