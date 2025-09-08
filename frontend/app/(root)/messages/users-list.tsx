import React, { useEffect, useState } from 'react'
import { Header } from '@/components/ReusableComponent'
import icons from '@/constants/icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import { chatApi, User } from '@/services/chatApi'
import { useSocket } from '@/contexts/SocketContext'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { ActivityIndicator, Alert, FlatList, Image, ListRenderItem, RefreshControl, Text, TouchableOpacity, View } from 'react-native'
import { router } from 'expo-router'

interface UserWithLastMessage extends User {
  lastMessage?: {
    text?: string;
    image?: string;
    video?: string;
    createdAt: string;
    senderId: string;
  };
  unreadCount?: number;
}

const UsersList = () => {
  const [users, setUsers] = useState<UserWithLastMessage[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const { onlineUsers } = useSocket()

  useEffect(() => {
    getCurrentUser();
    fetchUsersWithChatHistory();
  }, [])

  const getCurrentUser = async (): Promise<void> => {
    try {
      const userData = await AsyncStorage.getItem("user");
      if(userData) {
        const user = JSON.parse(userData);
        setCurrentUserId(user._id)
      }
    } catch (error) {
      console.error('Error getting current user:', error);
    }
  }

  const fetchUsersWithChatHistory = async (): Promise<void> => {
    try {
      setLoading(true)

      const allUsers = await chatApi.getUsers()

      const usersWithchatHistory: UserWithLastMessage[] = []

      for(const user of allUsers) {
        try {
          const messages = await chatApi.getMessages(user._id)

          if(messages && messages.length > 0) {
            const lastMessage = messages[messages.length - 1]
            
            let lastMessageText = '';
            if(lastMessage.text) {
              lastMessageText = lastMessage.text;
            } else if(lastMessage.image && lastMessage.image.length > 0) {
              lastMessageText = "Image";
            } else if(lastMessage.video && lastMessage.video.length > 0) {
              lastMessageText = "Video"
            }

            const userWithLastMessage: UserWithLastMessage = {
              ...user,
              lastMessage: {
                text: lastMessageText,
                createdAt: lastMessage.createdAt,
                senderId: typeof lastMessage.senderId === 'string'
                  ? lastMessage.senderId
                  : lastMessage.senderId._id
              }
            }

            usersWithchatHistory.push(userWithLastMessage)
          } 
        } catch (error) {
          console.log(`No chat history found for user: ${user.name}`)
        }
      }

      usersWithchatHistory.sort((a, b) => {
        if(!a.lastMessage || !b.lastMessage) return 0;
        return new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime()
      });

      setUsers(usersWithchatHistory)
    } catch (error) {
      console.error('Error fetching users with chat history:', error);
      Alert.alert('Error', 'Failed to load chat history');
    } finally {
      setLoading(false)
    }
  }

  const onRefresh = async (): Promise<void> => {
    setRefreshing(true)
    await fetchUsersWithChatHistory()
    setRefreshing(false)
  }

  const navigateToChat = (user: User) => {
    router.push({
      pathname: "/(root)/messages/chat",
      params: { user: JSON.stringify(user)}
    })
  }

  const formatMessageTime = (dateString: string): string => {
    const messageDate = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - messageDate.getTime()) / (1000 * 60))

    if(diffInMinutes < 1) return 'Just now';
    if(diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if(diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return messageDate.toLocaleDateString()
  }

  const renderUser: ListRenderItem<UserWithLastMessage> = ({ item }) => {
    const isOnline = onlineUsers.includes(item._id)
    const isLastMessageFromCurrentUser = item.lastMessage?.senderId === currentUserId;

    return (
      <TouchableOpacity
        className="flex-row items-center bg-white p-4 mx-3 my-1 rounded-xl shadow-sm"
        onPress={() => navigateToChat(item)}
      >
        <View className="relative">
          <Image 
              source={{ uri: item.avatar }} 
              className="w-12 h-12 rounded-full"
            />
          {isOnline && (
            <View className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
          )}
        </View>

        <View className="flex-1 ml-4">
          <View className="flex-row justify-between items-center mb-1">
            <Text className="text-base font-semibold text-gray-800 flex-1" numberOfLines={1}>
              {item.name}
            </Text>
            {item.lastMessage && (
              <Text className="text-xs text-gray-500 ml-2">
                {formatMessageTime(item.lastMessage.createdAt)}
              </Text>
            )}
          </View>
          
          {item.lastMessage && (
            <View className="flex-row items-center">
              <Text className="text-sm text-gray-600 flex-1" numberOfLines={1}>
                {isLastMessageFromCurrentUser ? 'You: ' : ''}
                {item.lastMessage.text || 'Media'}
              </Text>
            </View>
          )}
          
          {isOnline && (
            <Text className="text-xs text-green-500 font-medium mt-1">
              Online
            </Text>
          )}
        </View>
      </TouchableOpacity>
    )
  }

  if (loading) {
    return (
      <SafeAreaView className='bg-white h-full'>
        <Header title='Talk with your connection' backRoute='/' rightIcon={icons.bell} />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text className="mt-3 text-base text-gray-600">Loading chats...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if(users.length === 0) {
    return (
      <SafeAreaView className='bg-white h-full'>
        <Header title='Talk with your connection' backRoute='/' rightIcon={icons.bell} />
        <View className="flex-1 justify-center items-center px-6">
          <Text className="text-2xl font-rubik-bold text-black-300 text-center mb-2">
            No conversations yet
          </Text>
          <Text className="text-lg font-rubik text-black-200 text-center">
            Start a conversation with someone to see your chats here
          </Text>
        </View>
      </SafeAreaView>
    )
  }
  return (
    <SafeAreaView className='bg-white h-full'>
      <Header title='Talk with your connection' backRoute='/' rightIcon={icons.bell} />
      <FlatList 
        data={users}
        renderItem={renderUser}
        keyExtractor={(item) => item._id}
        className='flex-1'
        refreshControl={
          <RefreshControl 
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#3B82F6']}
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  )
}

export default UsersList