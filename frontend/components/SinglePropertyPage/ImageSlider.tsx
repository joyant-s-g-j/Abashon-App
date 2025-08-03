// components/ImageSlider.tsx
import icons from '@/constants/icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { View, Image, Dimensions, Text, TouchableOpacity } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

const { width } = Dimensions.get('window');

interface Props {
  images: (number | { uri: string })[];
}

const ImageSlider: React.FC<Props> = ({ images }) => {
  const [active, setActive] = useState(0);

  return (
    <View className="relative h-[250px]">
      <Carousel
        loop
        autoPlay
        autoPlayInterval={3000}
        width={width}
        height={250}
        data={images}
        scrollAnimationDuration={1000}
        onSnapToItem={(index) => setActive(index)}
        renderItem={({ item }) => (
          <Image
            source={item}
            className="w-full h-full"
            resizeMode="cover"
          />
        )}
      />
      {/* upper content */}
      <View className="absolute top-3 left-3 right-3 flex-row items-center justify-between z-10">
        <TouchableOpacity onPress={() => router.back()} className='bg-primary-200 rounded-full size-11 items-center justify-center'>
          <Image source={icons.backArrow} className='size-6' />
        </TouchableOpacity>

        <View className='flex-row gap-3'>
          <TouchableOpacity>
            <Image source={icons.heart} className="size-6" tintColor="#000" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image source={icons.send} className='size-6' />
          </TouchableOpacity>
        </View>
      </View>

      {/* Dots */}
      <View className="absolute bottom-4 left-0 right-0 flex-row justify-center items-center">
        {images?.map((_, index) => (
          <Text
            key={index}
            className={`text-lg mx-1 ${
              index === active ? 'text-primary-300' : 'text-black-100'
            }`}
          >
            ●
          </Text>
        ))}
      </View>
    </View>
  );
};

export default ImageSlider;
