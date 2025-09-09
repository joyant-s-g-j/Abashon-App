import { View, Text, Dimensions, FlatList, Alert, Image, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, TextInput, Modal } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router, useLocalSearchParams } from 'expo-router';
import { chatApi, Message, User } from '@/services/chatApi';
import { useSocket } from '@/contexts/SocketContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { Video } from 'expo-av';
import { pickFromCamera, pickFromGallery } from '@/utils/chatUtils';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

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
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
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
        const formattedMessages = messagesData.map((msg: Message) =>  {
          const senderId = typeof msg.senderId === 'string' ? msg.senderId : msg.senderId._id;
          const isMe = senderId === userId;

          let senderName: string;
          let senderAvatar: string | undefined;

          if(isMe) {
            senderName = currentUser?.name || 'You';
            senderAvatar = currentUser?.avatar
          } else {
            senderName = selectedUser?.name || 'User';
            senderAvatar = selectedUser?.avatar
          }

          if(typeof msg.senderId === 'object' && msg.senderId) {
            senderName = msg.senderId.name;
            senderAvatar = msg.senderId.avatar;
          }

          return {
            _id: msg._id,
            text: msg.text || '',
            createdAt: new Date(msg.createdAt),
            senderId,
            senderName,
            senderAvatar,
            image: msg.image && msg.image.length > 0 ? msg.image[0] : undefined,
            video: msg.video && msg.video.length > 0 ? msg.video[0] : undefined,
            isMe
          }
        })
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
              const isMe = senderId === currentUser?._id
              let senderName: string;
              let senderAvatar: string | undefined;

              if(isMe) {
                senderName = currentUser?.name || 'You';
                senderAvatar = currentUser?.avatar
              } else {
                senderName = selectedUser?.name || 'User';
                senderAvatar = selectedUser?.avatar
              }

              if(typeof newMessage.senderId === 'object' && newMessage.senderId) {
                senderName = newMessage.senderId.name;
                senderAvatar = newMessage.senderId.avatar;
              }

              const formattedMessage: ChatMessage = {
                _id: newMessage._id,
                text: newMessage.text || '',
                createdAt: new Date(newMessage.createdAt),
                senderId: senderId,
                senderName,
                senderAvatar,
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
    return (
      <View className={`mb-4 mx-4 ${item.isMe ? 'items-end' : 'items-start'}`}>
      <View className={`flex-row max-w-[80%] ${item.isMe ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        {!item.isMe && (
          <View className='mr-2'>
            <Image 
              source={{ uri: item.senderAvatar }}
              className='size-8 rounded-full'
            />
          </View>
        )}
        {/* Message Content */}
        <View className={`rounded-2xl p-3 ${
          item.isMe
            ? 'bg-blue-500 rounded-br-md'
            : 'bg-gray-100 rounded-bl-md'
        }`}>
          {/* image */}
          {item.image && (
            <TouchableOpacity
              onPress={() => {
                setSelectedImage(item.image!)
                setImageModalVisible(true)
              }}
            >
              <Image 
                source={{ uri: item.image }}
                className='size-48 rounded-xl mb-2'
                resizeMode='cover'
              />
            </TouchableOpacity>
          )}
          {/* video */}
          {item.video && (
            <View className='size-48 rounded-xl mb-2 overflow-hidden'>
              <Video
                source={{ uri: item.video }}
                style={{ width: '100%', height: '100%' }}
                useNativeControls
                shouldPlay={false}
              />
            </View>
          )}
          {/* Text */}
          {item.text ? (
            <Text className={`text-base ${item.isMe ? 'text-white' : 'text-gray-800 font-rubik'}`}>
              {item.text}
            </Text>
          ) : null}
        </View>
      </View>
      {/* Timestamp */}
      <Text className='text-xs text-black-300 mt-1 font-rubik mx-2'>
        {formatTime(item.createdAt)}
      </Text>
    </View>
    )
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
    <SafeAreaView className=' bg-gray-50 h-full'>
      <View className='flex-row items-center justify-between p-4 bg-white border-b border-gray-200'>
        <View className='flex-row items-center flex-1'>
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
                  <Text className='text-lg font-rubik-semibold '>
                      {selectedUser.name}
                  </Text>
                  {onlineUsers.includes(selectedUser._id) && (
                    <Text className='text-xs font-rubik text-green-500'>Online</Text>
                  )}
              </View>
          </View>
        </View>

        <View className='flex-row gap-5'>
          <TouchableOpacity>
            <Ionicons name='call' size={28} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name='videocam' size={28} />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList 
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage as any}
        keyExtractor={(item) => item._id}
        inverted
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 10, flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      />

      <KeyboardAwareScrollView
        contentContainerStyle={{ flex: 1 }}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid
        enableAutomaticScroll
        extraScrollHeight={90}
        scrollEnabled={false}
        className='bg-green-800'
      >
        {/* Input bar */}
        <View className='flex-row items-center p-4 bg-white border-t border-gray-200'>
          <TouchableOpacity
            onPress={pickFromGallery}
            className='bg-blue-500 rounded-full p-2 mr-2'
            disabled={sending}
          >
            <Ionicons name='image' size={22} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={pickFromCamera}
            className='bg-blue-500 rounded-full p-2 mr-2'
            disabled={sending}
          >
            <Ionicons name='camera' size={22} color="white" />
          </TouchableOpacity>

          <TextInput 
            value={inputText}
            onChangeText={setInputText}
            placeholder='Type a message...'
            className='flex-1 bg-gray-100 rounded-full px-4 py-3 mr-3'
            multiline
            maxLength={1000}
            editable={!sending}
          />
          <TouchableOpacity
            onPress={sendMessage}
            className='bg-blue-500 rounded-full p-3'
            disabled={!inputText.trim()}
          >
            <Ionicons name='send' size={16} color="white" className='-rotate-45' />
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>

      {/* Image Preview Modal */}
      <Modal
        visible={imageModalVisible}
        transparent={true}
        onRequestClose={() => setImageModalVisible(false)}
      >
        <View className="flex-1 bg-black/90 justify-center items-center">
          <TouchableOpacity
            className="absolute top-12 right-5 w-10 h-10 rounded-full bg-white/30 justify-center items-center z-10"
            onPress={() => setImageModalVisible(false)}
          >
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
          {selectedImage && (
            <Image
              source={{ uri: selectedImage }}
              style={{ width, height: height * 0.8 }}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>
    </SafeAreaView>
  )
}

export default ChatScreen