export type TransactionType = 'income' | 'expense';

export type Category = string;

export interface CategoryState {
  income: string[];
  expense: string[];
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  description: string;
  date: string; // ISO date string YYYY-MM-DD
}

export type ViewState = 'dashboard' | 'transactions' | 'advisor' | 'categories';

export type FilterType = 'all' | 'income' | 'expense';