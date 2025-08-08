import { View, Text, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { stats } from '@/constants/data'

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('')
  return (
    <SafeAreaView className='flex-1 bg-gray-50'>
        <ScrollView
          className='flex-1 px-4'
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30 }}
        >
          {/* header */}
          <View className='py-6'>
            <Text className='text-3xl font-rubik-bold text-black-300 mb-2'>
              Admin Dashboard
            </Text>
            <Text className='text-base font-rubik-semibold text-black-300'>
              Manage your system configurations
            </Text>
          </View>

          {/* stats */}
          <View>
            <Text className='text-xl font-semibold text-black-300 mb-4'>
              Quick Stats
            </Text>
            <View className='flex-row flex-wrap justify-between'>
              {stats.map((stat, index ) => (
                <View key={index} className='w-[48%] flex-row items-center gap-2 bg-white rounded-xl p-4 mb-4 shadow-sm'>
                  <View className={`w-3 h-3 rounded-full ${stat.color} mb-2`} />
                  <View>
                    <Text className='text-2xl font-rubik-bold text-black-300 mb-1'>
                      {stat.value}
                    </Text>
                    <Text className='text-sm font-rubik text-black-200'>
                      {stat.label}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
    </SafeAreaView>
  )
}

export default AdminDashboard