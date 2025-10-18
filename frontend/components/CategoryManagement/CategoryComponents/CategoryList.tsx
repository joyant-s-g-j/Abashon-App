import { EmptyState, LoadingBox, SectionTitle } from "@/components/ReusableComponent";
import { View } from "react-native";
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
    return <LoadingBox text="Loading Categories" />;
  }

  return (
  <>
    <EmptyState
      isEmpty={categories.length === 0}
      icon="folder-open-outline"
      title="No categories found"
      message={
        searchQuery 
          ? 'Try adjusting your search' 
          : 'Add your first category to get started'
      }
    />
    <View>
      <SectionTitle title="All Categories" count={categories.length} />
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
  </>
  );
};

export default CategoryList;