import { useState } from "react";
import { Property } from "../types/property";
import { Alert } from "react-native";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export const useProperties = () => {
    const [properties, setProperties] = useState<Property[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const loadProperties = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/properties`)
            const result = await response.json();

            if(result.success) {
                setProperties(result.data)
            } else {
                Alert.alert('Error', 'Failed to load properties')
            }
        } catch (error) {
            console.log("Error loading properties", error)
            Alert.alert('Error', 'Failed to connect to server')
        } finally {
            setIsLoading(false);
        }
    }
}
