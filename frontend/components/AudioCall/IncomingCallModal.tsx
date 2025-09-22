import { View, Text, Dimensions, Animated, Modal, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window')

interface IncomingCallModalProps {
    visible: boolean;
    callerInfo: {
        id: string;
        name: string;
        avatar?: string;
    };
    onAccept: () => void;
    onReject: () => void;
}

const IncomingCallModal: React.FC<IncomingCallModalProps> = ({
    visible,
    callerInfo,
    onAccept,
    onReject
}) => {
  const [pulseAnim] = useState(new Animated.Value(1))
  const [slideAnim] = useState(new Animated.Value(height))

  useEffect(() => {
    if(visible) {
        Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: true,
            tension: 65,
            friction: 8
        }).start()

        const pluseAnimation = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true
                })
            ])
        );
        pluseAnimation.start()

        return () => {
            pluseAnimation.stop()
            slideAnim.setValue(height)
            pulseAnim.setValue(1)
        }
    }
  }, [visible])

  if(!visible) return null;

  const getAvatarInitials = (name: string) => {
    if(!name) return '?';
    const words = name.split(' ').filter(Boolean)
    if(words.length === 1) return words[0][0].toUpperCase()
    return (words[0][0] + words[1][0]).toUpperCase()
  }

  return (
    <Modal 
        visible={visible}
        animationType='none'
        presentationStyle='fullScreen'
        statusBarTranslucent
    >
        <Animated.View
            style={{ transform: [{ translateY: slideAnim }] }}
            className="flex-1 bg-gradient-to-b from-blue-900 to-gray-900 justify-center items-center"
        >
            <View className="absolute inset-0 bg-black/20" />

            <View className='items-center mb-20 z-10'>
                <Text className='text-white text-lg mb-2 opacity-90'>
                    Incoming Audio Call
                </Text>

                <Animated.View
                    style={{ transform: [{ scale: pulseAnim}] }}
                    className="mb-8"
                >
                    <View className='size-40 rounded-full bg-white/10 items-center justify-center border-4 border-white/20'>
                        {callerInfo.avatar ? (
                            <Image 
                                source={{ uri: callerInfo.avatar }}
                                className='size-36 rounded-full'
                                resizeMode='cover'
                            />
                        ) : (
                            <View className='size-36 rounded-full bg-gray-300 justify-center items-center'>
                                <Text className='text-black-300 text-8xl font-rubik-semibold'>{getAvatarInitials(callerInfo.name)}</Text>
                            </View>
                        )}
                    </View>
                </Animated.View>

                 <Text className="text-white text-3xl font-bold mb-3 text-center">
                    {callerInfo.name}
                </Text>
                <Text className="text-white/70 text-lg mb-4">
                    Audio Call
                </Text>

                <View className="flex-row items-center mb-8">
                    <View className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
                    <Text className="text-white/80 text-base">
                        Calling...
                    </Text>
                </View>
            </View>

            <View className='flex-row justify-center space-x-20 z-10'>
                <TouchableOpacity
                    onPress={onReject}
                    className='size-20 bg-red-200 rounded-full items-center justify-center shadow-lg'
                    style={{
                        shadowColor: '#EF4444',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 8,
                        elevation: 8
                    }}
                >
                    <Ionicons 
                        name='call'
                        size={32}
                        color="white"
                        style={{ transform: [{ rotate: '135deg' }]}}
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={onAccept}
                    className='size-20 bg-green-500 rounded-full items-center justify-center shadow-lg'
                    style={{
                        shadowColor: '#22C55E',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 8,
                        elevation: 8,
                    }}
                >
                    <Ionicons name="call" size={32} color="white" />
                </TouchableOpacity>
            </View>

            <View className="absolute bottom-16 items-center">
                <Text className="text-white/60 text-sm">
                    Swipe up to answer • Tap to decline
                </Text>
            </View>
        </Animated.View>
    </Modal>
  )
}

export default IncomingCallModal