import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList } from 'react-native';

type Option = {
  label: string;
  value: string;
};

type Props = {
  selectedValue: string | null;
  onValueChange: (value: string) => void;
  options: Option[];
  placeholder: string;
};

const CustomDropdown: React.FC<Props> = ({ selectedValue, onValueChange, options, placeholder }) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleSelect = (value: any) => {
    onValueChange(value);
    setIsVisible(false);
  };

  const selectedOption = options.find(option => option.value === selectedValue);

  return (
    <View>
      {/* Dropdown Button */}
      <TouchableOpacity
        onPress={() => setIsVisible(true)}
        className="border border-gray-300 rounded-xl px-4 py-3 mb-4 flex-row justify-between items-center"
      >
        <Text className={`font-rubik ${selectedValue ? 'text-black-300' : 'text-black-200'}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <Text className="text-gray-400 font-rubik">▼</Text>
      </TouchableOpacity>

      {/* Dropdown Modal */}
      <Modal
        visible={isVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}
      >
        <TouchableOpacity
          className="flex-1 bg-black/50 justify-center px-5"
          activeOpacity={1}
          onPress={() => setIsVisible(false)}
        >
          <View className="bg-white max-h-60 overflow-hidden">
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleSelect(item.value)}
                  className="px-4 py-4 border-b border-gray-100"
                >
                  <Text className="font-rubik text-black-300 text-base">
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default CustomDropdown;