import { Category, CategoryList, CategoryStats, filterCategories, useCategories, useCategoryModals } from "@/components/CategoryManagement";
import AddButton from "@/components/ReusableComponent/AddButton";
import Header from "@/components/ReusableComponent/Header";
import ItemModal from "@/components/ReusableComponent/ItemModal";
import SearchInput from "@/components/SearchInput";
import { useState } from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CategoryManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const {
    categories,
    isLoading,
    addCategory,
    updateCategory,
    deleteCategory
  } = useCategories();

  const {
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
  } = useCategoryModals();

  const filteredCategories = filterCategories(categories, searchQuery);

  const handleAddCategory = async () => {
    const success = await addCategory(newCategory.name);
    if (success) {
      closeAddModal();
    }
  };

  const handleUpdateCategory = async () => {
    if (!selectedCategory) return;

    const success = await updateCategory(selectedCategory._id, selectedCategory.name);
    if (success) {
      closeEditModal();
    }
  };

  const handleConfirmDelete = (category: Category) => {
    deleteCategory(category);
  };

  return (
    <SafeAreaView className='flex-1 bg-gray-50'>
      <Header
        title='Category Management'
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
          placeholder="Search Categories..."
        />

        <CategoryStats categories={categories} />

        <CategoryList
          categories={filteredCategories}
          searchQuery={searchQuery}
          isLoading={isLoading}
          onEditCategory={openEditModal}
          onDeleteCategory={(category) => handleDeleteCategory(category, handleConfirmDelete)}
        />

        <ItemModal
          visible={showAddModal}
          onClose={closeAddModal}
          title='Category'
          nameValue={newCategory.name}
          onNameChange={(text) => setNewCategory(prev => ({ ...prev, name: text }))}
          onSubmit={handleAddCategory}
          progressButtonLabel='Adding'
          submitButtonLabel='Add Category'
          isLoading={isLoading}
        />

        <ItemModal
          visible={showEditModal}
          onClose={closeEditModal}
          title='Category'
          nameValue={selectedCategory?.name ?? ''}
          onNameChange={updateSelectedCategory}
          onSubmit={handleUpdateCategory}
          progressButtonLabel='Updating'
          submitButtonLabel='Update Category'
          isLoading={isLoading}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default CategoryManagement;