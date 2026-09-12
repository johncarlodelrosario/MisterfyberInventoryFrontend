// app/inventory/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, Trash2, Minus, Search } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { inventoryService } from "@/services/inventory";
import { siteService } from "@/services/site";
import { authService } from "@/services/auth";
import toast from "react-hot-toast";
import InventoryModal from "@/components/modals/InventoryModal";
import DeductModal from "@/components/modals/DeductModal";

export default function InventoryPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [siteFilter, setSiteFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeductModalOpen, setIsDeductModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const queryClient = useQueryClient();
  const isAdmin = authService.isAdmin();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["inventory", page, search, siteFilter],
    queryFn: () =>
      inventoryService.getInventory({
        page,
        limit: 10,
        search: search || undefined,
        siteId: siteFilter || undefined,
      }),
    staleTime: 0,
    gcTime: 0,
  });

  const { data: sites } = useQuery({
    queryKey: ["sites-dropdown"],
    queryFn: () => siteService.getSites(1, 100),
    staleTime: 5 * 60 * 1000,
  });

  const deleteMutation = useMutation({
    mutationFn: inventoryService.deleteInventory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      toast.success("Inventory item deleted successfully");
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to delete item");
    },
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      deleteMutation.mutate(id);
    }
  };

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      refetch();
    }, 300);
    return () => clearTimeout(debounceTimeout);
  }, [search, siteFilter, refetch]);

  const handleModalClose = () => {
    setIsModalOpen(false);
    refetch();
  };

  const handleDeductModalClose = () => {
    setIsDeductModalOpen(false);
    refetch();
  };

  if (isLoading) return <LoadingSpinner />;

  // Get unique sites from all inventory items for header columns
  const allSites = new Set<string>();
  data?.inventory?.forEach((item: any) => {
    item.sitesData?.forEach((site: any) => {
      allSites.add(site.siteId);
    });
  });
  const siteList = Array.from(allSites);

  // Create a map of site names by ID for display
  const siteNameMap: Record<string, string> = {};
  sites?.sites?.forEach((site: any) => {
    siteNameMap[site._id] = site.name;
  });

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
            <p className="text-gray-500">Manage your inventory items</p>
          </div>
          <div className="flex items-center space-x-3">
            {isAdmin && (
              <button
                onClick={() => {
                  setSelectedItem(null);
                  setIsModalOpen(true);
                }}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Add Item</span>
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search inventory..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <select
            value={siteFilter}
            onChange={(e) => setSiteFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Sites</option>
            {sites?.sites?.map((site: any) => (
              <option key={site._id} value={site._id}>
                {site.name}
              </option>
            ))}
          </select>
          <div className="flex items-center justify-end">
            <span className="text-sm text-gray-500">
              Total items: {data?.inventory?.length || 0}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 sticky left-0 bg-gray-50 z-10">
                    Item
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    Category
                  </th>
                  {/* Site columns */}
                  {siteList.map((siteId) => (
                    <th
                      key={siteId}
                      className="text-center py-3 px-4 text-sm font-medium text-gray-500 min-w-[120px]"
                    >
                      {siteNameMap[siteId] || siteId}
                    </th>
                  ))}
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">
                    Total Quantity
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">
                    Total Value
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {data?.inventory?.length === 0 ? (
                  <tr>
                    <td
                      colSpan={siteList.length + 5}
                      className="py-8 text-center text-gray-500"
                    >
                      No inventory items found. Click "Add Item" to create one.
                    </td>
                  </tr>
                ) : (
                  data?.inventory?.map((item: any) => {
                    const totalQuantity =
                      item.sitesData?.reduce(
                        (sum: number, s: any) => sum + s.quantity,
                        0,
                      ) || 0;

                    // Create a map of siteId to quantity for this item
                    const siteQuantityMap: Record<string, any> = {};
                    item.sitesData?.forEach((site: any) => {
                      siteQuantityMap[site.siteId] = site;
                    });

                    return (
                      <tr key={item._id} className="border-t hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium sticky left-0 bg-white z-10">
                          {item.name}
                          <div className="text-xs text-gray-400 font-normal">
                            {item.unit}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {item.categoryId?.name || "N/A"}
                        </td>
                        {/* Site quantity cells */}
                        {siteList.map((siteId) => {
                          const siteData = siteQuantityMap[siteId];
                          const quantity = siteData?.quantity || 0;
                          const minQuantity = siteData?.minQuantity || 0;
                          const isLow = quantity > 0 && quantity <= minQuantity;

                          return (
                            <td key={siteId} className="py-3 px-4 text-center">
                              <span
                                className={`font-mono ${
                                  isLow
                                    ? "text-red-600 font-semibold"
                                    : quantity === 0
                                      ? "text-gray-400"
                                      : "text-gray-800"
                                }`}
                              >
                                {quantity}
                              </span>
                              {isLow && (
                                <div className="text-xs text-red-500">
                                  ⚠️ Low
                                </div>
                              )}
                            </td>
                          );
                        })}
                        <td className="py-3 px-4 text-center">
                          <span className="font-medium">
                            {totalQuantity} {item.unit}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          ₱{item.totalValue?.toFixed(2) || "0.00"}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex space-x-2 justify-center">
                            {isAdmin && (
                              <>
                                <button
                                  onClick={() => {
                                    setSelectedItem(item);
                                    setIsModalOpen(true);
                                  }}
                                  className="text-blue-600 hover:text-blue-800"
                                  title="Edit item"
                                >
                                  <Edit className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedItem(item);
                                    setIsDeductModalOpen(true);
                                  }}
                                  className="text-yellow-600 hover:text-yellow-800"
                                  title="Deduct quantity"
                                >
                                  <Minus className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={() => handleDelete(item._id)}
                                  className="text-red-600 hover:text-red-800"
                                  title="Delete item"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {data?.pagination && data.pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t">
              <div className="text-sm text-gray-500">
                Showing page {data.pagination.page} of{" "}
                {data.pagination.totalPages}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 border rounded-md disabled:opacity-50 hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    setPage((p) => Math.min(data.pagination.totalPages, p + 1))
                  }
                  disabled={page === data.pagination.totalPages}
                  className="px-3 py-1 border rounded-md disabled:opacity-50 hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <InventoryModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        item={selectedItem}
      />

      <DeductModal
        isOpen={isDeductModalOpen}
        onClose={handleDeductModalClose}
        item={selectedItem}
      />
    </MainLayout>
  );
}
