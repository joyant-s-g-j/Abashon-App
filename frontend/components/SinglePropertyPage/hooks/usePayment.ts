import { PaymentService } from "@/utils/PaymentService"
import { useState, useCallback } from "react"
import { Alert } from "react-native"

export const usePayment = () => {
    const [loading, setLoading] = useState(false)
    const [paymentData, setPaymentData] = useState(null)

    const checkAuthentication = useCallback(async () => {
        try {
            return await PaymentService.checkAuthStatus();
        } catch (error) {
            console.error('Error checking authentication:', error);
            return false;
        }
    }, []);

    const initiatePayment = async (property: any) => {
        try {
            setLoading(true)

            // Validate property data first
            if (!property) {
                throw new Error('Property data is missing');
            }

            if (!property._id && !property.id) {
                throw new Error('Property ID is missing');
            }

            if (!property.name) {
                throw new Error('Property name is missing');
            }

            if (!property.price) {
                throw new Error('Property price is missing');
            }

            const sessionData = await PaymentService.createCheckoutSession(property)

            setPaymentData(sessionData)

            return sessionData
        } catch (error: any) {            
            throw error
        } finally {
            setLoading(false)
        }
    };

    const confirmPayment = async (sessionId: string) => {
        try {
            setLoading(true)

            if (!sessionId) {
                throw new Error('Session ID is required');
            }

            const result = await PaymentService.handlePaymentSuccess(sessionId)

            Alert.alert(
                'Payment Success',
                'Your booking has been confirmed successfully!',
                [{ text: 'OK' }]
            )
            return result;
        } catch (error: any) {
            Alert.alert(
                'Payment Error',
                error.message || 'Failed to confirm payment. Please contact support.',
                [{ text: 'OK' }]
            );
            throw error;
        } finally {
            setLoading(false)
        }
    };

    return {
        loading,
        paymentData,
        initiatePayment,
        confirmPayment,
        checkAuthentication
    }
}