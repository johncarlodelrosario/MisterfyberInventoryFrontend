// app/installations/page.tsx
"use client";

import { useState, useCallback, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  CheckCircle,
  XCircle,
  X,
  Trash2,
  PlusCircle,
  AlertTriangle,
} from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { installationService } from "@/services/installation";
import { inventoryService } from "@/services/inventory";
import { siteService } from "@/services/site";
import { authService } from "@/services/auth";
import toast from "react-hot-toast";
import { format } from "date-fns";

interface InstallationItemForm {
  inventoryId: string;
  quantity: number;
}

export default function InstallationsPage() {
  const [page, setPage] = useState(1);
  const [siteFilter, setSiteFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSite, setSelectedSite] = useState("");
  const [items, setItems] = useState<InstallationItemForm[]>([
    { inventoryId: "", quantity: 1 },
  ]);
  const [scheduledDate, setScheduledDate] = useState("");
  const [notes, setNotes] = useState("");

  // Delete confirmation state
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const queryClient = useQueryClient();
  const isAdmin = authService.isAdmin();

  // Ultra-fast query with aggressive caching
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["installations", page, siteFilter, statusFilter, dateFilter],
    queryFn: () =>
      installationService.getInstallations({
        page,
        limit: 10,
        siteId: siteFilter || undefined,
        status: statusFilter || undefined,
        date: dateFilter || undefined,
      }),
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    placeholderData: (previousData) => previousData,
  });

  const { data: sites } = useQuery({
    queryKey: ["sites-dropdown"],
    queryFn: () => siteService.getSites(1, 100),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const { data: inventory, isLoading: isLoadingInventory } = useQuery({
    queryKey: ["inventory-dropdown", selectedSite],
    queryFn: async () => {
      if (!selectedSite) return [];
      const response = await inventoryService.getInventory({
        siteId: selectedSite,
        limit: 100,
      });
      return response.inventory || [];
    },
    enabled: !!selectedSite,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  // Optimistic update for create
  const createInstallationMutation = useMutation({
    mutationFn: installationService.createInstallation,
    onMutate: async (newInstallation) => {
      await queryClient.cancelQueries({ queryKey: ["installations"] });

      const previousInstallations = queryClient.getQueryData([
        "installations",
        page,
        siteFilter,
        statusFilter,
        dateFilter,
      ]);

      queryClient.setQueryData(
        ["installations", page, siteFilter, statusFilter, dateFilter],
        (old: any) => {
          if (!old) return old;
          return {
            ...old,
            installations: [
              {
                _id: `temp-${Date.now()}`,
                items: newInstallation.items.map((i) => ({
                  inventoryId: { _id: i.inventoryId, name: "Loading..." },
                  quantity: i.quantity,
                })),
                siteId: { _id: newInstallation.siteId, name: "Loading..." },
                status: newInstallation.scheduledDate
                  ? "scheduled"
                  : "completed",
                date: new Date().toISOString(),
                installedBy: { username: "You" },
                _optimistic: true,
              },
              ...old.installations,
            ],
            pagination: {
              ...old.pagination,
              total: old.pagination.total + 1,
            },
          };
        },
      );

      return { previousInstallations };
    },
    onError: (error: any, _, context) => {
      if (context?.previousInstallations) {
        queryClient.setQueryData(
          ["installations", page, siteFilter, statusFilter, dateFilter],
          context.previousInstallations,
        );
      }
      toast.error(
        error.response?.data?.error || "Failed to create installation",
      );
    },
    onSuccess: () => {
      toast.success("Installation created successfully");
      setIsModalOpen(false);
      setSelectedSite("");
      setItems([{ inventoryId: "", quantity: 1 }]);
      setScheduledDate("");
      setNotes("");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["installations"] });
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
    },
  });

  // Optimistic update for status change
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      installationService.updateInstallationStatus(id, status),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ["installations"] });

      const previousInstallations = queryClient.getQueryData([
        "installations",
        page,
        siteFilter,
        statusFilter,
        dateFilter,
      ]);

      queryClient.setQueryData(
        ["installations", page, siteFilter, statusFilter, dateFilter],
        (old: any) => {
          if (!old) return old;
          return {
            ...old,
            installations: old.installations.map((inst: any) =>
              inst._id === id ? { ...inst, status, _updating: true } : inst,
            ),
          };
        },
      );

      return { previousInstallations };
    },
    onError: (error: any, _, context) => {
      if (context?.previousInstallations) {
        queryClient.setQueryData(
          ["installations", page, siteFilter, statusFilter, dateFilter],
          context.previousInstallations,
        );
      }
      toast.error(error.response?.data?.error || "Failed to update status");
    },
    onSuccess: () => {
      toast.success("Installation status updated");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["installations"] });
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
    },
  });

  // NEW: Optimistic delete mutation
  const deleteInstallationMutation = useMutation({
    mutationFn: (id: string) => installationService.deleteInstallation(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["installations"] });

      const previousInstallations = queryClient.getQueryData([
        "installations",
        page,
        siteFilter,
        statusFilter,
        dateFilter,
      ]);

      // Optimistically remove from list
      queryClient.setQueryData(
        ["installations", page, siteFilter, statusFilter, dateFilter],
        (old: any) => {
          if (!old) return old;
          return {
            ...old,
            installations: old.installations.filter(
              (inst: any) => inst._id !== id,
            ),
            pagination: {
              ...old.pagination,
              total: Math.max(0, old.pagination.total - 1),
            },
          };
        },
      );

      return { previousInstallations };
    },
    onError: (error: any, _, context) => {
      if (context?.previousInstallations) {
        queryClient.setQueryData(
          ["installations", page, siteFilter, statusFilter, dateFilter],
          context.previousInstallations,
        );
      }
      toast.error(
        error.response?.data?.error || "Failed to delete installation",
      );
    },
    onSuccess: () => {
      toast.success("Installation deleted successfully");
      setDeleteTarget(null);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["installations"] });
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
    },
  });

  const getStatusBadge = useCallback((status: string) => {
    const styles: Record<string, string> = {
      completed: "bg-green-100 text-green-800",
      scheduled: "bg-yellow-100 text-yellow-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs ${styles[status] || "bg-gray-100 text-gray-800"}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  }, []);

  const handleStatusUpdate = useCallback(
    (id: string, status: string) => {
      if (confirm(`Mark this installation as ${status}?`)) {
        updateStatusMutation.mutate({ id, status });
      }
    },
    [updateStatusMutation],
  );

  // NEW: Handle delete click
  const handleDeleteClick = useCallback((inst: any) => {
    const itemNames = inst.items
      ?.map((i: any) => i.inventoryId?.name || "Unknown")
      .join(", ");
    setDeleteTarget({
      id: inst._id,
      name: itemNames || "this installation",
    });
  }, []);

  // NEW: Confirm delete
  const confirmDelete = useCallback(() => {
    if (deleteTarget) {
      deleteInstallationMutation.mutate(deleteTarget.id);
    }
  }, [deleteTarget, deleteInstallationMutation]);

  const addItemRow = useCallback(() => {
    setItems((prev) => [...prev, { inventoryId: "", quantity: 1 }]);
  }, []);

  const removeItemRow = useCallback((index: number) => {
    setItems((prev) => {
      if (prev.length === 1) {
        toast.error("At least one item is required");
        return prev;
      }
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const updateItem = useCallback(
    (index: number, field: keyof InstallationItemForm, value: any) => {
      setItems((prev) => {
        const updated = [...prev];
        updated[index] = { ...updated[index], [field]: value };
        return updated;
      });
    },
    [],
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      const hasEmptyItem = items.some((item) => !item.inventoryId);
      if (hasEmptyItem) {
        toast.error("Please select an item for all rows");
        return;
      }

      const hasInvalidQuantity = items.some((item) => item.quantity < 1);
      if (hasInvalidQuantity) {
        toast.error("Quantity must be at least 1 for all items");
        return;
      }

      createInstallationMutation.mutate({
        siteId: selectedSite,
        items: items.map((item) => ({
          inventoryId: item.inventoryId,
          quantity: item.quantity,
        })),
        scheduledDate: scheduledDate || undefined,
        notes,
      });
    },
    [items, selectedSite, scheduledDate, notes, createInstallationMutation],
  );

  const getAvailableQuantity = useCallback(
    (inventoryItem: any) => {
      if (!selectedSite) return 0;

      if (typeof inventoryItem.siteQuantity === "number") {
        return inventoryItem.siteQuantity;
      }

      if (Array.isArray(inventoryItem.sitesData)) {
        const siteData = inventoryItem.sitesData.find(
          (sd: any) => sd.siteId === selectedSite,
        );
        return siteData?.quantity || 0;
      }

      return 0;
    },
    [selectedSite],
  );

  const inventoryOptions = useMemo(() => {
    if (!inventory) return [];
    return inventory.map((inv: any) => ({
      ...inv,
      availableQty: getAvailableQuantity(inv),
    }));
  }, [inventory, getAvailableQuantity]);

  if (isLoading && !data) return <LoadingSpinner />;

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Installations</h1>
            <p className="text-gray-500">Track and manage all installations</p>
          </div>
          {isAdmin && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center space-x-2 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>New Installation</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            value={siteFilter}
            onChange={(e) => {
              setSiteFilter(e.target.value);
              setPage(1);
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Sites</option>
            {sites?.sites?.map((site: any) => (
              <option key={site._id} value={site._id}>
                {site.name}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <input
            type="date"
            value={dateFilter}
            onChange={(e) => {
              setDateFilter(e.target.value);
              setPage(1);
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <button
            onClick={() => {
              setSiteFilter("");
              setStatusFilter("");
              setDateFilter("");
              setPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Clear Filters
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden relative">
          {isFetching && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-600 animate-pulse" />
          )}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    Items
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    Site
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    Total Qty
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    Date
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    Installed By
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {data?.installations?.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-gray-500">
                      No installations found. Create a new installation to get
                      started.
                    </td>
                  </tr>
                ) : (
                  data?.installations?.map((inst: any) => (
                    <tr
                      key={inst._id}
                      className={`border-t hover:bg-gray-50 transition-colors ${inst._optimistic ? "opacity-60" : ""} ${inst._updating ? "opacity-60" : ""}`}
                    >
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          {inst.items && inst.items.length > 0 ? (
                            inst.items.map((item: any, idx: number) => (
                              <div key={idx} className="text-sm">
                                {item.inventoryId?.name || "N/A"} ×{" "}
                                {item.quantity}
                              </div>
                            ))
                          ) : (
                            <span className="text-sm text-gray-400">
                              No items
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {inst.siteId?.name || "N/A"}
                      </td>
                      <td className="py-3 px-4">
                        {inst.items && inst.items.length > 0
                          ? inst.items.reduce(
                              (sum: number, item: any) =>
                                sum + (item.quantity || 0),
                              0,
                            )
                          : 0}
                      </td>
                      <td className="py-3 px-4">
                        {inst.date
                          ? format(new Date(inst.date), "MMM dd, yyyy")
                          : "N/A"}
                      </td>
                      <td className="py-3 px-4">
                        {getStatusBadge(inst.status)}
                      </td>
                      <td className="py-3 px-4">
                        {inst.installedBy?.username || "N/A"}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2 items-center">
                          {isAdmin &&
                            inst.status === "scheduled" &&
                            !inst._updating && (
                              <>
                                <button
                                  onClick={() =>
                                    handleStatusUpdate(inst._id, "completed")
                                  }
                                  className="text-green-600 hover:text-green-800 transition-colors"
                                  title="Mark as completed"
                                >
                                  <CheckCircle className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={() =>
                                    handleStatusUpdate(inst._id, "cancelled")
                                  }
                                  className="text-red-600 hover:text-red-800 transition-colors"
                                  title="Cancel"
                                >
                                  <XCircle className="w-5 h-5" />
                                </button>
                              </>
                            )}
                          {isAdmin && !inst._optimistic && (
                            <button
                              onClick={() => handleDeleteClick(inst)}
                              className="text-red-600 hover:text-red-800 transition-colors"
                              title="Delete installation"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          )}
                          {inst.status === "completed" && !isAdmin && (
                            <span className="text-xs text-gray-500">
                              Completed
                            </span>
                          )}
                          {inst.status === "cancelled" && !isAdmin && (
                            <span className="text-xs text-gray-500">
                              Cancelled
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
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
                  className="px-3 py-1 border rounded-md disabled:opacity-50 hover:bg-gray-50 transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    setPage((p) => Math.min(data.pagination.totalPages, p + 1))
                  }
                  disabled={page === data.pagination.totalPages}
                  className="px-3 py-1 border rounded-md disabled:opacity-50 hover:bg-gray-50 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* New Installation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
              <h2 className="text-xl font-semibold">New Installation</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Site *
                </label>
                <select
                  value={selectedSite}
                  onChange={(e) => {
                    setSelectedSite(e.target.value);
                    setItems([{ inventoryId: "", quantity: 1 }]);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="">Select Site</option>
                  {sites?.sites?.map((site: any) => (
                    <option key={site._id} value={site._id}>
                      {site.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Items *
                  </label>
                  <button
                    type="button"
                    onClick={addItemRow}
                    className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
                    disabled={!selectedSite}
                  >
                    <PlusCircle className="w-4 h-4" />
                    Add Item
                  </button>
                </div>
                <div className="space-y-3">
                  {items.map((item, index) => (
                    <div key={index} className="flex gap-2 items-start">
                      <div className="flex-1">
                        <select
                          value={item.inventoryId}
                          onChange={(e) =>
                            updateItem(index, "inventoryId", e.target.value)
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          disabled={!selectedSite || isLoadingInventory}
                          required
                        >
                          <option value="">Select Item</option>
                          {isLoadingInventory ? (
                            <option value="" disabled>
                              Loading inventory...
                            </option>
                          ) : (
                            inventoryOptions?.map((inv: any) => (
                              <option
                                key={inv._id}
                                value={inv._id}
                                disabled={inv.availableQty <= 0}
                              >
                                {inv.name}
                                {inv.availableQty > 0
                                  ? ` (Available: ${inv.availableQty} ${inv.unit || ""})`
                                  : ` (Out of Stock)`}
                              </option>
                            ))
                          )}
                        </select>
                      </div>
                      <div className="w-20 flex-shrink-0">
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            updateItem(
                              index,
                              "quantity",
                              parseInt(e.target.value) || 1,
                            )
                          }
                          className="w-full px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          min="1"
                          required
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItemRow(index)}
                        className="p-2 text-red-500 hover:text-red-700 flex-shrink-0 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Add multiple items for this installation
                </p>
                {!selectedSite && (
                  <p className="text-xs text-amber-600 mt-1">
                    Please select a site first to view available inventory
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Schedule Date (Optional)
                </label>
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Leave empty to install immediately
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows={3}
                  placeholder="Add any notes about this installation"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    createInstallationMutation.isPending ||
                    !selectedSite ||
                    items.some((item) => !item.inventoryId) ||
                    items.some((item) => item.quantity < 1)
                  }
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {createInstallationMutation.isPending
                    ? "Creating..."
                    : "Create Installation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Delete Installation
                  </h3>
                  <p className="text-sm text-gray-500">
                    This action cannot be undone
                  </p>
                </div>
              </div>

              <p className="text-sm text-gray-700 mb-4">
                Are you sure you want to delete{" "}
                <span className="font-semibold">{deleteTarget.name}</span>?
              </p>

              <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mb-4">
                <p className="text-xs text-amber-800">
                  <strong>Note:</strong> If this installation was completed, the
                  inventory quantities will be restored to the site.
                </p>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setDeleteTarget(null)}
                  disabled={deleteInstallationMutation.isPending}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  disabled={deleteInstallationMutation.isPending}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  {deleteInstallationMutation.isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
