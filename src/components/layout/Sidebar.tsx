// src/components/layout/Sidebar.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Package,
  CalendarCheck,
  Banknote,
  FileText,
  LogOut,
  User,
  Menu,
  X,
  Tag,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Building2, label: "Sites", href: "/sites" },
  { icon: Package, label: "Inventory", href: "/inventory" },
  { icon: Tag, label: "Categories", href: "/categories" },
  { icon: CalendarCheck, label: "Installations", href: "/installations" },
  { icon: Banknote, label: "Budget", href: "/budget" },
  { icon: FileText, label: "Reports", href: "/reports" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved === "true") {
      setIsDesktopCollapsed(true);
    }
  }, []);

  const toggleDesktopCollapse = () => {
    setIsDesktopCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("sidebar-collapsed", String(next));
      return next;
    });
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
    setShowLogoutConfirm(false);
    setIsMobileOpen(false);
  };

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  if (!mounted) {
    return (
      <aside className="hidden lg:flex w-64 bg-gradient-to-b from-indigo-900 to-indigo-800 text-white min-h-screen flex-col shadow-xl">
        <div className="p-4 border-b border-indigo-700/50">
          <h1 className="text-xl font-bold">MisterFyber</h1>
          <p className="text-sm text-indigo-300 mt-1">Management System</p>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <div
              key={item.href}
              className="flex items-center space-x-3 px-4 py-2 rounded-lg text-indigo-200"
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </div>
          ))}
        </nav>
        <div className="p-4 border-t border-indigo-700/50">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-indigo-700 rounded-full flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-medium">Loading...</p>
              <p className="text-xs text-indigo-300">User</p>
            </div>
          </div>
        </div>
      </aside>
    );
  }

  const isActiveRoute = (href: string) => {
    return pathname === href || pathname?.startsWith(href + "/");
  };

  // Desktop Sidebar (collapsible with prominent toggle button)
  const desktopSidebar = (
    <aside
      className={`hidden lg:flex ${
        isDesktopCollapsed ? "w-20" : "w-64"
      } bg-gradient-to-b from-indigo-900 to-indigo-800 text-white min-h-screen flex-col shadow-xl flex-shrink-0 transition-all duration-300 ease-in-out relative`}
    >
      {/* Floating prominent collapse toggle button */}
      <button
        onClick={toggleDesktopCollapse}
        title={isDesktopCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        className="absolute -right-4 top-20 z-20 w-8 h-8 bg-white border-2 border-indigo-600 text-indigo-600 rounded-full shadow-lg hover:bg-indigo-600 hover:text-white hover:scale-110 active:scale-95 transition-all duration-200 flex items-center justify-center"
      >
        {isDesktopCollapsed ? (
          <ChevronRight className="w-5 h-5" strokeWidth={3} />
        ) : (
          <ChevronLeft className="w-5 h-5" strokeWidth={3} />
        )}
      </button>

      {/* Header */}
      <div
        className={`p-4 border-b border-indigo-700/50 flex items-center ${
          isDesktopCollapsed ? "justify-center" : ""
        }`}
      >
        {!isDesktopCollapsed ? (
          <div>
            <h1 className="text-xl font-bold">MisterFyber</h1>
            <p className="text-sm text-indigo-300 mt-1">Management System</p>
          </div>
        ) : (
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-lg font-bold">M</span>
          </div>
        )}
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = isActiveRoute(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              title={isDesktopCollapsed ? item.label : undefined}
              className={`flex items-center ${
                isDesktopCollapsed ? "justify-center" : "space-x-3"
              } px-4 py-2.5 rounded-xl transition-all ${
                isActive
                  ? "bg-indigo-700/50 text-white shadow-lg shadow-indigo-900/30"
                  : "text-indigo-200 hover:bg-indigo-700/30 hover:text-white"
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!isDesktopCollapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div
        className={`p-4 border-t border-indigo-700/50 ${
          isDesktopCollapsed ? "flex flex-col items-center" : ""
        }`}
      >
        <div
          className={`flex items-center ${
            isDesktopCollapsed ? "justify-center mb-2" : "space-x-3 mb-3"
          }`}
        >
          <div
            className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0"
            title={isDesktopCollapsed ? user?.username || "User" : undefined}
          >
            <User className="w-5 h-5" />
          </div>
          {!isDesktopCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {user?.username || "User"}
              </p>
              <p className="text-xs text-indigo-300 capitalize truncate">
                {user?.role || "User"}
              </p>
            </div>
          )}
        </div>
        <button
          onClick={() => setShowLogoutConfirm(true)}
          title={isDesktopCollapsed ? "Logout" : undefined}
          className={`flex items-center ${
            isDesktopCollapsed ? "justify-center" : "space-x-2"
          } text-indigo-200 hover:text-white w-full px-4 py-2.5 rounded-xl hover:bg-indigo-700/30 transition-all`}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!isDesktopCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );

  // Mobile Sidebar
  const mobileSidebar = (
    <div
      className={`lg:hidden fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out ${
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <aside className="w-72 bg-gradient-to-b from-indigo-900 to-indigo-800 text-white h-full flex flex-col shadow-2xl">
        <div className="p-4 border-b border-indigo-700/50 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">MisterFyber</h1>
            <p className="text-sm text-indigo-300 mt-1">Management System</p>
          </div>
          <button
            onClick={toggleMobileSidebar}
            className="text-white hover:text-indigo-200 p-1"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = isActiveRoute(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? "bg-indigo-700/50 text-white shadow-lg shadow-indigo-900/30"
                    : "text-indigo-200 hover:bg-indigo-700/30 hover:text-white"
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-indigo-700/50">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
              <User className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {user?.username || "User"}
              </p>
              <p className="text-xs text-indigo-300 capitalize truncate">
                {user?.role || "User"}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setShowLogoutConfirm(true);
              setIsMobileOpen(false);
            }}
            className="flex items-center space-x-2 text-indigo-200 hover:text-white w-full px-4 py-2.5 rounded-xl hover:bg-indigo-700/30 transition-all"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </div>
  );

  // Mobile Bottom Navigation
  const mobileBottomNav = (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-lg">
      <div className="flex justify-around items-center h-16 px-2">
        {menuItems.slice(0, 5).map((item) => {
          const isActive = isActiveRoute(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center px-3 py-1 rounded-lg transition-all ${
                isActive
                  ? "text-indigo-600"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </Link>
          );
        })}
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="flex flex-col items-center px-3 py-1 rounded-lg text-gray-400 hover:text-red-600 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Logout</span>
        </button>
      </div>
    </div>
  );

  // Logout Modal
  const logoutModal = (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => setShowLogoutConfirm(false)}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-in fade-in zoom-in duration-200">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogOut className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Are you sure?
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            You will be logged out of your account. Are you sure you want to
            continue?
          </p>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowLogoutConfirm(false)}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {desktopSidebar}
      {mobileSidebar}
      {mobileBottomNav}

      {/* Mobile menu button */}
      {!isMobileOpen && (
        <button
          onClick={toggleMobileSidebar}
          className="lg:hidden fixed top-4 left-4 z-30 p-2.5 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all"
        >
          <Menu className="w-5 h-5 text-indigo-600" />
        </button>
      )}

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={toggleMobileSidebar}
        />
      )}

      {showLogoutConfirm && logoutModal}
    </>
  );
}
