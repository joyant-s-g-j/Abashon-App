// components/ImageSlider.tsx
import React, { useState } from 'react';
import { View, Image, Dimensions, Text } from 'react-native';
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

      {/* Dots */}
      <View className="absolute bottom-4 left-0 right-0 flex-row justify-center items-center">
        {images?.map((_, index) => (
          <Text
            key={index}
            className={`text-lg mx-1 ${
              index === active ? 'text-white' : 'text-primary-300'
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
