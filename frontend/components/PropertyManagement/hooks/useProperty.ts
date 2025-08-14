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
    };

    const updatePorperty = async(id: string, propertyData: PropertyFormData) => {
        if(!propertyData) {
            Alert.alert('Error', 'Property data are required')
            return false;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/properties/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(propertyData)
            });

            const result = await response.json();

            if(response.ok && result.success) {
                setProperties(prev =>
                    prev.map(property => 
                        property._id === id
                        ? {...property,
                            name: propertyData.name || property.name,
                            thumbnailImage: propertyData.thumbnailImage || property.thumbnailImage,
                            type: propertyData.type || property.type,
                            specifications: propertyData.specifications || property.specifications,
                            description: propertyData.description || property.description,
                            facilities: propertyData.facilities || property.facilities,
                            galleryImages: propertyData.galleryImages || property.galleryImages,
                            location: propertyData.location ? {
                                address: propertyData.location.address,
                                latitude: parseFloat(propertyData.location.latitude),
                                longitude: parseFloat(propertyData.location.longitude),
                            } : property.location,
                            price: propertyData.price ? parseFloat(propertyData.price) : property.price,
                            isFeatued: propertyData.isFeatured !== undefined ? propertyData.isFeatured : property.isFeatured,
                            updatedAt: new Date()
                        } : property
                    )
                );
                Alert.alert('Success', 'Facility updated successfully')
                return true;
            } else {
                Alert.alert('Error', result.message || 'Failed to update facility');
                return false
            }
        } catch (error) {
            console.log('Error updating property', error)
            Alert.alert('Error', 'Failed to connect to server');
            return false;
        } finally {
            setIsLoading(false)
        }
    }
}
