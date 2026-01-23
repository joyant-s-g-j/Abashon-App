import { forwardRef } from 'react';
import { FlatList } from 'react-native';
import MessageItem from './MessageItem';

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

interface ChatListProps {
    messages: ChatMessage[];
    onImagePress: (imageUri: string) => void
}

const ChatList = forwardRef<FlatList, ChatListProps> (
    ({ messages, onImagePress }, ref) => {
        const renderMessage = ({ item }: { item: ChatMessage }) => (
            <MessageItem message={item} onImagePress={onImagePress} />
        )
    return (
            <FlatList 
                ref={ref}
                data={messages}
                renderItem={renderMessage}
                keyExtractor={(item) => item._id}
                inverted
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingTop: 10, flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
                className='flex-1 bg-gray-50'
            />
        )
    }
)

ChatList.displayName = 'ChatList';

export default ChatList