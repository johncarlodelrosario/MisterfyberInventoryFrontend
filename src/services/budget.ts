import api from "./api";

export interface Transaction {
  _id?: string;
  amount: number;
  type: "income" | "expense";
  description?: string;
  date: string;
}

export interface Budget {
  _id: string;
  siteId:
    | {
        _id: string;
        name: string;
      }
    | string;
  totalBudget: number;
  usedBudget: number;
  remainingBudget: number;
  transactions: Transaction[];
  createdAt: string;
  updatedAt: string;
}

export interface BudgetCreateData {
  siteId: string;
  totalBudget: number;
}

export interface TransactionCreateData {
  siteId: string;
  amount: number;
  type: "income" | "expense";
  description: string;
  date?: string;
}

export interface BudgetResponse {
  success?: boolean;
  budget: Budget | Budget[];
}

export interface SingleBudgetResponse {
  success?: boolean;
  budget: Budget;
}

export const budgetService = {
  async getBudget(siteId?: string): Promise<BudgetResponse> {
    const url = siteId ? `/budget?siteId=${siteId}` : "/budget";
    const response = await api.get(url);
    return response.data;
  },

  async createOrUpdateBudget(
    data: BudgetCreateData,
  ): Promise<SingleBudgetResponse> {
    const response = await api.post("/budget", data);
    return response.data;
  },

  async addTransaction(
    data: TransactionCreateData,
  ): Promise<SingleBudgetResponse> {
    const response = await api.post("/budget/transaction", data);
    return response.data;
  },
};
