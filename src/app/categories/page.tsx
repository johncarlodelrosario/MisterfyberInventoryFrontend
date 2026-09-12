// src/app/categories/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { categoryService, Category } from "../../services/category";
import CategoryModal from "../../components/modals/CategoryModal";
import DeleteConfirmationModal from "../../components/modals/DeleteConfirmationModal";
import MainLayout from "@/components/layout/MainLayout";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [searchTerm, setSearchTerm] = useState("");

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await categoryService.getCategories();
      setCategories(response.categories);
    } catch (err) {
      setError("Failed to fetch categories");
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleCreateCategory = async (data: {
    name: string;
    description?: string;
  }) => {
    try {
      await categoryService.createCategory(data);
      await fetchCategories();
      setIsCreateModalOpen(false);
    } catch (err) {
      console.error("Error creating category:", err);
      throw err;
    }
  };

  const handleUpdateCategory = async (data: {
    name: string;
    description?: string;
  }) => {
    if (!selectedCategory) return;
    try {
      await categoryService.updateCategory(selectedCategory._id, data);
      await fetchCategories();
      setIsEditModalOpen(false);
      setSelectedCategory(null);
    } catch (err) {
      console.error("Error updating category:", err);
      throw err;
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;
    try {
      await categoryService.deleteCategory(selectedCategory._id);
      await fetchCategories();
      setIsDeleteModalOpen(false);
      setSelectedCategory(null);
    } catch (err) {
      console.error("Error deleting category:", err);
      throw err;
    }
  };

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (category.description &&
        category.description.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Add Category
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {filteredCategories.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500 text-lg">
              {searchTerm
                ? "No categories found matching your search"
                : "No categories yet"}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="mt-4 text-blue-600 hover:text-blue-800"
              >
                Create your first category
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCategories.map((category) => (
              <div
                key={category._id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {category.name}
                    </h3>
                    {category.description && (
                      <p className="text-gray-600 mt-1">
                        {category.description}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-2">
                      Created:{" "}
                      {new Date(category.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setSelectedCategory(category);
                        setIsEditModalOpen(true);
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setSelectedCategory(category);
                        setIsDeleteModalOpen(true);
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <CategoryModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateCategory}
          title="Create Category"
        />

        {selectedCategory && (
          <>
            <CategoryModal
              isOpen={isEditModalOpen}
              onClose={() => {
                setIsEditModalOpen(false);
                setSelectedCategory(null);
              }}
              onSubmit={handleUpdateCategory}
              initialData={{
                name: selectedCategory.name,
                description: selectedCategory.description || "",
              }}
              title="Edit Category"
            />

            <DeleteConfirmationModal
              isOpen={isDeleteModalOpen}
              onClose={() => {
                setIsDeleteModalOpen(false);
                setSelectedCategory(null);
              }}
              onConfirm={handleDeleteCategory}
              itemName={selectedCategory.name}
            />
          </>
        )}
      </div>
    </MainLayout>
  );
}
