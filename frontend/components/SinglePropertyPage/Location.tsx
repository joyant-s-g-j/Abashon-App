import { View, Text, Image, Dimensions } from 'react-native'
import MapView, { Marker } from 'react-native-maps';
import Heading from './Heading'
import icons from '@/constants/icons'

const { width } = Dimensions.get('window');
const LATITUDE = 40.7128;
const LONGITUDE = -74.0060;

const Location = () => {
  return (
    <View className='mt-3'>
        <Heading title='Location' />
        <View className='flex-row mt-3 gap-2'>
          <Image source={icons.location} className='size-5' />
          <Text className='font-rubik text-base text-black-200'>Grand City St. 100, New York, United States</Text>
        </View>
        {/* Google map */}
        <View 
            className='mt-3 overflow-hidden rounded-xl'
            style={{ width: width - 32, height: 200 }}
        >
            <MapView
                style={{ flex: 1 }}
                initialRegion={{
                    latitude: LATITUDE,
                    longitude: LONGITUDE,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01
                }}
            >
                <Marker coordinate={{ latitude: LATITUDE, longitude: LONGITUDE }} />
            </MapView>
        </View>
      </View>
  )
}
export default Location