"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  Package,
  CalendarCheck,
  Wallet,
  TrendingUp,
} from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import { inventoryService } from "@/services/inventory";
import { siteService } from "@/services/site";
import { installationService } from "@/services/installation";
import { authService } from "@/services/auth";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    sites: 0,
    inventory: 0,
    installations: 0,
    todayInstallations: 0,
    totalValue: 0,
  });
  const [recentInstallations, setRecentInstallations] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    if (!authService.isAuthenticated()) {
      router.push("/login");
      return;
    }

    fetchDashboardData();
  }, [router]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch sites
      const sitesData = await siteService.getSites(1, 100);
      const sitesCount = sitesData.sites?.length || 0;

      // Fetch inventory
      const inventoryData = await inventoryService.getInventory({ limit: 100 });
      const inventoryItems = inventoryData.inventory || [];
      const inventoryCount = inventoryItems.length;

      // Calculate total value
      const totalValue = inventoryItems.reduce(
        (sum: number, item: any) =>
          sum + (item.totalValue || item.price * item.quantity || 0),
        0,
      );

      // Fetch today's installations
      const today = new Date().toISOString().split("T")[0];
      const todayData = await installationService.getInstallations({
        date: today,
        limit: 100,
      });
      const todayInstallations = todayData.installations || [];
      const todayCount = todayInstallations.length;

      // Get total installations
      const allData = await installationService.getInstallations({
        limit: 100,
      });
      const allInstallations = allData.installations || [];

      setStats({
        sites: sitesCount,
        inventory: inventoryCount,
        installations: allInstallations.length,
        todayInstallations: todayCount,
        totalValue: totalValue,
      });

      // Get recent 5 installations - safely handle the data
      if (Array.isArray(allInstallations)) {
        setRecentInstallations(allInstallations.slice(0, 5));
      } else {
        setRecentInstallations([]);
      }
    } catch (error: any) {
      console.error("Dashboard error:", error);
      setError(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to load dashboard data. Please make sure the backend is running.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return <div className="min-h-screen bg-gray-50"></div>;
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading dashboard...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => fetchDashboardData()}
            className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </MainLayout>
    );
  }

  const statCards = [
    {
      label: "Total Sites",
      value: stats.sites,
      icon: Building2,
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      label: "Inventory Items",
      value: stats.inventory,
      icon: Package,
      bgColor: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      label: "Total Installations",
      value: stats.installations,
      icon: CalendarCheck,
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
    {
      label: "Today's Installations",
      value: stats.todayInstallations,
      icon: TrendingUp,
      bgColor: "bg-orange-50",
      textColor: "text-orange-600",
    },
    {
      label: "Total Inventory Value",
      value: `₱${stats.totalValue.toFixed(2)}`,
      icon: Wallet,
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-600",
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500">
              Welcome back! Here's what's happening with your inventory.
            </p>
          </div>
          <button
            onClick={() => fetchDashboardData()}
            className="text-sm text-indigo-600 hover:text-indigo-800"
          >
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {statCards.map((stat) => (
            <div key={stat.label} className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                  <p className="text-xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`${stat.bgColor} p-2 rounded-lg`}>
                  <stat.icon className={`w-5 h-5 ${stat.textColor}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b flex items-center justify-between">
            <h3 className="text-lg font-semibold">Recent Installations</h3>
            <span className="text-sm text-gray-500">
              {recentInstallations.length} total
            </span>
          </div>
          <div className="overflow-x-auto">
            {recentInstallations.length > 0 ? (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                      Item
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                      Site
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                      Quantity
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentInstallations.map((inst: any) => (
                    <tr key={inst._id} className="border-t hover:bg-gray-50">
                      <td className="py-3 px-4">
                        {inst.inventoryId?.name || "N/A"}
                      </td>
                      <td className="py-3 px-4">
                        {inst.siteId?.name || "N/A"}
                      </td>
                      <td className="py-3 px-4">{inst.quantity}</td>
                      <td className="py-3 px-4">
                        {inst.date
                          ? new Date(inst.date).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            inst.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : inst.status === "scheduled"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {inst.status || "N/A"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No installations yet. Create your first installation!
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => router.push("/sites")}
            className="bg-indigo-50 hover:bg-indigo-100 p-4 rounded-lg text-center transition-colors"
          >
            <Building2 className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
            <span className="font-medium">Manage Sites</span>
          </button>
          <button
            onClick={() => router.push("/inventory")}
            className="bg-green-50 hover:bg-green-100 p-4 rounded-lg text-center transition-colors"
          >
            <Package className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <span className="font-medium">Manage Inventory</span>
          </button>
          <button
            onClick={() => router.push("/installations")}
            className="bg-purple-50 hover:bg-purple-100 p-4 rounded-lg text-center transition-colors"
          >
            <CalendarCheck className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <span className="font-medium">New Installation</span>
          </button>
        </div>
      </div>
    </MainLayout>
  );
}
