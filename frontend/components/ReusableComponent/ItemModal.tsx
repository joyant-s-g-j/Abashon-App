import { View, Text, Modal, TouchableOpacity, ScrollView, TextInput, Image } from 'react-native'
import React from 'react'
import InputField from './InputField'
import LabelText from './LabelText'

type ItemModalProps = {
    visible: boolean
    onClose: () => void
    title: string
    nameValue: string
    onNameChange: (text: string) => void
    imageUri?: string | null
    onPickImage?: () => void
    onSubmit: () => void
    progressButtonLabel: string
    submitButtonLabel: string
    isLoading: boolean
}

const ItemModal: React.FC<ItemModalProps> = ({
    visible,
    onClose,
    title,
    nameValue,
    onNameChange,
    imageUri,
    onPickImage,
    onSubmit,
    progressButtonLabel,
    submitButtonLabel,
    isLoading
}) => {
  return (
    <Modal
        visible={visible}
        animationType='slide'
        transparent={true}
        onRequestClose={onClose}
    >
        <View className='flex-1 justify-end bg-black/50'>
            <View className='bg-white rounded-t-3xl p-6 max-h-[80%]'>
                <View className='flex-row items-center justify-between mb-6'>
                    <Text className='text-xl font-rubik-bold text-black-300'>{`Add New ${title}`}</Text>
                    <TouchableOpacity onPress={onClose}>
                        <Text className='text-black-200 text-4xl'>×</Text>
                    </TouchableOpacity>
                </View> 

                <ScrollView showsVerticalScrollIndicator={false}>
                    <InputField 
                        label={`${title} Name *`}
                        value={nameValue}
                        onChangeText={onNameChange}
                        editable={!isLoading}
                        placeholder={`Enter ${title.toLowerCase()} name`}
                    />

                {onPickImage && (
                    <View className='mb-6'>
                        <LabelText text={`${title} Icon *`} />
                        {/* Image Preview */}
                        {imageUri && (
                            <View className='mb-4'>
                                <Image 
                                    source={{ uri: imageUri }} 
                                    className='w-24 h-24 rounded-xl'
                                    resizeMode='cover'
                                />
                            </View>
                        )}
                        
                        {/* Image Picker Button */}
                        <TouchableOpacity
                            onPress={onPickImage}
                            disabled={isLoading}
                            className='bg-gray-100 rounded-xl px-4 py-3 flex-row items-center justify-center'
                        >
                        <Text className='text-base font-rubik text-black-300 mr-2'>
                            {imageUri ? 'Change Image' : 'Select Image'}
                        </Text>
                        <Text className='text-lg'>📷</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Action Buttons */}
                <View className='flex-row gap-3'>
                    <TouchableOpacity
                        onPress={onClose}
                        disabled={isLoading}
                        className='flex-1 bg-gray-100 py-4 rounded-xl'
                    >
                        <Text className='text-center font-rubik-semibold text-black-200'>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className='flex-1 bg-primary-300 py-4 rounded-xl'
                        disabled={isLoading}
                        onPress={onSubmit}
                    >
                        <Text className='text-center font-rubik-bold text-white'>
                            {isLoading ? `${progressButtonLabel}...` : submitButtonLabel}
                        </Text>
                    </TouchableOpacity>
                </View>
                </ScrollView>
            </View>
        </View>
    </Modal>
  )
}

export default ItemModal