export interface Transaction {
  id: string;
  userId: number;
  type: 'income' | 'expense';
  category: string;
  description: string;
  amount: number;
  date: string;
}


export interface FinancialData {
  salary?: number;
  extraIncome?: number;
  extraIncomeType?: "monthly" | "weekly";
  balance?: number;
  fixedExpenses?: number;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  transactions?: Transaction[];
  financialData?: FinancialData;
  createdAt?: string;
}


export interface TransactionsSummary {
  transactions: Transaction[];
  expenses: number;
  income: number;
}