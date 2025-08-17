import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

interface TowColumnCheckboxProps<T> {
    items: T[]
    selectedId: string | number | null
    onSelect: (id: string | number | null) => void
    getId: (item: T) => string | number
    getLabel: (item: T) => string
}

export function TowColumnCheckbox<T>({
    items,
    selectedId,
    onSelect,
    getId,
    getLabel
}: TowColumnCheckboxProps<T>) {
  const leftColumn: T[] = []
  const rightColumn: T[] = []

  items.forEach((item, index) => {
    if(index % 2 === 0) leftColumn.push(item)
    else rightColumn.push(item)
  })

  const renderItem = (item: T) => {
    const id = getId(item)
    const isSelected = selectedId === id
    const handlePress = () => {
        if(isSelected) onSelect(null)
        else onSelect(id)
    }
    return (
    <TouchableOpacity
        key={id}
        className={`flex-row items-center`}
        onPress={handlePress}
    >
        <Text className='text-2xl mr-2'>
            {isSelected ? '✅' : '⬜'}
        </Text>
        <Text className={`text-xl font-rubik ${
            isSelected ? 'text-primary-300 font-rubik-semibold' : "text-black-300"}`}
        >
            {getLabel(item)}
        </Text>
    </TouchableOpacity>
    )
  }
  return (
    <View className='flex-row justify-between w-full'>
      <View className='flex-1 gap-3'>{leftColumn.map(renderItem)}</View>
      <View className='flex-1 gap-3'>{rightColumn.map(renderItem)}</View>
    </View>
  )
}