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

    sendMessages: (receiverId: string, messagesData: MessageData): Promise<Message> =>
        apiCall<Message>(`/api/message/send/${receiverId}`, {
            method: 'POST',
            body: JSON.stringify(messagesData)
        })
}

export type { User, Message, MessageData, ApiResponse }