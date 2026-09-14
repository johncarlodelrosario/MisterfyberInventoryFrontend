// components/modals/InventoryModal.tsx
"use client";

import { useEffect, useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import api from "@/services/api";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { categoryService } from "@/services/category";

interface InventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  item?: any | null;
}

interface SiteData {
  siteId: string;
  quantity: string;
  price: string;
  minQuantity: string;
}

export default function InventoryModal({
  isOpen,
  onClose,
  item,
}: InventoryModalProps) {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    unit: "pcs",
    description: "",
  });

  const [sitesData, setSitesData] = useState<SiteData[]>([
    { siteId: "", quantity: "", price: "", minQuantity: "" },
  ]);
  const [sites, setSites] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);

  // Fetch sites when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchSites();
      fetchAllCategories();
    }
  }, [isOpen]);

  // Populate form when editing
  useEffect(() => {
    if (item) {
      // Handle categoryId properly - it could be a string or an object
      let categoryIdValue = "";
      if (item.categoryId) {
        if (typeof item.categoryId === "object" && item.categoryId._id) {
          categoryIdValue = item.categoryId._id;
        } else if (typeof item.categoryId === "string") {
          categoryIdValue = item.categoryId;
        }
      }

      setFormData({
        name: item.name || "",
        categoryId: categoryIdValue,
        unit: item.unit || "pcs",
        description: item.description || "",
      });

      // Populate site data
      if (item.sitesData && item.sitesData.length > 0) {
        const siteData = item.sitesData.map((sd: any) => ({
          siteId: sd.siteId || sd.siteId?._id || "",
          quantity: sd.quantity?.toString() || "",
          price: sd.price?.toString() || "",
          minQuantity: sd.minQuantity?.toString() || "",
        }));
        setSitesData(siteData);
      }
    } else {
      setFormData({
        name: "",
        categoryId: "",
        unit: "pcs",
        description: "",
      });
      setSitesData([{ siteId: "", quantity: "", price: "", minQuantity: "" }]);
    }
  }, [item]);

  const fetchSites = async () => {
    try {
      const response = await api.get("/sites?limit=100");
      setSites(response.data.sites || []);
    } catch (error) {
      console.error("Error fetching sites:", error);
      toast.error("Failed to load sites");
    }
  };

  const fetchAllCategories = async () => {
    setLoadingCategories(true);
    try {
      const response = await categoryService.getCategories();
      let categoriesData: any[] = [];

      if (response && response.success) {
        categoriesData = response.categories || [];
      } else if (response && response.categories) {
        categoriesData = response.categories;
      } else if (response && Array.isArray(response)) {
        categoriesData = response;
      } else {
        categoriesData = [];
      }

      if (!Array.isArray(categoriesData)) {
        categoriesData = [];
      }

      setCategories(categoriesData);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
      toast.error("Failed to load categories");
    } finally {
      setLoadingCategories(false);
    }
  };

  const createCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    setIsCreatingCategory(true);
    try {
      const response = await categoryService.createCategory({
        name: newCategoryName.trim(),
        description: "",
      });

      // Extract the new category from response
      let newCategory: any = null;

      if (response && response.success) {
        newCategory = response.category || null;
      } else if (response && response.category) {
        newCategory = response.category;
      } else {
        newCategory = response;
      }

      if (!newCategory || !newCategory._id) {
        toast.error("Failed to create category: Invalid response");
        return;
      }

      // Store in a const so TypeScript keeps the narrowed type
      const createdCategory = newCategory;
      const createdCategoryId = createdCategory._id;

      setCategories((prevCategories) => {
        const exists = prevCategories.some(
          (cat) => cat._id === createdCategoryId,
        );
        if (exists) return prevCategories;
        return [...prevCategories, createdCategory];
      });

      setFormData((prev) => ({
        ...prev,
        categoryId: createdCategoryId,
      }));

      setNewCategoryName("");
      setShowNewCategory(false);
      toast.success("Category created successfully");
    } catch (error: any) {
      console.error("Error creating category:", error);
      let errorMessage = "Failed to create category";
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      toast.error(errorMessage);
    } finally {
      setIsCreatingCategory(false);
    }
  };

  const addSiteRow = () => {
    setSitesData([
      ...sitesData,
      { siteId: "", quantity: "", price: "", minQuantity: "" },
    ]);
  };

  const removeSiteRow = (index: number) => {
    if (sitesData.length <= 1) {
      toast.error("At least one site is required");
      return;
    }
    const newSitesData = sitesData.filter((_, i) => i !== index);
    setSitesData(newSitesData);
  };

  const updateSiteData = (
    index: number,
    field: keyof SiteData,
    value: string,
  ) => {
    const newSitesData = [...sitesData];
    newSitesData[index] = { ...newSitesData[index], [field]: value };
    setSitesData(newSitesData);
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    if (!formData.name.trim()) {
      toast.error("Please enter item name");
      return;
    }

    if (!formData.categoryId) {
      toast.error("Please select a category");
      return;
    }

    // Validate site data
    const hasEmptySite = sitesData.some((sd) => !sd.siteId);
    if (hasEmptySite) {
      toast.error("Please select a site for all rows");
      return;
    }

    const hasValidData = sitesData.some(
      (sd) => parseFloat(sd.quantity) > 0 || parseFloat(sd.price) > 0,
    );
    if (!hasValidData) {
      toast.error("Please enter quantity and price for at least one site");
      return;
    }

    setIsSubmitting(true);
    try {
      const data = {
        name: formData.name.trim(),
        categoryId: formData.categoryId,
        unit: formData.unit,
        description: formData.description,
        siteData: sitesData.map((sd) => ({
          siteId: sd.siteId,
          quantity: parseFloat(sd.quantity) || 0,
          price: parseFloat(sd.price) || 0,
          minQuantity: parseFloat(sd.minQuantity) || 0,
        })),
      };

      if (item) {
        await api.put(`/inventory/${item._id}`, data);
        toast.success("Inventory updated successfully");
      } else {
        await api.post("/inventory", data);
        toast.success("Inventory created successfully");
      }

      // Invalidate and close
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      onClose();
    } catch (error: any) {
      console.error("Error saving inventory:", error);
      let errorMessage = "Failed to save inventory item";
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
          <h2 className="text-xl font-semibold">
            {item ? "Edit Inventory Item" : "Add Inventory Item"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Item Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter item name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <div className="flex gap-2">
              <select
                value={formData.categoryId}
                onChange={(e) =>
                  setFormData({ ...formData, categoryId: e.target.value })
                }
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="">Select Category</option>
                {loadingCategories ? (
                  <option value="" disabled>
                    Loading categories...
                  </option>
                ) : (
                  categories.map((cat: any) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))
                )}
              </select>
              <button
                type="button"
                onClick={() => setShowNewCategory(!showNewCategory)}
                className="px-3 py-2 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 flex items-center gap-1 whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                New
              </button>
            </div>

            {showNewCategory && (
              <div className="mt-2 space-y-2 border p-3 rounded-md bg-gray-50">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Enter new category name"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={createCategory}
                    disabled={isCreatingCategory || !newCategoryName.trim()}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isCreatingCategory ? "Creating..." : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewCategory(false);
                      setNewCategoryName("");
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Unit
            </label>
            <select
              value={formData.unit}
              onChange={(e) =>
                setFormData({ ...formData, unit: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="pcs">Pieces</option>
              <option value="kg">Kilogram</option>
              <option value="g">Gram</option>
              <option value="l">Liter</option>
              <option value="ml">Milliliter</option>
              <option value="m">Meter</option>
              <option value="box">Box</option>
              <option value="pack">Pack</option>
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Site Details *
              </label>
              <button
                type="button"
                onClick={addSiteRow}
                className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Add Site
              </button>
            </div>

            <div className="space-y-3">
              {sitesData.map((sd, index) => (
                <div key={index} className="border p-3 rounded-md bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Site {index + 1}
                    </span>
                    {sitesData.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSiteRow(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Site *
                      </label>
                      <select
                        value={sd.siteId}
                        onChange={(e) =>
                          updateSiteData(index, "siteId", e.target.value)
                        }
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                        required
                      >
                        <option value="">Select Site</option>
                        {sites.map((site: any) => (
                          <option key={site._id} value={site._id}>
                            {site.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Quantity *
                      </label>
                      <input
                        type="number"
                        value={sd.quantity}
                        onChange={(e) =>
                          updateSiteData(index, "quantity", e.target.value)
                        }
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                        placeholder="0"
                        min="0"
                        step="1"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Price per Unit (₱) *
                      </label>
                      <input
                        type="number"
                        value={sd.price}
                        onChange={(e) =>
                          updateSiteData(index, "price", e.target.value)
                        }
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Min Quantity Alert
                      </label>
                      <input
                        type="number"
                        value={sd.minQuantity}
                        onChange={(e) =>
                          updateSiteData(index, "minQuantity", e.target.value)
                        }
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                        placeholder="0"
                        min="0"
                        step="1"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={3}
              placeholder="Enter description"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !formData.categoryId}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Saving..." : item ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
