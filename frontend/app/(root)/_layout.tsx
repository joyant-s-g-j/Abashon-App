import ProtectedRoute from "@/components/ProtectedRoute";
import { Slot } from "expo-router";

export default function RootLayout() {
  return (
    <ProtectedRoute>
      <Slot />
    </ProtectedRoute>
  );
}
