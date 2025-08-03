import { Redirect } from 'expo-router';
import 'react-native-reanimated'; 

export default function Index(id: string) {
  return <Redirect href={`/properties/${id}`} />;
}
