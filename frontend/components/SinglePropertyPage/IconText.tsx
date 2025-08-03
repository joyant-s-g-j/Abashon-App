import React from 'react';
import { View, Text, Image, ImageSourcePropType } from 'react-native';

interface Props {
  icon: ImageSourcePropType;
  text: string;
  direction?: 'row' | 'col'; // Optional: 'row' (default) or 'col'
}

const IconText: React.FC<Props> = ({ icon, text, direction = 'row' }) => {
  return (
    <View className={`flex-${direction} items-center`}>
      <View className="bg-primary-200 rounded-full size-10 items-center justify-center">
        <Image source={icon} className="size-5" />
      </View>
      <Text className={`${direction === 'row' ? 'ml-2' : 'mt-2'} text-center font-rubik-semibold text-black-300`}>
        {text}
      </Text>
    </View>
  );
};

export default IconText;
