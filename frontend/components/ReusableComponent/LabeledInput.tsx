import React from 'react'
import { InputField, LabelText } from '@/components/ReusableComponent'
import { View } from 'react-native';

interface Field {
  key: string;
  label: string;
  value: string;
  placeholder: string;
  keyboardType?: 'default' | 'numeric' | 'email-address';
  onChangeText: (text: string) => void;
}

interface LabeledInputProps {
  sectionLabel?: string; // optional section title
  fields: Field[];
}

const LabeledInput: React.FC<LabeledInputProps> = ({ sectionLabel, fields }) => {
  return (
    <View>
      {sectionLabel && <LabelText text={sectionLabel} className="text-xl mb-2" />}
      {fields.map((field) => (
        <InputField
          key={field.key}
          label={field.label}
          value={field.value}
          onChangeText={field.onChangeText}
          placeholder={field.placeholder}
          keyboardType={field.keyboardType || 'default'}
        />
      ))}
    </View>
  )
}

export default LabeledInput
