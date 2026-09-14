// services/inventory.ts
import api from "./api";

export interface SiteInventoryData {
  siteId: string;
  quantity: number;
  price: number;
  minQuantity: number;
}

export interface Inventory {
  _id: string;
  name: string;
  categoryId: {
    _id: string;
    name: string;
  };
  sitesData?: Array<{
    siteId: string;
    siteName: string;
    quantity: number;
    price: number;
    minQuantity: number;
    totalValue: number;
  }>;
  siteIds: string[];
  unit: string;
  description?: string;
  totalValue?: number;
  lastUpdated?: Date;
  // Fields returned when filtered by site
  siteQuantity?: number;
  sitePrice?: number;
  siteMinQuantity?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface InventoryCreateData {
  name: string;
  categoryId: string;
  siteData: SiteInventoryData[];
  unit?: string;
  description?: string;
}

export interface InventoryResponse {
  success?: boolean;
  inventory: Inventory[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SingleInventoryResponse {
  success?: boolean;
  inventory: Inventory;
}

export const inventoryService = {
  async getInventory(params?: {
    page?: number;
    limit?: number;
    siteId?: string;
    categoryId?: string;
    search?: string;
  }): Promise<InventoryResponse> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", String(params.page));
    if (params?.limit) queryParams.append("limit", String(params.limit));
    if (params?.siteId) queryParams.append("siteId", params.siteId);
    if (params?.categoryId) queryParams.append("categoryId", params.categoryId);
    if (params?.search) queryParams.append("search", params.search);

    const response = await api.get(`/inventory?${queryParams}`);
    return response.data;
  },

  async getInventoryById(id: string): Promise<SingleInventoryResponse> {
    const response = await api.get(`/inventory/${id}`);
    return response.data;
  },

  async createInventory(
    data: InventoryCreateData,
  ): Promise<SingleInventoryResponse> {
    const response = await api.post("/inventory", data);
    return response.data;
  },

  async updateInventory(
    id: string,
    data: Partial<InventoryCreateData>,
  ): Promise<SingleInventoryResponse> {
    const response = await api.put(`/inventory/${id}`, data);
    return response.data;
  },

  async deleteInventory(
    id: string,
  ): Promise<{ success?: boolean; message: string }> {
    const response = await api.delete(`/inventory/${id}`);
    return response.data;
  },

  async deductInventory(
    id: string,
    siteId: string,
    quantity: number,
  ): Promise<{
    success?: boolean;
    message: string;
    remainingQuantity: number;
  }> {
    const response = await api.post(`/inventory/${id}/deduct`, {
      siteId,
      quantity,
    });
    return response.data;
  },

  async moveInventory(
    id: string,
    fromSiteId: string,
    toSiteId: string,
    quantity: number,
  ): Promise<{
    success?: boolean;
    message: string;
    inventory: Inventory;
    fromSiteRemaining: number;
    toSiteNewQuantity: number;
  }> {
    const response = await api.post(`/inventory/${id}/move`, {
      fromSiteId,
      toSiteId,
      quantity,
    });
    return response.data;
  },
};
