import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, ActivityIndicator } from 'react-native';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const user = await AsyncStorage.getItem('user');
        if (user) {
          setIsLoggedIn(true);
        } else {
          router.replace('/sign-in');
        }
      } catch (error) {
        console.error('Error checking login:', error);
        router.replace('/sign-in');
      } finally {
        setLoading(false);
      }
    };

    checkLogin();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#0061ff" />
      </View>
    );
  }

  if (!isLoggedIn) return null;

  return <>{children}</>;
};

export default ProtectedRoute;
