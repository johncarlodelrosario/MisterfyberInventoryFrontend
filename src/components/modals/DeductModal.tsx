// components/modals/DeductModal.tsx
"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import toast from "react-hot-toast";

interface DeductModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: any | null;
}

export default function DeductModal({
  isOpen,
  onClose,
  item,
}: DeductModalProps) {
  const queryClient = useQueryClient();
  const [quantity, setQuantity] = useState("");
  const [selectedSiteId, setSelectedSiteId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !item) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedSiteId) {
      toast.error("Please select a site");
      return;
    }

    const qty = parseFloat(quantity);
    if (!qty || qty <= 0) {
      toast.error("Please enter a valid quantity");
      return;
    }

    // Find site data
    const siteData = item.sitesData?.find(
      (s: any) => s.siteId === selectedSiteId,
    );
    if (!siteData) {
      toast.error("Site not found");
      return;
    }

    if (qty > siteData.quantity) {
      toast.error(`Insufficient quantity. Available: ${siteData.quantity}`);
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post(`/inventory/${item._id}/deduct`, {
        siteId: selectedSiteId,
        quantity: qty,
      });
      toast.success("Inventory deducted successfully");
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      onClose();
    } catch (error: any) {
      console.error("Error deducting inventory:", error);
      toast.error(error.response?.data?.error || "Failed to deduct inventory");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Find current site data
  const selectedSiteData = item.sitesData?.find(
    (s: any) => s.siteId === selectedSiteId,
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Deduct Inventory</h2>
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
              Item
            </label>
            <p className="text-gray-900 font-medium">{item.name}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Site *
            </label>
            <select
              value={selectedSiteId}
              onChange={(e) => setSelectedSiteId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            >
              <option value="">Select Site</option>
              {item.sitesData?.map((site: any) => (
                <option key={site.siteId} value={site.siteId}>
                  {site.siteName} - Available: {site.quantity} {item.unit}
                </option>
              ))}
            </select>
          </div>

          {selectedSiteData && (
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Available Quantity:</span>
                <span className="font-medium">
                  {selectedSiteData.quantity} {item.unit}
                </span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-gray-600">Price per Unit:</span>
                <span className="font-medium">
                  ₱{selectedSiteData.price.toFixed(2)}
                </span>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity to Deduct *
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter quantity"
              min="0"
              step="1"
              required
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
              disabled={isSubmitting}
              className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Processing..." : "Deduct"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
