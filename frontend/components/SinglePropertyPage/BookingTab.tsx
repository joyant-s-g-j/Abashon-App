import React, { use, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Modal, Alert, SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';
import { usePayment } from './hooks/usePayment';
import PaymentSuccessModal from './PaymentSuccessModal';

interface BookingTabProps {
  price: number | undefined;
  property: any;
}

const BookingTab: React.FC<BookingTabProps> = ({ price, property }) => {
  const { loading, initiatePayment } = usePayment();
  const [webViewVisible, setWebViewVisible] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleBookingPress = async () => {
      if(!property) return;

      try {
          const sessionData = await initiatePayment(property);
          if(sessionData.url) {
              setPaymentUrl(sessionData.url); // save URL
              setWebViewVisible(true);        // show modal
          } else {
              Alert.alert('Payment Error', 'No payment URL received.');
          }
      } catch (error) {
          console.error(error);
      }
  };

  const handleNavigationStateChange = (navState: any) => {
    const { url } = navState

    if(url.includes('/purchase-success')) {
      setWebViewVisible(false)
      setShowSuccessModal(true)
    }

    if(url.includes('/purchase-cancel')) {
      setWebViewVisible(false)
      Alert.alert(
        'Payment Cancelled',
        'Your payment was cancelled.'
      )
    }
  }

  return (
    <View
      pointerEvents="box-none"
      className="absolute bottom-0 rounded-t-2xl left-0 right-0 px-5 pt-5 pb-12 bg-white flex-row justify-between items-center border-t-[0.5] border-black-100 z-50"
    >
      <View className="flex-col">
        <Text className="text-sm tracking-widest font-rubik-medium text-black-200 uppercase">Price</Text>
        <Text className="text-lg font-rubik-bold text-primary-300">${price}</Text>
      </View>

      <TouchableOpacity
        onPress={handleBookingPress}
        disabled={loading}
        className={`px-5 py-4 rounded-full flex-row items-center ${loading ? 'bg-gray-400' : 'bg-primary-300'}`}
      >
        {loading && <ActivityIndicator size="small" color="white" style={{ marginRight: 8 }} />}
        <Text className="font-rubik-semibold text-white">{loading ? 'Processing...' : 'Booking Now'}</Text>
      </TouchableOpacity>

      {/* WebView Modal */}
      <Modal visible={webViewVisible} animationType="slide" presentationStyle='pageSheet'>
        <SafeAreaView style={{ flex: 1 }}>
          <View className='flex flex-row justify-between items-center p-4 border-b-2 border-black-100 bg-slate-50'>
            <Text className='text-xl font-rubik-bold text-black-300'>
              Complete your payment
            </Text>
            <TouchableOpacity
              onPress={() => setWebViewVisible(false)}
              style={{ 
                padding: 8,
                backgroundColor: '#dc3545',
                borderRadius: 6
              }}
            >
              <Text className='text-lg text-white font-rubik-semibold'>
                  Cancel
              </Text>
            </TouchableOpacity>
          </View>

          {paymentUrl ? (
            <WebView
              source={{ uri: paymentUrl }}
              startInLoadingState
              onNavigationStateChange={handleNavigationStateChange}
              renderLoading={() => <ActivityIndicator size="large" color="blue" style={{ flex: 1 }} />}
            />
          ) : (
            <Text style={{ textAlign: 'center', marginTop: 20 }}>Loading payment...</Text>
          )}
        </SafeAreaView>
      </Modal>

      <PaymentSuccessModal 
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        property={property}
      />
    </View>
  );
};

export default BookingTab;
