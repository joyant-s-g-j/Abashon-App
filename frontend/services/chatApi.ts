import { User } from "@/components/PropertyManagement/types/property";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL

interface Message {
    _id: string;
    senderId: string | User;
    receiverId: string | User;
    text?: string;
    image?: string[];
    video?: string[];
    createdAt: string;
    updatedAt: string;
}

interface MessageData {
    text?: string;
    image?: string;
    video?: string;
}

interface ApiResponse<T> {
    data?: T;
    error: string;
    message?: string;
}

const getAuthToken = async () : Promise<string | null> => {
    try {
        const token = await AsyncStorage.getItem('token')
        return token
    } catch (error) {
        return null;
    }
}

const convertToBase64 = async (uri: string, type: string): Promise<string> => {
    try {
        const response = await fetch(uri)
        if(!response.ok) {
            throw new Error(`Faild to fetch file: ${response.status}`)
        }
        const blob = await response.blob()

        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onloadend = () => {
                if(typeof reader.result === 'string') {
                    resolve(reader.result)
                } else {
                    reject(new Error('Failed to convert to base64'))
                }
            };
            reader.onerror = () => reject(new Error('FileReader error'));
            reader.readAsDataURL(blob)
        })
    } catch (error) {
        throw new Error(`Failed to convert ${type} to base64: ${error}`);
    }
}

const apiCall = async <T> (
    url: string,
    options: RequestInit = {}
): Promise<T> => {
    try {
        const token = await getAuthToken()
        const response = await fetch(`${API_BASE_URL}${url}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : '',
                ...options.headers,
            },
            credentials: 'include',
            ...options
        });

        if(!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
        }
        return await response.json()
    } catch (error) {
        throw error
    }
}

export const chatApi = {
    getUsers: (): Promise<User[]> => 
        apiCall<User[]>('/api/message/users'),

    getMessages: (userId: string): Promise<Message[]> => 
        apiCall<Message[]>(`/api/message/${userId}`),

    sendMessages: async (receiverId: string, messagesData: MessageData & {
        imageUri?: string,
        videoUri?: string,
        imageType?: string,
        videoType?: string 
    }): Promise<Message> => {
        const finalMessageData: MessageData = {
            text: messagesData.text
        }

        if(messagesData.imageUri && messagesData.imageType) {
            finalMessageData.image = await convertToBase64(messagesData.imageUri, messagesData.imageType)
        }

        if (messagesData.videoUri && messagesData.videoType) {
            finalMessageData.video = await convertToBase64(messagesData.videoUri, messagesData.videoType);
        }

        return apiCall<Message>(`/api/message/send/${receiverId}`, {
            method: 'POST',
            body: JSON.stringify(finalMessageData)
        })
    }
        
}

export type { User, Message, MessageData, ApiResponse }