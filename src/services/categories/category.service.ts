import api from "../api";
import type { Category } from "./interfaces/Category";

const categoryService = {
  getAll: async (): Promise<Category[]> => {
    const response = await api.get<Category[]>("/api/categories");
    return response.data;
  },
};

export default categoryService;
