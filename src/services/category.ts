// src/services/categoryService.ts
import api from "./api";

export interface Category {
  _id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryCreateData {
  name: string;
  description?: string;
}

export interface CategoryResponse {
  success: boolean;
  categories: Category[];
}

export interface SingleCategoryResponse {
  success: boolean;
  category: Category;
}

export const categoryService = {
  async getCategories(): Promise<CategoryResponse> {
    const response = await api.get("/categories");
    return response.data;
  },

  async getCategoryById(id: string): Promise<SingleCategoryResponse> {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  async createCategory(
    data: CategoryCreateData,
  ): Promise<SingleCategoryResponse> {
    const response = await api.post("/categories", data);
    return response.data;
  },

  async updateCategory(
    id: string,
    data: Partial<CategoryCreateData>,
  ): Promise<SingleCategoryResponse> {
    const response = await api.put(`/categories/${id}`, data);
    return response.data;
  },

  async deleteCategory(
    id: string,
  ): Promise<{ success: boolean; message: string }> {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },
};
