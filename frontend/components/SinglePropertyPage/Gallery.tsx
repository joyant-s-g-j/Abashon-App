import React from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

interface GalleryProps {
  images: (number | { uri: string })[];
  onImagePress?: (index: number) => void;
  onViewAllPress?: () => void;
}

const Gallery: React.FC<GalleryProps> = ({
  images,
  onImagePress,
  onViewAllPress,
}) => {
  const displayImages = images.slice(0, 3); // Only first 3 images
  const remainingCount = images.length - 3;

  const imageSize = (width - 40) / 3; // 3 images per row, 40 = 16+16 padding + gap

  return (
    <View className="mt-3">
      <View className="flex-row justify-between">
        {displayImages.map((image, index) => (
          <TouchableOpacity
            key={index}
            onPress={() =>
              index === 2 && remainingCount > 0
                ? onViewAllPress?.()
                : onImagePress?.(index)
            }
            className="rounded-xl overflow-hidden relative"
            style={{ width: imageSize, height: imageSize }}
          >
            <Image
              source={image}
              style={{ width: '100%', height: '100%' }}
              resizeMode="cover"
            />
            {/* Overlay on 3rd image */}
            {index === 2 && remainingCount > 0 && (
              <View className="absolute inset-0 bg-black/60 justify-center items-center">
                <Text className="text-white text-xl font-rubik-bold">+{remainingCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default Gallery;
