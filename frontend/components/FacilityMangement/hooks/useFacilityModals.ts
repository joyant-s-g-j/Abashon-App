import { useState } from "react";
import { Facility, FacilityFormData } from "../types/facility";
import { Alert } from "react-native";

export const useFacilityModals = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [newFacility, setNewFacility] = useState<FacilityFormData>({
    name: '',
    icon: '',
    imageUri: null,
    iconBase64: null
  });
  const [editFacility, setEditFacility] = useState<FacilityFormData & { originalIcon: string }>({
    name: '',
    icon: '',
    imageUri: null,
    iconBase64: null,
    originalIcon: ''
  });

  const openAddModal = () => setShowAddModal(true);

  const closeAddModal = () => {
    setNewFacility({ name: '', icon: '', imageUri: null, iconBase64: null });
    setShowAddModal(false);
  };

  const openEditModal = (facility: Facility) => {
    setSelectedFacility(facility);
    setEditFacility({
      name: facility.name,
      icon: facility.icon as string,
      imageUri: facility.icon as string,
      iconBase64: null,
      originalIcon: facility.icon as string
    });
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setEditFacility({ name: '', icon: '', imageUri: null, iconBase64: null, originalIcon: '' });
    setSelectedFacility(null);
    setShowEditModal(false);
  };

  const handleDeleteFacility = (facility: Facility, onConfirmDelete: (facility: Facility) => void) => {
    Alert.alert(
      'Delete Facility',
      `Are you sure you want to delete "${facility.name}"? This action cannot be undone.`,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onConfirmDelete(facility)
        }
      ]
    );
  };

  const updateNewFacilityImage = (imageData: string) => {
    setNewFacility(prev => ({
      ...prev,
      imageUri: imageData,
      iconBase64: imageData,
      icon: imageData
    }));
  };

  const updateEditFacilityImage = (imageData: string) => {
    setEditFacility(prev => ({
      ...prev,
      imageUri: imageData,
      iconBase64: imageData,
      icon: imageData
    }));
  };

  return {
    showAddModal,
    showEditModal,
    selectedFacility,
    newFacility,
    editFacility,
    openAddModal,
    closeAddModal,
    openEditModal,
    closeEditModal,
    handleDeleteFacility,
    setNewFacility,
    setEditFacility,
    updateNewFacilityImage,
    updateEditFacilityImage
  };
};