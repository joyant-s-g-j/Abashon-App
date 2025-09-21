import { View, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';
import { Video } from 'expo-av';

interface ImagePreviewProps {
    imageUri: string;
    type: string;
    onRemove: () => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
    imageUri,
    type,
    onRemove
}) => {
  return (
    <View className='px-4 py-2 bg-white border-t border-gray-200'>
        <View className='relative size-20'>
            {type.startsWith('image/') && (
                <Image 
                    source={{ uri: imageUri }}
                    className='size-20 rounded-md'
                    resizeMode='cover'
                />
            )}

            {type.startsWith('video/') && (
                <View className="w-24 h-24 rounded-xl overflow-hidden bg-gray-200 justify-center items-center">
                    <Video
                        source={{ uri: imageUri }}
                        style={{ width: '100%', height: '100%' }}
                        shouldPlay={false}
                        useNativeControls
                    />
                </View>
            )}

            {/* Remove button */}
            <TouchableOpacity
                onPress={onRemove}
                className='absolute -top-2 -right-2 bg-red-500 rounded-full p-1 items-center '
            >
                <Ionicons name='close' size={14} color="white" />
            </TouchableOpacity>
        </View>
    </View>
  )
}

export default ImagePreview