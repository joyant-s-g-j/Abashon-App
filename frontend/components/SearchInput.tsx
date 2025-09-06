import { View, TextInput, TextInputProps, Image } from 'react-native';
import React from 'react';
import icons from '@/constants/icons';

interface SearchInputProps extends TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChangeText,
  placeholder = 'Search...',
  ...rest
}) => {
  return (
    <View className='flex flex-row items-center justify-between w-full px-5 mb-2 rounded-lg bg-accent-100 border border-primary-100 mt-5 py-2'>
      <View className='flex-1 flex flex-row items-center justify-start z-50'>
        <Image source={icons.search} className='size-5' />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          className='text-base font-rubik w-full text-black-300'
          placeholder={placeholder}
          {...rest}
        />
      </View>
    </View>
  );
};

export default SearchInput;


{/*  */}
