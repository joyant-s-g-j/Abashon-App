import { View, Text, Image, Dimensions, TouchableOpacity, Linking, Alert } from 'react-native'
import Heading from './Heading'
import icons from '@/constants/icons'

const { width } = Dimensions.get('window');
interface LocationProps {
  address: string;
  latitude: number;
  longitude: number;
}

const Location: React.FC<LocationProps> = ({ address, latitude, longitude }) => {
  
  const openInGoogleMaps = async () => {
    try {
      // Google Maps URL for both Android and iOS
      const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
      
      // Check if the URL can be opened
      const supported = await Linking.canOpenURL(url);
      
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Unable to open Google Maps');
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to open Google Maps');
    }
  };

  return (
    <View className='mt-3'>
        <Heading title='Location' />
        <View className='flex-row mt-3 gap-2'>
          <Image source={icons.location} className='size-5' />
          <Text className='font-rubik text-base text-black-200'>{address}</Text>
        </View>
        
        {/* Clickable Map Preview */}
        <TouchableOpacity 
          onPress={openInGoogleMaps}
          className='mt-3 overflow-hidden rounded-xl bg-blue-50 border-2 border-blue-200'
          style={{ width: width - 32, height: 200 }}
          activeOpacity={0.7}
        >
          {/* Map Pattern Background */}
          <View className='absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100'>
            {/* Grid pattern to simulate map */}
            <View className='absolute inset-0 opacity-20'>
              {Array.from({ length: 8 }).map((_, i) => (
                <View 
                  key={`h-${i}`}
                  className='absolute bg-gray-400' 
                  style={{ 
                    width: '100%', 
                    height: 1, 
                    top: i * 25 
                  }} 
                />
              ))}
              {Array.from({ length: 12 }).map((_, i) => (
                <View 
                  key={`v-${i}`}
                  className='absolute bg-gray-400' 
                  style={{ 
                    height: '100%', 
                    width: 1, 
                    left: i * 30 
                  }} 
                />
              ))}
            </View>
          </View>
          
          {/* Center content */}
          <View className='flex-1 justify-center items-center'>
            <View className='items-center bg-white/95 rounded-2xl p-4 shadow-lg mx-4'>
              <Image 
                source={icons.location} 
                className='size-10 mb-3'
                style={{ tintColor: '#DC2626' }}
              />
              <Text className='font-rubik-bold text-lg text-gray-800 text-center mb-1'>
                📍 View Location
              </Text>
              <Text className='font-rubik text-sm text-gray-600 text-center mb-2'>
                Tap to open in Google Maps
              </Text>
              <View className='bg-blue-500 rounded-full px-4 py-2'>
                <Text className='font-rubik-medium text-white text-xs'>
                  🗺️ Open Maps
                </Text>
              </View>
            </View>
          </View>
          
          {/* Coordinates info */}
          <View className='absolute top-3 left-3 bg-white/90 rounded-lg px-2 py-1'>
            <Text className='font-rubik text-xs text-gray-600'>
              {latitude.toFixed(4)}, {longitude.toFixed(4)}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
  )
}

export default Location