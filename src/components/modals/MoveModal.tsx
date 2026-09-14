// components/modals/MoveModal.tsx
"use client";

import { useState, useEffect } from "react";
import { X, ArrowRightLeft } from "lucide-react";
import { inventoryService } from "@/services/inventory";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

interface MoveModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: any | null;
}

export default function MoveModal({ isOpen, onClose, item }: MoveModalProps) {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fromSiteId, setFromSiteId] = useState("");
  const [toSiteId, setToSiteId] = useState("");
  const [quantity, setQuantity] = useState("");

  // Reset form when modal opens or item changes
  useEffect(() => {
    if (isOpen && item) {
      setFromSiteId("");
      setToSiteId("");
      setQuantity("");
    }
  }, [isOpen, item]);

  if (!isOpen || !item) return null;

  const sitesData = item.sitesData || [];

  const fromSite = sitesData.find((s: any) => s.siteId === fromSiteId);
  const availableQuantity = fromSite?.quantity || 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!fromSiteId) {
      toast.error("Please select a source site");
      return;
    }

    if (!toSiteId) {
      toast.error("Please select a destination site");
      return;
    }

    if (fromSiteId === toSiteId) {
      toast.error("Source and destination sites must be different");
      return;
    }

    const moveQty = parseFloat(quantity);
    if (!moveQty || moveQty <= 0) {
      toast.error("Please enter a valid quantity");
      return;
    }

    if (moveQty > availableQuantity) {
      toast.error(
        `Insufficient quantity. Available at source: ${availableQuantity}`,
      );
      return;
    }

    setIsSubmitting(true);
    try {
      await inventoryService.moveInventory(
        item._id,
        fromSiteId,
        toSiteId,
        moveQty,
      );

      toast.success("Inventory moved successfully");
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      onClose();
    } catch (error: any) {
      console.error("Error moving inventory:", error);
      const errorMessage =
        error.response?.data?.error || "Failed to move inventory";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-semibold">Move Inventory</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Item Info */}
          <div className="bg-gray-50 rounded-md p-3">
            <p className="text-sm text-gray-500">Item</p>
            <p className="font-medium text-gray-900">{item.name}</p>
            <p className="text-xs text-gray-400 mt-1">Unit: {item.unit}</p>
          </div>

          {/* Source Site */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              From Site (Source) *
            </label>
            <select
              value={fromSiteId}
              onChange={(e) => {
                setFromSiteId(e.target.value);
                // Reset quantity when source changes
                setQuantity("");
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            >
              <option value="">Select source site</option>
              {sitesData.map((site: any) => (
                <option
                  key={site.siteId}
                  value={site.siteId}
                  disabled={site.siteId === toSiteId}
                >
                  {site.siteName} (Available: {site.quantity})
                </option>
              ))}
            </select>
            {fromSite && (
              <p className="text-xs text-gray-500 mt-1">
                Available: {availableQuantity} {item.unit}
              </p>
            )}
          </div>

          {/* Destination Site */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              To Site (Destination) *
            </label>
            <select
              value={toSiteId}
              onChange={(e) => setToSiteId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            >
              <option value="">Select destination site</option>
              {sitesData.map((site: any) => (
                <option
                  key={site.siteId}
                  value={site.siteId}
                  disabled={site.siteId === fromSiteId}
                >
                  {site.siteName} (Current: {site.quantity})
                </option>
              ))}
            </select>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity to Move *
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter quantity"
              min="1"
              max={availableQuantity}
              step="1"
              required
            />
            {fromSite && quantity && parseFloat(quantity) > 0 && (
              <div className="mt-2 text-xs text-gray-500 space-y-0.5">
                <p>
                  Source after move:{" "}
                  <span className="font-medium text-gray-700">
                    {availableQuantity - parseFloat(quantity)} {item.unit}
                  </span>
                </p>
                <p>
                  Destination after move:{" "}
                  <span className="font-medium text-gray-700">
                    {(sitesData.find((s: any) => s.siteId === toSiteId)
                      ?.quantity || 0) + parseFloat(quantity)}{" "}
                    {item.unit}
                  </span>
                </p>
              </div>
            )}
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
              disabled={isSubmitting}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <ArrowRightLeft className="w-4 h-4" />
              {isSubmitting ? "Moving..." : "Move"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
