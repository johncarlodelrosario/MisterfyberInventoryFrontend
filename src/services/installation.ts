// services/installation.ts
import api from "./api";

export interface InstallationItem {
  inventoryId:
    | {
        _id: string;
        name: string;
        unit?: string;
      }
    | string;
  quantity: number;
}

export interface Installation {
  _id: string;
  items: InstallationItem[];
  siteId:
    | {
        _id: string;
        name: string;
      }
    | string;
  date: string;
  status: "scheduled" | "completed" | "cancelled";
  scheduledDate?: string;
  installedBy?:
    | {
        _id: string;
        username: string;
      }
    | string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InstallationCreateData {
  siteId: string;
  items: { inventoryId: string; quantity: number }[];
  scheduledDate?: string;
  notes?: string;
}

export interface InstallationResponse {
  success?: boolean;
  installations: Installation[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SingleInstallationResponse {
  success?: boolean;
  installation: Installation;
}

export interface DeleteInstallationResponse {
  success: boolean;
  message: string;
  deletedId: string;
}

export const installationService = {
  async getInstallations(params?: {
    page?: number;
    limit?: number;
    siteId?: string;
    status?: string;
    date?: string;
  }): Promise<InstallationResponse> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", String(params.page));
    if (params?.limit) queryParams.append("limit", String(params.limit));
    if (params?.siteId) queryParams.append("siteId", params.siteId);
    if (params?.status) queryParams.append("status", params.status);
    if (params?.date) queryParams.append("date", params.date);

    const response = await api.get(`/installations?${queryParams}`);
    return response.data;
  },

  async getDailyInstallations(
    date?: string,
  ): Promise<{ success?: boolean; installations: Installation[] }> {
    const url = date
      ? `/installations/daily?date=${date}`
      : "/installations/daily";
    const response = await api.get(url);
    return response.data;
  },

  async createInstallation(
    data: InstallationCreateData,
  ): Promise<SingleInstallationResponse> {
    const response = await api.post("/installations", data);
    return response.data;
  },

  async updateInstallationStatus(
    id: string,
    status: string,
  ): Promise<SingleInstallationResponse> {
    const response = await api.patch(`/installations/${id}/status`, { status });
    return response.data;
  },

  // NEW: Delete installation
  async deleteInstallation(id: string): Promise<DeleteInstallationResponse> {
    const response = await api.delete(`/installations/${id}`);
    return response.data;
  },
};
