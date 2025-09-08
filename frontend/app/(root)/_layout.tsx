import ProtectedRoute from "@/components/ProtectedRoute";
import { Slot } from "expo-router";
import { StripeProvider } from '@stripe/stripe-react-native';

export default function RootLayout() {
  return (
      <ProtectedRoute>
        <StripeProvider publishableKey={process.env.STRIPE_PUBLISHABLE_KEY!}>
        <Slot />
        </StripeProvider>
      </ProtectedRoute>
  );
}
