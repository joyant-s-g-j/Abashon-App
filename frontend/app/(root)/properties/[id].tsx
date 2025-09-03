import { View, ScrollView, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import ImageSlider from '@/components/SinglePropertyPage/ImageSlider'
import PropertInfo from '@/components/SinglePropertyPage/PropertInfo'
import PorpertyDetails from '@/components/SinglePropertyPage/PorpertyDetails'
import BookingTab from '@/components/SinglePropertyPage/BookingTab'
import { useLocalSearchParams } from 'expo-router'
import { Property } from '@/components/PropertyManagement'
import { LoadingBox } from '@/components/ReusableComponent'

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL

const PropertyPage = () => {
  const {id} = useLocalSearchParams()
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPorperty = async () => {
      if (!id) {
        setError('Property ID is required')
        setLoading(false)
        return
      }
      try {
        setLoading(true)
        setError(null)
        const response = await fetch(`${API_BASE_URL}/api/properties/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Property not found')
          } else if (response.status === 400) {
            throw new Error('Invalid property ID')
          } else {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
        }

        const data = await response.json()

        if (data.success && data.data) {
          setProperty(data.data)
        } else {
          throw new Error(data.message || 'Failed to fetch property')
        }
      } catch (error) {
        console.error('Error fetching property:', error)
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch property'
        setError(errorMessage)
        
        // Show alert for user feedback
        Alert.alert(
          'Error',
          errorMessage,
          [{ text: 'OK', style: 'default' }]
        )
      } finally {
        setLoading(false)
      }
    }
    fetchPorperty()
  }, [id])

  const galleryImages = [
    property?.thumbnailImage,
    ...(property?.galleryImages || [])
  ].filter(Boolean)
  
  return (
    <>
      <LoadingBox isLoading={loading} message="Loading Property..." />
      <SafeAreaView className='flex-1'>
        <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
          <ImageSlider images={galleryImages as any} />
          <View className='p-4'>
            <PropertInfo property={property} />
            <PorpertyDetails property={property}  />
          </View>
        </ScrollView>
        <BookingTab price={property?.price} />
      </SafeAreaView>
    </>
  )
}

export default PropertyPage