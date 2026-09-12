"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FileText, FileSpreadsheet, Download, Loader2 } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { reportService } from "@/services/report";
import { siteService } from "@/services/site";
import toast from "react-hot-toast";

export default function ReportsPage() {
  const [siteFilter, setSiteFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [generatingExcel, setGeneratingExcel] = useState(false);
  const [generatingPDF, setGeneratingPDF] = useState(false);

  const { data: sites, isLoading } = useQuery({
    queryKey: ["sites-dropdown"],
    queryFn: () => siteService.getSites(1, 100),
  });

  const generateReport = async (format: "excel" | "pdf") => {
    if (!siteFilter) {
      toast.error("Please select a site");
      return;
    }

    if (format === "excel") {
      setGeneratingExcel(true);
    } else {
      setGeneratingPDF(true);
    }

    try {
      const params = {
        siteId: siteFilter,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      };

      let blob;
      if (format === "excel") {
        blob = await reportService.generateExcelReport(params);
      } else {
        blob = await reportService.generatePDFReport(params);
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `inventory-report.${format === "excel" ? "xlsx" : "pdf"}`,
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success(`Report downloaded successfully`);
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Error generating report");
    } finally {
      if (format === "excel") {
        setGeneratingExcel(false);
      } else {
        setGeneratingPDF(false);
      }
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-500">
            Generate and download inventory reports
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Report Filters</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Site *
              </label>
              <select
                value={siteFilter}
                onChange={(e) => setSiteFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select a site</option>
                {sites?.sites?.map((site: any) => (
                  <option key={site._id} value={site._id}>
                    {site.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start space-x-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <FileSpreadsheet className="w-8 h-8 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  Excel Report
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Download detailed inventory report in Excel format (.xlsx)
                </p>
                <button
                  onClick={() => generateReport("excel")}
                  disabled={generatingExcel || !siteFilter}
                  className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {generatingExcel ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5" />
                      <span>Download Excel</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start space-x-4">
              <div className="bg-red-100 p-3 rounded-lg">
                <FileText className="w-8 h-8 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  PDF Report
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Download detailed inventory report in PDF format
                </p>
                <button
                  onClick={() => generateReport("pdf")}
                  disabled={generatingPDF || !siteFilter}
                  className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {generatingPDF ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5" />
                      <span>Download PDF</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="mt-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            </div>
            <div>
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Reports include all installations for the
                selected site. Use date filters to narrow down the report
                period.
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
