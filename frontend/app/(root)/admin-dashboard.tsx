import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { adminDashboard, stats } from '@/constants/data'
import { useRouter } from 'expo-router'
import icons from '@/constants/icons'

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('')
  const router = useRouter();
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

          {/* stats cards */}
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

          {/* Navigation Cards */}
          <View className='py-6'>
            <Text className='text-xl font-rubik-semibold mb-4 text-black-300'>
              Management Options
            </Text>

            {adminDashboard.map((option, index) => (
              <TouchableOpacity
                key={option.id}
                className='bg-white rounded-xl p-6 mb-4 shadow-sm border border-gray-100'
                onPress={() => router.push(option.route as any)}
                activeOpacity={0.7}
              >
                <View className='flex-row items-center justify-between'>
                  <View className='flex-row items-center flex-1'>
                    <View className='size-12 bg-primary-200 rounded-xl items-center justify-center mr-4'>
                      <Text className='text-4xl'>{option.icon}</Text>
                    </View>
                    <View className='flex-1'>
                      <Text className='text-2xl font-rubik-semibold text-black-300 mb-1'>
                        {option.title}
                      </Text>
                      <Text className='text-sm text-black-200'>
                        {option.description}
                      </Text>
                    </View>
                  </View>
                  <View className='flex flex-row bg-primary-200 rounded-full size-11 items-center justify-center'>
                    <Image source={icons.rightArrow} className='size-6' />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
    </SafeAreaView>
  )
}

export default AdminDashboard