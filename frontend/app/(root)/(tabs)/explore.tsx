import { View, Text } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

const explore = () => {
  return (
    <SafeAreaView className="bg-white h-full">
        <Text>explore</Text>
      <Link href="/sign-in">Sign In</Link>
      {/* <Link href="/login">Sign In</Link> */}
    </SafeAreaView>
  )
}

export default explore