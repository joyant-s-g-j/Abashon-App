import { View, TextInput, TextInputProps } from 'react-native';
import React from 'react';

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
    <View className='bg-white rounded-xl px-4 py-3 mb-6 shadow-md border border-gray-100'>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        className='text-base font-rubik text-black-300'
        placeholder={placeholder}
        {...rest}
      />
    </View>
  );
};

export default SearchInput;
