import categoryService from "@/services/categories/category.service";
import { useQuery } from "@tanstack/react-query";
import type { Category } from "@/services/categories/interfaces/Category";

export const useCategories = () => {
  return useQuery<Category[], Error>({
    queryKey: ['categories'],
    queryFn: () => categoryService.getAll(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};
