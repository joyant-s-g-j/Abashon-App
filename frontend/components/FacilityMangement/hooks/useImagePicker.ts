import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

export const useImagePicker = () => {
  const pickImage = async (): Promise<string | null> => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant camera roll permissions to select images');
        return null;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        try {
          const base64 = await FileSystem.readAsStringAsync(imageUri, {
            encoding: 'base64',
          });

          return `data:image/jpeg;base64,${base64}`;
        } catch (error) {
          console.error('Error converting image to base64:', error);
          Alert.alert('Error', 'Failed to process image');
          return null;
        }
      }
      return null;
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
      return null;
    }
  };

  return { pickImage };
};