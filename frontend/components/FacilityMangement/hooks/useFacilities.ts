import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { Facility } from "../types/facility";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export const useFacilities = () => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadFacilities = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/facilities`);
      const result = await response.json();

      if (result.success) {
        setFacilities(result.data);
      } else {
        Alert.alert('Error', 'Failed to load facilities');
      }
    } catch (error) {
      console.error('Error loading facilities', error);
      Alert.alert('Error', 'Failed to connect to server');
    } finally {
      setIsLoading(false);
    }
  };

  const addFacility = async (name: string, icon: string) => {
    if (!name.trim() || !icon.trim()) {
      Alert.alert('Error', 'Facility name and icon are required');
      return false;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/facilities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          icon: icon.trim()
        })
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        setFacilities(prev => [...prev, result.data]);
        Alert.alert('Success', 'Facility added successfully');
        return true;
      } else {
        Alert.alert('Error', result.message || 'Failed to add facility');
        return false;
      }
    } catch (error) {
      console.error('Error adding facility:', error);
      Alert.alert('Error', 'Failed to connect to server');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateFacility = async (facilityId: string, name: string, icon: string, originalIcon: string) => {
    if (!name.trim() || !icon.trim()) {
      Alert.alert('Error', 'Facility name and icon are required');
      return false;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/facilities/${facilityId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          icon: icon.trim(),
          originalIcon
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setFacilities(prev =>
          prev.map(facility =>
            facility._id === facilityId
              ? { ...facility, name: name.trim(), icon: icon.trim() }
              : facility
          )
        );
        Alert.alert('Success', 'Facility updated successfully');
        return true;
      } else {
        Alert.alert('Error', result.message || 'Failed to update facility');
        return false;
      }
    } catch (error) {
      console.error('Error updating facility:', error);
      Alert.alert('Error', 'Failed to connect to server');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteFacility = async (facility: Facility) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/facilities/${facility._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          icon: facility.icon
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setFacilities(prev => prev.filter(f => f._id !== facility._id));
        Alert.alert('Success', 'Facility deleted successfully');
        return true;
      } else {
        Alert.alert('Error', result.message || 'Failed to delete facility');
        return false;
      }
    } catch (error) {
      console.error('Error deleting facility:', error);
      Alert.alert('Error', 'Failed to connect to server');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFacilities();
  }, []);

  return {
    facilities,
    isLoading,
    loadFacilities,
    addFacility,
    updateFacility,
    deleteFacility
  };
};