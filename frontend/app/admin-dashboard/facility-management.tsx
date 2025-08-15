import { Facility, FacilityList, FacilityStats, filterFacilities, useFacilities, useFacilityModals, useImagePicker } from "@/components/FacilityMangement";
import SearchInput from "@/components/SearchInput";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native";
import { AddButton, Header, ItemModal } from "@/components/ReusableComponent";

const FacilityManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const {
    facilities,
    isLoading,
    addFacility,
    updateFacility,
    deleteFacility
  } = useFacilities();

  const { pickImage } = useImagePicker();

  const {
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
  } = useFacilityModals();

  const filteredFacilities = filterFacilities(facilities, searchQuery);

  const handlePickImage = async (isEdit = false) => {
    const imageData = await pickImage();
    if (imageData) {
      if (isEdit) {
        updateEditFacilityImage(imageData);
      } else {
        updateNewFacilityImage(imageData);
      }
    }
  };

  const handleAddFacility = async () => {
    const success = await addFacility(newFacility.name, newFacility.icon);
    if (success) {
      closeAddModal();
    }
  };

  const handleEditFacility = async () => {
    if (!selectedFacility) return;
    
    const success = await updateFacility(
      selectedFacility._id,
      editFacility.name,
      editFacility.icon,
      editFacility.originalIcon
    );
    
    if (success) {
      closeEditModal();
    }
  };

  const handleConfirmDelete = (facility: Facility) => {
    deleteFacility(facility);
  };

  return (
    <SafeAreaView className='flex-1 bg-gray-50'>
      <Header
        title='Facility Management'
        backRoute='/admin-dashboard'
        rightIcon={<AddButton onPress={openAddModal} />}
      />
      
      <ScrollView
        className='flex-1 px-4'
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <SearchInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search Facilities..."
        />

        <FacilityStats facilities={facilities} />

        <FacilityList
          facilities={filteredFacilities}
          searchQuery={searchQuery}
          isLoading={isLoading}
          onEditFacility={openEditModal}
          onDeleteFacility={(facility) => handleDeleteFacility(facility, handleConfirmDelete)}
        />

        <ItemModal
          visible={showAddModal}
          onClose={closeAddModal}
          title='Facility'
          nameValue={newFacility.name}
          onNameChange={(text) => setNewFacility(prev => ({ ...prev, name: text }))}
          imageUri={newFacility.imageUri}
          onPickImage={() => handlePickImage(false)}
          onSubmit={handleAddFacility}
          progressButtonLabel='Adding'
          submitButtonLabel='Add Facility'
          isLoading={isLoading}
        />

        <ItemModal
          visible={showEditModal}
          onClose={closeEditModal}
          title='Facility'
          nameValue={editFacility.name}
          onNameChange={(text) => setEditFacility(prev => ({ ...prev, name: text }))}
          imageUri={editFacility.imageUri}
          onPickImage={() => handlePickImage(true)}
          onSubmit={handleEditFacility}
          progressButtonLabel='Updating'
          submitButtonLabel='Update Facility'
          isLoading={isLoading}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default FacilityManagement;