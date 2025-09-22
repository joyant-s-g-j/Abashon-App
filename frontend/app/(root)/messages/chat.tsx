import { View, Text, FlatList, Alert, Keyboard } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router, useLocalSearchParams } from 'expo-router';
import { chatApi, Message, User } from '@/services/chatApi';
import { useSocket } from '@/contexts/SocketContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MediaAsset, pickFromCamera, pickFromGallery } from '@/utils/chatUtils';
import { LoadingBox } from '@/components/ReusableComponent';
import { ChatHeader, ChatList, ImageModal, ImagePreview, MessageInput } from '@/components/Messages';
import { useAudioCall } from '@/contexts/AudioCallContext';
import ActiveCallScreen from '@/components/AudioCall/ActiveCallScreen';
import IncomingCallModal from '@/components/AudioCall/IncomingCallModal';

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
  const [selectedMediaAsset, setSelectedMediaAsset] = useState<MediaAsset | null>(null)
  const flatListRef = useRef<FlatList>(null)
  const [keyboardHeight, setKeyboardHeight] = useState(0)
  const { socket, onlineUsers } = useSocket()

  const {
    callState,
    initiateCall,
    acceptCall,
    rejectCall,
    endCall,
    toggleMute,
    isMuted,
    callDuration
  } = useAudioCall()

  useEffect(() => {
    if(selectedUser) {
        initializeChat();
        setupSocketListeners()
    }
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (e) => {
      setKeyboardHeight(e.endCoordinates.height)
    })
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0)
    })
    return () => {
        if(socket) {
            socket.off('newMessage')
        }
        keyboardDidShowListener?.remove();
        keyboardDidHideListener?.remove();
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
            
            if(senderId === selectedUser._id || receiverId === selectedUser?._id) {
              let senderName: string = selectedUser?.name || 'User';
              let senderAvatar: string | undefined = selectedUser?.avatar;

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
                isMe: false
              }
              setMessages(prev => {
                const messageExists = prev.some(msg => msg._id === newMessage._id)
                if(messageExists) {
                  return prev;
                }
                return [formattedMessage, ...prev]
              })
            }
        })
    }
  }

  const handlePickFromGallery = async (): Promise<void> => {
    try {
      const result: MediaAsset | null = await pickFromGallery()

      if(result && result.uri) {
        setSelectedMediaAsset(result as any)
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image from gallery');
    }
  }

  const handlePickFromCamera = async (): Promise<void> => {
    try {
      const result: MediaAsset | null = await pickFromCamera()

      if(result && result.uri) {
        setSelectedMediaAsset(result as any)
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take picture');
    }
  }

  const removeSelectedMedia = (): void => {
    setSelectedMediaAsset(null)
  }
 
  const sendMessage = async (): Promise<void> => {
    if((!inputText.trim() && !selectedMediaAsset) || sending) return;

    setSending(true)
    try {
        const messageData: any = { text: inputText.trim() };

        if(selectedMediaAsset) {
          if(selectedMediaAsset.type.startsWith("image/")) {
            messageData.imageUri = selectedMediaAsset.uri;
            messageData.imageType = selectedMediaAsset.type;
          } else if (selectedMediaAsset.type.startsWith("video/")) {
            messageData.videoUri = selectedMediaAsset.uri
            messageData.videoType = selectedMediaAsset.type
          }
        }

        const tempId = `temp-${Date.now()}-${Math.random()}`

        const optimisticMessage: ChatMessage = {
            _id: tempId,
            text: inputText.trim(),
            createdAt: new Date(),
            senderId: currentUser?._id || '',
            senderName: currentUser?.name || 'You',
            senderAvatar: currentUser?.avatar,
            image: selectedMediaAsset?.type.startsWith("image/") ? selectedMediaAsset.uri : undefined,
            video: selectedMediaAsset?.type.startsWith("video/") ? selectedMediaAsset.uri : undefined,
            isMe: true
        }

        setMessages(prev => [optimisticMessage, ...prev])
        setInputText('')
        setSelectedMediaAsset(null)

        const response = await chatApi.sendMessages(selectedUser._id, messageData)

        setMessages(prev => prev.map(msg => 
          msg._id === tempId ? {
            ...msg,
            _id: response._id,
            text: response.text || msg.text,
            image: response.image && response.image.length > 0 ? response.image[0] : undefined,
            video: response.video && response.video.length > 0 ? response.video[0] : undefined,
            createdAt: new Date(response.createdAt || Date.now())
          }
          : msg
        ))
    } catch (error) {
        console.error('Error sending message:', error);
        setMessages(prev => prev.filter(msg => !msg._id.startsWith('temp-')));
        Alert.alert('Error', `Failed to send message: ${error || 'Unknown error'}`);
    } finally {
        setSending(false)
    }
  }

  const handleImagePress = (imageUri: string): void => {
    setSelectedImage(imageUri)
    setImageModalVisible(true)
  }

  const handleCloseImageModal = (): void => {
    setImageModalVisible(false);
    setSelectedImage(null);
  };

  const handleAudioCall = async (): Promise<void> => {
    try {
      await initiateCall(selectedUser._id, selectedUser.name, selectedUser.avatar);
    } catch (error) {
      console.error('Error starting audio call:', error);
      Alert.alert('Error', 'Failed to start audio call. Please check your microphone permissions.');
    }
  }

  const handleAcceptCall = (): void => {
    if(callState.callId) {
      acceptCall(callState.callId)
    }
  }

  const handleRejectCall = (): void => {
    if(callState.callId) {
      rejectCall(callState.callId)
    }
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
      <LoadingBox text='Loading chat...' />
    );
  }

  if(callState.isCallActive || callState.isOutgoing) {
    return (
      <ActiveCallScreen
        callerInfo={callState.callerInfo as any}
        onEndCall={endCall}
        isOutgoing={callState.isOutgoing}
        isMuted={isMuted}
        onToggleMute={toggleMute}
        callDuration={callDuration}
      />
    )
  }

  return (
    <SafeAreaView className='bg-gray-50 flex-1'>
      {/* header section */}
      <ChatHeader 
        selectedUser={selectedUser}
        onlineUsers={onlineUsers}
        onBack={() => router.back()}
        onCall={handleAudioCall}
        onVideoCall={() => console.log('video call pressed')}
      />

      <View className='flex-1' style={{ marginBottom: keyboardHeight }}>
        <ChatList 
          ref={flatListRef}
          messages={messages}
          onImagePress={handleImagePress}
        />
        {selectedMediaAsset && (
          <ImagePreview 
            imageUri={selectedMediaAsset.uri}
            type={selectedMediaAsset.type}
            onRemove={removeSelectedMedia}
          />
        )}
        <MessageInput 
          inputText={inputText}
          selectedMediaAsset={selectedMediaAsset}
          sending={sending}
          onTextChange={setInputText}
          onSend={sendMessage}
          onPickFromGallery={handlePickFromGallery}
          onPickFromCamera={handlePickFromCamera}
        />
      </View>

      <IncomingCallModal 
        visible={callState.isIncoming}
        callerInfo={callState.callerInfo as any}
        onAccept={handleAcceptCall}
        onReject={handleRejectCall}
      />

      <ImageModal
        visible={imageModalVisible}
        imageUri={selectedImage}
        onClose={handleCloseImageModal}
      />
    </SafeAreaView>
  )
}

export default ChatScreen