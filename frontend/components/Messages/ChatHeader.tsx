import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { User } from '@/services/chatApi';
import { Ionicons } from '@expo/vector-icons';

interface ChatHeaderProps {
  selectedUser: User;
  onlineUsers: string[];
  onBack: () => void;
}

const getAvatarInitials = (name: string) => {
  if(!name) return '?';
  const words = name.split(' ').filter(Boolean)
  if(words.length === 1) return words[0][0].toUpperCase()
  return (words[0][0] + words[1][0]).toUpperCase()
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  selectedUser,
  onlineUsers,
  onBack,
}) => {
  const avatarInitial = getAvatarInitials(selectedUser.name)
  return (

    <View className='flex-row items-center justify-between p-4 bg-white border-b border-gray-200'>
        <View className='flex-row items-center flex-1'>
          <TouchableOpacity 
            onPress={onBack}
            className="mr-3"
          >
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>
          <View className='flex-1 flex-row items-center'>
              {selectedUser.avatar ? (
                <Image
                  source={{ uri: selectedUser.avatar }}
                  className='size-10 rounded-full mr-3'
                />
              ): (
                <View className='size-10 rounded-full mr-3 bg-gray-300 justify-center items-center'>
                  <Text className='text-black-300 text-lg font-semibold'>{avatarInitial}</Text>
                </View>
              )}
              <View>
                  <Text className='text-lg font-rubik-semibold '>
                      {selectedUser.name}
                  </Text>
                  {onlineUsers.includes(selectedUser._id) && (
                    <Text className='text-xs font-rubik text-green-500'>Online</Text>
                  )}
              </View>
          </View>
        </View>
      </View>
  )
}

export default ChatHeader