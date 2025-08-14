import { useState } from "react";
import { Property, PropertyFormData } from "../types/property";
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

    const addProperty = async (propertyData: PropertyFormData) => {
        if(!propertyData) {
            Alert.alert('Error', 'Property data are required');
            return false;
        }
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/properties`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(propertyData)
            });

            const result = await response.json();

            if(response.ok && result.success) {
                setProperties(prev => [...prev, result.data]);
                Alert.alert('Success', 'Property added successfully');
                return true;
            } else {
                Alert.alert('Error', result.message || 'Failed to add property');
                return false;
            }
        } catch (error) {
            console.log("Error adding property", error);
            Alert.alert('Error', 'Failed to connect to server');
            return false;
        } finally {
            setIsLoading(false);
        }
    }
}
