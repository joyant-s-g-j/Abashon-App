import { View, Text, Dimensions, FlatList, Alert, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router, useLocalSearchParams } from 'expo-router';
import { chatApi, Message, User } from '@/services/chatApi';
import { useSocket } from '@/contexts/SocketContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window')

interface ChatMessage {
    _id: string;
    text: string;
    createdAt: Date;
    senderId: string;
    senderName: string;
    senderAvatar?: string;
    image?: string;
    video?: string;
    isMe: boolean;
}


const ChatScreen: React.FC = () => {
  const params = useLocalSearchParams()
  const selectedUser: User = params.user ? JSON.parse(params.user as string): null;
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [inputText, setInputText] = useState<string>('')
  const [sending, setSending] = useState<boolean>(false)
  const [imageModalVisible, setImageModalVisible] = useState<boolean>(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const flatListRef = useRef<FlatList>(null)
  const { socket, onlineUsers } = useSocket()

  useEffect(() => {
    if(selectedUser) {
        initializeChat();
        setupSocketListeners()
    }
    return () => {
        if(socket) {
            socket.off('newMessage')
        }
    }
  }, [socket, selectedUser])

  const initializeChat = async (): Promise<void> => {
    try {
        const userData = await AsyncStorage.getItem('user')
        if(userData) {
            const user: User = JSON.parse(userData)
            setCurrentUser(user)
            await fetchMessages(user._id)
        }
    } catch (error) {
        console.error('Error initializing chat:', error);
        Alert.alert('Error', 'Failed to initialize chat');
    } finally {
        setLoading(false)
    }
  }

  const fetchMessages = async (userId: string): Promise<void> => {
    try {
        const messagesData = await chatApi.getMessages(selectedUser._id)
        const formattedMessages = messagesData.map((msg: Message) => ({
            _id: msg._id,
            text: msg.text || '',
            createdAt: new Date(msg.createdAt),
            senderId: typeof msg.senderId === 'string' ? msg.senderId : msg.senderId._id,
            senderName: typeof msg.senderId === 'string' ? 'User' : msg.senderId.name,
            senderAvatar: typeof msg.senderId === 'string' ? undefined : msg.senderId.avatar,
            image: msg.image && msg.image.length > 0 ? msg.image[0] : undefined,
            video: msg.video && msg.video.length > 0 ? msg.video[0] : undefined,
            isMe: (typeof msg.senderId === 'string' ? msg.senderId : msg.senderId._id) === userId
        }))
        setMessages(formattedMessages.reverse())
    } catch (error) {
        console.error('Error fetching messages:', error);
        Alert.alert('Error', 'Failed to load messages');
    }
  }

  const setupSocketListeners = (): void => {
    if(socket) {
        socket.on('newMessage', (newMessage: Message) => {
            const senderId = typeof newMessage.senderId === 'string'
                ? newMessage.senderId
                : newMessage.senderId._id
            const receiverId = typeof newMessage.receiverId === 'string'
                ? newMessage.receiverId
                : newMessage.receiverId._id
            
            if(senderId === selectedUser._id || receiverId === selectedUser._id) {
                const formattedMessage: ChatMessage = {
                    _id: newMessage._id,
                    text: newMessage.text || '',
                    createdAt: new Date(newMessage.createdAt),
                    senderId: senderId,
                    senderName: typeof newMessage.senderId === 'string' ? 'User' : newMessage.senderId.name,
                    senderAvatar: typeof newMessage.senderId === 'string' ? 'undefined' : newMessage.senderId.avatar,
                    image: newMessage.image && newMessage.image.length > 0 ? newMessage.image[0] : undefined,
                    video: newMessage.video && newMessage.video.length > 0 ? newMessage.video[0] : undefined,
                    isMe: senderId === currentUser?._id
                }
                setMessages(prev => [formattedMessage, ...prev])
            }
        })
    }
  }

  const sendMessage = async (): Promise<void> => {
    if(!inputText.trim() || sending) return;

    setSending(true)
    try {
        const messageData = { text: inputText.trim() };
        await chatApi.sendMessages(selectedUser._id, messageData)

        const newMessage: ChatMessage = {
            _id: Math.random().toString(),
            text: inputText.trim(),
            createdAt: new Date(),
            senderId: currentUser?._id || '',
            senderName: currentUser?.name || '',
            senderAvatar: currentUser?.avatar,
            isMe: true
        }

        setMessages(prev => [newMessage, ...prev])
        setInputText('')
    } catch (error) {
        console.error('Error sending message:', error);
        Alert.alert('Error', 'Failed to send message');
    } finally {
        setSending(false)
    }
  }

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const renderMessage = ({ item }: {item: ChatMessage }) => {
    <View>

    </View>
  }

  if (!selectedUser) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-base text-gray-600">No user selected</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="mt-3 text-base text-gray-600">Loading chat...</Text>
      </View>
    );
  }



  return (
    <SafeAreaView className='flex-1 bg-white'>
      <View className='flex-row items-center p-4 bg-white border-b border-gray-200'>
        <TouchableOpacity 
          onPress={() => router.back()}
          className="mr-3"
        >
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <View className='flex-1 flex-row items-center'>
            <Image 
                source={{ uri: selectedUser.avatar }}
                className='size-10 rounded-full mr-3'
            />
            <View>
                <Text className='text-lg font-rubik-semibold text-black-200'>
                    {selectedUser.name}
                </Text>
            </View>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default ChatScreen