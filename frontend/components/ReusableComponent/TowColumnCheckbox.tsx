import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import LabelText from './LabelText'

interface TowColumnCheckboxProps<T> {
    label: string
    items: T[]
    selectedId?: string | number | null
    selectedIds?: (string | number)[]
    onSelect: (id: string | number | null | (string | number)[]) => void
    getId: (item: T) => string | number
    getLabel: (item: T) => string
    multi?: boolean
}

export function TowColumnCheckbox<T>({
    label,
    items,
    selectedId,
    selectedIds = [],
    onSelect,
    getId,
    getLabel,
    multi = false
}: TowColumnCheckboxProps<T>) {
  const leftColumn: T[] = []
  const rightColumn: T[] = []

  items.forEach((item, index) => {
    if(index % 2 === 0) leftColumn.push(item)
    else rightColumn.push(item)
  })

  const renderItem = (item: T) => {
    const id = getId(item)
    const isSelected = multi ? selectedIds.includes(id) : selectedId === id
    const handlePress = () => {
        if(multi) {
            if(isSelected) {
                onSelect(selectedIds.filter(sid => sid !== id))
            } else {
                onSelect([...selectedIds, id])
            }
        } else {
            if(isSelected) onSelect(null)
            else onSelect(id)
        }
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
    <View>
        <LabelText text={label} />
        <View className='flex-row justify-between w-full'>
            <View className='flex-1 gap-3'>{leftColumn.map(renderItem)}</View>
            <View className='flex-1 gap-3'>{rightColumn.map(renderItem)}</View>
        </View>
    </View>
    
  )
}