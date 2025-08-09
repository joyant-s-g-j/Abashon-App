import { Text, View } from "react-native";
import { Category } from "../types/category";
import CategoryCard from "./CategoryCard";

interface CategoryListProps {
  categories: Category[];
  searchQuery: string;
  isLoading: boolean;
  onEditCategory: (category: Category) => void;
  onDeleteCategory: (category: Category) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  searchQuery,
  isLoading,
  onEditCategory,
  onDeleteCategory
}) => {
  if (isLoading) {
    return (
      <View className='bg-white rounded-xl p-8 items-center justify-center shadow-sm'>
        <Text className='text-primary-300 font-rubik-medium'>Loading categories</Text>
      </View>
    );
  }

  if (categories.length === 0) {
    return (
      <View className='bg-white rounded-xl p-8 items-center justify-center shadow-sm'>
        <Text className='text-3xl mb-2'>📂</Text>
        <Text className='text-black-300 font-rubik-medium mb-1'>No categories found</Text>
        <Text className='text-black-200 font-rubik text-center'>
          {searchQuery ? 'Try adjusting your search' : 'Add your first category to get started'}
        </Text>
      </View>
    );
  }

  return (
    <View>
      <Text className='text-lg font-rubik-semibold text-black-300 mb-4'>
        All Categories ({categories.length})
      </Text>
      {categories.map((category, index) => (
        <CategoryCard
          key={category._id || index}
          category={category}
          onEdit={() => onEditCategory(category)}
          onDelete={() => onDeleteCategory(category)}
          isLoading={isLoading}
        />
      ))}
    </View>
  );
};

export default CategoryList;