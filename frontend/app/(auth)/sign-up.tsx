import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform,
  Keyboard,
  Alert,
  KeyboardTypeOptions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Link, useRouter } from 'expo-router';
import axios from 'axios';
import images from '@/constants/images';
import CustomDropdown from '@/components/CustomDropdown';
import CustomInput from '@/components/CustomInput';
import AsyncStorage from '@react-native-async-storage/async-storage';

type FormFieldKey = 'name' | 'email' | 'phone' | 'password';

type InputField = {
  key: FormFieldKey;
  placeholder: string;
  keyboardType: KeyboardTypeOptions;
  secure: boolean;
};

const SignUp = () => {
  const [form, setForm] = useState<Record<FormFieldKey, string>>({
    name: '',
    email: '',
    phone: '',
    password: '',
  });

  const [role, setRole] = useState('');
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
    const hideSub = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const validateForm = () => {
    if(!form.name.trim()) {
      Alert.alert('Error', 'Please enter your name')
      return false
    }
    if(!form.email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return false;
    }
    if (!form.password.trim()) {
      Alert.alert('Error', 'Please enter your password');
      return false;
    }
    if (!role) {
      Alert.alert('Error', 'Please select a role');
      return false;
    }
    if (form.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(form.email)) {
      Alert.alert('Error', 'Please enter a valid email address')
      return false
    }

    return true
  }

  const handleSignup = async () => {
    if(!validateForm()) return

    setLoading(true)
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/signup`,
        {
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          phone: form.phone.trim(),
          password: form.password,
          role: role,
        },
        {
          withCredentials: true,
          timeout: 10000,
        }
      );

      console.log('Signup Success:', response.data);
      if(response.data.success) {
        if(response.data.user) {
          await AsyncStorage.setItem('user', JSON.stringify(response.data.user))
        }
        if(response.data.token) {
          await AsyncStorage.setItem('token', response.data.token)
        }
        Alert.alert(
          'Success', 
          `Welcome ${form.name}! You have successfully signed up.`, 
          [
            { 
              text: 'Go to Login', 
              onPress: () => router.push('/login') 
            },
          ]
        );
      }
      
    } catch (error) {
      console.error('Signup error:', error);
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          Alert.alert('Error', 'Request timeout. Please check your internet connection.');
        } else if (error.response?.data?.message) {
          Alert.alert('Error', error.response.data.message);
        } else if (error.response?.status === 400) {
          Alert.alert('Error', 'Invalid information provided. Please check your details.');
        } else {
          Alert.alert('Error', 'Network error. Please check your connection.');
        }
      } else {
        Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false)
    }
  };

  const inputFields: InputField[] = [
    { key: 'name', placeholder: 'Name', keyboardType: 'default', secure: false },
    { key: 'email', placeholder: 'Email', keyboardType: 'email-address', secure: false },
    { key: 'phone', placeholder: 'Phone Number', keyboardType: 'phone-pad', secure: false },
    { key: 'password', placeholder: 'Password (min. 6 characters)', keyboardType: 'default', secure: true },
  ];

  const roleOptions = [
    { label: 'Select Role', value: '' },
    { label: 'Customer', value: 'customer' },
    { label: 'Agent', value: 'agent' },
  ];

  return (
    <SafeAreaView className="bg-white h-full">
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: isKeyboardVisible ? 20 : 0 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        enableOnAndroid
        enableAutomaticScroll={Platform.OS === 'android'}
        extraScrollHeight={Platform.OS === 'ios' ? 100 : 150}
        extraHeight={Platform.OS === 'ios' ? 100 : 150}
        keyboardOpeningTime={250}
        scrollToOverflowEnabled
        viewIsInsideTabBar={false}
      >
        {/* Top Image + Gradient Overlay */}
        <Image source={images.signup} className="w-full h-80" resizeMode="cover" />

        {/* Form Section */}
        <View className="flex-1 px-5 py-3">
          <Text className="text-4xl font-rubik-bold text-black-300">Sign Up</Text>
          <Text className="text-base font-rubik text-black-200 mt-1 mb-4">
            Create a new account
          </Text>

          {/* Role Picker */}
          <CustomDropdown
            selectedValue={role}
            onValueChange={setRole}
            options={roleOptions}
            placeholder="Select Role"
          />

          {/* Input Fields */}
          {inputFields.map((field) => (
            <CustomInput
              key={field.key}
              value={form[field.key]}
              onChangeText={(text) => setForm({ ...form, [field.key]: text })}
              placeholder={field.placeholder}
              keyboardType={field.keyboardType}
              secureTextEntry={field.secure}
            />
          ))}

          {/* Signup Button */}
          <TouchableOpacity 
            onPress={handleSignup} 
            disabled={loading}
            className="bg-primary-300 py-4 mt-4 rounded-xl"
          >
            <Text className="text-white text-center font-rubik-bold text-lg">
              {loading ? 'Creating Account...' : 'Sign Up'}
            </Text>
          </TouchableOpacity>

          {/* Login Redirect */}
          <View className="flex-row justify-center mt-6 mb-8">
            <Text className="text-black-200 font-rubik">Already have an account? </Text>
            <TouchableOpacity>
              <Link href="/login" className="text-primary-300 font-rubik-medium">
                Sign In
              </Link>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
