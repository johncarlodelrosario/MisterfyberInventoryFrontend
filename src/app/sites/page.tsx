"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { siteService, Site } from "@/services/site";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";
import SiteModal from "@/components/modals/SiteModal";

export default function SitesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);

  const queryClient = useQueryClient();
  const { user, isAdmin, loading: authLoading, refreshUser } = useAuth();

  // Debug: Log auth state
  useEffect(() => {
    console.log("=== SitesPage Debug ===");
    console.log("User:", user);
    console.log("IsAdmin:", isAdmin);
    console.log("AuthLoading:", authLoading);
    console.log("User Role:", user?.role);
    console.log("localStorage user:", localStorage.getItem("user"));
    console.log("localStorage token:", localStorage.getItem("token"));
    console.log("======================");

    // If user is not loaded but we have token, try to refresh
    if (!user && !authLoading) {
      console.log("No user but not loading, refreshing...");
      refreshUser();
    }
  }, [user, isAdmin, authLoading, refreshUser]);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["sites", page],
    queryFn: () => siteService.getSites(page, 10),
    enabled: !authLoading, // Always enable, but handle loading state
  });

  const deleteMutation = useMutation({
    mutationFn: siteService.deleteSite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sites"] });
      toast.success("Site deleted successfully");
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to delete site");
    },
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this site?")) {
      deleteMutation.mutate(id);
    }
  };

  const filteredSites = data?.sites?.filter(
    (site: Site) =>
      site.name.toLowerCase().includes(search.toLowerCase()) ||
      site.location.toLowerCase().includes(search.toLowerCase()),
  );

  if (authLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner />
          <p className="ml-2 text-gray-500">Loading user data...</p>
        </div>
      </MainLayout>
    );
  }

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner />
          <p className="ml-2 text-gray-500">Loading sites...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Sites</h1>
            <p className="text-gray-500">Manage your installation sites</p>
            {/* Debug info - shows current user status */}
            <div className="mt-1 text-xs text-gray-400 space-y-0.5">
              <div>User: {user?.username || "Not logged in"}</div>
              <div>Role: {user?.role || "N/A"}</div>
              <div>Is Admin: {isAdmin ? "✅ Yes" : "❌ No"}</div>
              <div>
                Token:{" "}
                {localStorage.getItem("token") ? "✅ Present" : "❌ Missing"}
              </div>
            </div>
          </div>
          {/* Show button if isAdmin is true */}
          {isAdmin ? (
            <button
              onClick={() => {
                setSelectedSite(null);
                setIsModalOpen(true);
              }}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Site</span>
            </button>
          ) : (
            <button
              disabled
              className="bg-gray-300 text-gray-500 px-4 py-2 rounded-md flex items-center space-x-2 cursor-not-allowed"
              title="Admin access required"
            >
              <Plus className="w-5 h-5" />
              <span>Add Site (Admin Only)</span>
            </button>
          )}
        </div>

        <div className="relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search sites..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    Name
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    Location
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    Created By
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredSites && filteredSites.length > 0 ? (
                  filteredSites.map((site: Site) => (
                    <tr key={site._id} className="border-t hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{site.name}</td>
                      <td className="py-3 px-4">{site.location}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            site.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {site.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {site.createdBy?.username || "N/A"}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          {isAdmin ? (
                            <>
                              <button
                                onClick={() => {
                                  setSelectedSite(site);
                                  setIsModalOpen(true);
                                }}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <Edit className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleDelete(site._id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </>
                          ) : (
                            <span className="text-gray-400 text-sm">
                              No actions
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-500">
                      No sites found
                    </td>
                  </tr>
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

      <SiteModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedSite(null);
        }}
        site={selectedSite}
        onSuccess={() => {
          refetch();
          queryClient.invalidateQueries({ queryKey: ["sites"] });
        }}
      />
    </MainLayout>
  );
}
