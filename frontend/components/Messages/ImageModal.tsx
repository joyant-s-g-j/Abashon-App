import { View, Dimensions, Modal, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

interface ImageModalProps {
  visible: boolean;
  imageUri: string | null;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({
    visible,
    imageUri,
    onClose
}) => {
  return (
    <Modal
        visible={visible}
        transparent={true}
        onRequestClose={onClose}
    >
        <View className="flex-1 bg-black/90 justify-center items-center">
            <TouchableOpacity
                className="absolute top-12 right-5 w-10 h-10 rounded-full bg-white/30 justify-center items-center z-10"
                onPress={onClose}
            >
                <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
            {imageUri && (
                <Image
                    source={{ uri: imageUri }}
                    style={{ width, height: height * 0.8 }}
                    resizeMode="contain"
                />
            )}
        </View>
    </Modal>
  )
}

export default ImageModal