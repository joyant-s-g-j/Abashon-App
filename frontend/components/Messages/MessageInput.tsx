import { View, Text, TouchableOpacity, TextInput } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';
import { MediaAsset } from '@/utils/chatUtils';

interface MessageInputProps {
    inputText: string;
    selectedMediaAsset: MediaAsset | null;
    sending: boolean;
    onTextChange: (text: string) => void;
    onSend: () => void;
    onPickFromGallery: () => void;
    onPickFromCamera: () => void;
}

const MessageInput: React.FC<MessageInputProps> = ({
    inputText,
    selectedMediaAsset,
    sending,
    onTextChange,
    onSend,
    onPickFromCamera,
    onPickFromGallery
}) => {
  return (
    <View className="flex-row items-center p-4 border-t border-gray-200">
        <TouchableOpacity
            onPress={onPickFromGallery}
            className="bg-blue-500 rounded-full p-2 mr-2"
            disabled={sending}
        >
            <Ionicons name="image" size={22} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
            onPress={onPickFromCamera}
            className="bg-blue-500 rounded-full p-2 mr-2"
            disabled={sending}
        >
            <Ionicons name="camera" size={22} color="white" />
        </TouchableOpacity>

        <TextInput
            value={inputText}
            onChangeText={onTextChange}
            placeholder="Type a message..."
            className="flex-1 bg-gray-100 rounded-full px-4 py-3 mr-3"
            multiline
            maxLength={1000}
            editable={!sending}
        />

        <TouchableOpacity
            onPress={onSend}
            className={`rounded-full p-3 ${
              (inputText.trim() || selectedMediaAsset) 
                ? 'bg-blue-500' 
                : 'bg-gray-300'
            }`}
            disabled={!inputText.trim() && !selectedMediaAsset}
        >
            <Ionicons name="send" size={16} color="white" />
        </TouchableOpacity>
    </View>
  )
}

export default MessageInput