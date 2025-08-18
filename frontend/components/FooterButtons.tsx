import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

interface FooterButtonsProps {
    handlePrevious: () => void;
    handleSubmit: () => void;
    handleNext: () => void;
    currentStep: number;
    isLoading: boolean;
    isEdit: boolean;
}

const FooterButtons: React.FC<FooterButtonsProps> = ({
    handlePrevious,
    handleSubmit,
    handleNext,
    currentStep,
    isLoading,
    isEdit
}) => {
  return (
    <View className='flex-row items-center justify-between p-4 border-t border-gray-200'>
      <TouchableOpacity
        onPress={handlePrevious}
        disabled={currentStep === 1}
        className={`px-6 py-3 rounded-lg ${
            currentStep === 1 ? 'bg-gray-100' : 'bg-gray-300'
        }`}
      >
        <Text className={`font-rubik-medium ${
            currentStep === 1 ? 'text-gray-400' : 'text-black-300'
        }`}>
            Previous
        </Text>
      </TouchableOpacity>

      {currentStep === 5 ? (
        <TouchableOpacity
            onPress={handleSubmit}
            disabled={isLoading}
            className={`px-8 py-3 rounded-lg ${
                isLoading ? 'bg-gray-300' : 'bg-primary-300'
            }`}
        >
            <Text className='text-white font-rubik-semibold'>
                {isLoading ? 'Submitting...': (isEdit ? 'Update': 'Create')}
            </Text>
        </TouchableOpacity>
      ): (
        <TouchableOpacity
            onPress={handleNext}
            className='bg-primary-300 px-8 py-3 rounded-lg'
        >
            <Text className='text-white font-rubik-semibold'>Next</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

export default FooterButtons