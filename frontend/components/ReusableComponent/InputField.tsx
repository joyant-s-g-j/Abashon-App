import React from "react";
import { TextInputProps, View } from "react-native";
import LabelText from "./LabelText";
import CustomInput from "./CustomInput";

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
    <View>
      {label && (
        <LabelText text={label} />
      )}
      <CustomInput 
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        {...rest}
      />
    </View>
  );
};

export default InputField;
