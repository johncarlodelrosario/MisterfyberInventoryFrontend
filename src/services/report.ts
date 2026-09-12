import api from "./api";

export interface ReportParams {
  siteId: string;
  startDate?: string;
  endDate?: string;
}

export const reportService = {
  async generateExcelReport(params: ReportParams): Promise<Blob> {
    const queryParams = new URLSearchParams();
    queryParams.append("siteId", params.siteId);
    if (params.startDate) queryParams.append("startDate", params.startDate);
    if (params.endDate) queryParams.append("endDate", params.endDate);

    const response = await api.get(`/reports/excel?${queryParams}`, {
      responseType: "blob",
    });
    return response.data;
  },

  async generatePDFReport(params: ReportParams): Promise<Blob> {
    const queryParams = new URLSearchParams();
    queryParams.append("siteId", params.siteId);
    if (params.startDate) queryParams.append("startDate", params.startDate);
    if (params.endDate) queryParams.append("endDate", params.endDate);

    const response = await api.get(`/reports/pdf?${queryParams}`, {
      responseType: "blob",
    });
    return response.data;
  },
};
