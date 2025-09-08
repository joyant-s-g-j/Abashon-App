import ProtectedRoute from "@/components/ProtectedRoute";
import { Slot } from "expo-router";
import { StripeProvider } from '@stripe/stripe-react-native';
import { SocketProvider } from "@/contexts/SocketContext";

export default function RootLayout() {
  return (
    <SocketProvider>
      <ProtectedRoute>
        <StripeProvider publishableKey={process.env.STRIPE_PUBLISHABLE_KEY!}>
        <Slot />
        </StripeProvider>
      </ProtectedRoute>
    </SocketProvider>
  );
}
