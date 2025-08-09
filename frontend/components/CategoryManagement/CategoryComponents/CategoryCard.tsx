import { Text, View } from "react-native";
import { Category } from "../types/category";
import ActionButtons from "@/components/ActionButtons";

interface CategoryCardProps {
  category: Category;
  onEdit: () => void;
  onDelete: () => void;
  isLoading: boolean;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  onEdit,
  onDelete,
  isLoading
}) => {
  return (
    <View className='bg-white rounded-xl p-6 mb-4 shadow-sm border border-gray-100'>
      <View className='flex-row items-center justify-between mb-4'>
        <View className='flex-row items-center flex-1'>
          <View className='size-12 bg-primary-100 rounded-xl items-center justify-center mr-4'>
            <Text className='text-2xl'>📂</Text>
          </View>
          <View className='flex-1'>
            <Text className='text-lg font-rubik-semibold text-black-300'>
              {category.name}
            </Text>
            <Text className='text-xs font-rubik text-black-200 mt-1'>
              ID: {category._id}
            </Text>
            {category.createdAt && (
              <Text className='text-xs font-rubik text-black-200 mt-1'>
                Created: {new Date(category.createdAt).toLocaleDateString()}
              </Text>
            )}
          </View>
        </View>
      </View>

      <ActionButtons
        onEdit={onEdit}
        onDelete={onDelete}
        disabled={isLoading}
      />
    </View>
  );
};

export default CategoryCard;