import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { adminDashboard, instructionSections, stats } from '@/constants/data'
import { useRouter } from 'expo-router'
import icons from '@/constants/icons'
import Header from '@/components/Header'
import { useEffect, useState } from 'react'

const AdminDashboard = () => {
  const [stats, setStats] = useState([
    { label: 'Total Properties', value: '0' },
    { label: 'Categories', value: '0' },
    { label: 'Facilities', value: '0' },
    { label: 'Agents', value: '0' },
    { label: 'Customers', value: '0' }
  ])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter();

  const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL

  useEffect(() => {
    loadDashboardStats()
  }, [])

  const loadDashboardStats = async () => {
    setIsLoading(true)
    try {
      const categoriesResponse = await fetch(`${API_BASE_URL}/api/categories`)
      const usersResponse = await fetch(`${API_BASE_URL}/api/users`)
      const categoriesResult = await categoriesResponse.json()
      const usersResult = await usersResponse.json()

      const categoriesCount = categoriesResult.success ? categoriesResult.data.length : 0
      
      let customersCount = 0
      let agentCount = 0

      if (usersResult.success && Array.isArray(usersResult.data)) {
        const users = usersResult.data
        customersCount = users.filter((user: any) => user.role === 'customer').length
        agentCount = users.filter((user: any) => user.role === 'agent').length
      }

      setStats([
        { label: 'Total Properties', value: '247' }, // Keep static for now
        { label: 'Categories', value: categoriesCount.toString() }, // Dynamic from API
        { label: 'Facilities', value: '38' },
        { label: 'Agents', value: agentCount.toString() }, // Keep static for now
        { label: 'Customers', value: customersCount.toString() } // Keep static for now
      ])
    } catch (error) {
      console.error('Error loading dashboard stats:', error)
      // Keep default values if API fails
      setStats([
        { label: 'Total Properties', value: '247' },
        { label: 'Categories', value: '12' },
        { label: 'Facilities', value: '38' },
        { label: 'Agents', value: '23' },
        { label: 'Customers', value: '140' }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <SafeAreaView className='flex-1 bg-gray-50'>
        <Header title="Admin Dashboard" backRoute="/profile" />

        <ScrollView
          className='flex-1 px-4'
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30 }}
        >
          <Text className='text-2xl font-rubik-semibold mb-4 text-black-300'>
            Manage your system configurations
          </Text>

          {/* stats cards */}
          <View>
            <Text className='text-xl font-rubik-semibold text-black-300 mb-4'>
              Quick Stats
            </Text>
            <View className='flex-row flex-wrap justify-between'>
              {stats.map((stat, index ) => (
                <View key={index} className='w-[48%] flex-row items-center gap-2 bg-white rounded-xl p-4 mb-4 shadow-sm'>
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
                className='bg-white rounded-xl px-6 py-4 mb-4 shadow-sm border border-gray-100'
                onPress={() => router.push(option.route as any)}
                activeOpacity={0.7}
              >
                <View className='flex-row items-center justify-between'>
                  <View className='flex-row items-center flex-1'>
                    <View className='size-12 bg-primary-200 rounded-xl items-center justify-center mr-4'>
                      <Text className='text-4xl'>{option.icon}</Text>
                    </View>
                    <View className='flex-1'>
                      <Text className='text-xl font-rubik-semibold text-black-300 mb-1'>
                        {option.title}
                      </Text>
                      <Text className='text-sm font-rubik text-black-200'>
                        {option.description}
                      </Text>
                    </View>
                  </View>
                  <View className='flex flex-row bg-primary-200 rounded-full size-8 items-center justify-center'>
                    <Image source={icons.rightArrow} className='size-5' />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
            <View className="bg-primary-200 rounded-md p-6 mb-6">
              <View className='flex-row items-center mb-4'>
                <Text className='text-3xl mr-4'>{instructionSections.emoji}</Text>
                <Text className="text-lg font-rubik-semibold text-black-300">
                  {instructionSections.title}
                </Text>
              </View>

              <View className='gap-1'>
                {instructionSections.points.map((point, i) => (
                  <View key={i} className='flex-row items-start'>
                    <Text className="text-sm font-rubik flex-1 leading-5 text-black-300">
                      {point}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
        </ScrollView>
    </SafeAreaView>
  )
}

export default AdminDashboard