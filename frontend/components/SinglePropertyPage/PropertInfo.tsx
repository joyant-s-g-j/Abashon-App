import { View, Text, Image, TouchableOpacity, Linking } from 'react-native';
import React from 'react';
import icons from '@/constants/icons';
import IconText from './IconText';
import images from '@/constants/images';
import Heading from './Heading';
import { Property } from '../PropertyManagement';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface PropertInfoProps {
  property?: Property | null;
}

const PropertInfo: React.FC<PropertInfoProps> = ({ property }) => {
  const getSpecifications = () => {
    if (!property?.specifications) {
      return { bed: '0', bath: '0', area: '0' };
    }

    if (typeof property.specifications === 'object') {
      return {
        bed: property.specifications.bed || '0',
        bath: property.specifications.bath || '0',
        area: property.specifications.area || '0',
      };
    }

    return { bed: '0', bath: '0', area: '0' };
  };

  const specs = getSpecifications();
  const bed = specs.bed;
  const bath = specs.bath;
  const area = specs.area;

  const getPropertyType = () => {
    if (!property?.type) return 'Property';

    // If type is an object with name property
    if (typeof property.type === 'object' && 'name' in property.type) {
      return property.type.name || 'Property';
    }

    // If type is a string
    if (typeof property.type === 'string') {
      return property.type;
    }

    return 'Property';
  };

  const propertyType = getPropertyType();

  const getOwnerInfo = () => {
    if (!property?.owner) {
      return { name: 'Property Owner', avatar: '', email: '', phone: '', _id: '' };
    }

    if (typeof property.owner === 'object') {
      return {
        name: property.owner.name || 'Property Owner',
        avatar: property.owner.avatar || '',
        email: property.owner.email || '',
        phone: property.owner.phone || '',
        _id: property.owner._id || ''
      };
    }

    return { name: 'Property Owner', avatar: '', email: '', phone: '', _id: '' };
  };
  const ownerInfo = getOwnerInfo();

  const handleChatWithOwner = () => {
    if(property?.owner && typeof property.owner === 'object') {
      const ownerUser = {
        _id: property.owner._id,
        name: property.owner.name,
        email: property.owner.email,
        avatar: property.owner.avatar
      };

      router.push({
        pathname: '/(root)/messages/chat',
        params: { user: JSON.stringify(ownerUser)}
      })
    }
  }

  return (
    <View>
      <View className='flex-col gap-3'>
        <Heading title={property?.name || 'Property'} size='text-3xl' />
        {/* category and rating */}
        <View className='flex-row gap-3 items-center'>
          <Text className='px-4 py-2 rounded-full text-base font-rubik-semibold bg-primary-100 border border-primary-200 text-primary-300'>
            {propertyType}
          </Text>
          <View className='flex-row gap-1'>
            <Image source={icons.star} className='size-5' />
            <Text className='font-rubik-semibold text-black-200 text-base'>
              {property?.averageRating?.toFixed(1) || '0.0'}
            </Text>
          </View>
        </View>
        {/* room count */}
        <View className='flex-row justify-between border-b pb-4 border-primary-200'>
          <IconText icon={icons.bed} text={`${bed} Beds`} />
          <IconText icon={icons.bath} text={`${bath} Baths`} />
          <IconText icon={icons.area} text={`${area} sqft`} />
        </View>
      </View>
      {/* agent info */}
      <View className='mt-4 flex-col gap-2'>
        <Heading title='Agent' />
        <View className='flex-row justify-between items-center'>
          <View className='flex-row gap-3 items-center'>
            <Image 
              source={{ uri: ownerInfo.avatar }} 
              className='size-14 rounded-full'
            />
            <View className='flex-col'>
              <Text className='text-lg font-rubik-semibold text-black-300'>
                {ownerInfo.name}
              </Text>
              <Text className='text-base font-rubik text-black-200'>Owner</Text>
            </View>
          </View>
          <View className='flex-row gap-3 items-center'>
            <TouchableOpacity
              disabled={!ownerInfo._id}
              onPress={handleChatWithOwner}
            >
              <Ionicons name="chatbubble-outline" size={24} color="#3B82F6" />
            </TouchableOpacity>
            <TouchableOpacity
              disabled={!ownerInfo.phone}
              onPress={() => Linking.openURL(`tel:${ownerInfo.phone}`)}
            >
              <Ionicons name="call-outline" size={24} color="#3B82F6" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {/* overview */}
      <View className='mt-4 flex-col gap-2'>
        <Heading title='Description' />
        <Text className='text-base font-rubik text-black-200'>
          {property?.description || 'No description available.'}
        </Text>
      </View>
    </View>
  );
};

export default PropertInfo;