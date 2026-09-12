// src/components/layout/Header.tsx
"use client";

import { useState, useEffect } from "react";
import { User, LogOut, Bell, Search, Menu } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/login");
    setShowLogoutConfirm(false);
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 flex-1">
              <div className="lg:hidden">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Menu className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-xl flex items-center justify-center">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-700">
                    {mounted ? user?.username || "User" : "Loading..."}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {mounted ? user?.role || "User" : "..."}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
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
      )}
    </>
  );
}
