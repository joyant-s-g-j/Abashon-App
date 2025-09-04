import AsyncStorage from "@react-native-async-storage/async-storage"
import { Linking } from "react-native"

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL

export const PaymentService = {
    getAuthToken: async () => {
        try {
            const tokenKeys = ['authToken', 'token', 'accessToken', 'userToken', 'jwt']

            for(const key of tokenKeys) {
                const token = await AsyncStorage.getItem(key)
                if(token) {
                    return token
                }
            }

            const allKeys = await AsyncStorage.getAllKeys()

            for(const key of allKeys) {
                if(key.toLowerCase().includes('token') || key.toLowerCase().includes('auth')) {
                    const value = await AsyncStorage.getItem(key)
                    if(value) return value
                }
            }
            throw new Error('No authentication token found')
        } catch (error) {
            console.error('Error getting auth token:', error);
            throw error;
        }
    },

    createCheckoutSession: async (property: any) => {
        try {
            // Get token with better error handling
            const token = await PaymentService.getAuthToken()

            // Validate property data
            if (!property) {
                throw new Error('Property data is required');
            }

            const requestBody = {
                property: {
                    id: property._id || property.id,
                    name: property.name,
                    price: property.price,
                    thumbnailImage: property.thumbnailImage
                }
            };

            // Validate required fields
            if (!requestBody.property.id || !requestBody.property.name || !requestBody.property.price) {
                throw new Error('Missing required property data (id, name, or price)');
            }

            const requestUrl = `${API_BASE_URL}/api/payment/create-checkout-session`;

            const response = await fetch(requestUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(requestBody)
            })

            if (!response.ok) {
                const errorText = await response.text();
                
                let errorData;
                try {
                    errorData = JSON.parse(errorText);
                } catch (parseError) {
                    console.error('Failed to parse error response:', parseError);
                    throw new Error(`Server error: ${response.status} ${response.statusText}`);
                }
                
                throw new Error(errorData.error || errorData.message || `Server error: ${response.status}`);
            }

            const data = await response.json()

            if (!data.success) {
                throw new Error(data.message || 'Failed to create checkout session');
            }

            return data
        } catch (error: any) {
            throw error;
        }
    },

    handlePaymentSuccess: async (sessionId: string) => {
        try {
            const token = await PaymentService.getAuthToken()

            if (!sessionId) {
                throw new Error('Session ID is required');
            }

            const response = await fetch(`${API_BASE_URL}/api/payment/checkout-success`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ sessionId })
            })

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to process payment');
            }

            return data;
        } catch (error: any) {
            console.error('Payment success error:', error);
            throw error;
        }
    },

    openPaymentUrl: async (url: string) => {
        try {            
            const canOpen = await Linking.canOpenURL(url);
            
            if (canOpen) {
                await Linking.openURL(url);
            } else {
                throw new Error('Cannot open payment URL. Please check if you have a browser installed.');
            }
        } catch (error: any) {
            throw error;
        }
    },

    // Helper function to check authentication status
    checkAuthStatus: async () => {
        try {
            const token = await PaymentService.getAuthToken();
            return !!token;
        } catch (error) {
            console.error('Error checking auth status:', error);
            return false;
        }
    }
}