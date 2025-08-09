import StatCard from "@/components/ReusableComponent/StatCard";
import { View } from "react-native";
import { Category } from "../types/category";

interface CategoryStatsProps {
  categories: Category[];
}

const CategoryStats: React.FC<CategoryStatsProps> = ({ categories }) => {
  const activeCategories = categories.filter(category => category.isActive).length;

  return (
    <View className="flex-row justify-between mb-6">
      <StatCard
        value={categories.length}
        label="Total Categories"
        style="flex-1 mr-2"
      />
      <StatCard
        value={activeCategories}
        label="Active Categories"
        valueColor="text-green-600"
        style="flex-1 ml-2"
      />
    </View>
  );
};

export default CategoryStats;