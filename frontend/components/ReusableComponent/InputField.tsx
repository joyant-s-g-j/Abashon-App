import React from "react";
import { TextInput, Text, View, TextInputProps } from "react-native";
import LabelText from "./LabelText";

interface InputFieldProps extends TextInputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  className?: string; // custom class support
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  className = "",
  ...rest
}) => {
  return (
    <View className="mb-4">
      {label && (
        <LabelText text={label} />
      )}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        className={`border border-gray-200 rounded-lg px-4 py-3 font-rubik text-black-300 ${className}`}
        placeholderTextColor="#9CA3AF"
        {...rest}
      />
    </View>
  );
};

export default InputField;
