import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import ImageViewing from 'react-native-image-viewing'

const { width } = Dimensions.get('window');
interface GalleryProps {
  images: (number | { uri: string })[];
}

const Gallery: React.FC<GalleryProps> = ({ images }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const displayImages = images.slice(0, 3);
  const remainingCount = images.length - 3;
  const imageSize = (width - 40) / 3;

  const ImageViewingData = images.map(img => {
    if(typeof img === 'string') {
      return { uri: img };
    } else if (typeof img === 'object' && 'uri' in img) {
      return img;
    } else {
      return { uri: Image.resolveAssetSource(img).uri }
    }
  })

  const handleImagePress = (index: number) => {
    setCurrentIndex(index);
    setIsVisible(true);
  }

  const handleViewAllPress = (index: number) => {
    setCurrentIndex(index)
    setIsVisible(true)
  }

  return (
    <View className="mt-3">
      <View className="flex-row justify-between">
        {displayImages.map((image, index) => {
          if (index === 2 && remainingCount > 0) {
            return (
              <TouchableOpacity
                key={index}
                onPress={() => handleViewAllPress(index)}
                className="rounded-xl overflow-hidden relative"
                style={{ width: imageSize, height: imageSize }}
              >
                <Image
                  source={typeof image === 'string' ? { uri: image }: image}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="cover"
                />
                <View className="absolute inset-0 bg-black/60 justify-center items-center">
                  <Text className="text-white text-xl font-rubik-bold">+{remainingCount}</Text>
                </View>
              </TouchableOpacity>
            )
          }

          return (
            <TouchableOpacity
              key={index}
              onPress={() => handleImagePress(index)}
              className='rounded-xl overflow-hidden'
              style={{ width: imageSize, height: imageSize }}
            >
              <Image 
                source={typeof image === 'string' ? { uri: image} : image }
                className='w-full h-full'
                resizeMode='cover'
              />
            </TouchableOpacity>
          )
        })}
      </View>

      <ImageViewing 
        images={ImageViewingData}
        imageIndex={currentIndex}
        visible={isVisible}
        onRequestClose={() => setIsVisible(false)}
        swipeToCloseEnabled={true}
        doubleTapToZoomEnabled={true}
      />
    </View>
  );
};

export default Gallery;
