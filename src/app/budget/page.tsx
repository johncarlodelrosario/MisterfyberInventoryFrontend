"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Coins, TrendingUp, TrendingDown, Plus, Edit, X } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { budgetService, TransactionCreateData } from "@/services/budget";
import { siteService } from "@/services/site";
import { authService } from "@/services/auth";
import toast from "react-hot-toast";

export default function BudgetPage() {
  const [selectedSite, setSelectedSite] = useState("");
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [budgetAmount, setBudgetAmount] = useState("");
  const [transactionData, setTransactionData] = useState({
    amount: "",
    description: "",
    type: "expense" as "income" | "expense",
  });

  const queryClient = useQueryClient();
  const isAdmin = authService.isAdmin();

  const { data: sites, isLoading: sitesLoading } = useQuery({
    queryKey: ["sites-dropdown"],
    queryFn: () => siteService.getSites(1, 100),
  });

  const { data: budgetData, isLoading: budgetLoading } = useQuery({
    queryKey: ["budget", selectedSite],
    queryFn: async () => {
      if (!selectedSite) return null;
      const response = await budgetService.getBudget(selectedSite);
      return response.budget;
    },
    enabled: !!selectedSite,
  });

  const createBudgetMutation = useMutation({
    mutationFn: budgetService.createOrUpdateBudget,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budget"] });
      toast.success("Budget saved successfully");
      setIsBudgetModalOpen(false);
      setBudgetAmount("");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to save budget");
    },
  });

  const addTransactionMutation = useMutation({
    mutationFn: (data: TransactionCreateData) =>
      budgetService.addTransaction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budget"] });
      toast.success("Transaction added successfully");
      setIsTransactionModalOpen(false);
      setTransactionData({ amount: "", description: "", type: "expense" });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to add transaction");
    },
  });

  const handleBudgetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSite) {
      toast.error("Please select a site");
      return;
    }
    if (!budgetAmount || parseFloat(budgetAmount) <= 0) {
      toast.error("Please enter a valid budget amount");
      return;
    }
    createBudgetMutation.mutate({
      siteId: selectedSite,
      totalBudget: parseFloat(budgetAmount),
    });
  };

  const handleTransactionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSite) {
      toast.error("Please select a site");
      return;
    }
    if (!transactionData.amount || parseFloat(transactionData.amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (!transactionData.description.trim()) {
      toast.error("Please enter a description");
      return;
    }

    const data: TransactionCreateData = {
      siteId: selectedSite,
      amount: parseFloat(transactionData.amount),
      type: transactionData.type,
      description: transactionData.description.trim(),
      date: new Date().toISOString().split("T")[0],
    };

    addTransactionMutation.mutate(data);
  };

  if (sitesLoading || budgetLoading) return <LoadingSpinner />;

  const budget = budgetData as any;

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Budget Management
            </h1>
            <p className="text-gray-500">Track and manage budgets per site</p>
          </div>
          <div className="flex space-x-3">
            {isAdmin && selectedSite && (
              <>
                <button
                  onClick={() => setIsTransactionModalOpen(true)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add Transaction</span>
                </button>
                <button
                  onClick={() => setIsBudgetModalOpen(true)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center space-x-2"
                >
                  <Edit className="w-5 h-5" />
                  <span>{budget ? "Edit Budget" : "Set Budget"}</span>
                </button>
              </>
            )}
          </div>
        </div>

        <div className="max-w-xs">
          <select
            value={selectedSite}
            onChange={(e) => setSelectedSite(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select a Site</option>
            {sites?.sites?.map((site: any) => (
              <option key={site._id} value={site._id}>
                {site.name}
              </option>
            ))}
          </select>
        </div>

        {selectedSite && budget && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Budget</p>
                    <p className="text-2xl font-bold mt-1 text-indigo-600">
                      {budget.totalBudget?.toFixed(2) || "0.00"}
                    </p>
                  </div>
                  <div className="bg-indigo-100 p-3 rounded-lg">
                    <Coins className="w-6 h-6 text-indigo-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Spent</p>
                    <p className="text-2xl font-bold mt-1 text-red-600">
                      {budget.usedBudget?.toFixed(2) || "0.00"}
                    </p>
                  </div>
                  <div className="bg-red-100 p-3 rounded-lg">
                    <TrendingDown className="w-6 h-6 text-red-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Remaining</p>
                    <p className="text-2xl font-bold mt-1 text-green-600">
                      {budget.remainingBudget?.toFixed(2) || "0.00"}
                    </p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-500">Budget Usage</span>
                <span className="text-sm font-medium">
                  {budget.totalBudget > 0
                    ? Math.round((budget.usedBudget / budget.totalBudget) * 100)
                    : 0}
                  %
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className={`h-4 rounded-full transition-all ${
                    budget.totalBudget > 0 &&
                    budget.usedBudget / budget.totalBudget > 0.9
                      ? "bg-red-500"
                      : "bg-indigo-600"
                  }`}
                  style={{
                    width:
                      budget.totalBudget > 0
                        ? `${Math.min((budget.usedBudget / budget.totalBudget) * 100, 100)}%`
                        : "0%",
                  }}
                />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b flex justify-between items-center">
                <h3 className="text-lg font-semibold">Transactions</h3>
                <span className="text-sm text-gray-500">
                  {budget.transactions?.length || 0} transactions
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                        Date
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                        Description
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                        Type
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {budget.transactions?.length > 0 ? (
                      [...budget.transactions]
                        .reverse()
                        .map((transaction: any, index: number) => (
                          <tr key={index} className="border-t hover:bg-gray-50">
                            <td className="py-3 px-4 text-sm">
                              {new Date(transaction.date).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4">
                              {transaction.description || "N/A"}
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                  transaction.type === "income"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {transaction.type}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={
                                  transaction.type === "income"
                                    ? "text-green-600"
                                    : "text-red-600"
                                }
                              >
                                {transaction.type === "income" ? "+" : "-"}
                                {transaction.amount?.toFixed(2) || "0.00"}
                              </span>
                            </td>
                          </tr>
                        ))
                    ) : (
                      <tr>
                        <td
                          colSpan={4}
                          className="text-center py-8 text-gray-500"
                        >
                          No transactions yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {selectedSite && !budget && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Coins className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900">
              No Budget Found
            </h3>
            <p className="text-gray-500 mt-2">
              Click the "Set Budget" button to create a budget for this site
            </p>
          </div>
        )}

        {!selectedSite && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Coins className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900">
              Select a Site
            </h3>
            <p className="text-gray-500 mt-2">
              Choose a site from the dropdown to view its budget
            </p>
          </div>
        )}
      </div>

      {/* Budget Modal */}
      {isBudgetModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">
                {budget ? "Edit Budget" : "Set Budget"}
              </h2>
              <button
                onClick={() => setIsBudgetModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleBudgetSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Budget
                </label>
                <input
                  type="number"
                  value={budgetAmount}
                  onChange={(e) => setBudgetAmount(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter total budget"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsBudgetModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createBudgetMutation.isPending}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                  {createBudgetMutation.isPending ? "Saving..." : "Save Budget"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Transaction Modal */}
      {isTransactionModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">Add Transaction</h2>
              <button
                onClick={() => setIsTransactionModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleTransactionSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type *
                </label>
                <select
                  value={transactionData.type}
                  onChange={(e) =>
                    setTransactionData({
                      ...transactionData,
                      type: e.target.value as "income" | "expense",
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount *
                </label>
                <input
                  type="number"
                  value={transactionData.amount}
                  onChange={(e) =>
                    setTransactionData({
                      ...transactionData,
                      amount: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter amount"
                  min="0.01"
                  step="0.01"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <input
                  type="text"
                  value={transactionData.description}
                  onChange={(e) =>
                    setTransactionData({
                      ...transactionData,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter description"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsTransactionModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addTransactionMutation.isPending}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                  {addTransactionMutation.isPending
                    ? "Adding..."
                    : "Add Transaction"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
