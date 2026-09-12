import api from "./api";

export interface Site {
  _id: string;
  name: string;
  location: string;
  description?: string;
  isActive: boolean;
  createdBy?: {
    _id: string;
    username: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface SiteCreateData {
  name: string;
  location: string;
  description?: string;
}

export interface SiteResponse {
  success?: boolean;
  sites: Site[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const siteService = {
  async getSites(page = 1, limit = 10): Promise<SiteResponse> {
    const response = await api.get(`/sites?page=${page}&limit=${limit}`);
    return response.data;
  },

  async getSite(id: string): Promise<{ success?: boolean; site: Site }> {
    const response = await api.get(`/sites/${id}`);
    return response.data;
  },

  async createSite(
    data: SiteCreateData,
  ): Promise<{ success?: boolean; site: Site }> {
    const response = await api.post("/sites", data);
    return response.data;
  },

  async updateSite(
    id: string,
    data: Partial<SiteCreateData & { isActive: boolean }>,
  ): Promise<{ success?: boolean; site: Site }> {
    const response = await api.put(`/sites/${id}`, data);
    return response.data;
  },

  async deleteSite(
    id: string,
  ): Promise<{ success?: boolean; message: string }> {
    const response = await api.delete(`/sites/${id}`);
    return response.data;
  },
};
