"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  Package,
  CalendarCheck,
  Wallet,
  ArrowUpRight,
  RefreshCw,
} from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import { inventoryService } from "@/services/inventory";
import { siteService } from "@/services/site";
import { installationService } from "@/services/installation";
import { authService } from "@/services/auth";

// ─── Simple SVG Bar Chart ────────────────────────────────────────────────
function BarChart({
  data,
  height = 180,
}: {
  data: { label: string; value: number }[];
  height?: number;
}) {
  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const barWidth = 100 / data.length;

  return (
    <div className="w-full" style={{ height }}>
      <svg
        viewBox={`0 0 100 ${height}`}
        preserveAspectRatio="none"
        className="w-full h-full"
      >
        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
          <line
            key={ratio}
            x1="0"
            y1={height - ratio * height}
            x2="100"
            y2={height - ratio * height}
            stroke="#e5e7eb"
            strokeWidth="0.5"
          />
        ))}

        {data.map((item, i) => {
          const barHeight = (item.value / maxValue) * (height - 30);
          const x = i * barWidth + barWidth * 0.15;
          const y = height - barHeight - 10;
          const w = barWidth * 0.7;

          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={w}
                height={barHeight}
                rx="2"
                fill="#4f46e5"
                opacity={item.value === 0 ? 0.15 : 0.85}
              />
              {item.value > 0 && (
                <text
                  x={x + w / 2}
                  y={y - 4}
                  textAnchor="middle"
                  fontSize="6"
                  fill="#4f46e5"
                  fontWeight="600"
                >
                  {item.value}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      <div className="flex justify-around mt-1">
        {data.map((item, i) => (
          <span
            key={i}
            className="text-[10px] text-gray-400 flex-1 text-center truncate px-0.5"
          >
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Simple SVG Donut Chart ──────────────────────────────────────────────
function DonutChart({
  segments,
  size = 140,
}: {
  segments: { label: string; value: number; color: string }[];
  size?: number;
}) {
  const total = segments.reduce((s, seg) => s + seg.value, 0) || 1;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        className="flex-shrink-0"
      >
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="#f3f4f6"
          strokeWidth="12"
        />
        {segments.map((seg, i) => {
          const pct = seg.value / total;
          const dash = pct * circumference;
          const gap = circumference - dash;
          const currentOffset = offset;
          offset += dash;

          return (
            <circle
              key={i}
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth="12"
              strokeDasharray={`${dash} ${gap}`}
              strokeDashoffset={-currentOffset}
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
            />
          );
        })}
        <text
          x="50"
          y="46"
          textAnchor="middle"
          fontSize="14"
          fill="#111827"
          fontWeight="700"
        >
          {total}
        </text>
        <text x="50" y="58" textAnchor="middle" fontSize="6" fill="#9ca3af">
          Total
        </text>
      </svg>

      <div className="space-y-2.5 w-full sm:w-auto">
        {segments.map((seg, i) => (
          <div key={i} className="flex items-center gap-2.5">
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: seg.color }}
            />
            <span className="text-sm text-gray-600 flex-1 sm:flex-none">
              {seg.label}
            </span>
            <span className="text-sm font-semibold text-gray-900 ml-auto sm:ml-4">
              {seg.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Dashboard ──────────────────────────────────────────────────────
export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    sites: 0,
    inventory: 0,
    installations: 0,
    todayInstallations: 0,
    totalValue: 0,
    lowStockItems: 0,
    completedInstallations: 0,
    scheduledInstallations: 0,
    cancelledInstallations: 0,
  });
  const [recentInstallations, setRecentInstallations] = useState<any[]>([]);
  const [inventoryItems, setInventoryItems] = useState<any[]>([]);
  const [sitesList, setSitesList] = useState<{ _id: string; name: string }[]>(
    [],
  );
  const [weeklyData, setWeeklyData] = useState<
    { label: string; value: number }[]
  >([]);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const [activeChart, setActiveChart] = useState<"installations" | "value">(
    "installations",
  );

  useEffect(() => {
    setMounted(true);

    if (!authService.isAuthenticated()) {
      router.push("/login");
      return;
    }

    fetchDashboardData();
  }, [router]);

  const fetchDashboardData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError("");

      const today = new Date().toISOString().split("T")[0];

      // ── Run ALL requests in parallel (huge speed boost) ──
      const [sitesData, inventoryData, allInstallationsData] =
        await Promise.all([
          siteService.getSites(1, 100),
          inventoryService.getInventory({ limit: 100 }),
          installationService.getInstallations({ limit: 100 }),
        ]);

      const sites = sitesData.sites || [];
      const inventoryItemsData = inventoryData.inventory || [];
      const allInstallations = allInstallationsData.installations || [];

      // ── Inventory: total value + low stock (single pass) ──
      let totalValue = 0;
      let lowStockCount = 0;
      for (const item of inventoryItemsData) {
        totalValue += item.totalValue || 0;
        if (item.sitesData) {
          for (const site of item.sitesData) {
            if (site.quantity > 0 && site.quantity <= (site.minQuantity || 0)) {
              lowStockCount++;
            }
          }
        }
      }

      // ── Installations: status + today counts (single pass) ──
      let completedCount = 0;
      let scheduledCount = 0;
      let cancelledCount = 0;
      let todayCount = 0;
      for (const inst of allInstallations) {
        if (inst.status === "completed") completedCount++;
        else if (inst.status === "scheduled") scheduledCount++;
        else if (inst.status === "cancelled") cancelledCount++;

        if (inst.date && inst.date.split("T")[0] === today) todayCount++;
      }

      setStats({
        sites: sites.length,
        inventory: inventoryItemsData.length,
        installations: allInstallations.length,
        todayInstallations: todayCount,
        totalValue,
        lowStockItems: lowStockCount,
        completedInstallations: completedCount,
        scheduledInstallations: scheduledCount,
        cancelledInstallations: cancelledCount,
      });

      setInventoryItems(inventoryItemsData);
      setSitesList(sites);
      setRecentInstallations(allInstallations.slice(0, 6));

      // ── Build weekly chart data in one pass ──
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const countsByDate: Record<string, number> = {};
      for (const inst of allInstallations) {
        if (!inst.date) continue;
        const d = inst.date.split("T")[0];
        countsByDate[d] = (countsByDate[d] || 0) + 1;
      }

      const weekly: { label: string; value: number }[] = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split("T")[0];
        weekly.push({
          label: days[d.getDay()],
          value: countsByDate[dateStr] || 0,
        });
      }
      setWeeklyData(weekly);
    } catch (error: any) {
      console.error("Dashboard error:", error);
      setError(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to load dashboard data. Please make sure the backend is running.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // ── Memoized derived data ──
  const statCards = useMemo(
    () => [
      {
        label: "Total Sites",
        value: stats.sites,
        icon: Building2,
        change: null,
        changeType: undefined,
      },
      {
        label: "Inventory Items",
        value: stats.inventory,
        icon: Package,
        change:
          stats.lowStockItems > 0 ? `${stats.lowStockItems} low stock` : null,
        changeType: "warning" as const,
      },
      {
        label: "Total Installations",
        value: stats.installations,
        icon: CalendarCheck,
        change: `${stats.todayInstallations} today`,
        changeType: "info" as const,
      },
      {
        label: "Inventory Value",
        value: `₱${stats.totalValue.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
        icon: Wallet,
        change: null,
        changeType: undefined,
      },
    ],
    [stats],
  );

  const statusSegments = useMemo(
    () => [
      {
        label: "Completed",
        value: stats.completedInstallations,
        color: "#4f46e5",
      },
      {
        label: "Scheduled",
        value: stats.scheduledInstallations,
        color: "#a5b4fc",
      },
      {
        label: "Cancelled",
        value: stats.cancelledInstallations,
        color: "#e0e7ff",
      },
    ],
    [stats],
  );

  // ── Precompute per-item site maps once (avoids rework on every render) ──
  const inventoryRows = useMemo(
    () =>
      inventoryItems.slice(0, 8).map((item: any) => {
        const totalQty =
          item.sitesData?.reduce(
            (sum: number, s: any) => sum + s.quantity,
            0,
          ) || 0;

        const siteMap: Record<string, any> = {};
        item.sitesData?.forEach((s: any) => {
          siteMap[s.siteId] = s;
        });

        return { item, totalQty, siteMap };
      }),
    [inventoryItems],
  );

  // ── Loading skeleton ──
  if (!mounted) {
    return <div className="min-h-screen bg-gray-50"></div>;
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="space-y-4 sm:space-y-6">
          <div className="h-8 w-40 sm:w-48 bg-gray-200 rounded animate-pulse" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-24 sm:h-28 bg-gray-200 rounded-xl animate-pulse"
              />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="h-64 sm:h-72 bg-gray-200 rounded-xl animate-pulse lg:col-span-2" />
            <div className="h-64 sm:h-72 bg-gray-200 rounded-xl animate-pulse" />
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 sm:p-8 text-center max-w-lg mx-auto mt-8 sm:mt-12">
          <p className="text-red-600 font-medium text-sm sm:text-base">
            {error}
          </p>
          <button
            onClick={() => fetchDashboardData()}
            className="mt-4 bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
          >
            Retry
          </button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Dashboard
            </h1>
            <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
              Overview of your inventory system
            </p>
          </div>
          <button
            onClick={() => fetchDashboardData(true)}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors disabled:opacity-50 self-start sm:self-auto"
          >
            <RefreshCw
              className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
            />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {statCards.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-xl border border-gray-100 p-3.5 sm:p-5 hover:border-indigo-100 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] sm:text-xs font-medium text-gray-400 uppercase tracking-wide truncate">
                    {stat.label}
                  </p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900 mt-1 sm:mt-1.5 truncate">
                    {stat.value}
                  </p>
                  {stat.change && (
                    <p
                      className={`text-[10px] sm:text-xs mt-1 sm:mt-1.5 font-medium truncate ${
                        stat.changeType === "warning"
                          ? "text-amber-600"
                          : "text-indigo-600"
                      }`}
                    >
                      {stat.change}
                    </p>
                  )}
                </div>
                <div className="p-1.5 sm:p-2.5 bg-indigo-50 rounded-lg flex-shrink-0">
                  <stat.icon className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Charts Row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Bar Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                  Weekly Installations
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Last 7 days activity
                </p>
              </div>
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5 self-start sm:self-auto">
                <button
                  onClick={() => setActiveChart("installations")}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    activeChart === "installations"
                      ? "bg-white text-indigo-600 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Installations
                </button>
                <button
                  onClick={() => setActiveChart("value")}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    activeChart === "value"
                      ? "bg-white text-indigo-600 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Value
                </button>
              </div>
            </div>

            {activeChart === "installations" ? (
              <BarChart data={weeklyData} height={180} />
            ) : (
              <BarChart
                data={inventoryItems.slice(0, 7).map((item: any) => ({
                  label:
                    item.name?.length > 8
                      ? item.name.slice(0, 8) + "…"
                      : item.name,
                  value: Math.round(item.totalValue || 0),
                }))}
                height={180}
              />
            )}
          </div>

          {/* Donut Chart */}
          <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-5">
            <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">
              Installation Status
            </h3>
            <p className="text-xs text-gray-400 mb-4">Breakdown by status</p>
            <DonutChart segments={statusSegments} size={130} />
          </div>
        </div>

        {/* ── Inventory TABLE (PER SITE) ── */}
        <div className="bg-white rounded-xl border border-gray-100">
          <div className="px-4 sm:px-5 py-4 border-b border-gray-100 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                Inventory
              </h3>
              <p className="text-xs text-gray-400 mt-0.5 truncate">
                {stats.inventory} items · {sitesList.length} sites
              </p>
            </div>
            <button
              onClick={() => router.push("/inventory")}
              className="text-xs font-medium text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1 flex-shrink-0"
            >
              View all <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="sm:hidden px-4 pt-2 text-[10px] text-gray-400">
            ← Swipe to see all sites →
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-2.5 px-3 sm:px-4 text-[10px] sm:text-[11px] font-semibold text-gray-500 uppercase tracking-wide sticky left-0 bg-gray-50 z-10 min-w-[130px] sm:min-w-[160px]">
                    Item
                  </th>
                  <th className="text-left py-2.5 px-3 sm:px-4 text-[10px] sm:text-[11px] font-semibold text-gray-500 uppercase tracking-wide min-w-[90px] sm:min-w-[110px]">
                    Category
                  </th>
                  {sitesList.map((site) => (
                    <th
                      key={site._id}
                      className="text-center py-2.5 px-2 sm:px-3 text-[10px] sm:text-[11px] font-semibold text-gray-500 uppercase tracking-wide min-w-[70px] sm:min-w-[90px] whitespace-nowrap"
                    >
                      {site.name}
                    </th>
                  ))}
                  <th className="text-center py-2.5 px-3 sm:px-4 text-[10px] sm:text-[11px] font-semibold text-gray-500 uppercase tracking-wide min-w-[70px] sm:min-w-[80px]">
                    Total Qty
                  </th>
                  <th className="text-right py-2.5 px-3 sm:px-4 text-[10px] sm:text-[11px] font-semibold text-gray-500 uppercase tracking-wide min-w-[90px] sm:min-w-[110px]">
                    Total Value
                  </th>
                </tr>
              </thead>
              <tbody>
                {inventoryRows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={sitesList.length + 4}
                      className="py-10 text-center text-gray-400 text-sm"
                    >
                      No inventory items yet
                    </td>
                  </tr>
                ) : (
                  inventoryRows.map(({ item, totalQty, siteMap }) => (
                    <tr
                      key={item._id}
                      className="border-t border-gray-50 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3 px-3 sm:px-4 sticky left-0 bg-white z-10">
                        <p className="text-xs sm:text-sm font-medium text-gray-900 truncate max-w-[120px] sm:max-w-[150px]">
                          {item.name}
                        </p>
                        <p className="text-[10px] sm:text-[11px] text-gray-400">
                          {item.unit}
                        </p>
                      </td>
                      <td className="py-3 px-3 sm:px-4">
                        <span className="text-[11px] sm:text-xs text-gray-600 whitespace-nowrap">
                          {item.categoryId?.name || "Uncategorized"}
                        </span>
                      </td>
                      {sitesList.map((site) => {
                        const sd = siteMap[site._id];
                        const qty = sd?.quantity || 0;
                        const minQty = sd?.minQuantity || 0;
                        const isLow = qty > 0 && qty <= minQty;

                        return (
                          <td
                            key={site._id}
                            className="py-3 px-2 sm:px-3 text-center"
                          >
                            <span
                              className={`text-xs sm:text-sm font-semibold ${
                                isLow
                                  ? "text-amber-600"
                                  : qty === 0
                                    ? "text-gray-300"
                                    : "text-gray-900"
                              }`}
                            >
                              {qty}
                            </span>
                            {isLow && (
                              <div className="text-[9px] sm:text-[10px] text-amber-600 font-medium whitespace-nowrap">
                                ⚠ Low
                              </div>
                            )}
                          </td>
                        );
                      })}
                      <td className="py-3 px-3 sm:px-4 text-center">
                        <span className="text-xs sm:text-sm font-bold text-gray-900 whitespace-nowrap">
                          {totalQty} {item.unit}
                        </span>
                      </td>
                      <td className="py-3 px-3 sm:px-4 text-right">
                        <span className="text-xs sm:text-sm font-medium text-gray-900 whitespace-nowrap">
                          ₱
                          {(item.totalValue || 0).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Recent Installations ── */}
        <div className="bg-white rounded-xl border border-gray-100">
          <div className="px-4 sm:px-5 py-4 border-b border-gray-100 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                Recent Installations
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">Latest activity</p>
            </div>
            <button
              onClick={() => router.push("/installations")}
              className="text-xs font-medium text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1 flex-shrink-0"
            >
              View all <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {recentInstallations.length === 0 ? (
              <div className="py-10 text-center text-gray-400 text-sm">
                No installations yet
              </div>
            ) : (
              recentInstallations.map((inst: any) => (
                <div
                  key={inst._id}
                  className="px-4 sm:px-5 py-3 flex items-center justify-between gap-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                      {inst.siteId?.name || "Unknown site"}
                    </p>
                    <p className="text-[11px] sm:text-xs text-gray-400">
                      {inst.date
                        ? new Date(inst.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "No date"}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-semibold px-2 py-1 rounded-full flex-shrink-0 ${
                      inst.status === "completed"
                        ? "bg-indigo-100 text-indigo-700"
                        : inst.status === "scheduled"
                          ? "bg-indigo-50 text-indigo-500"
                          : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {inst.status || "N/A"}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ── Quick Actions ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <button
            onClick={() => router.push("/sites")}
            className="group bg-white border border-gray-100 rounded-xl p-4 sm:p-5 text-left hover:border-indigo-200 hover:shadow-sm transition-all"
          >
            <Building2 className="w-5 h-5 text-indigo-600 mb-2 sm:mb-3" />
            <p className="font-medium text-gray-900 group-hover:text-indigo-600 transition-colors text-sm sm:text-base">
              Manage Sites
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              Add or edit site locations
            </p>
          </button>
          <button
            onClick={() => router.push("/inventory")}
            className="group bg-white border border-gray-100 rounded-xl p-4 sm:p-5 text-left hover:border-indigo-200 hover:shadow-sm transition-all"
          >
            <Package className="w-5 h-5 text-indigo-600 mb-2 sm:mb-3" />
            <p className="font-medium text-gray-900 group-hover:text-indigo-600 transition-colors text-sm sm:text-base">
              Manage Inventory
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              Track stock across sites
            </p>
          </button>
          <button
            onClick={() => router.push("/installations")}
            className="group bg-white border border-gray-100 rounded-xl p-4 sm:p-5 text-left hover:border-indigo-200 hover:shadow-sm transition-all"
          >
            <CalendarCheck className="w-5 h-5 text-indigo-600 mb-2 sm:mb-3" />
            <p className="font-medium text-gray-900 group-hover:text-indigo-600 transition-colors text-sm sm:text-base">
              New Installation
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              Schedule a new installation
            </p>
          </button>
        </div>
      </div>
    </MainLayout>
  );
}
