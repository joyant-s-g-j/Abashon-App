import { Category } from "../types/category";

export const filterCategories = (categories: Category[], searchQuery: string): Category[] => {
  if (!searchQuery.trim()) return categories;
  
  return categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
};