"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { authService, User } from "@/services/auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = () => {
    console.log("Refreshing user...");
    const currentUser = authService.getCurrentUser();
    console.log("Current user:", currentUser);
    setUser(currentUser);
    setLoading(false);
  };

  useEffect(() => {
    console.log("AuthProvider mounted - loading user...");
    refreshUser();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      console.log("Login attempt for:", username);
      const { user } = await authService.login({ username, password });
      console.log("Login successful, user:", user);
      setUser(user);
    } catch (error) {
      console.error("Login error in context:", error);
      throw error;
    }
  };

  const logout = () => {
    console.log("Logging out...");
    authService.logout();
    setUser(null);
  };

  const isAdmin = user?.role === "admin";
  console.log("AuthContext state:", { user, loading, isAdmin });

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAdmin,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
