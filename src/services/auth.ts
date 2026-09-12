import api from "./api";

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  email: string;
  role?: string;
}

export interface User {
  id: string;
  _id?: string;
  username: string;
  email: string;
  role: string;
}

const getLocalStorage = () => {
  if (typeof window !== "undefined") {
    return window.localStorage;
  }
  return null;
};

export const authService = {
  async login(
    credentials: LoginCredentials,
  ): Promise<{ token: string; user: User }> {
    try {
      console.log("Attempting login with:", credentials.username);

      const response = await api.post("/auth/login", credentials);
      console.log("Login response:", response.data);

      const { token, user } = response.data;

      const storage = getLocalStorage();
      if (storage) {
        storage.setItem("token", token);
        storage.setItem("user", JSON.stringify(user));
        console.log("User saved to localStorage:", user);
      }

      return { token, user };
    } catch (error: any) {
      console.error("Login error:", error.response?.data || error.message);
      throw error;
    }
  },

  async register(
    credentials: RegisterCredentials,
  ): Promise<{ token: string; user: User }> {
    try {
      const response = await api.post("/auth/register", credentials);
      const { token, user } = response.data;

      const storage = getLocalStorage();
      if (storage) {
        storage.setItem("token", token);
        storage.setItem("user", JSON.stringify(user));
      }

      return { token, user };
    } catch (error: any) {
      console.error(
        "Registration error:",
        error.response?.data || error.message,
      );
      throw error;
    }
  },

  logout(): void {
    const storage = getLocalStorage();
    if (storage) {
      storage.removeItem("token");
      storage.removeItem("user");
      console.log("User logged out");
    }
  },

  getCurrentUser(): User | null {
    const storage = getLocalStorage();
    if (!storage) {
      console.log("No localStorage available");
      return null;
    }

    const userStr = storage.getItem("user");
    if (!userStr) {
      console.log("No user found in localStorage");
      return null;
    }

    try {
      const user = JSON.parse(userStr);
      console.log("Parsed user:", user);
      return user;
    } catch (error) {
      console.error("Error parsing user:", error);
      return null;
    }
  },

  getToken(): string | null {
    const storage = getLocalStorage();
    if (!storage) return null;
    return storage.getItem("token");
  },

  isAuthenticated(): boolean {
    const storage = getLocalStorage();
    if (!storage) return false;
    return !!storage.getItem("token");
  },

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === "admin";
  },
};
