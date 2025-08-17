import { Text } from 'react-native'
import React from 'react'

interface LabelTextProps {
  text: string
  className?: string
}

const LabelText: React.FC<LabelTextProps> = ({ text, className }) => {
  return (
    <Text className={className ?? "text-lg font-rubik-medium text-black-300 mb-2"}>
      {text}
    </Text>
  )
}

export default LabelText
