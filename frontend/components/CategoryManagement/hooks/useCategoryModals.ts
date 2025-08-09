import { useState } from "react";
import { Category, CategoryFormData } from "../types/category";
import { Alert } from "react-native";

export const useCategoryModals = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [newCategory, setNewCategory] = useState<CategoryFormData>({
    name: ''
  });

  const openAddModal = () => setShowAddModal(true);

  const closeAddModal = () => {
    setNewCategory({ name: '' });
    setShowAddModal(false);
  };

  const openEditModal = (category: Category) => {
    setSelectedCategory({ ...category });
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setSelectedCategory(null);
    setShowEditModal(false);
  };

  const handleDeleteCategory = (category: Category, onConfirmDelete: (category: Category) => void) => {
    Alert.alert(
      'Delete Category',
      `Are you sure you want to delete "${category.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onConfirmDelete(category)
        }
      ]
    );
  };

  const updateSelectedCategory = (name: string) => {
    setSelectedCategory(prev => prev ? { ...prev, name } : prev);
  };

  return {
    showAddModal,
    showEditModal,
    selectedCategory,
    newCategory,
    openAddModal,
    closeAddModal,
    openEditModal,
    closeEditModal,
    handleDeleteCategory,
    setNewCategory,
    updateSelectedCategory
  };
};