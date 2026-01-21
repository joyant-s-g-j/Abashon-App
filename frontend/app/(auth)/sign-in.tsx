import icons from "@/constants/icons";
import images from "@/constants/images";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Google from "expo-auth-session/providers/google";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// This is needed to properly close the browser on web
WebBrowser.maybeCompleteAuthSession();

const SignIn = () => {
  const [isLoading, setIsLoading] = useState(false);
  const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
  const GOOGLE_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID;

  // Configure Google Auth with expo-auth-session
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: GOOGLE_CLIENT_ID,
    scopes: ["openid", "profile", "email"],
  });

  // Handle Google auth response
  useEffect(() => {
    handleGoogleResponse();
  }, [response]);

  const handleGoogleResponse = async () => {
    if (response?.type === "success") {
      const { authentication } = response;

      if (authentication?.accessToken) {
        try {
          // Send access token to backend
          const backendResponse = await fetch(
            `${API_BASE_URL}/api/auth/google/access-token`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                accessToken: authentication.accessToken,
              }),
            },
          );

          const data = await backendResponse.json();

          if (backendResponse.ok) {
            // Save user data and token
            await AsyncStorage.multiRemove(["user", "token"]);

            // Extract token from cookies or response
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

            // If backend returns a token in the response body
            if (data.token) {
              await AsyncStorage.setItem("token", data.token);
            }

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
          } else {
            Alert.alert("Error", data.message || "Authentication failed");
          }
        } catch (error) {
          console.error("❌ Backend auth error:", error);
          Alert.alert("Error", "Failed to authenticate with server");
        }
      }
      setIsLoading(false);
    } else if (response?.type === "error") {
      console.error("❌ Google auth error:", response.error);
      Alert.alert(
        "Authentication Error",
        response.error?.message || "Google sign-in failed",
      );
      setIsLoading(false);
    } else if (response?.type === "cancel") {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      // Clear any existing data before starting new sign-in
      await AsyncStorage.multiRemove(["user", "token"]);
      setIsLoading(true);
      await promptAsync();
    } catch (error) {
      console.error("❌ Error starting Google sign-in:", error);
      Alert.alert("Error", "Failed to start Google sign-in");
      setIsLoading(false);
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
            disabled={isLoading || !request}
            className={`bg-white shadow-md shadow-zinc-400 rounded-full w-full py-4 mt-5 ${
              isLoading || !request ? "opacity-50" : ""
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
