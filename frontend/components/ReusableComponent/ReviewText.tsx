import { View, Text } from 'react-native'
import React from 'react'

interface ReviewTextProps {
    text: string
}

const ReviewText: React.FC<ReviewTextProps> = ({text}) => {
  return (
      <Text className="text-base font-rubik text-black-200">{text}</Text>
  )
}

export default ReviewText