import { useEffect, useState } from "react";
import { Property, PropertyFormData, User } from "../types/property";
import { Alert } from "react-native";
import { transformPropertyDataForApi } from "../utils/propertyUtils";
import { Facility } from "@/components/FacilityMangement";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export const useProperties = () => {
    const [owners, setOwners] = useState<User[]>([])
    const [facilities, setFacilities] = useState<Facility[]>([])
    const [properties, setProperties] = useState<Property[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const loadOwners = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/users`)
            const result = await response.json();

            if(result.success) {
                const agents = result.data.filter((user: any) => user.role === 'agent');
                setOwners(agents)
            } else {
                Alert.alert('Error', 'Failed to load owners')
            }
        } catch (error) {
            console.log("Error loading owners", error)
            Alert.alert('Error', 'Failed to connect to server')
        } finally {
            setIsLoading(false);
        }
    }

    const loadFacilities = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/facilities`)
            const result = await response.json();

            if(result.success) {
                setFacilities(result.data)
            } else {
                Alert.alert('Error', 'Failed to load facilities')
            }
        } catch (error) {
            console.log("Error loading facilities", error)
            Alert.alert('Error', 'Failed to connect to server')
        } finally {
            setIsLoading(false);
        }
    }

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
            const transformedData = transformPropertyDataForApi(propertyData)

            const response = await fetch(`${API_BASE_URL}/api/properties`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(transformedData)
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

    const updateProperty = async(id: string, propertyData: PropertyFormData) => {
        if(!propertyData) {
            Alert.alert('Error', 'Property data are required')
            return false;
        }

        setIsLoading(true);
        try {
            const transformedData = transformPropertyDataForApi(propertyData);

            const response = await fetch(`${API_BASE_URL}/api/properties/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(transformedData)
            });

            const result = await response.json();

            if(response.ok && result.success) {
                setProperties(prev =>
                    prev.map(property => 
                        property._id === id ? result.data : property
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

    const deleteProperty = async (property: Property) => {
        setIsLoading(true)
        try {
            const response = await fetch(`${API_BASE_URL}/api/properties/${property._id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(property)
            })

            const result = await response.json();

            if(response.ok && result.success) {
                setProperties(prev => prev.filter(p => p._id !== property._id))
                Alert.alert('Success', 'Facility deleted successfully');
                return true;
            } else {
                Alert.alert('Error', result.message || 'Failed to delete property');
                return false;
            }
        } catch (error) {
            console.log('Error deleting property', error)
            Alert.alert('Error', 'Failed to connect to server')
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadProperties()
        loadOwners();
        loadFacilities();
    }, []);

    return {
        owners,
        facilities,
        properties,
        isLoading,
        loadOwners,
        loadFacilities,
        loadProperties,
        addProperty,
        updateProperty,
        deleteProperty
    }
}
