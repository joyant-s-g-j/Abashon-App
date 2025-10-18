// components/ImageSlider.tsx
import icons from '@/constants/icons';
import { useRouter } from 'expo-router';

import React, { useState } from 'react';
import { Dimensions, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

interface Props {
  images: string[];
}

const ImageSlider: React.FC<Props> = ({ images }) => {
  const [active, setActive] = useState(0);
  const router = useRouter()

  const safeImages = images && images.length > 0 ? images : [];

  const renderImage = (imageUrl: string) => {
    if (typeof imageUrl === 'string' && (imageUrl.startsWith('http') || imageUrl.startsWith('https'))) {
      return { uri: imageUrl };
    } else {
      return { uri: imageUrl };
    }
  }
  
  const handleScroll = (event: any) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    setActive(Math.round(index));
  }
  
  return (
    <View className="relative h-[250px]">
      <ScrollView
        horizontal
        pagingEnabled
        scrollEventThrottle={16}
        onScroll={handleScroll}
        showsHorizontalScrollIndicator={false}
      >
        {safeImages.map((image, index) => (
          <Image
            key={index}
            source={renderImage(image)}
            style={{ width, height: 250 }}
            resizeMode="cover"
          />
        ))}
      </ScrollView>
      
      {/* upper content */}
      <View className="absolute top-3 left-3 right-3 flex-row items-center justify-between z-10">
        <TouchableOpacity 
          onPress={() => router.replace('/(root)/(tabs)')}
          className='bg-primary-200 rounded-full size-11 items-center justify-center'
        >
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
        {safeImages?.map((_, index) => (
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
