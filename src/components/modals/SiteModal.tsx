"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X } from "lucide-react";
import { siteService, Site } from "@/services/site";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  location: z.string().min(1, "Location is required"),
  description: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface SiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  site?: Site | null;
  onSuccess?: () => void;
}

export default function SiteModal({
  isOpen,
  onClose,
  site,
  onSuccess,
}: SiteModalProps) {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      location: "",
      description: "",
    },
  });

  useEffect(() => {
    if (site) {
      reset({
        name: site.name,
        location: site.location,
        description: site.description || "",
      });
    } else {
      reset({ name: "", location: "", description: "" });
    }
  }, [site, reset, isOpen]);

  if (!isOpen) return null;

  const onSubmit = async (data: FormData) => {
    try {
      if (site) {
        // Update existing site
        const response = await siteService.updateSite(site._id, {
          ...data,
          isActive: site.isActive,
        });
        console.log("Update response:", response);
        toast.success("Site updated successfully");
      } else {
        // Create new site
        const response = await siteService.createSite(data);
        console.log("Create response:", response);
        toast.success("Site created successfully");
      }

      // Invalidate queries and refresh
      await queryClient.invalidateQueries({ queryKey: ["sites"] });

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }

      // Close modal
      onClose();
      reset({ name: "", location: "", description: "" });
    } catch (error: any) {
      console.error("Error saving site:", error);
      const errorMessage =
        error.response?.data?.error || error.message || "Failed to save site";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full shadow-xl">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {site ? "Edit Site" : "Add New Site"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Site Name *
            </label>
            <input
              {...register("name")}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              placeholder="Enter site name"
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location *
            </label>
            <input
              {...register("location")}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              placeholder="Enter location"
              disabled={isSubmitting}
            />
            {errors.location && (
              <p className="text-red-500 text-sm mt-1">
                {errors.location.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              {...register("description")}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              rows={3}
              placeholder="Enter description (optional)"
              disabled={isSubmitting}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                  <span>Saving...</span>
                </>
              ) : (
                <span>{site ? "Update Site" : "Create Site"}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
