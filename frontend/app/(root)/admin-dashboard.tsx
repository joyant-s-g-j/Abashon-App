import { View, Text, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('')
  return (
    <SafeAreaView className='flex-1'>
        <ScrollView
          className='flex-1'
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30 }}
        >
          {/* header */}
          <View className='px-4 py-8'>
            <Text className='text-3xl font-rubik-bold text-black-300 mb-2'>
              Admin Dashboard
            </Text>
            <Text className='text-base font-rubik-semibold text-black-300'>
              Manage your system configurations
            </Text>
          </View>
        </ScrollView>
    </SafeAreaView>
  )
}

export default AdminDashboard