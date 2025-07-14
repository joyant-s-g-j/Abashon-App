import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text className="text-red-600 font-rubik-bold text-4xl my-10">Welcome to Abashon</Text>
      <Link href="/sign-in">Sign In</Link>
      <Link href="/explore">explore</Link>
      <Link href="./profile">profile</Link>
      <Link href="./properties">Property</Link>
    </View>
  );
}
