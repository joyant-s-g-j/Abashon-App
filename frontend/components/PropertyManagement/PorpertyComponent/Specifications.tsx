import React from 'react'
import { InputField } from '@/components/ReusableComponent'

interface SpecificationsProps {
    label: string;
    value: string;
    placeholder: string;
    onChangeText: (text: string) => void
}

const Specifications: React.FC<SpecificationsProps> = ({
    label,
    value,
    placeholder,
    onChangeText
}) => {
  return (
    <InputField 
      label={label}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      keyboardType="numeric"
    />
  )
}

export default Specifications