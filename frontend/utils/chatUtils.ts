import * as ImageManipulator from 'expo-image-manipulator'
import * as VideoThumbnails from 'expo-video-thumbnails';
import * as ImagePicker from "expo-image-picker"
import { Alert } from 'react-native';
import { Message } from '@/services/chatApi';
export interface GiftedChatMessage {
    _id: string;
    text: string;
    createdAt: Date;
    user: {
        _id: string;
        name: string;
        avatar?: string
    };
    image?: string;
    video?: string;
}

export interface MediaAsset {
    uri: string;
    type: string;
    width?: number;
    height?: number;
    duration?: number;
    fileSize?: number;
}

const compressImage = async (
    uri: string,
    options: {
        quality?: number;
        maxWidth?: number;
        maxHeight?: number
    } = {}
) => {
    try {
        const { quality = 0.7, maxWidth = 800, maxHeight = 600 } = options
        const result = await ImageManipulator.manipulateAsync(
            uri,
            [
                { resize: {
                    width: maxWidth,
                    height: maxHeight
                }}
            ],
            {
                compress: quality,
                format: ImageManipulator.SaveFormat.JPEG,
            }
        )

        return {
            uri: result.uri,
            type: "image/jpeg",
            width: result.width,
            height: result.height
        }
    } catch (error) {
        console.log('Error compressing image:', error)
        return {
            uri,
            type: "image/jpeg",
        };
    }
}

const getVideoInfo = async (videoUri: string): Promise<{width: number, height: number, duration: number}> => {
    try {
        return {
            width: 1920,
            height: 1080,
            duration: 30
        }
    } catch (error) {
        console.error('Error getting video info:', error);
        return { width: 1920, height: 1080, duration: 30 };
    }
}

const compressVideo = async (
    videoUri: string,
    options: {
        quality?: number
    } = {}
): Promise<MediaAsset> => {
    try {
        const { quality = 0.8 } = options;

        const videoInfo = await getVideoInfo(videoUri)

        return {
            uri: videoUri,
            type: 'video/mp4',
            width: videoInfo.width,
            height: videoInfo.height,
            duration: videoInfo.duration
        }
    } catch (error) {
        console.error('Video compression error:', error);
        throw error;
    }
}

const openCamera = async (resolve: (value: MediaAsset | null) => void): Promise<void> => {
    try {
        const { status } = await ImagePicker.requestCameraPermissionsAsync()
        if (status !== 'granted') {
            Alert.alert('Permission needed', 'Camera permission is required')
            resolve(null)
            return
        }

        // Ask user what they want to capture
        Alert.alert(
            'Camera',
            'What do you want to capture?',
            [
                {
                    text: 'Photo',
                    onPress: async () => {
                        try {
                            const result = await ImagePicker.launchCameraAsync({
                                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                                allowsEditing: true,
                                aspect: [4, 3],
                                quality: 1.0
                            })

                            if (!result.canceled && result.assets && result.assets.length > 0) {
                                const asset = result.assets[0]
                                const compressedImage = await compressImage(asset.uri, {
                                    maxWidth: 1920,
                                    maxHeight: 1080,
                                    quality: 0.85,
                                });
                                resolve(compressedImage)
                            } else {
                                resolve(null)
                            }
                        } catch (error) {
                            console.error('Camera photo error:', error);
                            resolve(null);
                        }
                    }
                },
                {
                    text: 'Video',
                    onPress: async () => {
                        try {
                            const result = await ImagePicker.launchCameraAsync({
                                mediaTypes: ImagePicker.MediaTypeOptions.Videos,
                                allowsEditing: true,
                                quality: ImagePicker.UIImagePickerControllerQualityType.High,
                                videoMaxDuration: 60
                            })

                            if (!result.canceled && result.assets && result.assets.length > 0) {
                                const asset = result.assets[0]
                                const compressedVideo = await compressVideo(asset.uri, {
                                    quality: 0.8
                                })
                                resolve(compressedVideo)
                            } else {
                                resolve(null)
                            }
                        } catch (error) {
                            console.error('Camera video error:', error);
                            resolve(null);
                        }
                    }
                },
                { text: 'Cancel', style: 'cancel', onPress: () => resolve(null) }
            ]
        )
    } catch (error) {
        console.error('Camera error:', error);
        resolve(null);
    }
}

const openGallery = async (resolve: (value: MediaAsset | null) => void): Promise<void> => {
    try {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
        
        if(status !== 'granted') {
            Alert.alert('Permission needed', 'Media library permission is required');
            resolve(null);
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1.0,
            videoMaxDuration: 60
        })

        if(!result.canceled && result.assets && result.assets.length > 0) {
            const asset = result.assets[0]

            if(asset.type === 'image') {
                const compressedImage = await compressImage(asset.uri, {
                    maxWidth: 1920,
                    maxHeight: 1080,
                    quality: 0.85,
                })
                resolve(compressedImage)
            } else if (asset.type === 'video') {
                const compressedVideo = await compressVideo(asset.uri, {
                    quality: 0.8
                })
                resolve(compressedVideo)
            } else {
                resolve(null)
            }
        } else {
            resolve(null)
        }
    } catch (error) {
        console.error('Gallery error:', error);
        resolve(null);
    }
}

export const pickFromCamera = (): Promise<MediaAsset | null> => {
    return new Promise((resolve) => {
        openCamera(resolve);
    })
}

export const pickFromGallery = (): Promise<MediaAsset | null> => {
    return new Promise((resolve) => {
        openGallery(resolve);
    })
}


export const formatMessagesForGiftedChat = (
    message: Message[],
    currentUserId: string
): GiftedChatMessage[] => {
    return message.map((message) => {
        const senderId = typeof message.senderId === 'string'
            ? message.senderId
            : message.senderId._id;

        const senderName = typeof message.senderId === 'string'
            ? 'User'
            : message.senderId.name
        
        const senderAvatar = typeof message.senderId === 'string'
            ? undefined
            : message.senderId.avatar

        return {
            _id: message._id,
            text: message.text || '',
            createdAt: new Date(message.createdAt),
            user: {
                _id: senderId,
                name: senderName,
                avatar: senderAvatar
            },
            image: message.image && message.image.length > 0 ? message.image[0] : undefined,
            video: message.video && message.video.length > 0 ? message.video[0] : undefined
        }
    }).reverse()
}