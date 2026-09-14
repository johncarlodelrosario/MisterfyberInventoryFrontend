// /Users/johncarlodelrosario/Documents/Misterfyber_Inventory_System/inventory-system/frontend/src/components/inventory/InventoryTable.tsx
"use client";

import { Edit, Trash2, Minus, ArrowRightLeft } from "lucide-react";

interface InventoryTableProps {
  data: any;
  siteList: string[];
  siteNameMap: Record<string, string>;
  isAdmin: boolean;
  onEdit: (item: any) => void;
  onDeduct: (item: any) => void;
  onMove: (item: any) => void;
  onDelete: (id: string) => void;
  page: number;
  setPage: (page: number | ((p: number) => number)) => void;
}

export default function InventoryTable({
  data,
  siteList,
  siteNameMap,
  isAdmin,
  onEdit,
  onDeduct,
  onMove,
  onDelete,
  page,
  setPage,
}: InventoryTableProps) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Mobile Card View */}
      <div className="block md:hidden">
        {data?.inventory?.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            No inventory items found. Click "Add Item" to create one.
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {data?.inventory?.map((item: any) => {
              const totalQuantity =
                item.sitesData?.reduce(
                  (sum: number, s: any) => sum + s.quantity,
                  0,
                ) || 0;

              const siteQuantityMap: Record<string, any> = {};
              item.sitesData?.forEach((site: any) => {
                siteQuantityMap[site.siteId] = site;
              });

              return (
                <div key={item._id} className="p-4 space-y-3">
                  {/* Item Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {item.name}
                      </h3>
                      <p className="text-xs text-gray-400">{item.unit}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {item.categoryId?.name || "N/A"}
                      </p>
                    </div>
                    {isAdmin && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => onEdit(item)}
                          className="p-1 text-blue-600 hover:text-blue-800"
                          title="Edit item"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeduct(item)}
                          className="p-1 text-yellow-600 hover:text-yellow-800"
                          title="Deduct quantity"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onMove(item)}
                          className="p-1 text-purple-600 hover:text-purple-800"
                          title="Move quantity"
                        >
                          <ArrowRightLeft className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete(item._id)}
                          className="p-1 text-red-600 hover:text-red-800"
                          title="Delete item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Site Quantities */}
                  {siteList.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {siteList.map((siteId) => {
                        const siteData = siteQuantityMap[siteId];
                        const quantity = siteData?.quantity || 0;
                        const minQuantity = siteData?.minQuantity || 0;
                        const isLow = quantity > 0 && quantity <= minQuantity;

                        return (
                          <div
                            key={siteId}
                            className="flex items-center justify-between bg-gray-50 rounded px-2 py-1"
                          >
                            <span className="text-gray-500 text-xs truncate mr-1">
                              {siteNameMap[siteId] || siteId}
                            </span>
                            <span
                              className={`font-mono text-sm ${
                                isLow
                                  ? "text-red-600 font-semibold"
                                  : quantity === 0
                                    ? "text-gray-400"
                                    : "text-gray-800"
                              }`}
                            >
                              {quantity}
                              {isLow && (
                                <span className="text-xs text-red-500 ml-1">
                                  ⚠️
                                </span>
                              )}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Totals */}
                  <div className="flex items-center justify-between text-sm border-t pt-2">
                    <div>
                      <span className="text-gray-500">Total: </span>
                      <span className="font-medium">
                        {totalQuantity} {item.unit}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Value: </span>
                      <span className="font-medium">
                        ₱{item.totalValue?.toFixed(2) || "0.00"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block">
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
                              <div className="text-xs text-red-500">⚠️ Low</div>
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
                                onClick={() => onEdit(item)}
                                className="text-blue-600 hover:text-blue-800"
                                title="Edit item"
                              >
                                <Edit className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => onDeduct(item)}
                                className="text-yellow-600 hover:text-yellow-800"
                                title="Deduct quantity"
                              >
                                <Minus className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => onMove(item)}
                                className="text-purple-600 hover:text-purple-800"
                                title="Move quantity"
                              >
                                <ArrowRightLeft className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => onDelete(item._id)}
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
      </div>

      {/* Pagination */}
      {data?.pagination && data.pagination.totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t">
          <div className="text-sm text-gray-500">
            Showing page {data.pagination.page} of {data.pagination.totalPages}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setPage((p: number) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 border rounded-md disabled:opacity-50 hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              onClick={() =>
                setPage((p: number) =>
                  Math.min(data.pagination.totalPages, p + 1),
                )
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
  );
}
