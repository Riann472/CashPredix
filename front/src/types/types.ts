export interface Transaction {
  id: number;
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
  sub: number;
  name: string;
  email: string;
  financialData?: FinancialData;
  createdAt?: string;
}


export interface TransactionsSummary {
  transactions: Transaction[];
  expenses: number;
  income: number;
}