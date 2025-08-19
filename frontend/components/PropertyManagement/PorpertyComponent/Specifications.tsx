import { View, Text } from 'react-native'
import React from 'react'
import { LabelText } from '@/components/ReusableComponent'
import CustomInput from '@/components/CustomInput'

interface SpecificationsProps {
    label: string;
    value: string;
    placeholder: string;
    onChnageText: (text: string) => void
}

const Specifications: React.FC<SpecificationsProps> = ({
    label,
    value,
    placeholder,
    onChnageText
}) => {
  return (
    <View>
        <LabelText text={label} />
        <CustomInput  
            value={value}
            onChangeText={onChnageText}
            placeholder={placeholder}
            keyboardType='numeric'
        />
    </View>
  )
}

export default Specifications