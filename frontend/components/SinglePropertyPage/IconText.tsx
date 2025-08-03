import React from 'react';
import { View, Text, Image, ImageSourcePropType } from 'react-native';

interface Props {
  icon: ImageSourcePropType;
  text: string;
}

const IconText: React.FC<Props> = ({ icon, text }) => {
  return (
    <View className="flex-row items-center">
      <View className="bg-primary-200 rounded-full size-10 items-center justify-center">
        <Image source={icon} className="size-5" />
      </View>
      <Text className="ml-2 font-rubik-semibold text-black-300">{text}</Text>
    </View>
  );
};

export default IconText;
