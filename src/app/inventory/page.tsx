// app/inventory/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { inventoryService } from "@/services/inventory";
import { siteService } from "@/services/site";
import { authService } from "@/services/auth";
import toast from "react-hot-toast";
import InventoryModal from "@/components/modals/InventoryModal";
import DeductModal from "@/components/modals/DeductModal";
import MoveModal from "@/components/modals/MoveModal";
import InventoryTable from "@/components/inventory/InventoryTable";

export default function InventoryPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [siteFilter, setSiteFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeductModalOpen, setIsDeductModalOpen] = useState(false);
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
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

  const handleEdit = (item: any) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleDeduct = (item: any) => {
    setSelectedItem(item);
    setIsDeductModalOpen(true);
  };

  const handleMove = (item: any) => {
    setSelectedItem(item);
    setIsMoveModalOpen(true);
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

  const handleMoveModalClose = () => {
    setIsMoveModalOpen(false);
    refetch();
  };

  if (isLoading) return <LoadingSpinner />;

  const allSites = new Set<string>();
  data?.inventory?.forEach((item: any) => {
    item.sitesData?.forEach((site: any) => {
      allSites.add(site.siteId);
    });
  });
  const siteList = Array.from(allSites);

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

        <InventoryTable
          data={data}
          siteList={siteList}
          siteNameMap={siteNameMap}
          isAdmin={isAdmin}
          onEdit={handleEdit}
          onDeduct={handleDeduct}
          onMove={handleMove}
          onDelete={handleDelete}
          page={page}
          setPage={setPage}
        />
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

      <MoveModal
        isOpen={isMoveModalOpen}
        onClose={handleMoveModalClose}
        item={selectedItem}
      />
    </MainLayout>
  );
}
