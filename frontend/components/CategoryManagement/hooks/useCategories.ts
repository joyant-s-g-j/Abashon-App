import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { Category } from "../types/category";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadCategories = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/categories`);
      const result = await response.json();

      if (result.success) {
        setCategories(result.data);
      } else {
        Alert.alert('Error', 'Failed to load categories');
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      Alert.alert('Error', 'Failed to connect to server');
    } finally {
      setIsLoading(false);
    }
  };

  const addCategory = async (name: string) => {
    if (!name.trim()) {
      Alert.alert('Error', 'Category name is required');
      return false;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: name.trim() })
      });

      const result = await response.json();

      if (result.success) {
        setCategories(prev => [...prev, result.data]);
        Alert.alert('Success', result.message || 'Category added successfully!');
        return true;
      } else {
        Alert.alert('Error', result.message || 'Failed to add category');
        return false;
      }
    } catch (error) {
      console.error('Error adding category:', error);
      Alert.alert('Error', 'Failed to connect to server');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateCategory = async (categoryId: string, name: string) => {
    if (!name.trim()) {
      Alert.alert('Error', 'Category name is required');
      return false;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/categories/${categoryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: name.trim() })
      });

      const result = await response.json();

      if (result.success) {
        setCategories(prev =>
          prev.map(cat =>
            cat._id === categoryId ? result.data : cat
          )
        );
        Alert.alert('Success', result.message || 'Category updated successfully!');
        return true;
      } else {
        Alert.alert('Error', result.message || 'Failed to update category');
        return false;
      }
    } catch (error) {
      console.error('Error updating category:', error);
      Alert.alert('Error', 'Failed to connect to server');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCategory = async (category: Category) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/categories/${category._id}`, {
        method: 'DELETE'
      });

      const result = await response.json();

      if (result.success) {
        setCategories(prev => prev.filter(cat => cat._id !== category._id));
        Alert.alert('Success', result.message || 'Category deleted successfully!');
        return true;
      } else {
        Alert.alert('Error', result.message || 'Failed to delete category');
        return false;
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      Alert.alert('Error', 'Failed to connect to server');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return {
    categories,
    isLoading,
    loadCategories,
    addCategory,
    updateCategory,
    deleteCategory
  };
};