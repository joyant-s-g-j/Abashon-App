import React from 'react'
import { TouchableOpacity, Text, ViewStyle, TextStyle, View } from 'react-native'

type ActionButtonsProps = {
  onEdit: () => void
  onDelete: () => void
  disabled?: boolean
  containerStyle?: ViewStyle | ViewStyle[]
  editButtonStyle?: ViewStyle | ViewStyle[]
  deleteButtonStyle?: ViewStyle | ViewStyle[]
  editTextStyle?: TextStyle | TextStyle[]
  deleteTextStyle?: TextStyle | TextStyle[]
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onEdit,
  onDelete,
  disabled = false,
  containerStyle,
  editButtonStyle,
  deleteButtonStyle,
  editTextStyle,
  deleteTextStyle,
}) => {
  return (
    <View className='flex-row justify-between items-center pt-4 border-t border-gray-100'>
      <TouchableOpacity
        onPress={onEdit}
        disabled={disabled}
        className='flex-1 bg-blue-50 py-3 px-4 rounded-lg mr-2'
      >
        <Text className='text-center text-primary-300 font-rubik-semibold text-sm'>
          Edit
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onDelete}
        disabled={disabled}
        className='flex-1 bg-red-50 py-3 px-4 rounded-lg ml-2'
      >
        <Text className='text-center text-red-700 font-rubik-semibold text-sm'>
          Delete
        </Text>
      </TouchableOpacity>
    </View>
  )
}

export default ActionButtons
