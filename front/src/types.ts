export interface Transaction {
  id: string;
  userId: number;
  type: 'income' | 'expense';
  category: string;
  description: string;
  amount: number;
  date: string;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  transactions?: Transaction[];
  createdAt?: string;
}

export interface FinantialData {
  userId: number;
  salary: number | null;
  extraIncome: number | null
  extraIncomeType: "monthly" | "weekly" | null
  balance: number | null
  fixedExpenses: number | null
}

