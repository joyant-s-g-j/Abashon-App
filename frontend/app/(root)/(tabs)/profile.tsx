import { View, Text, ScrollView, Image, TouchableOpacity, ImageSourcePropType, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import icons from '@/constants/icons'
import images from '@/constants/images'
import { settings } from '@/constants/data'
import { useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'

interface SettingsItemProps {
  icon: ImageSourcePropType;
  title: string;
  onPress?: () => void;
  textStyle?: string;
  showArrow?: boolean;
}

const SettingsItem = ({icon, title, onPress, textStyle, showArrow = true }: SettingsItemProps) => {
  return (
    <TouchableOpacity onPress={onPress} className='flex flex-row items-center justify-between py-3'>
      <View className='flex flex-row items-center gap-3'>
        <Image source={icon} className='size-6' resizeMode='contain' />
        <Text className={`text-lg font-rubik-medium text-black-300 ${textStyle}`}>{title}</Text>
      </View>

      {showArrow && <Image source={icons?.rightArrow} className='size-5' />}
    </TouchableOpacity>
  )
}

const Profile = () => {
  const router = useRouter()
  const [user, setUser] = useState<null | {
    name: string;
    email: string;
    phone: string;
    role?: string;        // Optional to avoid TS error
    profilePic?: string;  // Optional to avoid TS error
  }>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user')
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);

          setForm({
            name: parsedUser.name || '',
            email: parsedUser.email || '',
            phone: parsedUser.phone || '',
          });
        }
      } catch (error) {
        console.error('Failed to load user:', error)
      }
    };
    fetchUser();
  }, [])

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      router.replace('/sign-in');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  const handleSave = async () => {
    // For now, just update local state & AsyncStorage

    const updatedUser = {
      ...user,
      name: form.name,
      email: form.email,
      phone: form.phone,
      role: user?.role ?? 'customer',
      profilePic: user?.profilePic ?? '',
    };

    setUser(updatedUser);
    await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
    setIsEditing(false);
  };

  return (
    <SafeAreaView>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName='pb-32 px-7'
      >
        <View className='flex flex-row items-center justify-between mt-5'>
          <Text className='text-xl font-rubik-bold'>Profile</Text>
          <View className='flex-row gap-2'>
            <TouchableOpacity onPress={() => setIsEditing(prev => !prev)}>
              <Image source={icons.edit} className='size-5' />
            </TouchableOpacity>
          </View>
        </View>
        
        <View className='flex-row justify-center flex mt-5'>
          <View className='flex flex-col items-center relative mt-5'>
            <Image
              source={
                user?.profilePic === "local" || !user?.profilePic
                  ? images.avatar
                  : { uri: user.profilePic }
              }
              className='size-44 relative rounded-full'
            />

            {isEditing ? (
              <>
                <TextInput
                  value={form.name}
                  onChangeText={text => setForm({...form, name: text})}
                  className="text-2xl font-rubik-bold mt-2 border-b border-gray-300 w-60 text-center"
                  placeholder="Name"
                />
                <TextInput
                  value={form.email}
                  onChangeText={text => setForm({...form, email: text})}
                  className="text-base font-rubik text-black-200 mt-1 border-b border-gray-300 w-60 text-center"
                  placeholder="Email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <TextInput
                  value={form.phone}
                  onChangeText={text => setForm({...form, phone: text})}
                  className="text-base font-rubik text-black-200 mt-1 border-b border-gray-300 w-60 text-center"
                  placeholder="Phone"
                  keyboardType="phone-pad"
                />

                <TouchableOpacity
                  onPress={handleSave}
                  className="bg-primary-300 py-3 mt-5 rounded-xl w-40 self-center"
                >
                  <Text className="text-white text-center font-rubik-bold text-lg">Save</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setIsEditing(false)}
                  className="py-3 mt-3 rounded-xl w-40 self-center border border-gray-400"
                >
                  <Text className="text-center font-rubik text-black-300">Cancel</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text className='text-2xl font-rubik-bold mt-2'>
                  {user?.name}
                </Text>
                <Text className='text-base font-rubik text-black-200'>
                  {user?.email}
                </Text>
                <Text className='text-base font-rubik text-black-200 mt-1'>
                  {user?.phone}
                </Text>
              </>
            )}
          </View>
        </View>

        <View className='flex flex-col mt-5'>
          <SettingsItem icon={icons.calendar} title='My Bookings' />
          <SettingsItem icon={icons.wallet} title='Payments' />
          {user?.role?.toLowerCase() === 'admin' && (
            <SettingsItem icon={icons.filter} title='Admin Management' />
          )}
        </View>

        <View className='flex flex-col mt-5 border-t pt-5 border-primary-200'>
          {settings.slice(2).map((item, index) => (
            <SettingsItem key={index} {...item} />
          ))}
        </View>

        <View className='flex flex-col mt-5 border-t pt-5 border-primary-200'>
          <SettingsItem
            icon={icons.logout} 
            title='Logout' 
            textStyle='text-danger' 
            showArrow={false} 
            onPress={handleLogout}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Profile
