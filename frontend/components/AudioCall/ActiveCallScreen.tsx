import { View, Text, Dimensions, Animated, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window')

interface ActiveCallScreenProps {
    callerInfo: {
        id: string;
        name: string;
        avatar?: string
    };
    onEndCall: () => void;
    isOutgoing?: boolean;
    isMuted: boolean;
    onToggleMute: () => void;
    callDuration: number;
}

const ActiveCallScreen: React.FC<ActiveCallScreenProps> = ({
    callerInfo,
    onEndCall,
    isOutgoing = false,
    isMuted,
    onToggleMute,
    callDuration
}) => {
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0))
  const [scaleAnim] = useState(new Animated.Value(0.8))

  useEffect(() => {
    Animated.parallel([
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true
        }),
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
            tension: 50,
            friction: 8
        }),
    ]).start()
  }, [])

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const toggleSpeaker = () => {
    setIsSpeakerOn(!isSpeakerOn)
  }

  const getConnectionStatus = () => {
    if(isOutgoing && callDuration === 0) {
        return 'Calling...'
    }
    if(callDuration === 0) {
        return 'Connecting...'
    }
    return 'Connected'
  }

  const getAvatarInitials = (name: string) => {
    if(!name) return '?';
    const words = name.split(' ').filter(Boolean)
    if(words.length === 1) return words[0][0].toUpperCase()
    return (words[0][0] + words[1][0]).toUpperCase()
  }
  return (
    <SafeAreaView className='flex-1 bg-gradient-to-b from-gray-900 to-black'>
        <Animated.View
            style={{
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }]
            }}
            className="flex-1 justify-between items-center py-12"
        >
            <View className='items-center mt-8'>
                <Text className='text-white/80 text-lg mb-4'>
                    {getConnectionStatus()}
                </Text>

                <View className='size-48 rounded-full bg-white/10 items-center justify-center mb-8 border-4 border-white/20'>
                    {callerInfo.avatar ? (
                        <Image 
                            source={{ uri: callerInfo.avatar }}
                            className='size-44 rounded-full'
                            resizeMode='cover'
                        />
                    ) : (
                        <View className='size-44 rounded-full bg-gray-300 justify-center items-center'>
                            <Text className='text-black-300 text-9xl font-rubik-semibold'>{getAvatarInitials(callerInfo.name)}</Text>
                        </View>
                    )}
                </View>

                <Text className='text-white text-3xl font-bold mb-2 text-center'>
                    {callerInfo.name}
                </Text>

                <Text className='text-white/70 text-xl font-rubik'>
                    {formatDuration(callDuration)}
                </Text>
            </View>

            <View className='items-center'>
                {callDuration > 0 && (
                    <View className='flex-row items-center bg-green-500/20 px-4 py-2 rounded-full'>
                        <View className='size-3 bg-green-400 rounded-full mr-2 animate-pulse'/>
                        <Text className='text-green-400 text-sm font-medium'>
                            Call Active
                        </Text>
                    </View>
                )}
            </View>

            <View className='items-center'>
                <View className='flex-row space-x-8 mb-8'>
                    {/* Mute Button */}
                    <TouchableOpacity
                        onPress={onToggleMute}
                        className={`size-16 rounded-full items-center justify-center ${
                            isMuted ? 'bg-red-500' : 'bg-white/20'
                        }`}
                        style={{
                            shadowColor: isMuted ? '#EF4444' : '#000000',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.3,
                            shadowRadius: 8,
                            elevation: 8
                        }}
                    >
                        <Ionicons 
                            name={isMuted ? "mic-off" : "mic"}
                            size={28}
                            color={isMuted ? "white" : "#FFFFFF"}
                        />
                    </TouchableOpacity>

                    {/* Speaker Button */}
                    <TouchableOpacity
                        onPress={toggleSpeaker}
                        className={`w-16 h-16 rounded-full items-center justify-center ${
                            isSpeakerOn ? 'bg-blue-500' : 'bg-white/20'
                        }`}
                        style={{
                            shadowColor: isSpeakerOn ? '#3B82F6' : '#000000',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.3,
                            shadowRadius: 8,
                            elevation: 8,
                        }}
                    >
                    <Ionicons 
                        name={isSpeakerOn ? "volume-high" : "volume-medium"} 
                        size={28} 
                        color="white" 
                    />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    onPress={onEndCall}
                    className="w-20 h-20 bg-red-500 rounded-full items-center justify-center"
                    style={{
                    shadowColor: '#EF4444',
                    shadowOffset: { width: 0, height: 6 },
                    shadowOpacity: 0.4,
                    shadowRadius: 12,
                    elevation: 12,
                }}>
                    <Ionicons 
                        name="call" 
                        size={36} 
                        color="white" 
                        style={{ transform: [{ rotate: '135deg' }] }} 
                    />
                </TouchableOpacity>

                {/* End Call Label */}
                <Text className="text-white/60 text-sm mt-4">
                    End Call
                </Text>
            </View>
        </Animated.View>
    </SafeAreaView>
  )
}

export default ActiveCallScreen