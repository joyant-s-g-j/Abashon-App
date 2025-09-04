import { View, Text, Modal, TouchableOpacity } from 'react-native'
import React from 'react'

interface PaymentSuccessModalProps {
    visible: boolean;
    onClose: () => void;
    property: any;
}

const PaymentSuccessModal: React.FC<PaymentSuccessModalProps> = ({
    visible,
    onClose,
    property
}) => {
  return (
    <Modal
        visible={visible}
        transparent
        animationType='fade'
        onRequestClose={onClose}
    >
        <View className="flex-1 bg-black/50 justify-center items-center px-6">
        <View className="bg-white rounded-2xl p-8 w-full max-w-sm items-center shadow-lg">
          {/* Success Icon */}
          <View className="bg-green-100 rounded-full w-20 h-20 items-center justify-center mb-6">
            <Text className="text-4xl">✅</Text>
          </View>
          
          {/* Success Message */}
          <Text className="text-2xl font-rubik-bold text-gray-900 text-center mb-2">
            Payment Successful!
          </Text>
          
          <Text className="text-base text-gray-600 text-center mb-6">
            Your booking has been confirmed
          </Text>
          
          {/* Property Details */}
          {property?.name && (
            <View className="bg-gray-50 rounded-lg p-4 w-full mb-6">
              <Text className="text-sm text-gray-500 uppercase tracking-wide mb-1">
                PROPERTY BOOKED
              </Text>
              <Text className="text-lg font-rubik-semibold text-gray-900 mb-2">
                {property?.name}
              </Text>
              {property?.price && (
                <>
                  <Text className="text-sm text-gray-500 uppercase tracking-wide mb-1">
                    AMOUNT PAID
                  </Text>
                  <Text className="text-xl font-rubik-bold text-green-600">
                    ${property?.price}
                  </Text>
                </>
              )}
            </View>
          )}
          
          {/* Success Message */}
          <View className="bg-green-50 border border-green-200 rounded-lg p-4 w-full mb-6">
            <Text className="text-sm text-green-800 text-center">
              🎉 Congratulations! You will receive a confirmation email shortly.
            </Text>
          </View>
          
          {/* Action Buttons */}
          <View className="flex-row space-x-3 w-full">
            <TouchableOpacity 
              onPress={onClose}
              className="flex-1 bg-primary-300 py-4 rounded-full"
            >
              <Text className="text-white font-rubik-semibold text-center text-lg">
                Continue
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* Optional: View Booking Button */}
          <TouchableOpacity 
            onPress={() => {
              onClose();
              // Navigate to bookings page
              // navigation.navigate('Bookings');
            }}
            className="mt-3 py-2"
          >
            <Text className="text-primary-300 font-rubik-medium text-center">
              View My Bookings
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

export default PaymentSuccessModal