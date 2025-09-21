import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { Video } from 'expo-av';

interface MessageItemProps {
    message: {
        _id: string;
        text: string;
        createdAt: Date;
        senderId: string;
        senderName: string;
        senderAvatar?: string;
        image?: string;
        video?: string;
        isMe: boolean;
    };
    onImagePress: (imageUri: string) => void
}

const MessageItem: React.FC<MessageItemProps> = ({ message, onImagePress }) => {
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };
  const getAvatarInitials = (name: string) => {
    if(!name) return '?';
    const words = name.split(' ').filter(Boolean)
    if(words.length === 1) return words[0][0].toUpperCase()
    return (words[0][0] + words[1][0]).toUpperCase()
  }
  const avatarInitial = getAvatarInitials(message.senderName)
  return (
    <View className={`mb-4 mx-4 ${message.isMe ? 'items-end' : 'items-start'}`}>
      <View className={`flex-row max-w-[80%] ${message.isMe ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        {!message.isMe && (
          <View className='mr-2'>
            {message.senderAvatar ? (
              <Image 
                source={{ uri: message.senderAvatar }}
                className='size-8 rounded-full'
              />
            ) : (
              <View className='size-10 rounded-full bg-gray-300 justify-center items-center'>
                <Text className='text-black-300 text-lg font-semibold'>{avatarInitial}</Text>
              </View>
            )}
          </View>
        )}
        {/* Message Content */}
        <View className={`rounded-2xl ${
         message.isMe ? 'items-end' : 'items-start'
        }`}>
          {/* image */}
          {message.image && (
            <TouchableOpacity
              onPress={() => onImagePress(message.image!)}
            >
              <Image 
                source={{ uri: message.image }}
                className='size-48 rounded-xl mb-2'
                resizeMode='cover'
              />
            </TouchableOpacity>
          )}
          {/* video */}
          {message.video && (
            <View className='size-48 rounded-xl mb-2 overflow-hidden'>
              <Video
                source={{ uri: message.video }}
                style={{ width: '100%', height: '100%' }}
                useNativeControls
                shouldPlay={false}
              />
            </View>
          )}
          {/* Text */}
          {message.text ? (
            <Text className={`text-base rounded-2xl px-3 py-2 ${message.isMe ? 'text-black-300 bg-gray-200 font-rubik rounded-br-md' : 'text-white font-rubik bg-blue-500 rounded-bl-md'}`}>
              {message.text}
            </Text>
          ) : null}
        </View>
      </View>
      {/* Timestamp */}
      <Text className='text-xs text-black-300 mt-1 font-rubik mx-2'>
        {formatTime(message.createdAt)}
      </Text>
    </View>
  )
}

export default MessageItem