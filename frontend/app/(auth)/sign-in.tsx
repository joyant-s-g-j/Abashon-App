import { CONFIG } from "@/constants/config";
import icons from "@/constants/icons";
import images from "@/constants/images";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SignIn = () => {
  const [isLoading, setIsLoading] = useState(false);
  const API_BASE_URL = CONFIG.API_BASE_URL;
  const GOOGLE_WEB_CLIENT_ID = CONFIG.GOOGLE_WEB_CLIENT_ID;

  // Configure Google Sign-In on mount
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: GOOGLE_WEB_CLIENT_ID,
      offlineAccess: true,
      scopes: ["profile", "email"],
    });
  }, []);

  const handleGoogleLogin = async () => {
    try {
      await AsyncStorage.multiRemove(["user", "token"]);
      setIsLoading(true);

      // Check if Google Play Services are available
      await GoogleSignin.hasPlayServices();

      // Sign in using native Google Sign-In
      const response = await GoogleSignin.signIn();

      if (isSuccessResponse(response)) {
        // Get tokens
        const tokens = await GoogleSignin.getTokens();
        const accessToken = tokens.accessToken;

        // ...existing code...

        if (accessToken) {
          await authenticateWithBackend(accessToken);
        } else {
          setIsLoading(false);
          Alert.alert("Error", "Could not get access token");
        }
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.error("❌ Google Sign-In error:", error);

      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.SIGN_IN_CANCELLED:
            break;
          case statusCodes.IN_PROGRESS:
            Alert.alert("Error", "Sign-in already in progress");
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            Alert.alert("Error", "Google Play Services not available");
            break;
          default:
            Alert.alert(
              "Error",
              `Failed to sign in with Google: ${error.code}`,
            );
        }
      } else {
        Alert.alert("Error", "Failed to sign in with Google");
      }
    }
  };

  const authenticateWithBackend = async (token: string) => {
    try {
      const endpoint = `${API_BASE_URL}/api/auth/google/access-token`;

      const body = { accessToken: token };

      const backendResponse = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await backendResponse.json();

      if (!backendResponse.ok) {
        setIsLoading(false);
        Alert.alert("Error", data.message || "Authentication failed");
        return;
      }

      const userData = {
        _id: data._id,
        name: data.name,
        email: data.email,
        phone: data.phone || "",
        role: data.role || "customer",
        avatar: data.avatar || "",
        authMethod: "google",
      };

      await AsyncStorage.setItem("user", JSON.stringify(userData));

      if (data.token) {
        await AsyncStorage.setItem("token", data.token);
      }

      setIsLoading(false);
      Alert.alert(
        "Success!",
        `Welcome ${userData.name}! You have successfully signed in.`,
        [
          {
            text: "OK",
            onPress: () => {
              router.replace("/(root)/(tabs)");
            },
          },
        ],
      );
    } catch (error) {
      console.error("❌ Backend auth error:", error);
      setIsLoading(false);
      Alert.alert("Error", "Failed to authenticate with server");
    }
  };

  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView contentContainerClassName="h-full">
        <Image
          source={images.onboarding}
          className="w-full h-4/6"
          resizeMode="contain"
        />
        <View className="px-10">
          <Text className="text-base text-center uppercase font-rubik text-black-200">
            Welcome to Abashon
          </Text>
          <Text className="text-3xl font-rubik-bold text-black-300 text-center mt-2">
            Find your dream home easily{"\n"}
            <Text className="text-primary-300">Start your search today</Text>
          </Text>

          <TouchableOpacity
            onPress={() => router.replace("/login")}
            className="bg-blue-500 rounded-full w-full py-4 mt-4 items-center"
          >
            <Text className="text-lg font-rubik-medium text-white">
              Continue with Email
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleGoogleLogin}
            disabled={isLoading}
            className={`bg-white shadow-md shadow-zinc-400 rounded-full w-full py-4 mt-5 ${
              isLoading ? "opacity-50" : ""
            }`}
          >
            <View className="flex flex-row items-center justify-center gap-2">
              <Image
                source={icons.google}
                className="w-5 h-5"
                resizeMode="contain"
              />
              <Text className="text-lg font-rubik-medium text-black-300">
                {isLoading ? "Signing in..." : "Continue with Google"}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
